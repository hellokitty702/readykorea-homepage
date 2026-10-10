// Allowed values for the string columns that act as enums. The database stores plain varchar
// (no Postgres enum types), so adding a value is a code change only: list it here, no migration.
// No imports, so client components can use these too.

export const JOB_STATUSES = ['draft', 'published', 'closed'] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export const JOB_BADGES = ['new', 'urgent'] as const;
export type JobBadge = (typeof JOB_BADGES)[number];

/** Hiring flow: new → reviewing → interview → offered → hired, or rejected / withdrawn. */
export const APPLICATION_STATUSES = [
  'new',
  'reviewing',
  'interview',
  'offered',
  'hired',
  'rejected',
  'withdrawn',
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_EVENT_TYPES = ['submitted', 'status_changed', 'note'] as const;
export type ApplicationEventType = (typeof APPLICATION_EVENT_TYPES)[number];

export const POST_STATUSES = ['draft', 'published'] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

/** Where an uploaded file lives: `local` (dev, served by app/uploads) or `r2` (Cloudflare R2). */
export const MEDIA_DISKS = ['local', 'r2'] as const;
export type MediaDisk = (typeof MEDIA_DISKS)[number];

/**
 * How teachers apply to a job: `standard` is the ReadyKorea form, with the questions set in the job's
 * form builder (new jobs start with the default questions); the rest embed a form hosted elsewhere,
 * whose answers never reach this site (lib/apply-forms.ts).
 */
export const APPLY_METHODS = ['standard', 'google_form', 'typeform', 'embed'] as const;
export type ApplyMethod = (typeof APPLY_METHODS)[number];

/** Question types of the ReadyKorea application form. */
export const FORM_FIELD_TYPES = [
  'short_text',
  'long_text',
  'email',
  'phone',
  'number',
  'date',
  'url',
  'select',
  'radio',
  'checkboxes',
] as const;
export type FormFieldType = (typeof FORM_FIELD_TYPES)[number];
