'use server';

import { and, asc, eq, inArray, like, max, ne, or, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as z from 'zod';
import { requireAdmin } from '@/lib/auth/dal';
import { postText, sanitizePostHtml } from '@/lib/blog-html';
import { parseTagNames, pruneTags, setPostTags } from '@/lib/blog-tags';
import { db } from '@/lib/db';
import { POST_STATUSES, categories, posts } from '@/lib/db/schema';
import { SLUG_HINT, SLUG_MAX, SLUG_PATTERN, slugify } from '@/lib/slug';

export type PostFormState = { message?: string; errors?: Record<string, string> };
export type CategoryFormState = { error?: string; ok?: string };
export type BulkPostState = { error?: string; ok?: string };

const FIX = 'Please fix the highlighted fields.';
/** /blog/category/… and /blog/tag/… are archive pages. */
const RESERVED_POST_SLUGS = ['category', 'tag'];

const slugField = z
  .string()
  .trim()
  .toLowerCase()
  .max(SLUG_MAX, { error: `Keep it under ${SLUG_MAX} characters.` })
  .refine((s) => s === '' || SLUG_PATTERN.test(s), { error: SLUG_HINT });

/** Accepts a YouTube link (watch, youtu.be, shorts, embed) or the bare 11-character video ID. */
function youtubeId(input: string) {
  const value = input.trim();
  if (!value) return '';
  const match =
    value.match(/(?:youtu\.be\/|[?&]v=|\/(?:embed|shorts|live)\/)([\w-]{11})/) ?? value.match(/^([\w-]{11})$/);
  return match ? match[1] : null;
}

const PostSchema = z.object({
  title: z.string().trim().min(1, { error: 'Enter a title.' }).max(200),
  // Blank: made from the title.
  slug: slugField,
  status: z.enum(POST_STATUSES),
  categoryId: z
    .string()
    .trim()
    .transform((v) => (v ? Number(v) : null))
    .refine((v) => v === null || Number.isInteger(v), { error: 'Choose a category.' }),
  summary: z.string().trim().max(400, { error: 'Keep it under 400 characters.' }),
  teaser: z.string().trim().max(200, { error: 'Keep it under 200 characters.' }),
  youtube: z
    .string()
    .transform((v) => youtubeId(v))
    .refine((v) => v !== null, { error: 'Paste a YouTube link or video ID.' }),
  seoTitle: z.string().trim().max(200),
  seoDescription: z.string().trim().max(400, { error: 'Keep it under 400 characters.' }),
});

/**
 * Every page: besides the blog pages and the homepage "Latest Posts", the header on all pages lists
 * the categories that have published posts (components/layout/site-header.tsx).
 */
function revalidateBlog() {
  revalidatePath('/', 'layout');
}

/** `base`, or `base-2`, `base-3`… if another row has it. */
async function freeSlug(table: typeof posts | typeof categories, base: string, id: number | null) {
  const taken = new Set(
    (
      await db
        .select({ slug: table.slug })
        .from(table)
        .where(and(or(eq(table.slug, base), like(table.slug, `${base}-%`)), id ? ne(table.id, id) : undefined))
    ).map((row) => row.slug),
  );
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

/** Creates a post (no `id`) or updates one. */
export async function savePost(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  const admin = await requireAdmin();
  const id = Number(formData.get('id')) || null;
  const field = (name: string) => String(formData.get(name) ?? '');

  const parsed = PostSchema.safeParse({
    title: field('title'),
    slug: field('slug'),
    status: field('status') || 'draft',
    categoryId: field('categoryId'),
    summary: field('summary'),
    teaser: field('teaser'),
    youtube: field('youtube'),
    seoTitle: field('seoTitle'),
    seoDescription: field('seoDescription'),
  });
  const errors: Record<string, string> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
  }
  const body = sanitizePostHtml(field('body').slice(0, 200_000));
  const tagNames = parseTagNames(field('tags'));
  if (tagNames.length > 12) errors.tags = 'Use at most 12 tags.';
  if (parsed.success && parsed.data.status === 'published' && !postText(body) && !body.includes('<img')) {
    errors.body = 'Write the article before publishing (or save it as a draft).';
  }
  if (!parsed.success || Object.keys(errors).length) return { errors, message: FIX };
  const { youtube, ...data } = parsed.data;

  if (data.categoryId) {
    const [category] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.id, data.categoryId));
    if (!category) return { errors: { categoryId: 'That category no longer exists.' }, message: FIX };
  }
  if (data.slug && RESERVED_POST_SLUGS.includes(data.slug)) {
    return { errors: { slug: `/blog/${data.slug}/ is used by the blog itself. Choose another URL.` }, message: FIX };
  }
  if (data.slug) {
    const [clash] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(and(eq(posts.slug, data.slug), id ? ne(posts.id, id) : undefined))
      .limit(1);
    if (clash) return { errors: { slug: 'Another post already uses this URL.' }, message: FIX };
  }
  let base = slugify(data.title) || 'post';
  if (RESERVED_POST_SLUGS.includes(base)) base = `${base}-post`;
  const slug = data.slug || (await freeSlug(posts, base, id));
  const values = { ...data, slug, body, youtubeId: youtube ?? '', isFeatured: formData.get('isFeatured') === 'on' };

  let postId = id;
  const result = await db.transaction(async (tx) => {
    if (id) {
      const [current] = await tx.select({ publishedAt: posts.publishedAt }).from(posts).where(eq(posts.id, id));
      if (!current) return 'missing';
      await tx
        .update(posts)
        .set({ ...values, publishedAt: current.publishedAt ?? (data.status === 'published' ? new Date() : null) })
        .where(eq(posts.id, id));
    } else {
      const [row] = await tx
        .insert(posts)
        .values({ ...values, authorId: admin.id, publishedAt: data.status === 'published' ? new Date() : null })
        .returning({ id: posts.id });
      postId = row.id;
    }
    await setPostTags(tx, postId!, tagNames);
  });
  if (result === 'missing') return { message: 'This post no longer exists.' };

  revalidateBlog();
  redirect(`/admin/blog/${postId}/?saved=1`);
}

