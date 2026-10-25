import type { Metadata } from 'next';
import Link from 'next/link';
import {
  alertError,
  button,
  card,
  cardFlush,
  cx,
  input,
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
import { Empty, PAYMENT_STATUS_LABEL, PageHeader, PaymentStatusBadge, fmtDateTime } from '@/components/admin/ui';
import { listPayments, paidTotals, paymentStatusCounts, type PaymentFilters } from '@/lib/admin/queries';
import { requireAdmin } from '@/lib/auth/dal';
import { PAYMENT_STATUSES } from '@/lib/db/schema';
import { formatMoney } from '@/lib/money';
import { getStripeSettings, stripeDashboardUrl } from '@/lib/stripe';

export const metadata: Metadata = { title: 'Payments' };

type Search = { status?: string; q?: string; page?: string };

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<Search> }) {
  await requireAdmin();
  const params = await searchParams;
  const filters: PaymentFilters = {
    status: PAYMENT_STATUSES.find((s) => s === params.status),
    q: params.q?.trim().slice(0, 100) || undefined,
    page: Number(params.page) > 0 ? Number(params.page) : 1,
  };
  const [{ rows, total, page, pages }, counts, totals, stripe] = await Promise.all([
    listPayments(filters),
    paymentStatusCounts(filters),
    paidTotals(),
    getStripeSettings(),
  ]);
  const all = PAYMENT_STATUSES.reduce((n, s) => n + (counts[s] ?? 0), 0);

  const href = (change: Partial<Search>) => {
    const next = new URLSearchParams();
    const merged: Search = { status: filters.status, q: filters.q, ...change };
    for (const [k, v] of Object.entries(merged)) if (v) next.set(k, v);
    const qs = next.toString();
    return `/admin/payments/${qs ? `?${qs}` : ''}`;
  };

  return (
    <>
      <PageHeader
        title="Payments"
        actions={
          <>
            <a className={button('ghost')} href="/pay/" target="_blank" rel="noopener">
              Open payment page
            </a>
            <Link className={button()} href="/admin/payments/settings/">
              Stripe settings
            </Link>
          </>
        }
      />

      {(!stripe.enabled || !stripe.secretKey) && (
        <p className={alertError}>
          Payments are off, so /pay/ doesn&apos;t take payments.{' '}
          <Link href="/admin/payments/settings/">Set up Stripe</Link>.
        </p>
      )}

      {totals.length > 0 && (
        <section className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
          {totals.map((t) => (
            <div key={`${t.mode}-${t.currency}`} className={card}>
              <div className={cx(muted, small)}>
                Received{t.mode === 'test' && <span className={tag}>Test</span>}
              </div>
              <div className="mt-1 text-xl font-bold tabular-nums">{formatMoney(t.amount, t.currency)}</div>
              <div className={cx(muted, small)}>
                {t.count} payment{t.count === 1 ? '' : 's'}
              </div>
            </div>
          ))}
        </section>
      )}

      <form className="flex flex-wrap gap-2" action="/admin/payments/">
        {filters.status && <input type="hidden" name="status" value={filters.status} />}
        <input
          className={cx(input, 'flex-[1_1_220px]')}
          type="search"
          name="q"
          placeholder="Search name, email or note"
          defaultValue={filters.q}
          aria-label="Search"
        />
        <button className={button()}>Search</button>
        {filters.q && (
          <Link className={button('ghost')} href={href({ q: undefined, page: undefined })}>
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
        {PAYMENT_STATUSES.map((s) => (
          <Link
            key={s}
            className={tabLink}
            href={href({ status: s, page: undefined })}
            aria-current={filters.status === s ? 'page' : undefined}
          >
            {PAYMENT_STATUS_LABEL[s]} <span className={tabCount}>{counts[s] ?? 0}</span>
          </Link>
        ))}
      </nav>

      <section className={cardFlush}>
        {rows.length ? (
          <table className={table()}>
            <thead>
              <tr>
                <th>Payer</th>
                <th className={num}>Amount</th>
                <th>Status</th>
                <th className="max-sm:hidden">Date</th>
                <th className="max-md:hidden">Stripe</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const stripeUrl = stripeDashboardUrl(p);
                return (
                  <tr key={p.id}>
                    <td>
                      <span className={strong}>{p.name || p.email || 'Anonymous'}</span>
                      {p.name && p.email && <div className={cx(muted, small, 'wrap-anywhere')}>{p.email}</div>}
                      {p.description && <div className={cx(small, 'wrap-anywhere')}>{p.description}</div>}
                      {/* The Date column is hidden on narrow screens. */}
                      <div className={cx(muted, small, 'sm:hidden')}>{fmtDateTime(p.createdAt)}</div>
                    </td>
                    <td className={cx(num, 'font-semibold whitespace-nowrap')}>
                      {formatMoney(p.amount, p.currency)}
                      {p.mode === 'test' && <span className={tag}>Test</span>}
                    </td>
                    <td>
                      <PaymentStatusBadge status={p.status} />
                    </td>
                    <td className={cx(muted, 'whitespace-nowrap max-sm:hidden')}>
                      {fmtDateTime(p.paidAt ?? p.createdAt)}
                    </td>
                    <td className={cx(small, 'max-md:hidden')}>
                      {stripeUrl ? (
                        <a href={stripeUrl} target="_blank" rel="noopener noreferrer">
                          View ↗
                        </a>
                      ) : (
                        <span className={muted}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <Empty>{filters.status || filters.q ? 'No payments match these filters.' : 'No payments yet.'}</Empty>
        )}
      </section>

      {pages > 1 && (
        <nav className="flex flex-wrap items-center justify-center gap-x-4.5 gap-y-2" aria-label="Pages">
          {page > 1 && <Link href={href({ page: String(page - 1) })}>← Newer</Link>}
          <span className={muted}>
            Page {page} of {pages} · {total} payments
          </span>
          {page < pages && <Link href={href({ page: String(page + 1) })}>Older →</Link>}
        </nav>
      )}
    </>
  );
}
