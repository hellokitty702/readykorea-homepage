import 'server-only';
import { and, asc, count, desc, eq, inArray, ne, sql, type SQL } from 'drizzle-orm';
import { cache } from 'react';
import { db } from '@/lib/db';
import { categories, postTags, posts, tags } from '@/lib/db/schema';

/** Same shape as the live site: /blog/<slug>/ (/blog/<slug>.html redirects here, see next.config.ts). */
export const postPath = (slug: string) => `/blog/${slug}/`;
export const categoryPath = (slug: string) => `/blog/category/${slug}/`;
export const tagPath = (slug: string) => `/blog/tag/${slug}/`;

/** "Jul 24, 2026", in Korea time. */
export const fmtPostDate = (d: Date | null) =>
  d ? d.toLocaleDateString('en-US', { timeZone: 'Asia/Seoul', month: 'short', day: 'numeric', year: 'numeric' }) : '';

type Term = { slug: string; name: string };

/** Tags of each post, keyed by post id, sorted by name. */
async function tagsByPost(postIds: number[]) {
  const map = new Map<number, Term[]>();
  if (!postIds.length) return map;
  const rows = await db
    .select({ postId: postTags.postId, slug: tags.slug, name: tags.name })
    .from(postTags)
    .innerJoin(tags, eq(tags.id, postTags.tagId))
    .where(inArray(postTags.postId, postIds))
    .orderBy(tags.name);
  for (const { postId, ...tag } of rows) map.set(postId, [...(map.get(postId) ?? []), tag]);
  return map;
}

const listColumns = {
  id: posts.id,
  slug: posts.slug,
  title: posts.title,
  summary: posts.summary,
  teaser: posts.teaser,
  publishedAt: posts.publishedAt,
  updatedAt: posts.updatedAt,
  isFeatured: posts.isFeatured,
  categorySlug: categories.slug,
  categoryName: categories.name,
};

/**
 * Published posts, newest first; optionally only one category's or one tag's, without one post (the
 * featured one shown above the list), or `byCategory`: grouped by category in menu order, newest first
 * within each, like the old blog's index.
 */
export async function getPublishedPosts({
  categoryId,
  tagId,
  exceptId,
  byCategory,
  limit,
}: { categoryId?: number; tagId?: number; exceptId?: number; byCategory?: boolean; limit?: number } = {}) {
  const where: SQL[] = [eq(posts.status, 'published')];
  if (categoryId) where.push(eq(posts.categoryId, categoryId));
  if (exceptId) where.push(ne(posts.id, exceptId));
  if (tagId) {
    where.push(inArray(posts.id, db.select({ id: postTags.postId }).from(postTags).where(eq(postTags.tagId, tagId))));
  }
  const query = db
    .select(listColumns)
    .from(posts)
    .leftJoin(categories, eq(categories.id, posts.categoryId))
    .where(and(...where))
    .orderBy(
      ...(byCategory ? [sql`${categories.position} asc nulls last`, asc(categories.name)] : []),
      desc(posts.publishedAt),
      desc(posts.id),
    );
  const rows = limit ? await query.limit(limit) : await query;
  const postTagMap = await tagsByPost(rows.map((r) => r.id));
  return rows.map(({ categorySlug, categoryName, ...post }) => ({
    ...post,
    category: categorySlug && categoryName ? { slug: categorySlug, name: categoryName } : null,
    tags: postTagMap.get(post.id) ?? [],
  }));
}
export type PostListItem = Awaited<ReturnType<typeof getPublishedPosts>>[number];

/** The newest published featured post, overall or in one category. */
export async function getFeaturedPost(categoryId?: number) {
  const where: SQL[] = [eq(posts.status, 'published'), eq(posts.isFeatured, true)];
  if (categoryId) where.push(eq(posts.categoryId, categoryId));
  const [row] = await db
    .select(listColumns)
    .from(posts)
    .leftJoin(categories, eq(categories.id, posts.categoryId))
    .where(and(...where))
    .orderBy(desc(posts.publishedAt), desc(posts.id))
    .limit(1);
  if (!row) return null;
  const { categorySlug, categoryName, ...post } = row;
  return { ...post, category: categorySlug && categoryName ? { slug: categorySlug, name: categoryName } : null };
}
export type FeaturedPost = NonNullable<Awaited<ReturnType<typeof getFeaturedPost>>>;

/** One published post by slug, with its category and tags (cached per request). */
export const getPublishedPost = cache(async (slug: string) => {
  const [row] = await db
    .select({ post: posts, categorySlug: categories.slug, categoryName: categories.name })
    .from(posts)
    .leftJoin(categories, eq(categories.id, posts.categoryId))
    .where(and(eq(posts.slug, slug), eq(posts.status, 'published')))
    .limit(1);
  if (!row) return null;
  return {
    ...row.post,
    category: row.categorySlug && row.categoryName ? { slug: row.categorySlug, name: row.categoryName } : null,
    tags: (await tagsByPost([row.post.id])).get(row.post.id) ?? [],
  };
});

export const getCategory = cache(async (slug: string) => {
  const [category] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return category ?? null;
});

export const getTag = cache(async (slug: string) => {
  const [tag] = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1);
  return tag ?? null;
});

/** Categories that have published posts, in their set order, for the header menu and the blog navigation. */
export function getBlogCategories() {
  return db
    .select({ slug: categories.slug, name: categories.name, posts: count(posts.id) })
    .from(categories)
    .innerJoin(posts, and(eq(posts.categoryId, categories.id), eq(posts.status, 'published')))
    .groupBy(categories.id)
    .orderBy(categories.position, categories.name);
}

/** Number of published posts, for the "All" tab. */
export async function countPublishedPosts() {
  const [row] = await db.select({ value: count() }).from(posts).where(eq(posts.status, 'published'));
  return row.value;
}
