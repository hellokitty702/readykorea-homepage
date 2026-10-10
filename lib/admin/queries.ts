import 'server-only';
import { and, asc, count, desc, eq, gte, ilike, inArray, isNull, or, sql, type SQL } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  applicationEvents,
  applications,
  categories,
  jobs,
  media,
  postTags,
  posts,
  tags,
  users,
  type ApplicationStatus,
  type Media,
  type PostStatus,
} from '@/lib/db/schema';

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

const DAY = 24 * 60 * 60 * 1000;
/** Dates inside raw sql`` fragments must be sent as text. */
const ts = (d: Date) => sql`${d.toISOString()}::timestamptz`;

export async function getDashboardStats() {
  const now = Date.now();
  const since7 = new Date(now - 7 * DAY);
  const since14 = new Date(now - 14 * DAY);
  const since30 = new Date(now - 30 * DAY);

  const [jobCounts, byStatus, [recent], perDay, topJobs, byCountry, byPosition, latest] = await Promise.all([
    db.select({ status: jobs.status, value: count() }).from(jobs).groupBy(jobs.status),
    db.select({ status: applications.status, value: count() }).from(applications).groupBy(applications.status),
    db
      .select({
        last7: sql<number>`count(*) filter (where ${applications.createdAt} >= ${ts(since7)})`.mapWith(Number),
        prev7:
          sql<number>`count(*) filter (where ${applications.createdAt} >= ${ts(since14)} and ${applications.createdAt} < ${ts(since7)})`.mapWith(
            Number,
          ),
      })
      .from(applications),
    // Days in Korea time, so "today" matches the team's calendar.
    db
      .select({
        day: sql<string>`to_char(${applications.createdAt} at time zone 'Asia/Seoul', 'YYYY-MM-DD')`,
        value: count(),
      })
      .from(applications)
      .where(gte(applications.createdAt, since30))
      .groupBy(sql`1`)
      .orderBy(sql`1`),
    db
      .select({
        id: jobs.id,
        code: jobs.code,
        title: sql<string>`${jobs.en}->>'title'`,
        school: jobs.school,
        status: jobs.status,
        total: count(applications.id),
        open: sql<number>`count(${applications.id}) filter (where ${applications.status} in ('new','reviewing','interview','offered'))`.mapWith(
          Number,
        ),
        hired: sql<number>`count(${applications.id}) filter (where ${applications.status} = 'hired')`.mapWith(Number),
      })
      .from(jobs)
      .leftJoin(applications, eq(applications.jobId, jobs.id))
      .groupBy(jobs.id)
      .orderBy(desc(count(applications.id)), desc(jobs.id))
      .limit(8),
    db
      .select({ label: applications.passportCountry, value: count() })
      .from(applications)
      .groupBy(applications.passportCountry)
      .orderBy(desc(count())),
    db
      .select({ label: applications.position, value: count() })
      .from(applications)
      .groupBy(applications.position)
      .orderBy(desc(count())),
    listApplications({ limit: 6 }),
  ]);

  const statusCount = Object.fromEntries(byStatus.map((r) => [r.status, r.value])) as Partial<
    Record<ApplicationStatus, number>
  >;
  const jobCount = Object.fromEntries(jobCounts.map((r) => [r.status, r.value])) as Partial<
    Record<'draft' | 'published' | 'closed', number>
  >;

  // Fill in days without applications.
  const perDayMap = new Map(perDay.map((r) => [r.day, r.value]));
  const days = Array.from({ length: 30 }, (_, i) => {
    const day = new Date(now - (29 - i) * DAY).toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
    return { day, value: perDayMap.get(day) ?? 0 };
  });

  return {
    jobCount,
    statusCount,
    totalApplications: byStatus.reduce((sum, r) => sum + r.value, 0),
    last7: recent.last7,
    prev7: recent.prev7,
    days,
    topJobs,
    byCountry,
    byPosition,
    latest: latest.rows,
  };
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

export function listJobs(status?: 'draft' | 'published' | 'closed') {
  return db
    .select({
      id: jobs.id,
      code: jobs.code,
      status: jobs.status,
      badge: jobs.badge,
      school: jobs.school,
      title: sql<string>`${jobs.en}->>'title'`,
      location: sql<string>`${jobs.en}->>'location'`,
      startDate: jobs.startDate,
      updatedAt: jobs.updatedAt,
      applications: count(applications.id),
      newApplications: sql<number>`count(${applications.id}) filter (where ${applications.status} = 'new')`.mapWith(
        Number,
      ),
    })
    .from(jobs)
    .leftJoin(applications, eq(applications.jobId, jobs.id))
    .where(status ? eq(jobs.status, status) : undefined)
    .groupBy(jobs.id)
    .orderBy(
      asc(sql`array_position(array['published','draft','closed']::varchar[], ${jobs.status})`),
      desc(jobs.updatedAt),
    );
}

export async function jobStatusCounts() {
  const rows = await db.select({ status: jobs.status, value: count() }).from(jobs).groupBy(jobs.status);
  return Object.fromEntries(rows.map((r) => [r.status, r.value])) as Partial<
    Record<'draft' | 'published' | 'closed', number>
  >;
}

/** Route param → positive integer id, or null. */
export const parseId = (value: string) => (/^\d{1,9}$/.test(value) ? Number(value) : null);

export async function getJob(id: number | null) {
  if (!id) return null;
  const [job] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return job ?? null;
}

/** Next free `RK-<year>-<nnn>` ID (codes like RK-2026-GN-001 count by their trailing number). */
export async function suggestJobCode() {
  const year = new Date().getFullYear();
  const rows = await db
    .select({ code: jobs.code })
    .from(jobs)
    .where(ilike(jobs.code, `RK-${year}-%`));
  const taken = new Set(rows.map((r) => r.code));
  let n = Math.max(0, ...rows.map((r) => Number(r.code.match(/(\d+)$/)?.[1] ?? 0))) + 1;
  while (taken.has(`RK-${year}-${String(n).padStart(3, '0')}`)) n++;
  return `RK-${year}-${String(n).padStart(3, '0')}`;
}

export function openJobOptions() {
  return db
    .select({ id: jobs.id, code: jobs.code, title: sql<string>`${jobs.en}->>'title'`, status: jobs.status })
    .from(jobs)
    .orderBy(desc(jobs.id));
}

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------

export type ApplicationFilters = {
  status?: ApplicationStatus;
  /** Job id, or 'general' for applications not tied to a job. */
  job?: number | 'general';
  q?: string;
  page?: number;
  limit?: number;
};

function applicationWhere({ status, job, q }: ApplicationFilters, withStatus = true) {
  const where: SQL[] = [];
  if (withStatus && status) where.push(eq(applications.status, status));
  if (job === 'general') where.push(isNull(applications.jobId));
  else if (job) where.push(eq(applications.jobId, job));
  if (q) {
    const like = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
    where.push(or(ilike(applications.fullName, like), ilike(applications.email, like))!);
  }
  return where.length ? and(...where) : undefined;
}

export async function listApplications(filters: ApplicationFilters = {}) {
  const limit = filters.limit ?? 50;
  const page = Math.max(1, filters.page ?? 1);
  const where = applicationWhere(filters);
  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: applications.id,
        fullName: applications.fullName,
        email: applications.email,
        status: applications.status,
        position: applications.position,
        passportCountry: applications.passportCountry,
        experience: applications.experience,
        createdAt: applications.createdAt,
        updatedAt: applications.updatedAt,
        jobId: jobs.id,
        jobCode: jobs.code,
        jobTitle: sql<string | null>`${jobs.en}->>'title'`,
      })
      .from(applications)
      .leftJoin(jobs, eq(jobs.id, applications.jobId))
      .where(where)
      .orderBy(desc(applications.createdAt))
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(applications).where(where),
  ]);
  return { rows, total, page, pages: Math.max(1, Math.ceil(total / limit)) };
}

