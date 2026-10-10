'use client';

import { startTransition, useActionState, useEffect, useRef, type FormEvent } from 'react';
import { createUser, deleteUser, resetUserPassword, updateUserRole, type UserFormState } from '@/lib/actions/users';
import { Field } from './field';
import { PasswordInput } from './password-input';
import { alertError, alertOk, button, cx, formGrid, input, plainSummary, small } from './styles';

function Message({ state }: { state: UserFormState }) {
  if (state.error) return <p className={cx(alertError, small)}>{state.error}</p>;
  if (state.ok) return <p className={cx(alertOk, small)}>{state.ok}</p>;
  return null;
}

export function NewUserForm() {
  const [state, action, pending] = useActionState<UserFormState, FormData>(createUser, {});
  const form = useRef<HTMLFormElement>(null);

  // Keep what was typed when the server rejects it; clear the form only once the user is added.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  };
  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={action} onSubmit={onSubmit} className="grid gap-3.5">
      <Message state={state} />
      <div className={formGrid}>
        <Field label="Name">
          <input className={input} name="name" required maxLength={120} />
        </Field>
        <Field label="Email">
          <input className={input} name="email" type="email" required autoComplete="off" />
        </Field>
        <Field label="Role">
          <select className={input} name="role" defaultValue="admin">
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </Field>
        <Field label="Password" hint="At least 10 characters. Share it with them privately.">
          <PasswordInput name="password" required minLength={10} autoComplete="new-password" />
        </Field>
      </div>
      <div>
        <button className={button('primary')} disabled={pending}>
          {pending ? 'Adding…' : 'Add user'}
        </button>
      </div>
    </form>
  );
}

export function UserRowActions({
  user,
  isMe,
}: {
  user: { id: number; email: string; role: 'user' | 'admin' };
  isMe: boolean;
}) {
  const [roleState, roleAction, rolePending] = useActionState<UserFormState, FormData>(updateUserRole, {});
  const [pwState, pwAction, pwPending] = useActionState<UserFormState, FormData>(resetUserPassword, {});
  const [delState, delAction, delPending] = useActionState<UserFormState, FormData>(deleteUser, {});
  const details = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (pwState.ok && details.current) details.current.open = false;
  }, [pwState]);

  return (
    <div className="grid justify-items-end gap-1.5">
      <div className="flex items-start gap-1.5">
        {!isMe && (
          <form action={roleAction}>
            <input type="hidden" name="id" value={user.id} />
            <input type="hidden" name="role" value={user.role === 'admin' ? 'user' : 'admin'} />
            <button className={button('default', 'sm')} disabled={rolePending}>
              {user.role === 'admin' ? 'Make user' : 'Make admin'}
            </button>
          </form>
        )}
        {/* Opens inside the table row: the table's scroll container would clip a floating box. */}
        <details ref={details} className="open:grid open:justify-items-end">
          <summary className={cx(plainSummary, button('default', 'sm'))}>
            {isMe ? 'Change password' : 'Set password'}
          </summary>
          <form
            action={pwAction}
            className="mt-2 grid w-70 gap-2.5 rounded-[10px] border border-slate-200 bg-white p-3.5 text-left whitespace-normal shadow-[0_10px_30px_rgba(15,23,42,0.12)]"
          >
            <input type="hidden" name="id" value={user.id} />
            <Field label={`New password for ${user.email}`}>
              <PasswordInput name="password" minLength={10} required autoComplete="new-password" />
            </Field>
            <button className={button('primary', 'sm')} disabled={pwPending}>
              Save password
            </button>
          </form>
        </details>
        {!isMe && (
          <form
            action={delAction}
            onSubmit={(e) => {
              if (!window.confirm(`Delete ${user.email}? This can't be undone.`)) e.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={user.id} />
            <button className={button('dangerGhost', 'sm')} disabled={delPending}>
              Delete
            </button>
          </form>
        )}
      </div>
      <Message state={roleState.error || roleState.ok ? roleState : pwState.error || pwState.ok ? pwState : delState} />
    </div>
  );
}
