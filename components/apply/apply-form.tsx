'use client';

import Link from 'next/link';
import { startTransition, useActionState, useEffect, useRef, type FormEvent } from 'react';
import { submitApplication, type ApplyField, type ApplyState } from '@/lib/actions/apply';
import { EXPERIENCE, PASSPORT_COUNTRIES, POSITIONS, REGIONS } from '@/lib/apply-options';

export type OpenJob = { code: string; label: string };

export function ApplyForm({ jobs, selectedJob }: { jobs: OpenJob[]; selectedJob: string }) {
  const [state, action, pending] = useActionState<ApplyState, FormData>(submitApplication, {});
  const langRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const v = state.values ?? { job: selectedJob };
  const err = (field: ApplyField) => state.errors?.[field];
  const str = (field: ApplyField) => (typeof v[field] === 'string' ? (v[field] as string) : '');

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

  const fieldProps = (field: ApplyField) => ({
    'aria-invalid': err(field) ? true : undefined,
    'aria-describedby': err(field) ? `${field}-error` : undefined,
  });

  return (
    <form className="apply-form" action={action} onSubmit={onSubmit} noValidate>
      <div ref={topRef} className="scroll-anchor" />
      {state.message && (
        <p className="form-alert" role="alert">
          {state.message}
        </p>
      )}
      <input ref={langRef} type="hidden" name="lang" defaultValue="en" />
      <div className="hp" aria-hidden="true">
        <label>
          Company <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="field">
        <label htmlFor="job">Position you are applying for</label>
        <select id="job" name="job" defaultValue={str('job')} {...fieldProps('job')}>
          <option value="">General application (any open position)</option>
          {jobs.map((job) => (
            <option key={job.code} value={job.code}>
              {job.label}
            </option>
          ))}
        </select>
        <FieldError field="job" message={err('job')} />
      </div>

      <div className="field">
        <label htmlFor="position">
          What is your preferred position? <span className="req">*</span>
        </label>
        <select id="position" name="position" required defaultValue={str('position')} {...fieldProps('position')}>
          <option value="" disabled>
            Choose…
          </option>
          {POSITIONS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <FieldError field="position" message={err('position')} />
      </div>

      <fieldset className="field" {...fieldProps('regions')}>
        <legend>
          Which regions are you open to? <span className="req">*</span>{' '}
          <span className="hint">Select all that apply</span>
        </legend>
        <div className="checks">
          {REGIONS.map((r) => (
            <label key={r} className="check">
              <input type="checkbox" name="regions" value={r} defaultChecked={(v.regions ?? []).includes(r)} /> {r}
            </label>
          ))}
        </div>
        <FieldError field="regions" message={err('regions')} />
      </fieldset>

      <div className="field">
        <label htmlFor="experience">
          Years of teaching experience <span className="req">*</span>
        </label>
        <select
          id="experience"
          name="experience"
          required
          defaultValue={str('experience')}
          {...fieldProps('experience')}
        >
          <option value="" disabled>
            Choose…
          </option>
          {EXPERIENCE.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
        <FieldError field="experience" message={err('experience')} />
      </div>

      <div className="field">
        <label htmlFor="introduction">
          Brief introduction <span className="hint">Optional</span>
        </label>
        <textarea
          id="introduction"
          name="introduction"
          rows={5}
          maxLength={3000}
          defaultValue={str('introduction')}
          {...fieldProps('introduction')}
        />
        <FieldError field="introduction" message={err('introduction')} />
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
            {...fieldProps('fullName')}
          />
          <FieldError field="fullName" message={err('fullName')} />
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
            {...fieldProps('email')}
          />
          <FieldError field="email" message={err('email')} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="passportCountry">
          Passport country <span className="req">*</span>
        </label>
        <select
          id="passportCountry"
          name="passportCountry"
          required
          defaultValue={str('passportCountry')}
          {...fieldProps('passportCountry')}
        >
          <option value="" disabled>
            Choose…
          </option>
          {PASSPORT_COUNTRIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <FieldError field="passportCountry" message={err('passportCountry')} />
      </div>

      <button className="submit" type="submit" disabled={pending}>
        {pending ? 'Sending…' : 'Submit application'}
      </button>
    </form>
  );
}

function FieldError({ field, message }: { field: ApplyField; message?: string }) {
  if (!message) return null;
  return (
    <p className="field-error" id={`${field}-error`}>
      {message}
    </p>
  );
}