/** Counts per status for the filter tabs (respecting the job and search filters). */
export async function applicationStatusCounts(filters: ApplicationFilters) {
  const rows = await db
    .select({ status: applications.status, value: count() })
    .from(applications)
    .where(applicationWhere(filters, false))
    .groupBy(applications.status);
  return Object.fromEntries(rows.map((r) => [r.status, r.value])) as Partial<Record<ApplicationStatus, number>>;
}

export async function getApplication(id: number | null) {
  if (!id) return null;
  const [row] = await db
    .select({
      application: applications,
      job: { id: jobs.id, code: jobs.code, school: jobs.school, en: jobs.en, status: jobs.status },
    })
    .from(applications)
    .leftJoin(jobs, eq(jobs.id, applications.jobId))
    .where(eq(applications.id, id))
    .limit(1);
  if (!row) return null;

  const events = await db
    .select({
      id: applicationEvents.id,
      type: applicationEvents.type,
      fromStatus: applicationEvents.fromStatus,
      toStatus: applicationEvents.toStatus,
      note: applicationEvents.note,
      createdAt: applicationEvents.createdAt,
      userName: users.name,
    })
    .from(applicationEvents)
    .leftJoin(users, eq(users.id, applicationEvents.userId))
    .where(eq(applicationEvents.applicationId, id))
    .orderBy(desc(applicationEvents.createdAt), desc(applicationEvents.id));

  // Other applications from the same person.
  const others = await db
    .select({ id: applications.id, status: applications.status, createdAt: applications.createdAt, jobCode: jobs.code })
    .from(applications)
    .leftJoin(jobs, eq(jobs.id, applications.jobId))
    .where(and(eq(applications.email, row.application.email), sql`${applications.id} <> ${id}`))
    .orderBy(desc(applications.createdAt));

  return { ...row, events, others };
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export function listUsers() {
  return db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.role), asc(users.name));
}

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

