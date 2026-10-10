import type { Metadata } from 'next';
import Link from 'next/link';
import {
  button,
  cardFlush,
  cx,
  input,
  muted,
  small,
  strong,
  table,
  tabCount,
  tabLink,
  tabs,
} from '@/components/admin/styles';
import { Empty, PageHeader, StatusBadge, fmtDate } from '@/components/admin/ui';
import {
  applicationStatusCounts,
  listApplications,
  openJobOptions,
  type ApplicationFilters,
} from '@/lib/admin/queries';
import { ALL_STATUSES, STATUS_LABEL } from '@/lib/application-flow';
import { requireAdmin } from '@/lib/auth/dal';

export const metadata: Metadata = { title: 'Applications' };

type Search = { status?: string; job?: string; q?: string; page?: string };

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<Search> }) {
  await requireAdmin();
  const params = await searchParams;
  const filters: ApplicationFilters = {
    status: ALL_STATUSES.find((s) => s === params.status),
    job: params.job === 'general' ? 'general' : Number(params.job) > 0 ? Number(params.job) : undefined,
    q: params.q?.trim().slice(0, 100) || undefined,
    page: Number(params.page) > 0 ? Number(params.page) : 1,
  };
  const [{ rows, total, page, pages }, counts, jobOptions] = await Promise.all([
    listApplications(filters),
    applicationStatusCounts(filters),
    openJobOptions(),
  ]);
  const all = ALL_STATUSES.reduce((n, s) => n + (counts[s] ?? 0), 0);

  const href = (change: Partial<Search>) => {
    const next = new URLSearchParams();
    const merged: Search = {
      status: filters.status,
      job: filters.job ? String(filters.job) : undefined,
      q: filters.q,
      ...change,
    };
    for (const [k, v] of Object.entries(merged)) if (v) next.set(k, v);
    const qs = next.toString();
    return `/admin/applications/${qs ? `?${qs}` : ''}`;
  };

  return (
    <>
      <PageHeader title="Applications" />

      <form className="flex flex-wrap gap-2" action="/admin/applications/">
        {filters.status && <input type="hidden" name="status" value={filters.status} />}
        <input
          className={cx(input, 'flex-[1_1_220px]')}
          type="search"
          name="q"
          placeholder="Search name or email"
          defaultValue={filters.q}
          aria-label="Search"
        />
        <select
          className={cx(input, 'flex-[0_1_320px]')}
          name="job"
          defaultValue={filters.job ? String(filters.job) : ''}
          aria-label="Job"
        >
          <option value="">All jobs</option>
          <option value="general">General applications</option>
          {jobOptions.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title} ({j.code}){j.status !== 'published' ? ` · ${j.status}` : ''}
            </option>
          ))}
        </select>
        <button className={button()}>Filter</button>
        {(filters.q || filters.job) && (
          <Link
            className={button('ghost')}
            href={filters.status ? `/admin/applications/?status=${filters.status}` : '/admin/applications/'}
          >
            Clear
          </Link>
        )}
      </form>

      <nav className={tabs} aria-label="Filter by status">
        <Link
          className={tabLink}
          href={href({ status: undefined, page: undefined })}
          aria-current={!filters.status ? 'page' : undefined}
        >
          All <span className={tabCount}>{all}</span>
        </Link>
        {ALL_STATUSES.map((s) => (
          <Link
            key={s}
            className={tabLink}
            href={href({ status: s, page: undefined })}
            aria-current={filters.status === s ? 'page' : undefined}
          >
            {STATUS_LABEL[s]} <span className={tabCount}>{counts[s] ?? 0}</span>
          </Link>
        ))}
      </nav>

      <section className={cardFlush}>
        {rows.length ? (
          <table className={table()}>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Job</th>
                <th>Details</th>
                <th>Status</th>
                <th>Applied</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Link className={strong} href={`/admin/applications/${a.id}/`}>
                      {a.fullName}
                    </Link>
                    <div className={cx(muted, small)}>{a.email}</div>
                  </td>
                  <td>
                    {a.jobId ? (
                      <Link href={`/admin/jobs/${a.jobId}/`}>{a.jobTitle}</Link>
                    ) : (
                      <span className={muted}>General</span>
                    )}
                  </td>
                  <td className={small}>
                    {a.position}
                    <div className={muted}>
                      {a.passportCountry} · {a.experience}
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={a.status} />
                  </td>
                  <td className={muted}>{fmtDate(a.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty>No applications match these filters.</Empty>
        )}
      </section>

      {pages > 1 && (
        <nav className="flex items-center justify-center gap-4.5" aria-label="Pages">
          {page > 1 && <Link href={href({ page: String(page - 1) })}>← Newer</Link>}
          <span className={muted}>
            Page {page} of {pages} · {total} applications
          </span>
          {page < pages && <Link href={href({ page: String(page + 1) })}>Older →</Link>}
        </nav>
      )}
    </>
  );
}
