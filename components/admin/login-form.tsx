'use client';

import { ArrowRight, LoaderCircle } from 'lucide-react';
import { useActionState } from 'react';
import { login, type LoginState } from '@/lib/actions/auth';
import { PasswordInput } from './password-input';
import { alertError, cx, field, fieldLabel, input } from './styles';

/** Larger controls than the rest of the panel: this is the one form everybody uses. */
const control = 'h-11 px-3 text-[15px] focus-visible:border-slate-900! focus-visible:outline-amber-300!';

export function LoginForm({ next, notice }: { next: string; notice: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const error = state.error ?? notice;

  return (
    <form action={action} className="grid gap-4">
      {error && (
        <p className={alertError} role="alert">
          {error}
        </p>
      )}
      <input type="hidden" name="next" value={next} />
      <label className={field}>
        <span className={fieldLabel}>Email</span>
        <input
          className={cx(input, control)}
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state.email}
          autoFocus
        />
      </label>
      <label className={field}>
        <span className={fieldLabel}>Password</span>
        <PasswordInput name="password" autoComplete="current-password" required className={control} />
      </label>
      <button
        className="mt-1 inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-[15px] font-semibold text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-wait disabled:opacity-70"
        disabled={pending}
      >
        {pending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Signing in…
          </>
        ) : (
          <>
            Sign in <ArrowRight className="size-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
