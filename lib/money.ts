// Amounts and currencies for payments. No imports, so client components can use these too.

/** Currencies offered in the Stripe settings; any of them works with Checkout. */
export const CURRENCIES = ['usd', 'krw', 'eur', 'gbp', 'cad', 'aud', 'jpy'] as const;
export type Currency = (typeof CURRENCIES)[number];

/** Stripe counts these in whole units (₩1000 is 1000), the rest in hundredths ($10.00 is 1000). */
const ZERO_DECIMAL = new Set(['krw', 'jpy']);

export const currencyDecimals = (currency: string) => (ZERO_DECIMAL.has(currency.toLowerCase()) ? 0 : 2);

/** Typed amount (10.5) → Stripe's integer amount (1050); null if it isn't a usable number. */
export function toMinorUnits(amount: number, currency: string): number | null {
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const minor = Math.round(amount * 10 ** currencyDecimals(currency));
  return Number.isSafeInteger(minor) ? minor : null;
}

/** Stripe's integer amount → "$10.50", "₩10,000". */
export function formatMoney(minor: number, currency: string) {
  const decimals = currencyDecimals(currency);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(minor / 10 ** decimals);
}
