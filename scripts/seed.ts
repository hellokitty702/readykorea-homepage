// Adds the content the old site had: two Job Board listings, the blog categories (seed-categories.json;
// they also make the header's Blog menu) and the blog posts copied from www.readykoreaesl.com
// (seed-posts.json; their images are in public/images/).
// Safe to re-run: skips jobs, posts and categories whose slug (or job ID) already exists.
// Usage: bun run db:seed
import './env';
import { db, sql } from '@/lib/db';
import { sanitizePostHtml } from '@/lib/blog-html';
import { parseTagNames, setPostTags } from '@/lib/blog-tags';
import { categories, jobs, posts, type JobBadge, type JobContent } from '@/lib/db/schema';
import { slugify } from '@/lib/slug';
import seedCategories from './seed-categories.json';
import seedJobs from './seed-jobs.json';
import seedPosts from './seed-posts.json';

type SeedJob = {
  code: string;
  badge: JobBadge;
  school: string;
  startDate: string;
  rating: string;
  en: JobContent;
  ko: JobContent;
};

// Listed newest first on the Job Board, so publish them in reverse to keep the original order.
const list = [...(seedJobs as SeedJob[])].reverse();
const now = Date.now();
const rows = await db
  .insert(jobs)
  .values(
    list.map((job, i) => ({
      ...job,
      slug: slugify(job.en.title),
      status: 'published' as const,
      publishedAt: new Date(now + i * 1000),
    })),
  )
  .onConflictDoNothing()
  .returning({ code: jobs.code });

console.log(rows.length ? `Added jobs: ${rows.map((r) => r.code).join(', ')}` : 'Jobs already present, nothing added.');

// Blog categories, in the order of the file (the old blog's order)
const newCategories = await db
  .insert(categories)
  .values(seedCategories.map((category, i) => ({ ...category, position: i + 1 })))
  .onConflictDoNothing()
  .returning({ slug: categories.slug });
console.log(
  newCategories.length
    ? `Added categories: ${newCategories.map((c) => c.slug).join(', ')}`
    : 'Categories already present, nothing added.',
);

// Blog posts
const categoryIds = new Map(
  (await db.select({ id: categories.id, slug: categories.slug }).from(categories)).map((c) => [c.slug, c.id]),
);
const added: string[] = [];
for (const { category, tags, publishedAt, body, ...post } of seedPosts.posts) {
  await db.transaction(async (tx) => {
    const [row] = await tx
      .insert(posts)
      .values({
        ...post,
        // Same cleaning as a post saved in the admin panel.
        body: sanitizePostHtml(body),
        status: 'published',
        publishedAt: new Date(publishedAt),
        categoryId: categoryIds.get(category) ?? null,
      })
      .onConflictDoNothing()
      .returning({ id: posts.id });
    if (!row) return;
    await setPostTags(tx, row.id, parseTagNames(tags.join(',')));
    added.push(post.slug);
  });
}
console.log(added.length ? `Added posts: ${added.join(', ')}` : 'Posts already present, nothing added.');

await sql.end();
