import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import { cache } from 'react';
import { db } from '@/lib/db';
import { jobs, type Job } from '@/lib/db/schema';

/** Jobs on the public Job Board, newest first. */
export function getPublishedJobs() {
  return db.select().from(jobs).where(eq(jobs.status, 'published')).orderBy(desc(jobs.publishedAt), desc(jobs.id));
}

/** One published job by its page slug (cached per request: used by the page and its metadata). */
export const getPublishedJob = cache(async (slug: string) => {
  const [job] = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.slug, slug), eq(jobs.status, 'published')))
    .limit(1);
  return job ?? null;
});

export const applyHref = (job: Pick<Job, 'code'>) => `/apply/?job=${encodeURIComponent(job.code)}`;