/** Tag names per post, joined with ", " (the post form's tag field format). */
async function tagNamesByPost(postIds: number[]) {
  const map = new Map<number, string[]>();
  if (!postIds.length) return map;
  const rows = await db
    .select({ postId: postTags.postId, name: tags.name })
    .from(postTags)
    .innerJoin(tags, eq(tags.id, postTags.tagId))
    .where(inArray(postTags.postId, postIds))
    .orderBy(tags.name);
  for (const r of rows) map.set(r.postId, [...(map.get(r.postId) ?? []), r.name]);
  return map;
}

export async function listPosts(status?: PostStatus) {
  const rows = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      status: posts.status,
      publishedAt: posts.publishedAt,
      updatedAt: posts.updatedAt,
      category: categories.name,
    })
    .from(posts)
    .leftJoin(categories, eq(categories.id, posts.categoryId))
    .where(status ? eq(posts.status, status) : undefined)
    // Drafts first (work in progress), then newest.
    .orderBy(desc(sql`${posts.status} = 'draft'`), desc(sql`coalesce(${posts.publishedAt}, ${posts.updatedAt})`));
  const tagMap = await tagNamesByPost(rows.map((r) => r.id));
  return rows.map((r) => ({ ...r, tags: tagMap.get(r.id) ?? [] }));
}

export async function postStatusCounts() {
  const rows = await db.select({ status: posts.status, value: count() }).from(posts).groupBy(posts.status);
  return Object.fromEntries(rows.map((r) => [r.status, r.value])) as Partial<Record<PostStatus, number>>;
}

export async function getPostForEdit(id: number | null) {
  if (!id) return null;
  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!post) return null;
  return { ...post, tags: ((await tagNamesByPost([id])).get(id) ?? []).join(', ') };
}

/** Every category with its post counts, for the category manager and the post form. */
export function listCategories() {
  return db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
      description: categories.description,
      posts: count(posts.id),
      published: sql<number>`count(${posts.id}) filter (where ${posts.status} = 'published')`.mapWith(Number),
    })
    .from(categories)
    .leftJoin(posts, eq(posts.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(asc(categories.name));
}

/** Existing tag names, suggested while typing in the post form. */
export async function allTagNames() {
  return (await db.select({ name: tags.name }).from(tags).orderBy(tags.name)).map((t) => t.name);
}

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export type MediaItem = Media & { usedIn: { id: number; title: string }[] };

export const MEDIA_PAGE_SIZE = 36;

/** Posts whose HTML contains each address, keyed by address. */
export async function mediaUsage(urls: string[]) {
  const map = new Map<string, { id: number; title: string }[]>();
  if (!urls.length) return map;
  const rows = await db
    .select({ url: media.url, id: posts.id, title: posts.title })
    .from(media)
    .innerJoin(posts, sql`strpos(${posts.body}, ${media.url}) > 0`)
    .where(inArray(media.url, urls))
    .orderBy(posts.title);
  for (const { url, ...post } of rows) map.set(url, [...(map.get(url) ?? []), post]);
  return map;
}

/** The media library, newest first, with the posts using each image. */
export async function listMedia({ page = 1, search = '' }: { page?: number; search?: string } = {}) {
  const q = search.trim();
  const like = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
  const where = q ? or(ilike(media.filename, like), ilike(media.alt, like)) : undefined;
  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(media)
      .where(where)
      .orderBy(desc(media.createdAt), desc(media.id))
      .limit(MEDIA_PAGE_SIZE)
      .offset((page - 1) * MEDIA_PAGE_SIZE),
    db.select({ total: count() }).from(media).where(where),
  ]);
  const usage = await mediaUsage(rows.map((r) => r.url));
  return {
    items: rows.map((row): MediaItem => ({ ...row, usedIn: usage.get(row.url) ?? [] })),
    page,
    pages: Math.max(1, Math.ceil(total / MEDIA_PAGE_SIZE)),
    total,
  };
}
