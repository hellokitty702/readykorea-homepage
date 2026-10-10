import { eq, inArray, notExists } from 'drizzle-orm';
import type { db as Db } from '@/lib/db';
import { postTags, tags } from '@/lib/db/schema';
import { slugify } from '@/lib/slug';

type Tx = Parameters<Parameters<typeof Db.transaction>[0]>[0];

/** "Classroom, beginners ,classroom" → ["Classroom", "beginners"]: trimmed, de-duplicated by slug. */
export function parseTagNames(input: string) {
  const seen = new Map<string, string>();
  for (const raw of input.split(',')) {
    const name = raw.trim().replace(/\s+/g, ' ').slice(0, 60);
    const slug = slugify(name);
    if (slug && !seen.has(slug)) seen.set(slug, name);
  }
  return [...seen.entries()].map(([slug, name]) => ({ slug, name }));
}

/** Gives a post exactly these tags (creating new ones) and deletes tags no post uses any more. */
export async function setPostTags(tx: Tx, postId: number, names: { slug: string; name: string }[]) {
  if (names.length) await tx.insert(tags).values(names).onConflictDoNothing({ target: tags.slug });
  const ids = names.length
    ? (
        await tx
          .select({ id: tags.id })
          .from(tags)
          .where(
            inArray(
              tags.slug,
              names.map((n) => n.slug),
            ),
          )
      ).map((t) => t.id)
    : [];
  await tx.delete(postTags).where(eq(postTags.postId, postId));
  if (ids.length) await tx.insert(postTags).values(ids.map((tagId) => ({ postId, tagId })));
  await pruneTags(tx);
}

/** Removes tags that no post uses. */
export function pruneTags(tx: Tx) {
  return tx.delete(tags).where(notExists(tx.select().from(postTags).where(eq(postTags.tagId, tags.id))));
}
