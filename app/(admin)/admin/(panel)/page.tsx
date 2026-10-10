import type { Metadata } from 'next';
import Link from 'next/link';
import {
  STATUS_BAR,
  button,
  card,
  cardHead,
  cardTitle,
  cx,
  muted,
  num,
  small,
  table,
  twoColumns,
} from '@/components/admin/styles';
import { Empty, JobStatusBadge, PageHeader, StatusBadge, fmtDate } from '@/components/admin/ui';
import { EXITS, PIPELINE, STATUS_LABEL } from '@/lib/application-flow';
import { getDashboardStats } from '@/lib/admin/queries';
import { requireAdmin } from '@/lib/auth/dal';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  await requireAdmin();
  const s = await getDashboardStats();
  const open = (['new', 'reviewing', 'interview', 'offered'] as const).reduce(
    (n, st) => n + (s.statusCount[st] ?? 0),
    0,
  );
  const trend = s.last7 - s.prev7;
  const maxDay = Math.max(1, ...s.days.map((d) => d.value));
  const hired = s.statusCount.hired ?? 0;

  return (
    <>
      <PageHeader
        title="Dashboard"
        actions={
          <Link className={button('primary')} href="/admin/jobs/new/">
            Post a job
          </Link>
        }
      />

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <Kpi label="Published jobs" value={s.jobCount.published ?? 0} href="/admin/jobs/?status=published">
          {(s.jobCount.draft ?? 0) > 0 && `${s.jobCount.draft} draft`}
        </Kpi>
        <Kpi label="Applications" value={s.totalApplications} href="/admin/applications/">
          {open} in progress
        </Kpi>
        <Kpi label="Waiting for review" value={s.statusCount.new ?? 0} href="/admin/applications/?status=new" highlight>
          status “New”
        </Kpi>
        <Kpi label="Last 7 days" value={s.last7}>
          {trend === 0 ? 'same as the week before' : `${trend > 0 ? '+' : ''}${trend} vs the week before`}
        </Kpi>
        <Kpi label="Hired" value={hired}>
          {s.totalApplications ? `${Math.round((hired / s.totalApplications) * 100)}% of applications` : '—'}
        </Kpi>
      </section>

      <div className={twoColumns}>
        <section className={card}>
          <h2 className={cardTitle}>Hiring flow</h2>
          <Bars
            rows={[...PIPELINE, ...EXITS].map((st) => ({
              label: STATUS_LABEL[st],
              href: `/admin/applications/?status=${st}`,
              value: s.statusCount[st] ?? 0,
              color: STATUS_BAR[st],
            }))}
          />
        </section>

        <section className={card}>
          <h2 className={cardTitle}>Applications per day</h2>
          <p className={cx(muted, small)}>Last 30 days (Korea time)</p>
          <div
            className="mt-3 flex h-35 items-end gap-0.75 border-b border-slate-200"
            role="img"
            aria-label={`Applications per day for the last 30 days, ${s.days.reduce((n, d) => n + d.value, 0)} in total`}
          >
            {s.days.map((d) => (
              <span key={d.day} className="group flex h-full flex-1 items-end" title={`${d.day}: ${d.value}`}>
                <span
                  className="block min-h-px w-full rounded-t-[3px] bg-blue-700 opacity-85 group-hover:opacity-100"
                  style={{ height: `${(d.value / maxDay) * 100}%` }}
                />
              </span>
            ))}
          </div>
          <div className="mt-1.5 flex justify-between text-xs text-slate-500">
            <span>{fmtDate(s.days[0].day)}</span>
            <span>Today</span>
          </div>
        </section>
      </div>

      <section className={card}>
        <h2 className={cardTitle}>Jobs by applications</h2>
        {s.topJobs.length ? (
          <div className="overflow-x-auto">
            <table className={table(true)}>
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Status</th>
                  <th className={num}>Applications</th>
                  <th className={num}>In progress</th>
                  <th className={num}>Hired</th>
                </tr>
              </thead>
              <tbody>
                {s.topJobs.map((j) => (
                  <tr key={j.id}>
                    <td>
                      <Link href={`/admin/jobs/${j.id}/`}>{j.title}</Link>
                      <div className={cx(muted, small)}>
                        {j.school} · {j.code}
                      </div>
                    </td>
                    <td>
                      <JobStatusBadge status={j.status} />
                    </td>
                    <td className={num}>
                      <Link href={`/admin/applications/?job=${j.id}`}>{j.total}</Link>
                    </td>
                    <td className={num}>{j.open}</td>
                    <td className={num}>{j.hired}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty>No jobs yet.</Empty>
        )}
      </section>

      <div className={twoColumns}>
        <Breakdown title="By passport country" rows={s.byCountry} />
        <Breakdown title="By preferred position" rows={s.byPosition} />
      </div>

      <section className={card}>
        <div className={cardHead}>
          <h2 className="text-md font-bold">Latest applications</h2>
          <Link href="/admin/applications/">All applications →</Link>
        </div>
        {s.latest.length ? (
          <table className={table(true)}>
            <tbody>
              {s.latest.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Link href={`/admin/applications/${a.id}/`}>{a.fullName}</Link>
                    <div className={cx(muted, small)}>{a.jobTitle ?? 'General application'}</div>
                  </td>
                  <td>
                    <StatusBadge status={a.status} />
                  </td>
                  <td className={cx(num, muted)}>{fmtDate(a.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty>No applications yet. They appear here when teachers apply on the site.</Empty>
        )}
      </section>
    </>
  );
}

function Kpi({
  label,
  value,
  href,
  highlight,
  children,
}: {
  label: string;
  value: number;
  href?: string;
  highlight?: boolean;
  children?: React.ReactNode;
}) {
  const body = (
    <>
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className="text-[28px] font-bold tracking-tight">{value}</span>
      <span className="min-h-4.5 text-xs text-slate-500">{children}</span>
    </>
  );
  const className = cx(
    'grid gap-0.5 rounded-xl border p-4 text-slate-900',
    highlight && value > 0 ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-white',
    href && 'hover:border-slate-300 hover:no-underline hover:shadow-[0_2px_8px_rgba(15,23,42,0.05)]',
  );
  return href ? (
    <Link className={className} href={href}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

type Bar = { label: string; value: number; href?: string; color?: string };

function Bars({ rows }: { rows: Bar[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  const labelClass = 'truncate text-label text-slate-700';
  return (
    <ul className="grid gap-2">
      {rows.map((r) => (
        <li key={r.label} className="grid grid-cols-[90px_1fr_32px] items-center gap-2.5 sm:grid-cols-[120px_1fr_40px]">
          {r.href ? (
            <Link href={r.href} className={labelClass}>
              {r.label}
            </Link>
          ) : (
            <span className={labelClass}>{r.label}</span>
          )}
          <span className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <span
              className={cx('block h-full min-w-0.5 rounded-full', r.color ?? 'bg-blue-700')}
              style={{ width: `${(r.value / max) * 100}%` }}
            />
          </span>
          <span className="text-right font-semibold tabular-nums">{r.value}</span>
        </li>
      ))}
    </ul>
  );
}

function Breakdown({ title, rows }: { title: string; rows: { label: string; value: number }[] }) {
  return (
    <section className={card}>
      <h2 className={cardTitle}>{title}</h2>
      {rows.length ? <Bars rows={rows} /> : <Empty>No data yet.</Empty>}
    </section>
  );
}
