'use client';

import Link from 'next/link';
import { startTransition, useActionState, useEffect, useState, type FormEvent } from 'react';
import { TriangleAlert } from 'lucide-react';
import { saveJob, type JobFormState } from '@/lib/actions/jobs';
import { APPLY_METHOD_HINT, APPLY_METHOD_LABEL, DEFAULT_APPLY_FIELDS, isExternalMethod } from '@/lib/apply-forms';
import { APPLY_METHODS, type ApplyMethod } from '@/lib/db/enums';
import type { Job, JobContent, JobFaq } from '@/lib/db/schema';
import { JOB_FIELD_GROUPS } from '@/lib/job-fields';
import { SLUG_MAX, slugify } from '@/lib/slug';
import { Field } from './field';
import { FormBuilder } from './form-builder';
import { alertError, button, card, cardTitle, cx, formGrid, input, muted, small, tabCount, tabLink, tabs } from './styles';

type Lang = 'en' | 'ko';

const LANGS: Lang[] = ['en', 'ko'];
const LANG_LABEL: Record<Lang, string> = { en: 'English', ko: 'Korean (한국어)' };

const fieldset = 'mb-5.5 min-w-0';
const legend = 'mb-2.5 text-xs font-bold tracking-wider text-slate-500 uppercase';

const URL_HINT: Partial<Record<ApplyMethod, string>> = {
  google_form: 'In Google Forms: Send → <> (Embed), copy the code and paste it here. A docs.google.com/forms link works too.',
  typeform: 'In Typeform: Share → Copy link (…typeform.com/to/…).',
  embed: 'The form’s public link, or its embed code (<iframe …>). The form must allow being embedded on other sites.',
};

