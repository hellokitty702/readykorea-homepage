'use client';

import { ArrowDown, ArrowUp, Copy, Lock, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { FIELD_TYPE_LABEL, MAX_FORM_FIELDS, hasOptions, newFieldId } from '@/lib/apply-forms';
import { FORM_FIELD_TYPES, type FormFieldType } from '@/lib/db/enums';
import type { FormField } from '@/lib/db/schema';
import { button, cx, fieldLabel, hint, input, muted, small } from './styles';

const blank = (type: FormFieldType = 'short_text'): FormField => ({
  id: newFieldId(),
  type,
  label: '',
  help: '',
  required: false,
  options: hasOptions(type) ? ['', ''] : [],
});

const iconButton =
  'grid size-8 cursor-pointer place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35';

/**
 * Questions of a job's ReadyKorea application form. Sent with the job form as JSON in `name`; the
 * Server Action checks them again (lib/apply-forms.ts → parseFormFields).
 */
export function FormBuilder({
  name,
  initial,
  defaults,
  error,
}: {
  name: string;
  initial: FormField[];
  /** Offered by "Reset to default questions". */
  defaults?: FormField[];
  error?: string;
}) {
  const [fields, setFields] = useState<FormField[]>(initial);
  const update = (i: number, change: Partial<FormField>) =>
    setFields((list) => list.map((f, j) => (j === i ? { ...f, ...change } : f)));
  const move = (i: number, by: number) =>
    setFields((list) => {
      const next = [...list];
      [next[i], next[i + by]] = [next[i + by], next[i]];
      return next;
    });

  return (
    <div className="grid gap-3">
      <input type="hidden" name={name} value={JSON.stringify(fields)} />
      {error && (
        <p className="text-label text-red-700" role="alert">
          {error}
        </p>
      )}

      {/* Always asked: applications are listed and tracked by name and email. */}
      <div className="grid gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3.5 sm:grid-cols-2">
        {['Full name', 'Email address'].map((label) => (
          <p key={label} className="flex items-center gap-2 text-slate-700">
            <Lock className="size-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="font-semibold">{label}</span>
            <span className={cx(muted, small)}>Always asked, required</span>
          </p>
        ))}
      </div>

      {fields.map((field, i) => {
        const id = `q-${field.id}`;
        return (
          <fieldset key={field.id} className="min-w-0 rounded-xl border border-slate-200 bg-white p-3.5">
            <legend className="sr-only">Question {i + 1}</legend>
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Question {i + 1}</span>
              <span className="flex gap-0.5">
                <button
                  type="button"
                  className={iconButton}
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label={`Move question ${i + 1} up`}
                  title="Move up"
                >
                  <ArrowUp className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={iconButton}
                  onClick={() => move(i, 1)}
                  disabled={i === fields.length - 1}
                  aria-label={`Move question ${i + 1} down`}
                  title="Move down"
                >
                  <ArrowDown className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={iconButton}
                  onClick={() =>
                    setFields((list) => [...list.slice(0, i + 1), { ...field, id: newFieldId() }, ...list.slice(i + 1)])
                  }
                  disabled={fields.length >= MAX_FORM_FIELDS}
                  aria-label={`Duplicate question ${i + 1}`}
                  title="Duplicate"
                >
                  <Copy className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={cx(iconButton, 'hover:bg-red-50 hover:text-red-700')}
                  onClick={() => setFields((list) => list.filter((_, j) => j !== i))}
                  aria-label={`Remove question ${i + 1}`}
                  title="Remove"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
              <label className="grid min-w-0 gap-1.5" htmlFor={`${id}-label`}>
                <span className={fieldLabel}>Question</span>
                <input
                  id={`${id}-label`}
                  className={input}
                  value={field.label}
                  maxLength={200}
                  placeholder="e.g. When can you start?"
                  onChange={(e) => update(i, { label: e.target.value })}
                />
              </label>
              <label className="grid min-w-0 gap-1.5" htmlFor={`${id}-type`}>
                <span className={fieldLabel}>Type</span>
                <select
                  id={`${id}-type`}
                  className={input}
                  value={field.type}
                  onChange={(e) => {
                    const type = e.target.value as FormFieldType;
                    // Keep typed choices when switching between choice types; start two blanks otherwise.
                    const options = hasOptions(type) ? (field.options.length ? field.options : ['', '']) : [];
                    update(i, { type, options });
                  }}
                >
                  {FORM_FIELD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {FIELD_TYPE_LABEL[t]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid min-w-0 gap-1.5 md:col-span-2" htmlFor={`${id}-help`}>
                <span className={fieldLabel}>
                  Help text <span className="font-normal text-slate-500">Optional</span>
                </span>
                <input
                  id={`${id}-help`}
                  className={input}
                  value={field.help}
                  maxLength={300}
                  onChange={(e) => update(i, { help: e.target.value })}
                />
              </label>

              {hasOptions(field.type) && (
                <div className="grid min-w-0 gap-1.5 md:col-span-2">
                  <span className={fieldLabel}>Choices</span>
                  {field.options.map((option, k) => (
                    <div key={k} className="flex gap-1.5">
                      <input
                        className={input}
                        value={option}
                        maxLength={200}
                        aria-label={`Choice ${k + 1}`}
                        placeholder={`Choice ${k + 1}`}
                        onChange={(e) =>
                          update(i, { options: field.options.map((o, m) => (m === k ? e.target.value : o)) })
                        }
                      />
                      <button
                        type="button"
                        className={cx(iconButton, 'size-9.5 shrink-0')}
                        onClick={() => update(i, { options: field.options.filter((_, m) => m !== k) })}
                        aria-label={`Remove choice ${k + 1}`}
                        title="Remove choice"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                  <div>
                    <button
                      type="button"
                      className={button('ghost', 'sm')}
                      onClick={() => update(i, { options: [...field.options, ''] })}
                    >
                      <Plus className="size-3.5" aria-hidden="true" /> Add choice
                    </button>
                  </div>
                </div>
              )}

              <label className="flex items-center gap-2 md:col-span-2">
                <input
                  type="checkbox"
                  className="size-4 accent-blue-700"
                  checked={field.required}
                  onChange={(e) => update(i, { required: e.target.checked })}
                />
                <span className="font-medium">Required</span>
              </label>
            </div>
          </fieldset>
        );
      })}

      {!fields.length && <p className={hint}>No extra questions yet: the form only asks for name and email.</p>}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={button('default', 'sm')}
          onClick={() => setFields((list) => [...list, blank()])}
          disabled={fields.length >= MAX_FORM_FIELDS}
        >
          <Plus className="size-3.5" aria-hidden="true" /> Add question
        </button>
        {defaults && (
          <button
            type="button"
            className={button('ghost', 'sm')}
            onClick={() => {
              if (window.confirm('Replace these questions with the default ones? Your changes here are lost.')) {
                setFields(defaults.map((f) => ({ ...f, options: [...f.options] })));
              }
            }}
          >
            <RotateCcw className="size-3.5" aria-hidden="true" /> Reset to default questions
          </button>
        )}
      </div>
    </div>
  );
}
