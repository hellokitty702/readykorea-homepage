'use client';

import { ArrowRight, LoaderCircle } from 'lucide-react';
import { useActionState } from 'react';
import { signupFirstAdmin, type SignupState } from '@/lib/actions/auth';
import { PasswordInput } from './password-input';
import { alertError, cx, field, fieldLabel, input } from './styles';

/** Same sizes as the sign-in form it replaces until the first admin exists. */
const control = 'h-11 px-3 text-[15px] focus-visible:border-slate-900! focus-visible:outline-amber-300!';

export function SignupForm() {
  const [state, action, pending] = useActionState<SignupState, FormData>(signupFirstAdmin, {});

  return (
    <form action={action} className="grid gap-4">
      {state.error && (
        <p className={alertError} role="alert">
          {state.error}
        </p>
      )}
      <label className={field}>
        <span className={fieldLabel}>Name</span>
        <input
          className={cx(input, control)}
          name="name"
          autoComplete="name"
          required
          maxLength={120}
          defaultValue={state.name}
          autoFocus
        />
      </label>
      <label className={field}>
        <span className={fieldLabel}>Email</span>
        <input
          className={cx(input, control)}
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state.email}
        />
      </label>
      <label className={field}>
        <span className={fieldLabel}>Password</span>
        <PasswordInput name="password" autoComplete="new-password" required minLength={10} className={control} />
        <span className="text-label text-slate-500">At least 10 characters.</span>
      </label>
      <button
        className="mt-1 inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-[15px] font-semibold text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-wait disabled:opacity-70"
        disabled={pending}
      >
        {pending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Creating account…
          </>
        ) : (
          <>
            Create admin account <ArrowRight className="size-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
