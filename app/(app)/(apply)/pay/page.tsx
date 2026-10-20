import type { Metadata } from 'next';
import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { PayForm } from '@/components/pay/pay-form';
import { db } from '@/lib/db';
import { payments, type Payment } from '@/lib/db/schema';
import { formatMoney } from '@/lib/money';
import { getCheckout, syncCheckoutSession } from '@/lib/stripe';

export const metadata: Metadata = {
  title: 'Make a Payment · ReadyKorea',
  description: 'Pay ReadyKorea securely by card through Stripe.',
  // A test page for the Stripe setup; not for search results.
  robots: { index: false, follow: false },
};

/** The payment Stripe sent the payer back for, updated from Stripe (the webhook may not have arrived yet). */
async function returnedPayment(checkout: NonNullable<Awaited<ReturnType<typeof getCheckout>>>, sessionId: string) {
  try {
    const session = await checkout.stripe.checkout.sessions.retrieve(sessionId);
    const synced = await syncCheckoutSession(session);
    if (synced) return synced;
    const [row] = await db.select().from(payments).where(eq(payments.stripeSessionId, session.id)).limit(1);
    return row ?? null;
  } catch {
    return null;
  }
}

const RESULT: Record<Payment['status'], { title: string; text: string }> = {
  paid: { title: 'Thank you — payment received.', text: 'A receipt is on its way from Stripe to your email.' },
  pending: {
    title: 'Your payment is processing.',
    text: 'Some payment methods take a few days to clear. We will be notified once it does.',
  },
  failed: { title: 'The payment did not go through.', text: 'No money was taken. You can try again below.' },
  expired: { title: 'The payment page expired.', text: 'No money was taken. You can start again below.' },
};

/**
 * Simple payment page: enter an amount, pay on Stripe Checkout, come back to /pay/?session_id=…
 * Payments show on /admin/payments/; Stripe is set up on /admin/payments/settings/.
 */
export default async function PayPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string | string[]; canceled?: string }>;
}) {
  const { session_id, canceled } = await searchParams;
  const checkout = await getCheckout();
  const payment =
    checkout && typeof session_id === 'string' && /^cs_\w+$/.test(session_id)
      ? await returnedPayment(checkout, session_id)
      : null;

  return (
    <main className="wrap">
      <section className="intro">
        <div className="eyebrow">Payments</div>
        <h1>Make a Payment</h1>
        <p className="lead">Enter the amount and you&apos;ll continue to Stripe&apos;s secure page to pay by card.</p>
      </section>

      <section className="panel" aria-label="Payment">
        {payment ? (
          <div className="apply-done" role="status">
            <h2>{RESULT[payment.status].title}</h2>
            <p>
              {formatMoney(payment.amount, payment.currency)} · {RESULT[payment.status].text}
            </p>
            <Link className="apply-done-link" href="/pay/">
              Make another payment
            </Link>
          </div>
        ) : !checkout ? (
          <p className="apply-embed-fallback">Online payments are not available right now.</p>
        ) : (
          <>
            {canceled && (
              <p className="apply-embed-fallback" role="status">
                Payment canceled. No money was taken.
              </p>
            )}
            {checkout.mode === 'test' && (
              <p className="apply-embed-fallback">
                <strong>Test mode:</strong> no real money moves. Pay with card 4242 4242 4242 4242, any future
                date and any CVC.
              </p>
            )}
            <PayForm currency={checkout.config.currency} />
          </>
        )}
      </section>
    </main>
  );
}
