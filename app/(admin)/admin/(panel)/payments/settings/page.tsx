import type { Metadata } from 'next';
import { StripeSettingsForm } from '@/components/admin/stripe-settings-form';
import { badge, card, cardTitle, code, cx, muted, small } from '@/components/admin/styles';
import { PageHeader, PageSub } from '@/components/admin/ui';
import { requireAdmin } from '@/lib/auth/dal';
import { absoluteUrl } from '@/lib/site';
import { getStripeSettings, keyMode, maskKey } from '@/lib/stripe';

export const metadata: Metadata = { title: 'Stripe settings' };

const WEBHOOK_EVENTS = [
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.async_payment_failed',
  'checkout.session.expired',
];

export default async function StripeSettingsPage() {
  await requireAdmin();
  const stripe = await getStripeSettings();
  const on = stripe.enabled && Boolean(stripe.secretKey);
  const mode = keyMode(stripe.secretKey);

  return (
    <>
      <PageHeader title="Stripe settings" crumbs={[{ href: '/admin/payments/', label: 'Payments' }]}>
        <PageSub>
          <span className={cx(badge, on ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600')}>
            {on ? 'On' : 'Off'}
          </span>
          {stripe.secretKey && (
            <span className={cx(badge, mode === 'live' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800')}>
              {mode === 'live' ? 'Live mode' : 'Test mode'}
            </span>
          )}
          Payments on /pay/ go through Stripe Checkout.
        </PageSub>
      </PageHeader>

      <section className={cx(card, 'max-w-190')}>
        <h2 className={cardTitle}>Keys</h2>
        <StripeSettingsForm
          enabled={stripe.enabled}
          currency={stripe.currency}
          savedKey={maskKey(stripe.secretKey)}
          savedWebhookSecret={maskKey(stripe.webhookSecret)}
        />
      </section>

      <section className={cx(card, 'max-w-190')}>
        <h2 className={cardTitle}>Setup</h2>
        <ol className="grid list-decimal gap-2.5 pl-5">
          <li>
            In the Stripe Dashboard, open <strong>Developers → API keys</strong> and copy the secret key. Use a{' '}
            <code className={code}>sk_test_</code> key to try payments without real money, then switch to the{' '}
            <code className={code}>sk_live_</code> key.
          </li>
          <li>
            Under <strong>Developers → Webhooks</strong>, add an endpoint with this URL (keep the trailing slash):
            <div className="mt-1.5">
              <code className={cx(code, 'wrap-anywhere')}>{absoluteUrl('/api/stripe/webhook/')}</code>
            </div>
            <div className="mt-1.5">and these events:</div>
            <ul className={cx(small, 'mt-1 grid gap-0.5')}>
              {WEBHOOK_EVENTS.map((e) => (
                <li key={e}>
                  <code className={code}>{e}</code>
                </li>
              ))}
            </ul>
          </li>
          <li>Copy the endpoint&apos;s signing secret into the form above. Test and live endpoints have different secrets.</li>
        </ol>
        <p className={cx(muted, small, 'mt-3.5')}>
          Without the webhook, a payment is still recorded when the payer returns to the site after paying. The webhook
          also catches payers who close the tab, and bank payments that clear later.
        </p>
      </section>
    </>
  );
}
