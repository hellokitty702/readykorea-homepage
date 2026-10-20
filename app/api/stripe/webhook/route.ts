import type Stripe from 'stripe';
import { getStripeSettings, stripeClient, syncCheckoutSession } from '@/lib/stripe';

/**
 * Stripe's webhook (set it up in the Stripe Dashboard with the URL and events shown on
 * /admin/payments/settings/). Keep the trailing slash in the URL: Stripe doesn't follow the redirect
 * that `trailingSlash` would send.
 */
export async function POST(request: Request) {
  const config = await getStripeSettings();
  const signature = request.headers.get('stripe-signature');
  if (!config.secretKey || !config.webhookSecret || !signature) {
    return new Response('Webhook not configured', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await stripeClient(config.secretKey).webhooks.constructEventAsync(
      await request.text(),
      signature,
      config.webhookSecret,
    );
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
    case 'checkout.session.expired':
      await syncCheckoutSession(event.data.object);
      break;
    case 'checkout.session.async_payment_failed':
      await syncCheckoutSession(event.data.object, true);
      break;
  }
  return Response.json({ received: true });
}
