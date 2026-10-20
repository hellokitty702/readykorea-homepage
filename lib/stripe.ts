import 'server-only';
import { and, eq, ne } from 'drizzle-orm';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { payments, settings, type Payment, type PaymentMode, type PaymentStatus } from '@/lib/db/schema';
import { CURRENCIES, type Currency } from '@/lib/money';

/**
 * Stripe settings, kept in the `settings` table (row `stripe`) and edited on /admin/payments/settings/.
 * Payments go through Stripe Checkout (Stripe's hosted page), so only the secret key is needed, plus
 * the webhook signing secret so /api/stripe/webhook can trust what Stripe sends.
 */
export type StripeSettings = {
  enabled: boolean;
  currency: Currency;
  /** sk_test_… or sk_live_… (a restricted rk_… key works too). */
  secretKey: string;
  /** whsec_… of the webhook endpoint pointing at /api/stripe/webhook/. */
  webhookSecret: string;
};

const DEFAULTS: StripeSettings = { enabled: false, currency: 'usd', secretKey: '', webhookSecret: '' };

export async function getStripeSettings(): Promise<StripeSettings> {
  const [row] = await db.select({ value: settings.value }).from(settings).where(eq(settings.key, 'stripe')).limit(1);
  const saved = (row?.value ?? {}) as Partial<StripeSettings>;
  return {
    enabled: saved.enabled === true,
    currency: CURRENCIES.find((c) => c === saved.currency) ?? DEFAULTS.currency,
    secretKey: typeof saved.secretKey === 'string' ? saved.secretKey : '',
    webhookSecret: typeof saved.webhookSecret === 'string' ? saved.webhookSecret : '',
  };
}

export async function saveStripeSettings(value: StripeSettings) {
  await db
    .insert(settings)
    .values({ key: 'stripe', value })
    .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } });
}

export const keyMode = (secretKey: string): PaymentMode => (/^(sk|rk)_live_/.test(secretKey) ? 'live' : 'test');

/** "sk_test_…4xYz", to show which key is saved without showing the key. */
export const maskKey = (key: string) => (key ? `${key.slice(0, key.indexOf('_', 3) + 1)}…${key.slice(-4)}` : '');

export const stripeClient = (secretKey: string) => new Stripe(secretKey, { maxNetworkRetries: 2 });

/** Stripe client and settings when payments are switched on and a key is saved, else null. */
export async function getCheckout() {
  const config = await getStripeSettings();
  if (!config.enabled || !config.secretKey) return null;
  return { stripe: stripeClient(config.secretKey), config, mode: keyMode(config.secretKey) };
}

/**
 * Copies the state of a Checkout Session onto its payment. Called when the payer returns to /pay/
 * and from the webhook, so payments are recorded even when the webhook isn't set up (or the payer
 * closes the tab before returning). A paid payment never goes back to another status.
 */
export async function syncCheckoutSession(session: Stripe.Checkout.Session, failed = false) {
  const status: PaymentStatus = failed
    ? 'failed'
    : session.status === 'expired'
      ? 'expired'
      : session.payment_status === 'paid' || session.payment_status === 'no_payment_required'
        ? 'paid'
        : 'pending';
  const paymentIntent = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
  const email = session.customer_details?.email;

  const [row] = await db
    .update(payments)
    .set({
      status,
      ...(paymentIntent && { stripePaymentIntentId: paymentIntent }),
      ...(email && { email: email.toLowerCase() }),
      ...(status === 'paid' && { paidAt: new Date() }),
    })
    .where(and(eq(payments.stripeSessionId, session.id), ne(payments.status, 'paid')))
    .returning();
  return row ?? null;
}

/** The payment in the Stripe Dashboard (the Checkout Session until a payment exists). */
export function stripeDashboardUrl(p: Pick<Payment, 'mode' | 'stripePaymentIntentId' | 'stripeSessionId'>) {
  const base = `https://dashboard.stripe.com/${p.mode === 'test' ? 'test/' : ''}`;
  if (p.stripePaymentIntentId) return `${base}payments/${p.stripePaymentIntentId}`;
  if (p.stripeSessionId) return `${base}checkout/sessions/${p.stripeSessionId}`;
  return null;
}
