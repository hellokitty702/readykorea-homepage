'use client';

import Link from 'next/link';
import { startTransition, useActionState, useEffect, useRef, type FormEvent } from 'react';
import { submitApplication, type ApplyState } from '@/lib/actions/apply';
import type { FormField } from '@/lib/db/schema';

const INPUT_TYPE: Partial<Record<FormField['type'], string>> = {
  short_text: 'text',
  email: 'email',
  phone: 'tel',
  number: 'number',
  date: 'date',
  url: 'url',
};

/**
 * The ReadyKorea application form: name, email and the job's questions (set in the admin job form).
 * `jobCode` is empty for a general application, which asks the default questions. Styles: apply.css.
 */
export function ApplyForm({ jobCode, fields }: { jobCode: string; fields: FormField[] }) {
  const [state, action, pending] = useActionState<ApplyState, FormData>(submitApplication, {});
  const langRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const v = state.values ?? {};
  const err = (key: string) => state.errors?.[key];
  const str = (key: string) => (typeof v[key] === 'string' ? (v[key] as string) : '');

  // Record the language the visitor is browsing in (set by the header's EN / 한글 switch).
  useEffect(() => {
    if (langRef.current) langRef.current.value = document.documentElement.lang === 'ko' ? 'ko' : 'en';
  });
  useEffect(() => {
    if (state.ok || state.message) topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [state]);

  if (state.ok) {
    return (
      <div className="apply-done" ref={topRef} role="status">
        <h2>Thank you — your application is in.</h2>
        <p>We review every application and will reply by email.</p>
        <Link className="apply-done-link" href="/jobs/">
          Back to the Job Board
        </Link>
      </div>
    );
  }

  // Submit without React's automatic form reset, so a validation error keeps what was typed.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  };

  const a11y = (key: string, help?: string) => ({
    'aria-invalid': err(key) ? true : undefined,
    'aria-describedby': [err(key) && `${key}-error`, help && `${key}-help`].filter(Boolean).join(' ') || undefined,
  });

  return (
    <form className="apply-form" action={action} onSubmit={onSubmit} noValidate>
      <div ref={topRef} className="scroll-anchor" />
      {state.message && (
        <p className="form-alert" role="alert">
          {state.message}
        </p>
      )}
      <input type="hidden" name="job" value={jobCode} />
      <input ref={langRef} type="hidden" name="lang" defaultValue="en" />
      <div className="hp" aria-hidden="true">
        <label>
          Company <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="fullName">
            Full name <span className="req">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            autoComplete="name"
            maxLength={160}
            defaultValue={str('fullName')}
            {...a11y('fullName')}
          />
          <FieldError id="fullName" message={err('fullName')} />
        </div>
        <div className="field">
          <label htmlFor="email">
            Email address <span className="req">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={255}
            defaultValue={str('email')}
            {...a11y('email')}
          />
          <FieldError id="email" message={err('email')} />
        </div>
      </div>

      {fields.map((field) => {
        const name = `q.${field.id}`;
        const id = `q-${field.id}`;
        const required = field.required ? <span className="req">*</span> : <span className="hint">Optional</span>;
        const help = field.help ? (
          <p className="hint" id={`${field.id}-help`}>
            {field.help}
          </p>
        ) : null;

        if (field.type === 'radio' || field.type === 'checkboxes') {
          const picked = v[field.id];
          return (
            <fieldset key={field.id} className="field" {...a11y(field.id, field.help)}>
              <legend>
                {field.label} {required}
                {field.type === 'checkboxes' && <span className="hint">Select all that apply</span>}
              </legend>
              {help}
              <div className="checks">
                {field.options.map((option) => (
                  <label key={option} className="check">
                    <input
                      type={field.type === 'radio' ? 'radio' : 'checkbox'}
                      name={name}
                      value={option}
                      defaultChecked={Array.isArray(picked) ? picked.includes(option) : picked === option}
                    />{' '}
                    {option}
                  </label>
                ))}
              </div>
              <FieldError id={field.id} message={err(field.id)} />
            </fieldset>
          );
        }

        return (
          <div key={field.id} className="field">
            <label htmlFor={id}>
              {field.label} {required}
            </label>
            {help}
            {field.type === 'long_text' ? (
              <textarea
                id={id}
                name={name}
                rows={5}
                maxLength={5000}
                required={field.required}
                defaultValue={str(field.id)}
                {...a11y(field.id, field.help)}
              />
            ) : field.type === 'select' ? (
              <select
                id={id}
                name={name}
                required={field.required}
                defaultValue={str(field.id)}
                {...a11y(field.id, field.help)}
              >
                <option value="">Choose…</option>
                {field.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                id={id}
                name={name}
                type={INPUT_TYPE[field.type] ?? 'text'}
                maxLength={500}
                required={field.required}
                defaultValue={str(field.id)}
                {...a11y(field.id, field.help)}
              />
            )}
            <FieldError id={field.id} message={err(field.id)} />
          </div>
        );
      })}

      <button className="submit" type="submit" disabled={pending}>
        {pending ? 'Sending…' : 'Submit application'}
      </button>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="field-error" id={`${id}-error`}>
      {message}
    </p>
  );
}
