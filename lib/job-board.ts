import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import { cache } from 'react';
import { db } from '@/lib/db';
import { jobs, type Job } from '@/lib/db/schema';
import { formatStartDate, jobPath, localizedContent } from '@/lib/job-fields';
import { SCHOOL_POST_JOB_FORM_URL } from '@/lib/site';

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

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (value: string) => value.replace(/[&<>"']/g, (c) => ESCAPES[c]);

export const applyHref = (job: Pick<Job, 'code'>) => `/apply/?job=${encodeURIComponent(job.code)}`;

/** One value per language: shown/hidden by the site's html[lang] en-only / ko-only rules. */
function bilingual(en: string, ko: string) {
  return en === ko ? esc(en) : `<span class="en-only">${esc(en)}</span><span class="ko-only">${esc(ko)}</span>`;
}

/** Job Board cards (same markup the hard-coded cards used). */
export function renderJobCards(list: Job[], postJobUrl: string): string {
  if (!list.length) {
    return (
      '<div class="job-card job-card-empty"><h3>' +
      bilingual('No open positions right now', '현재 오픈 포지션이 없습니다') +
      '</h3><div class="school">' +
      bilingual('New school postings appear here after review.', '새 공고는 검토 후 이곳에 표시됩니다.') +
      '</div></div>'
    );
  }
  return list
    .map((job) => {
      const en = job.en;
      const ko = localizedContent(job.en, job.ko);
      const row = (labelKey: string, label: string, value: string) =>
        `<tr><td data-i18n="${labelKey}">${label}</td><td>${value}</td></tr>`;
      const badge = job.badge
        ? `<span class="${job.badge}" data-i18n="jobs.badge.${job.badge}">${job.badge === 'urgent' ? 'Urgent' : 'New'}</span>`
        : '';
      return (
        `<div class="job-card">` +
        `<div class="top"><span class="type">${bilingual(en.type, ko.type)}</span>${badge}</div>` +
        `<h3>${bilingual(en.title, ko.title)}</h3>` +
        `<div class="school">${esc(job.school)}</div>` +
        '<table><tbody>' +
        row('jobs.col.location', 'Location', bilingual(en.location, ko.location)) +
        row('jobs.col.salary', 'Salary', bilingual(en.salary, ko.salary)) +
        row('jobs.col.start', 'Start date', esc(formatStartDate(job.startDate))) +
        row('jobs.col.housing', 'Housing', bilingual(en.housing, ko.housing)) +
        row('jobs.col.rating', 'Rating', esc(job.rating)) +
        row('jobs.col.response', 'Response', bilingual(en.response, ko.response)) +
        '</tbody></table>' +
        `<a class="view-detail-btn" href="${esc(jobPath(job))}" data-i18n="jobs.viewDetail">View job details →</a>` +
        '<div class="job-card-actions">' +
        `<a class="apply-btn" href="${esc(applyHref(job))}" data-i18n="jobs.apply">Apply Now</a>` +
        `<a class="post-job-btn" href="${esc(postJobUrl)}" target="_blank" rel="noopener noreferrer" data-i18n="jobs.post">Post a Job</a>` +
        '</div></div>'
      );
    })
    .join('');
}

/** Fills the job cards into content/sections/jobs.html (the homepage and /jobs/). */
export async function jobBoardCards() {
  return { '<!--JOB_CARDS-->': renderJobCards(await getPublishedJobs(), SCHOOL_POST_JOB_FORM_URL) };
}