export function JobForm({ job, defaults }: { job?: Job; defaults?: { code: string } }) {
  const [state, action, pending] = useActionState<JobFormState, FormData>(saveJob, {});
  const [applyMethod, setApplyMethod] = useState<ApplyMethod>(job?.applyMethod ?? 'standard');
  const service = applyMethod === 'embed' ? 'the other service' : APPLY_METHOD_LABEL[applyMethod];
  const [faq, setFaq] = useState<Record<Lang, JobFaq[]>>({ en: job?.en.faq ?? [], ko: job?.ko.faq ?? [] });
  const err = (name: string) => state.errors?.[name];
  const [lang, setLang] = useState<Lang>('en');
  const errorsIn = (l: Lang) => Object.keys(state.errors ?? {}).filter((key) => key.startsWith(`${l}.`)).length;
  // After a failed save, show the language whose fields need fixing.
  useEffect(() => {
    if (errorsIn(lang) === 0) {
      const other = LANGS.find((l) => errorsIn(l) > 0);
      if (other) setLang(other);
    }
  }, [state]);
  // A blank slug is made from the English title on save; the placeholder previews it.
  const [autoSlug, setAutoSlug] = useState(() => slugify(job?.en.title ?? ''));

  // Submit without React's automatic form reset, so a validation error keeps what was typed.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  };

  const textValue = (lang: Lang, key: keyof JobContent) => {
    const value = (lang === 'en' ? job?.en : job?.ko)?.[key];
    return typeof value === 'string' ? value : '';
  };

  const contentFields = (lang: Lang) =>
    JOB_FIELD_GROUPS.map((group) => (
      <fieldset key={group.title} className={fieldset}>
        <legend className={legend}>{group.title}</legend>
        <div className={formGrid}>
          {group.fields.map((f) => {
            const name = `${lang}.${f.key}`;
            const required = lang === 'en' && f.required;
            const props = {
              id: name,
              name,
              className: cx(input, f.long && 'resize-y'),
              defaultValue: textValue(lang, f.key),
              placeholder: lang === 'ko' ? textValue('en', f.key) || f.hint : f.hint,
              required,
              'aria-invalid': err(name) ? true : undefined,
            };
            return (
              <Field
                key={f.key}
                label={f.label}
                htmlFor={name}
                required={required}
                error={err(name)}
                className={f.long ? 'md:col-span-2' : undefined}
              >
                {f.long ? <textarea rows={3} {...props} /> : <input {...props} />}
              </Field>
            );
          })}
        </div>
      </fieldset>
    ));

  const faqEditor = (lang: Lang) => {
    const items = faq[lang];
    const update = (next: JobFaq[]) => setFaq((prev) => ({ ...prev, [lang]: next }));
    return (
      <fieldset className={fieldset}>
        <legend className={legend}>Quick answers (FAQ)</legend>
        <input type="hidden" name={`${lang}.faq`} value={JSON.stringify(items)} />
        {lang === 'ko' && <p className={cx(muted, small)}>Leave empty to show the English answers.</p>}
        {items.map((item, i) => (
          <div key={i} className="mb-2 grid grid-cols-1 items-start gap-2 md:grid-cols-[1fr_1.6fr_auto]">
            <input
              className={input}
              aria-label={`Question ${i + 1}`}
              placeholder="Question"
              value={item.q}
              onChange={(e) => update(items.map((it, j) => (j === i ? { ...it, q: e.target.value } : it)))}
            />
            <textarea
              className={input}
              aria-label={`Answer ${i + 1}`}
              placeholder="Answer"
              rows={2}
              value={item.a}
              onChange={(e) => update(items.map((it, j) => (j === i ? { ...it, a: e.target.value } : it)))}
            />
            <button
              type="button"
              className={button('ghost', 'sm')}
              onClick={() => update(items.filter((_, j) => j !== i))}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" className={button('default', 'sm')} onClick={() => update([...items, { q: '', a: '' }])}>
          + Add question
        </button>
      </fieldset>
    );
  };

  return (
    <form
      className="grid gap-4.5"
      onSubmit={onSubmit}
      action={action}
      noValidate
      onInput={(e) => {
        const target = e.target as HTMLInputElement;
        if (target.name === 'en.title') setAutoSlug(slugify(target.value));
      }}
    >
      {job && <input type="hidden" name="id" value={job.id} />}
      {state.message && (
        <p className={alertError} role="alert">
          {state.message}
        </p>
      )}

      <section className={card}>
        <h2 className={cardTitle}>Listing</h2>
        <div className={formGrid}>
          <Field
            label="Job ID"
            htmlFor="code"
            required
            error={err('code')}
            hint="Shown on the job page and used in apply links."
          >
            <input
              className={input}
              id="code"
              name="code"
              defaultValue={job?.code ?? defaults?.code}
              required
              aria-invalid={err('code') ? true : undefined}
            />
          </Field>
          <Field label="School" htmlFor="school" required error={err('school')}>
            <input
              className={input}
              id="school"
              name="school"
              defaultValue={job?.school}
              required
              aria-invalid={err('school') ? true : undefined}
            />
          </Field>
          <Field
            label="Page URL"
            htmlFor="slug"
            error={err('slug')}
            hint={
              job
                ? 'Changing it breaks links that were already shared. Leave blank to make it from the job title.'
                : 'Leave blank to make it from the job title.'
            }
            className="md:col-span-2"
          >
            <span className="flex">
              <span className="inline-flex items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-2.5 text-slate-500">
                /jobs/
              </span>
              <input
                className={cx(input, 'rounded-l-none')}
                id="slug"
                name="slug"
                defaultValue={job?.slug}
                placeholder={autoSlug || 'kindergarten-lead-teacher-k2-k3'}
                maxLength={SLUG_MAX}
                spellCheck={false}
                autoCapitalize="off"
                aria-invalid={err('slug') ? true : undefined}
              />
            </span>
          </Field>
          <Field label="Status" htmlFor="status">
            <select className={input} id="status" name="status" defaultValue={job?.status ?? 'draft'}>
              <option value="draft">Draft (hidden)</option>
              <option value="published">Published (on the Job Board)</option>
              <option value="closed">Closed (hidden, no new applications)</option>
            </select>
          </Field>
          <Field label="Badge" htmlFor="badge">
            <select className={input} id="badge" name="badge" defaultValue={job?.badge ?? ''}>
              <option value="">None</option>
              <option value="new">New</option>
              <option value="urgent">Urgent</option>
            </select>
          </Field>
          <Field label="Start date" htmlFor="startDate" error={err('startDate')}>
            <input className={input} id="startDate" name="startDate" type="date" defaultValue={job?.startDate ?? ''} />
          </Field>
          <Field label="Rating" htmlFor="rating">
            <input
              className={input}
              id="rating"
              name="rating"
              defaultValue={job?.rating}
              placeholder="4.7 · 32 reviews"
            />
          </Field>
        </div>
      </section>

      <section className={card}>
        <h2 className={cardTitle}>Application form</h2>
        <fieldset className="min-w-0">
          <legend className="sr-only">How teachers apply</legend>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {APPLY_METHODS.map((method) => (
              <label
                key={method}
                className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 p-3 hover:border-slate-300 has-checked:border-blue-700 has-checked:bg-blue-50/50 has-checked:ring-1 has-checked:ring-blue-700"
              >
                <input
                  type="radio"
                  name="applyMethod"
                  value={method}
                  checked={applyMethod === method}
                  onChange={() => setApplyMethod(method)}
                  className="mt-0.5 size-4 shrink-0 accent-blue-700"
                />
                <span className="grid gap-0.5">
                  <span className="font-semibold">{APPLY_METHOD_LABEL[method]}</span>
                  <span className={cx(muted, small)}>{APPLY_METHOD_HINT[method]}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {isExternalMethod(applyMethod) && (
          <div className="mt-4 grid gap-4">
            <p
              className="flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-3 text-amber-900"
              role="note"
            >
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                <strong>You won&apos;t be able to track applicants or other data for this job here.</strong> Answers
                go to {service}, not to Applications: no applicant list, hiring stages, notes or emails in this panel,
                and the job isn&apos;t counted on the dashboard. Check the responses in {service}.
              </span>
            </p>
            <Field
              label={`${APPLY_METHOD_LABEL[applyMethod]} link`}
              htmlFor="applyFormUrl"
              required
              error={err('applyFormUrl')}
              hint={URL_HINT[applyMethod]}
            >
              <textarea
                className={cx(input, 'resize-y font-mono text-label')}
                id="applyFormUrl"
                name="applyFormUrl"
                rows={2}
                defaultValue={job?.applyFormUrl}
                spellCheck={false}
                aria-invalid={err('applyFormUrl') ? true : undefined}
              />
            </Field>
          </div>
        )}
        {/* Kept in the form while another method is chosen, so switching back doesn't lose it. */}
        {!isExternalMethod(applyMethod) && <input type="hidden" name="applyFormUrl" value={job?.applyFormUrl ?? ''} />}

        <div className={cx('mt-4', applyMethod !== 'standard' && 'hidden')}>
          <h3 className={cx(legend, 'mb-3')}>Questions</h3>
          {/* A new job starts with the default questions. */}
          <FormBuilder
            name="applyFields"
            initial={job?.applyFields ?? DEFAULT_APPLY_FIELDS}
            defaults={DEFAULT_APPLY_FIELDS}
            error={err('applyFields')}
          />
        </div>
      </section>

      <section className={card}>
        <h2 className="sr-only">Job text</h2>
        <div
          className={cx(tabs, 'mb-4.5')}
          role="tablist"
          aria-label="Language"
          onKeyDown={(e) => {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
            const next = lang === 'en' ? 'ko' : 'en';
            setLang(next);
            document.getElementById(`job-tab-${next}`)?.focus();
          }}
        >
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              role="tab"
              id={`job-tab-${l}`}
              aria-controls={`job-panel-${l}`}
              aria-selected={lang === l}
              tabIndex={lang === l ? 0 : -1}
              className={cx(tabLink, 'cursor-pointer')}
              onClick={() => setLang(l)}
            >
              {LANG_LABEL[l]}
              {l === 'ko' && <span className={tabCount}>Optional</span>}
              {errorsIn(l) > 0 && (
                <span className="ml-1.5 inline-block rounded-full bg-red-100 px-1.5 text-2xs font-semibold text-red-700">
                  {errorsIn(l)} to fix
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Both panels stay in the form (only hidden), so both languages are saved. */}
        <div role="tabpanel" id="job-panel-en" aria-labelledby="job-tab-en" hidden={lang !== 'en'}>
          {contentFields('en')}
          {faqEditor('en')}
        </div>
        <div role="tabpanel" id="job-panel-ko" aria-labelledby="job-tab-ko" hidden={lang !== 'ko'}>
          <p className={cx(muted, small, 'mb-4.5')}>
            Optional. Blank fields fall back to English. The Job Board is currently hidden when the site is in Korean,
            so this text isn&apos;t shown yet.
          </p>
          {contentFields('ko')}
          {faqEditor('ko')}
        </div>
      </section>

      <div className="sticky bottom-0 flex gap-2 bg-linear-to-b from-transparent to-slate-50 to-30% py-3">
        <button className={button('primary')} disabled={pending}>
          {pending ? 'Saving…' : job ? 'Save changes' : 'Create job'}
        </button>
        <Link className={button('ghost')} href={job ? `/admin/jobs/${job.id}/` : '/admin/jobs/'}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
