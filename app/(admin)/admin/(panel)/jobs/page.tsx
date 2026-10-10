import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TAG_COLORS,
  alertOk,
  button,
  cardFlush,
  cx,
  muted,
  num,
  small,
  strong,
  table,
  tabCount,
  tabLink,
  tabs,
  tag,
} from '@/components/admin/styles';
import { Empty, JobStatusBadge, PageHeader, fmtDate } from '@/components/admin/ui';
import { jobStatusCounts, listJobs } from '@/lib/admin/queries';
import { requireAdmin } from '@/lib/auth/dal';
import { JOB_STATUS_LABEL } from '@/lib/job-fields';

export const metadata: Metadata = { title: 'Jobs' };

const STATUSES = ['published', 'draft', 'closed'] as const;

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; deleted?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const status = STATUSES.find((s) => s === params.status);
  const [list, counts] = await Promise.all([listJobs(status), jobStatusCounts()]);
  const total = STATUSES.reduce((n, s) => n + (counts[s] ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Jobs"
        actions={
          <Link className={button('primary')} href="/admin/jobs/new/">
            Post a job
          </Link>
        }
      />
      {params.deleted && <p className={alertOk}>Job deleted.</p>}

      <nav className={tabs} aria-label="Filter by status">
        <Link className={tabLink} href="/admin/jobs/" aria-current={!status ? 'page' : undefined}>
          All <span className={tabCount}>{total}</span>
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            className={tabLink}
            href={`/admin/jobs/?status=${s}`}
            aria-current={status === s ? 'page' : undefined}
          >
            {JOB_STATUS_LABEL[s]} <span className={tabCount}>{counts[s] ?? 0}</span>
          </Link>
        ))}
      </nav>

      <section className={cardFlush}>
        {list.length ? (
          <table className={table()}>
            <thead>
              <tr>
                <th>Job</th>
                <th>Status</th>
                <th className="max-md:hidden">Start</th>
                <th className={num}>Applications</th>
                <th className="max-sm:hidden">Updated</th>
              </tr>
            </thead>
            <tbody>
              {list.map((job) => (
                <tr key={job.id}>
                  <td>
                    <Link className={strong} href={`/admin/jobs/${job.id}/`}>
                      {job.title}
                    </Link>
                    {job.badge && (
                      <span className={cx(tag, TAG_COLORS[job.badge])}>
                        {job.badge === 'urgent' ? 'Urgent' : 'New'}
                      </span>
                    )}
                    <div className={cx(muted, small)}>
                      {job.school} · {job.location} · {job.code}
                    </div>
                  </td>
                  <td>
                    <JobStatusBadge status={job.status} />
                  </td>
                  <td className="max-md:hidden">{fmtDate(job.startDate)}</td>
                  <td className={num}>
                    <Link href={`/admin/applications/?job=${job.id}`}>{job.applications}</Link>
                    {job.newApplications > 0 && (
                      <span className="block text-2xs font-semibold text-amber-700">{job.newApplications} new</span>
                    )}
                  </td>
                  <td className={cx(muted, 'max-sm:hidden')}>{fmtDate(job.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty>No jobs here yet.</Empty>
        )}
      </section>
    </>
  );
}
