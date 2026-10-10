'use client';

import { startTransition, useActionState, useEffect, useRef, type FormEvent } from 'react';
import { changePassword, updateProfile, type AccountFormState } from '@/lib/actions/account';
import { Field } from './field';
import { PasswordInput } from './password-input';
import { alertError, alertOk, button, cx, formGrid, input, small } from './styles';

function Message({ state }: { state: AccountFormState }) {
  if (state.error) return <p className={cx(alertError, small)}>{state.error}</p>;
  if (state.ok) return <p className={cx(alertOk, small)}>{state.ok}</p>;
  return null;
}

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, action, pending] = useActionState<AccountFormState, FormData>(updateProfile, {});

  // Keep what was typed when the server rejects it (React would reset the form otherwise).
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  };

  return (
    <form action={action} onSubmit={onSubmit} className="grid gap-3.5">
      <Message state={state} />
      <div className={formGrid}>
        <Field label="Name">
          <input className={input} name="name" defaultValue={name} required maxLength={120} autoComplete="name" />
        </Field>
        <Field label="Email" hint="Used to sign in.">
          <input className={input} name="email" type="email" defaultValue={email} required autoComplete="username" />
        </Field>
      </div>
      <div>
        <button className={button('primary')} disabled={pending}>
          {pending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState<AccountFormState, FormData>(changePassword, {});
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={action} className="grid gap-3.5">
      <Message state={state} />
      <div className={formGrid}>
        <Field label="Current password">
          <PasswordInput name="current" required autoComplete="current-password" />
        </Field>
        <Field label="New password" hint="At least 10 characters.">
          <PasswordInput name="password" required minLength={10} autoComplete="new-password" />
        </Field>
      </div>
      <div>
        <button className={button('primary')} disabled={pending}>
          {pending ? 'Saving…' : 'Change password'}
        </button>
      </div>
    </form>
  );
}
