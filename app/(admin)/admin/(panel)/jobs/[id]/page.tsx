import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DeleteJobButton } from '@/components/admin/delete-job-button';
import {
  STATUS_COLORS,
  alertError,
  alertOk,
  button,
  card,
  cardHead,
  cardTitle,
  code,
  cx,
  dangerCard,
  muted,
  num,
  sectionHeading,
  small,
  specs,
  strong,
  table,
  twoColumnsWideLeft,
} from '@/components/admin/styles';
import { Empty, JobStatusBadge, PageHeader, PageSub, StatusBadge, fmtDate, fmtDateTime } from '@/components/admin/ui';
import { setJobStatus } from '@/lib/actions/jobs';
import { applicationStatusCounts, getJob, listApplications, parseId } from '@/lib/admin/queries';
import { ALL_STATUSES, STATUS_LABEL } from '@/lib/application-flow';
import { APPLY_METHOD_LABEL, isExternalMethod, standaloneFormUrl } from '@/lib/apply-forms';
import { requireAdmin } from '@/lib/auth/dal';
import { JOB_FIELD_GROUPS, formatStartDate, jobPath } from '@/lib/job-fields';
import { applyHref } from '@/lib/job-board';

export const metadata: Metadata = { title: 'Job' };

export default async function JobPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await requireAdmin();
  const job = await getJob(parseId((await params).id));
  if (!job) notFound();
  const { saved, error } = await searchParams;
  const [apps, counts] = await Promise.all([
    listApplications({ job: job.id, limit: 100 }),
    applicationStatusCounts({ job: job.id }),
  ]);

  const statusButton = (status: 'draft' | 'published' | 'closed', label: string, primary = false) => (
    <form action={setJobStatus}>
      <input type="hidden" name="id" value={job.id} />
      <input type="hidden" name="status" value={status} />
      <button className={button(primary ? 'primary' : 'default')}>{label}</button>
    </form>
  );

  return (
    <>
      <PageHeader
        title={job.en.title}
        crumbs={[{ href: '/admin/jobs/', label: 'Jobs' }]}
        actions={
          <>
            {job.status !== 'published' && statusButton('published', 'Publish', true)}
            {job.status === 'published' && statusButton('closed', 'Close job')}
            {job.status === 'closed' && statusButton('draft', 'Move to draft')}
            <Link className={button()} href={`/admin/jobs/${job.id}/edit/`}>
              Edit
            </Link>
          </>
        }
      >
        <PageSub>
          <JobStatusBadge status={job.status} /> {job.school} · {job.en.location} ·{' '}
          <code className={code}>{job.code}</code>
        </PageSub>
      </PageHeader>

      {error === 'has-applications' && (
        <p className={alertError}>This job has applications, so it can&apos;t be deleted. Close it instead.</p>
      )}
      {saved && <p className={alertOk}>Saved. {job.status === 'published' && 'The Job Board shows the update.'}</p>}

      <div className={twoColumnsWideLeft}>
        <section className={card}>
          <div className={cx(cardHead, 'flex-wrap')}>
            <h2 className="text-md font-bold">Applications ({apps.total})</h2>
            <Link href={`/admin/applications/?job=${job.id}`}>Open in Applications →</Link>
          </div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {ALL_STATUSES.filter((s) => counts[s]).map((s) => (
              <Link
                key={s}
                className={cx(
                  'rounded-full px-2.5 py-0.75 text-xs font-semibold hover:no-underline hover:brightness-95',
                  STATUS_COLORS[s],
                )}
                href={`/admin/applications/?job=${job.id}&status=${s}`}
              >
                {STATUS_LABEL[s]} {counts[s]}
              </Link>
            ))}
          </div>
          {isExternalMethod(job.applyMethod) && (
            <p className="mb-3 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-label text-amber-900">
              Teachers apply through {APPLY_METHOD_LABEL[job.applyMethod]}, so new applicants don&apos;t appear
              here.{' '}
              {job.applyFormUrl && (
                <a href={standaloneFormUrl(job.applyFormUrl)} target="_blank" rel="noopener">
                  Open the form ↗
                </a>
              )}
            </p>
          )}
          {apps.rows.length ? (
            <table className={table(true)}>
              <tbody>
                {apps.rows.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Link className={strong} href={`/admin/applications/${a.id}/`}>
                        {a.fullName}
                      </Link>
                      <div className={cx(muted, small)}>
                        {a.passportCountry ? `${a.passportCountry} · ${a.experience}` : a.email}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={a.status} />
                    </td>
                    <td className={cx(num, muted, 'whitespace-nowrap max-sm:hidden')}>{fmtDate(a.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Empty>No applications for this job yet.</Empty>
          )}
        </section>

        <section className={card}>
          <h2 className={cardTitle}>Listing</h2>
          <dl className={specs}>
            <dt>Page URL</dt>
            <dd>
              <code className={code}>{jobPath(job)}</code>
            </dd>
            <dt>Status</dt>
            <dd>
              <JobStatusBadge status={job.status} />
            </dd>
            <dt>Application form</dt>
            <dd>
              {APPLY_METHOD_LABEL[job.applyMethod]}
              {job.applyMethod === 'standard' && (
                <span className={muted}>
                  {' '}
                  · {job.applyFields.length + 2} questions
                </span>
              )}
            </dd>
            <dt>Badge</dt>
            <dd>{job.badge === 'urgent' ? 'Urgent' : job.badge === 'new' ? 'New' : '—'}</dd>
            <dt>Start date</dt>
            <dd>{formatStartDate(job.startDate) || '—'}</dd>
            <dt>Rating</dt>
            <dd>{job.rating || '—'}</dd>
            <dt>Published</dt>
            <dd>{fmtDateTime(job.publishedAt)}</dd>
            <dt>Last updated</dt>
            <dd>{fmtDateTime(job.updatedAt)}</dd>
            <dt>Korean text</dt>
            <dd>{Object.keys(job.ko).length ? `${Object.keys(job.ko).length} fields translated` : 'Not translated'}</dd>
          </dl>
          {job.status === 'published' && (
            <p className={small}>
              <a href={jobPath(job)} target="_blank" rel="noopener">
                View job page ↗
              </a>{' '}
              ·{' '}
              <a href={applyHref(job)} target="_blank" rel="noopener">
                Apply link ↗
              </a>
            </p>
          )}
        </section>
      </div>

      <section className={card}>
        <h2 className={cardTitle}>Job details (English)</h2>
        {JOB_FIELD_GROUPS.map((group) => (
          <div key={group.title} className="border-slate-200 not-first:border-t">
            <h3 className={cx(sectionHeading, 'mt-3.5')}>{group.title}</h3>
            <dl className={specs}>
              {group.fields.map((f) => (
                <div key={f.key} className="contents">
                  <dt>{f.label}</dt>
                  <dd>{job.en[f.key] || <span className={muted}>—</span>}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
        {job.en.faq.length > 0 && (
          <div className="border-t border-slate-200">
            <h3 className={cx(sectionHeading, 'mt-3.5')}>Quick answers</h3>
            {job.en.faq.map((item, i) => (
              <details key={i} className="border-t border-slate-200 py-2">
                <summary className="cursor-pointer font-semibold">{item.q}</summary>
                <p className="mt-1.5 text-slate-700">{item.a}</p>
              </details>
            ))}
          </div>
        )}
      </section>

      <section className={dangerCard}>
        <h2 className={cardTitle}>Delete job</h2>
        <p className={cx(muted, small, 'mb-3')}>
          {apps.total > 0
            ? 'This job has applications, so it can’t be deleted. To stop new applications, close the job instead.'
            : 'Only jobs without applications can be deleted. To stop new applications, close the job instead.'}
        </p>
        <DeleteJobButton
          job={{ id: job.id, code: job.code, title: job.en.title, status: job.status }}
          applications={apps.total}
        />
      </section>
    </>
  );
}
