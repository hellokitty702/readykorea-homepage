'use client';

import { startTransition, useActionState, useEffect, useRef, type FormEvent } from 'react';
import { updateStripeSettings, type StripeSettingsState } from '@/lib/actions/payments';
import { CURRENCIES } from '@/lib/money';
import { Field } from './field';
import { PasswordInput } from './password-input';
import { alertError, alertOk, button, code, cx, formGrid, input, small } from './styles';

export function StripeSettingsForm({
  enabled,
  currency,
  savedKey,
  savedWebhookSecret,
}: {
  enabled: boolean;
  currency: string;
  /** Masked, e.g. "sk_test_…4xYz"; empty when none is saved. */
  savedKey: string;
  savedWebhookSecret: string;
}) {
  const [state, action, pending] = useActionState<StripeSettingsState, FormData>(updateStripeSettings, {});
  const form = useRef<HTMLFormElement>(null);

  // Once saved, empty the secret fields again (the saved values show masked under them).
  useEffect(() => {
    if (!state.ok || !form.current) return;
    for (const name of ['secretKey', 'webhookSecret']) {
      const el = form.current.elements.namedItem(name);
      if (el instanceof HTMLInputElement) el.value = '';
    }
  }, [state]);

  // Keep what was typed when the server rejects it (React would reset the form otherwise).
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  };

  const saved = (value: string) =>
    value ? (
      <>
        Saved: <code className={code}>{value}</code>. Leave blank to keep it.
      </>
    ) : (
      'Not set.'
    );

  return (
    <form ref={form} action={action} onSubmit={onSubmit} className="grid gap-3.5">
      {state.error && <p className={cx(alertError, small)}>{state.error}</p>}
      {state.ok && <p className={cx(alertOk, small)}>{state.ok}</p>}

      <label className="flex items-center gap-2.5 font-semibold">
        <input type="checkbox" name="enabled" defaultChecked={enabled} className="size-4 accent-blue-700" />
        Take payments on /pay/
      </label>

      <div className={formGrid}>
        <Field label="Secret key" hint={saved(savedKey)}>
          <PasswordInput name="secretKey" placeholder="sk_test_… or sk_live_…" autoComplete="off" />
        </Field>
        <Field label="Currency">
          <select className={input} name="currency" defaultValue={currency}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Webhook signing secret" hint={saved(savedWebhookSecret)}>
          <PasswordInput name="webhookSecret" placeholder="whsec_…" autoComplete="off" />
        </Field>
      </div>
      {savedWebhookSecret && (
        <label className={cx(small, 'flex items-center gap-2')}>
          <input type="checkbox" name="removeWebhookSecret" className="accent-red-700" />
          Remove the saved webhook signing secret
        </label>
      )}

      <div>
        <button className={button('primary')} disabled={pending}>
          {pending ? 'Checking with Stripe…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
