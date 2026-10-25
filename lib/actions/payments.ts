'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import { requireAdmin } from '@/lib/auth/dal';
import { db } from '@/lib/db';
import { payments } from '@/lib/db/schema';
import { CURRENCIES, formatMoney, toMinorUnits } from '@/lib/money';
import { SITE_ORIGIN } from '@/lib/site';
import { getCheckout, getStripeSettings, keyMode, saveStripeSettings, stripeClient } from '@/lib/stripe';

// ---------------------------------------------------------------------------
// Admin: Stripe settings
// ---------------------------------------------------------------------------

export type StripeSettingsState = { ok?: string; error?: string };

const SettingsSchema = z.object({
  enabled: z.boolean(),
  currency: z.enum(CURRENCIES, { error: 'Choose a currency.' }),
  // Blank keeps the saved value (the form never shows the saved secrets).
  secretKey: z
    .string()
    .trim()
    .regex(/^((sk|rk)_(test|live)_\S+)?$/, { error: 'The secret key starts with sk_test_ or sk_live_.' }),
  webhookSecret: z
    .string()
    .trim()
    .regex(/^(whsec_\S+)?$/, { error: 'The webhook signing secret starts with whsec_.' }),
});

export async function updateStripeSettings(
  _prev: StripeSettingsState,
  formData: FormData,
): Promise<StripeSettingsState> {
  await requireAdmin();
  const parsed = SettingsSchema.safeParse({
    enabled: formData.get('enabled') === 'on',
    currency: formData.get('currency'),
    secretKey: String(formData.get('secretKey') ?? ''),
    webhookSecret: String(formData.get('webhookSecret') ?? ''),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const current = await getStripeSettings();
  const next = {
    enabled: parsed.data.enabled,
    currency: parsed.data.currency,
    secretKey: parsed.data.secretKey || current.secretKey,
    webhookSecret:
      formData.get('removeWebhookSecret') === 'on' ? '' : parsed.data.webhookSecret || current.webhookSecret,
  };
  if (next.enabled && !next.secretKey) return { error: 'Add the secret key before turning payments on.' };

  // Check a new key with Stripe before saving it.
  if (parsed.data.secretKey) {
    try {
      await stripeClient(parsed.data.secretKey).balance.retrieve();
    } catch (error) {
      return { error: `Stripe rejected the secret key: ${error instanceof Error ? error.message : 'unknown error'}` };
    }
  }

  await saveStripeSettings(next);
  revalidatePath('/admin/payments/', 'layout');
  return {
    ok: next.enabled
      ? `Saved. Payments are on, in ${keyMode(next.secretKey) === 'live' ? 'live' : 'test'} mode.`
      : 'Saved. Payments are off.',
  };
}

// ---------------------------------------------------------------------------
// Public: /pay/
// ---------------------------------------------------------------------------

export type PayState = {
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

const PaySchema = z.object({
  amount: z.coerce.number({ error: 'Enter an amount.' }).positive({ error: 'Enter an amount above zero.' }),
  name: z.string().trim().max(160),
  email: z.union([z.literal(''), z.email({ error: 'Enter a valid email address.' }).trim().toLowerCase().max(255)]),
  description: z.string().trim().max(300),
});

/** Records a pending payment and sends the payer to Stripe Checkout; Stripe brings them back to /pay/. */
export async function startPayment(_prev: PayState, formData: FormData): Promise<PayState> {
  const values = {
    amount: String(formData.get('amount') ?? '').trim(),
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? '').trim(),
    description: String(formData.get('description') ?? ''),
  };
  const checkout = await getCheckout();
  if (!checkout) return { values, message: 'Online payments are not available right now.' };
  const { stripe, config, mode } = checkout;

  const parsed = PaySchema.safeParse(values);
  const errors: Record<string, string> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
  }
  const amount = parsed.success ? toMinorUnits(parsed.data.amount, config.currency) : null;
  if (parsed.success && !amount) errors.amount = 'Enter a valid amount.';
  if (!parsed.success || !amount) return { values, errors, message: 'Please check the highlighted fields.' };
  const { name, email, description } = parsed.data;

  // Back to the address the form was sent from (localhost, a preview deployment or the live site).
  const origin = (await headers()).get('origin') ?? SITE_ORIGIN;
  let url: string | null;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: config.currency,
            unit_amount: amount,
            product_data: { name: description || 'Payment to ReadyKorea' },
          },
        },
      ],
      ...(email && { customer_email: email }),
      success_url: `${origin}/pay/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pay/?canceled=1`,
      // Abandoned pages expire after 30 minutes (Stripe's minimum), so they stop showing as pending.
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });
    await db.insert(payments).values({
      mode,
      amount,
      currency: config.currency,
      name,
      email,
      description,
      stripeSessionId: session.id,
    });
    url = session.url;
  } catch (error) {
    console.error('startPayment failed', error);
    const detail = error instanceof Error && 'type' in error ? ` (${error.message})` : '';
    return { values, message: `Could not start the payment of ${formatMoney(amount, config.currency)}${detail}.` };
  }
  if (!url) return { values, message: 'Could not start the payment. Please try again.' };
  redirect(url);
}
