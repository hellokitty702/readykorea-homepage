'use server';

import { and, count, eq, like, ne, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as z from 'zod';
import { requireAdmin } from '@/lib/auth/dal';
import { db } from '@/lib/db';
import { JOB_BADGES, JOB_STATUSES, applications, jobs, type JobContent, type JobFaq } from '@/lib/db/schema';
import { JOB_TEXT_KEYS, REQUIRED_JOB_KEYS, type JobTextKey } from '@/lib/job-fields';
import { SLUG_HINT, SLUG_MAX, SLUG_PATTERN, slugify } from '@/lib/slug';

export type JobFormState = { message?: string; errors?: Record<string, string> };

const SettingsSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9][A-Z0-9-]{2,38}$/, { error: 'Use 3–39 letters, numbers and dashes, e.g. RK-2026-GN-003.' }),
  // Blank: made from the English title.
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(SLUG_MAX, { error: `Keep it under ${SLUG_MAX} characters.` })
    .refine((s) => s === '' || SLUG_PATTERN.test(s), {
      error: SLUG_HINT,
    }),
  school: z.string().trim().min(1, { error: 'Enter the school name.' }).max(160),
  status: z.enum(JOB_STATUSES),
  badge: z.enum(['', ...JOB_BADGES]).transform((b) => (b === '' ? null : b)),
  startDate: z
    .string()
    .trim()
    .refine((d) => d === '' || /^\d{4}-\d{2}-\d{2}$/.test(d), { error: 'Use a valid date.' })
    .transform((d) => d || null),
  rating: z.string().trim().max(60),
});

function readFaq(formData: FormData, lang: 'en' | 'ko'): JobFaq[] {
  try {
    const list = JSON.parse(String(formData.get(`${lang}.faq`) ?? '[]')) as JobFaq[];
    return list
      .map((item) => ({
        q: String(item.q ?? '')
          .trim()
          .slice(0, 300),
        a: String(item.a ?? '')
          .trim()
          .slice(0, 2000),
      }))
      .filter((item) => item.q && item.a);
  } catch {
    return [];
  }
}

function readContent(formData: FormData, lang: 'en' | 'ko') {
  const content = Object.fromEntries(
    JOB_TEXT_KEYS.map((key) => [
      key,
      String(formData.get(`${lang}.${key}`) ?? '')
        .trim()
        .slice(0, 4000),
    ]),
  ) as Record<JobTextKey, string>;
  return { ...content, faq: readFaq(formData, lang) } satisfies JobContent;
}

/** `base`, or `base-2`, `base-3`… if another job has it. */
async function freeSlug(base: string, id: number | null) {
  const taken = new Set(
    (
      await db
        .select({ slug: jobs.slug })
        .from(jobs)
        .where(and(or(eq(jobs.slug, base), like(jobs.slug, `${base}-%`)), id ? ne(jobs.id, id) : undefined))
    ).map((j) => j.slug),
  );
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

/** The Job Board (homepage and /jobs/) and every /jobs/<slug>/ page show published jobs (the sitemap is built per request). */
function revalidatePublicJobs() {
  revalidatePath('/');
  revalidatePath('/jobs/');
  revalidatePath('/jobs/[slug]', 'page');
}

/** Creates a job (no `id`) or updates one. */
export async function saveJob(_prev: JobFormState, formData: FormData): Promise<JobFormState> {
  const admin = await requireAdmin();
  const id = Number(formData.get('id')) || null;

  const parsed = SettingsSchema.safeParse({
    code: formData.get('code') ?? '',
    slug: formData.get('slug') ?? '',
    school: formData.get('school') ?? '',
    status: formData.get('status') ?? 'draft',
    badge: formData.get('badge') ?? '',
    startDate: formData.get('startDate') ?? '',
    rating: formData.get('rating') ?? '',
  });
  const errors: Record<string, string> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
  }
  const en = readContent(formData, 'en');
  const ko = readContent(formData, 'ko');
  for (const key of REQUIRED_JOB_KEYS) if (!en[key]) errors[`en.${key}`] = 'Required.';
  if (!parsed.success || Object.keys(errors).length) {
    return { errors, message: 'Please fix the highlighted fields.' };
  }
  const settings = parsed.data;

  const others = id ? ne(jobs.id, id) : undefined;
  const clashes = await db
    .select({ code: jobs.code, slug: jobs.slug })
    .from(jobs)
    .where(and(or(eq(jobs.code, settings.code), settings.slug ? eq(jobs.slug, settings.slug) : undefined), others));
  if (clashes.some((j) => j.code === settings.code)) errors.code = 'Another job already uses this ID.';
  if (settings.slug && clashes.some((j) => j.slug === settings.slug))
    errors.slug = 'Another job already uses this URL.';
  if (Object.keys(errors).length) return { errors, message: 'Please fix the highlighted fields.' };

  // Korean: keep only filled-in fields so blanks fall back to English.
  const koFilled: Partial<JobContent> = Object.fromEntries(
    Object.entries(ko).filter(([, value]) => (Array.isArray(value) ? value.length : value)),
  );
  const slug = settings.slug || (await freeSlug(slugify(en.title) || settings.code.toLowerCase(), id));
  const values = { ...settings, slug, en, ko: koFilled };

  let jobId = id;
  if (id) {
    const [current] = await db.select({ publishedAt: jobs.publishedAt }).from(jobs).where(eq(jobs.id, id)).limit(1);
    if (!current) return { message: 'This job no longer exists.' };
    await db
      .update(jobs)
      .set({ ...values, publishedAt: current.publishedAt ?? (settings.status === 'published' ? new Date() : null) })
      .where(eq(jobs.id, id));
  } else {
    const [row] = await db
      .insert(jobs)
      .values({ ...values, createdById: admin.id, publishedAt: settings.status === 'published' ? new Date() : null })
      .returning({ id: jobs.id });
    jobId = row.id;
  }

  revalidatePublicJobs();
  redirect(`/admin/jobs/${jobId}/?saved=1`);
}

export async function setJobStatus(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  const status = z.enum(JOB_STATUSES).parse(formData.get('status'));
  const [job] = await db.select({ publishedAt: jobs.publishedAt }).from(jobs).where(eq(jobs.id, id)).limit(1);
  if (!job) return;
  await db
    .update(jobs)
    .set({ status, publishedAt: job.publishedAt ?? (status === 'published' ? new Date() : null) })
    .where(eq(jobs.id, id));
  revalidatePublicJobs();
  revalidatePath(`/admin/jobs/${id}/`);
}

/** Only jobs without applications can be deleted; others should be closed instead. */
export async function deleteJob(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  const [{ value }] = await db.select({ value: count() }).from(applications).where(eq(applications.jobId, id));
  if (value > 0) redirect(`/admin/jobs/${id}/?error=has-applications`);
  await db.delete(jobs).where(eq(jobs.id, id));
  revalidatePublicJobs();
  redirect('/admin/jobs/?deleted=1');
}
