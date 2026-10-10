import Link from 'next/link';
import type { ReactNode } from 'react';
import { STATUS_LABEL } from '@/lib/application-flow';
import type { ApplicationStatus } from '@/lib/db/schema';
import { JOB_STATUS_LABEL } from '@/lib/job-fields';
import { JOB_STATUS_COLORS, STATUS_COLORS, badge, cx } from './styles';

const KST: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Seoul' };

/** Dates are shown in Korea time. */
export const fmtDate = (d: Date | string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { ...KST, day: 'numeric', month: 'short', year: 'numeric' }) : '—';
export const fmtDateTime = (d: Date | string | null) =>
  d
    ? new Date(d).toLocaleString('en-GB', {
        ...KST,
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={cx(badge, STATUS_COLORS[status])}>{STATUS_LABEL[status]}</span>;
}

export function JobStatusBadge({ status }: { status: keyof typeof JOB_STATUS_LABEL }) {
  return <span className={cx(badge, JOB_STATUS_COLORS[status])}>{JOB_STATUS_LABEL[status]}</span>;
}

const POST_STATUS_LABEL = { draft: 'Draft', published: 'Published' } as const;

export function PostStatusBadge({ status }: { status: keyof typeof POST_STATUS_LABEL }) {
  return <span className={cx(badge, JOB_STATUS_COLORS[status])}>{POST_STATUS_LABEL[status]}</span>;
}

export function PageHeader({
  title,
  crumbs,
  actions,
  children,
}: {
  title: ReactNode;
  crumbs?: { href: string; label: string }[];
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
      <div className="min-w-0">
        {crumbs && (
          <nav className="mb-1 text-label text-slate-500" aria-label="Breadcrumb">
            {crumbs.map((c) => (
              <span key={c.href}>
                <Link href={c.href}>{c.label}</Link> /{' '}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl leading-tight font-bold tracking-tight wrap-break-word">{title}</h1>
        {children}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="p-5 text-center text-slate-500">{children}</p>;
}

/** Subtitle line under a page title. */
export function PageSub({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-slate-500">{children}</p>;
}
