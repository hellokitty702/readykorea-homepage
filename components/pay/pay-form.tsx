'use client';

import { startTransition, useActionState, type FormEvent } from 'react';
import { startPayment, type PayState } from '@/lib/actions/payments';
import { currencyDecimals } from '@/lib/money';

/** Amount, name, email and note; sends the payer on to Stripe Checkout. Styles: apply.css. */
export function PayForm({ currency }: { currency: string }) {
  const [state, action, pending] = useActionState<PayState, FormData>(startPayment, {});
  const v = state.values ?? {};
  const err = (key: string) => state.errors?.[key];
  const decimals = currencyDecimals(currency);

  // Submit without React's automatic form reset, so a validation error keeps what was typed.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  };

  const a11y = (key: string) => ({
    'aria-invalid': err(key) ? true : undefined,
    'aria-describedby': err(key) ? `${key}-error` : undefined,
  });
  const error = (key: string) =>
    err(key) && (
      <span className="field-error" id={`${key}-error`}>
        {err(key)}
      </span>
    );

  return (
    <form className="apply-form" action={action} onSubmit={onSubmit} noValidate>
      {state.message && (
        <p className="form-alert" role="alert">
          {state.message}
        </p>
      )}

      <div className="field">
        <label htmlFor="amount">
          Amount ({currency.toUpperCase()}) <span className="req">*</span>
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          inputMode="decimal"
          min={decimals ? 0.01 : 1}
          step={decimals ? 0.01 : 1}
          placeholder={decimals ? '10.00' : '10000'}
          defaultValue={v.amount}
          required
          {...a11y('amount')}
        />
        {error('amount')}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" maxLength={160} autoComplete="name" defaultValue={v.name} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            maxLength={255}
            autoComplete="email"
            defaultValue={v.email}
            {...a11y('email')}
          />
          {error('email')}
        </div>
      </div>

      <div className="field">
        <label htmlFor="description">
          What is it for? <span className="hint">Shown on the Stripe page</span>
        </label>
        <input id="description" name="description" maxLength={300} defaultValue={v.description} />
      </div>

      <button className="submit" disabled={pending}>
        {pending ? 'Opening Stripe…' : 'Pay with Stripe'}
      </button>
    </form>
  );
}