const plural = (n: number) => `${n} ${n === 1 ? 'post' : 'posts'}`;

/** Publishes the selected posts (`ids`), or moves them to drafts, from the post list. */
export async function setPostsStatus(_prev: BulkPostState, formData: FormData): Promise<BulkPostState> {
  await requireAdmin();
  const ids = formData
    .getAll('ids')
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0);
  const status = z.enum(POST_STATUSES).safeParse(formData.get('status'));
  if (!status.success) return { error: 'Choose Publish or Move to draft.' };
  if (!ids.length) return { error: 'Select at least one post.' };

  if (status.data === 'draft') {
    // Drafts keep their first publish date, so republishing doesn't move them to the top of the blog.
    const moved = await db
      .update(posts)
      .set({ status: 'draft' })
      .where(and(inArray(posts.id, ids), eq(posts.status, 'published')))
      .returning({ id: posts.id });
    if (moved.length) revalidateBlog();
    return { ok: moved.length ? `Moved ${plural(moved.length)} to drafts.` : 'Those posts were already drafts.' };
  }

  // Same rule as the post form: a post needs an article before it can go live.
  const drafts = await db
    .select({ id: posts.id, title: posts.title, body: posts.body })
    .from(posts)
    .where(and(inArray(posts.id, ids), eq(posts.status, 'draft')));
  const ready = drafts.filter((p) => postText(p.body) || p.body.includes('<img'));
  const empty = drafts.filter((p) => !ready.includes(p));
  if (ready.length) {
    await db
      .update(posts)
      .set({ status: 'published', publishedAt: sql`coalesce(${posts.publishedAt}, now())` })
      .where(
        inArray(
          posts.id,
          ready.map((p) => p.id),
        ),
      );
    revalidateBlog();
  }
  const skipped = empty.length
    ? ` Skipped ${plural(empty.length)} with no article yet: ${empty.map((p) => `“${p.title}”`).join(', ')}.`
    : '';
  if (!ready.length) return empty.length ? { error: skipped.trim() } : { ok: 'Those posts were already published.' };
  return { ok: `Published ${plural(ready.length)}.${skipped}` };
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  await db.transaction(async (tx) => {
    await tx.delete(posts).where(eq(posts.id, id));
    await pruneTags(tx);
  });
  revalidateBlog();
  redirect('/admin/blog/?deleted=1');
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

const CategorySchema = z.object({
  name: z.string().trim().min(1, { error: 'Enter a name.' }).max(80),
  slug: slugField,
  description: z.string().trim().max(400, { error: 'Keep the description under 400 characters.' }),
});

/** Creates a category (no `id`) or renames / edits one. */
export async function saveCategory(_prev: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  await requireAdmin();
  const id = Number(formData.get('id')) || null;
  const parsed = CategorySchema.safeParse({
    name: formData.get('name') ?? '',
    slug: formData.get('slug') ?? '',
    description: formData.get('description') ?? '',
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, description } = parsed.data;

  let slug = parsed.data.slug;
  if (slug) {
    const [clash] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(and(eq(categories.slug, slug), id ? ne(categories.id, id) : undefined))
      .limit(1);
    if (clash) return { error: 'Another category already uses this URL.' };
  } else {
    slug = await freeSlug(categories, slugify(name) || 'category', id);
  }

  if (id) {
    await db.update(categories).set({ name, slug, description }).where(eq(categories.id, id));
  } else {
    // New categories go last.
    const [{ last }] = await db.select({ last: max(categories.position) }).from(categories);
    await db.insert(categories).values({ name, slug, description, position: (last ?? 0) + 1 });
  }
  revalidateBlog();
  return { ok: id ? 'Category saved.' : `Added “${name}”.` };
}

/** Moves a category one place up or down. FormData: `id`, `move` ("up" or "down"). */
export async function moveCategory(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  const step = formData.get('move') === 'up' ? -1 : 1;
  await db.transaction(async (tx) => {
    const list = await tx
      .select({ id: categories.id })
      .from(categories)
      .orderBy(asc(categories.position), asc(categories.name));
    const from = list.findIndex((c) => c.id === id);
    const to = from + step;
    if (from < 0 || to < 0 || to >= list.length) return;
    [list[from], list[to]] = [list[to], list[from]];
    // Renumber 1…n, which also tidies gaps and ties.
    for (const [i, c] of list.entries()) {
      await tx.update(categories).set({ position: i + 1 }).where(eq(categories.id, c.id));
    }
  });
  revalidateBlog();
}

/** Posts in a deleted category stay published, without a category. */
export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  await db.delete(categories).where(eq(categories.id, Number(formData.get('id'))));
  revalidateBlog();
}
