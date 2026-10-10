// Application forms of a job: labels for the admin panel, the links of embedded forms, and the
// questions of the ReadyKorea form. Shared by the admin job form, its Server Action and the public apply page.
import { EXPERIENCE, PASSPORT_COUNTRIES, POSITIONS, REGIONS } from '@/lib/apply-options';
import type { FormField } from '@/lib/db/schema';
import { FORM_FIELD_TYPES, type ApplyMethod, type FormFieldType } from '@/lib/db/enums';

export const APPLY_METHOD_LABEL: Record<ApplyMethod, string> = {
  standard: 'ReadyKorea form',
  google_form: 'Google Form',
  typeform: 'Typeform',
  embed: 'Other embeddable form',
};

export const APPLY_METHOD_HINT: Record<ApplyMethod, string> = {
  standard: 'Starts with the usual questions; change them below. Answers arrive under Applications.',
  google_form: 'Embed a Google Form on the apply page.',
  typeform: 'Embed a Typeform on the apply page.',
  embed: 'Embed any form that can be shown in an iframe (Tally, Jotform, Microsoft Forms…).',
};

/** Methods whose answers go to another service, so the admin panel never sees the applicants. */
export const isExternalMethod = (method: ApplyMethod) =>
  method === 'google_form' || method === 'typeform' || method === 'embed';

/** Pasted embed code (`<iframe src="…">`) is accepted too: its address is used. */
function extractUrl(input: string) {
  const value = input.trim();
  const src = value.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  return (src ? src[1] : value).replace(/&amp;/g, '&');
}

/**
 * Checks the link of an embedded form and returns the address to save, or an error to show.
 * Google Forms get `embedded=true` (the form without Google's page around it).
 */
export function embedFormUrl(method: ApplyMethod, input: string): { url: string } | { error: string } {
  const raw = extractUrl(input);
  if (!raw) return { error: 'Paste the link of the form.' };
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { error: 'Paste a full link, starting with https://.' };
  }
  if (url.protocol !== 'https:') return { error: 'The link must start with https://.' };

  if (method === 'google_form') {
    if (url.hostname === 'forms.gle') {
      return {
        error: 'Short forms.gle links can’t be embedded. In Google Forms, use Send → <> (Embed) and paste that code.',
      };
    }
    if (url.hostname !== 'docs.google.com' || !url.pathname.startsWith('/forms/')) {
      return { error: 'This isn’t a Google Forms link (docs.google.com/forms/…).' };
    }
    if (/\/edit\/?$/.test(url.pathname)) {
      return { error: 'That’s the editor link. Use Send → <> (Embed) in Google Forms and paste that code.' };
    }
    url.pathname = url.pathname.replace(/\/(viewform|formResponse)?\/?$/, '/viewform');
    url.searchParams.set('embedded', 'true');
    return { url: url.toString() };
  }
  if (method === 'typeform') {
    if (!/(^|\.)typeform\.com$/.test(url.hostname) || !url.pathname.startsWith('/to/')) {
      return { error: 'This isn’t a Typeform link (…typeform.com/to/…). Use Share → Copy link in Typeform.' };
    }
    return { url: url.toString() };
  }
  return { url: url.toString() };
}

/** The embedded form's own page, for visitors whose browser won't show the embed. */
export function standaloneFormUrl(embedUrl: string) {
  const url = new URL(embedUrl);
  url.searchParams.delete('embedded');
  return url.toString();
}

/** Starting height of the embedded form; the visitor scrolls inside it if the form is longer. */
export const EMBED_HEIGHT: Partial<Record<ApplyMethod, number>> = { google_form: 1400, typeform: 640, embed: 900 };

// ---------------------------------------------------------------------------
// ReadyKorea form
// ---------------------------------------------------------------------------

/**
 * Questions a new job starts with, also used for general applications (/apply/ without a job).
 * Answers to questions with these ids are also saved in the application's own columns, which the
 * dashboard charts and the application list read.
 */
export const DEFAULT_APPLY_FIELDS: FormField[] = [
  {
    id: 'position',
    type: 'select',
    label: 'What is your preferred position?',
    help: '',
    required: true,
    options: [...POSITIONS],
  },
  {
    id: 'regions',
    type: 'checkboxes',
    label: 'Which regions are you open to?',
    help: '',
    required: true,
    options: [...REGIONS],
  },
  {
    id: 'experience',
    type: 'select',
    label: 'Years of teaching experience',
    help: '',
    required: true,
    options: [...EXPERIENCE],
  },
  {
    id: 'passportCountry',
    type: 'select',
    label: 'Passport country',
    help: '',
    required: true,
    options: [...PASSPORT_COUNTRIES],
  },
  { id: 'introduction', type: 'long_text', label: 'Brief introduction', help: '', required: false, options: [] },
];

