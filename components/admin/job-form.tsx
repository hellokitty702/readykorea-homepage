'use client';

import Link from 'next/link';
import { startTransition, useActionState, useState, type FormEvent } from 'react';
import { saveJob, type JobFormState } from '@/lib/actions/jobs';
import type { Job, JobContent, JobFaq } from '@/lib/db/schema';
import { JOB_FIELD_GROUPS } from '@/lib/job-fields';
import { SLUG_MAX, slugify } from '@/lib/slug';
import { Field } from './field';
import { alertError, button, card, cardTitle, cx, formGrid, input, muted, plainSummary, small } from './styles';

type Lang = 'en' | 'ko';

const fieldset = 'mb-5.5 min-w-0';
const legend = 'mb-2.5 text-xs font-bold tracking-wider text-slate-500 uppercase';

export function JobForm({ job, defaults }: { job?: Job; defaults?: { code: string } }) {
  const [state, action, pending] = useActionState<JobFormState, FormData>(saveJob, {});
  const [faq, setFaq] = useState<Record<Lang, JobFaq[]>>({ en: job?.en.faq ?? [], ko: job?.ko.faq ?? [] });
  const err = (name: string) => state.errors?.[name];
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
        <h2 className={cardTitle}>English</h2>
        {contentFields('en')}
        {faqEditor('en')}
      </section>

      <details className={cx(card, 'group')} open={Boolean(job && Object.keys(job.ko).length)}>
        <summary className={cx(plainSummary, 'grid gap-0.5 group-open:mb-4')}>
          <h2 className="text-md font-bold before:text-slate-400 before:content-['▸_'] group-open:before:content-['▾_']">
            Korean (한국어)
          </h2>
          <span className={cx(muted, small)}>
            Optional. Blank fields fall back to English. The Job Board is currently hidden when the site is in Korean,
            so this text isn&apos;t shown yet.
          </span>
        </summary>
        {contentFields('ko')}
        {faqEditor('ko')}
      </details>

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