/** The application columns filled from the default questions' answers (see DEFAULT_APPLY_FIELDS). */
export function standardColumns(answers: Map<string, string | string[]>) {
  const text = (id: string, max: number) => {
    const value = answers.get(id);
    return (Array.isArray(value) ? value.join(', ') : (value ?? '')).slice(0, max);
  };
  const regions = answers.get('regions');
  return {
    position: text('position', 60),
    experience: text('experience', 30),
    passportCountry: text('passportCountry', 60),
    regions: Array.isArray(regions) ? regions : regions ? [regions] : [],
    introduction: text('introduction', 5000),
  };
}

export const FIELD_TYPE_LABEL: Record<FormFieldType, string> = {
  short_text: 'Short answer',
  long_text: 'Paragraph',
  email: 'Email',
  phone: 'Phone number',
  number: 'Number',
  date: 'Date',
  url: 'Link (URL)',
  select: 'Dropdown',
  radio: 'Multiple choice (one answer)',
  checkboxes: 'Checkboxes (several answers)',
};

export const hasOptions = (type: FormFieldType) => type === 'select' || type === 'radio' || type === 'checkboxes';

export const MAX_FORM_FIELDS = 40;
export const MAX_OPTIONS = 50;

export const newFieldId = () => Math.random().toString(36).slice(2, 8);

/**
 * Reads the builder's questions (JSON) and returns them cleaned, or the first problem found.
 * The form always asks for the full name and email as well; those aren't part of this list.
 */
export function parseFormFields(json: string): { fields: FormField[] } | { error: string } {
  let list: unknown;
  try {
    list = JSON.parse(json || '[]');
  } catch {
    return { error: 'The form could not be read. Reload the page and try again.' };
  }
  if (!Array.isArray(list)) return { error: 'The form could not be read. Reload the page and try again.' };
  if (list.length > MAX_FORM_FIELDS) return { error: `Use at most ${MAX_FORM_FIELDS} questions.` };

  const fields: FormField[] = [];
  const ids = new Set<string>();
  for (const [i, item] of (list as Record<string, unknown>[]).entries()) {
    const n = i + 1;
    const type = FORM_FIELD_TYPES.find((t) => t === item.type);
    if (!type) return { error: `Question ${n}: choose a question type.` };
    const label = String(item.label ?? '').trim().slice(0, 200);
    if (!label) return { error: `Question ${n}: enter the question.` };
    let id = String(item.id ?? '').replace(/[^a-z0-9]/gi, '').slice(0, 20);
    while (!id || ids.has(id)) id = newFieldId();
    ids.add(id);
    const options = hasOptions(type)
      ? [
          ...new Set(
            (Array.isArray(item.options) ? item.options : [])
              .map((o) => String(o).trim().slice(0, 200))
              .filter(Boolean),
          ),
        ]
      : [];
    if (hasOptions(type) && options.length < 2) return { error: `“${label}”: add at least two choices.` };
    if (options.length > MAX_OPTIONS) return { error: `“${label}”: use at most ${MAX_OPTIONS} choices.` };
    fields.push({
      id,
      type,
      label,
      help: String(item.help ?? '').trim().slice(0, 300),
      required: Boolean(item.required),
      options,
    });
  }
  return { fields };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Checks one answer; returns the value to store or an error for the visitor. */
export function checkAnswer(field: FormField, raw: string[]): { value: string | string[] } | { error: string } {
  if (field.type === 'checkboxes') {
    const picked = raw.filter((v) => field.options.includes(v));
    if (field.required && !picked.length) return { error: 'Choose at least one.' };
    return { value: picked };
  }
  const value = (raw[0] ?? '').trim();
  if (!value) return field.required ? { error: 'This question is required.' } : { value: '' };
  const max = field.type === 'long_text' ? 5000 : 500;
  if (value.length > max) return { error: `Keep it under ${max.toLocaleString('en')} characters.` };
  switch (field.type) {
    case 'email':
      return EMAIL.test(value) ? { value } : { error: 'Enter a valid email address.' };
    case 'phone':
      return /^[+()\d\s.-]{6,30}$/.test(value) ? { value } : { error: 'Enter a valid phone number.' };
    case 'number':
      return Number.isFinite(Number(value)) ? { value } : { error: 'Enter a number.' };
    case 'date':
      return /^\d{4}-\d{2}-\d{2}$/.test(value) ? { value } : { error: 'Enter a valid date.' };
    case 'url':
      return /^https?:\/\/\S+\.\S+/.test(value) ? { value } : { error: 'Enter a full link, starting with https://.' };
    case 'select':
    case 'radio':
      return field.options.includes(value) ? { value } : { error: 'Choose one of the options.' };
    default:
      return { value };
  }
}
