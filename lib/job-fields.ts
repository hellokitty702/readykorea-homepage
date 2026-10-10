import type { JobContent } from '@/lib/db/schema';

export type JobTextKey = Exclude<keyof JobContent, 'faq'>;

type JobField = { key: JobTextKey; label: string; hint?: string; long?: boolean; required?: boolean };

/** Translatable job text, grouped as on the public Job Board. Drives the admin job form. */
export const JOB_FIELD_GROUPS: { title: string; fields: JobField[] }[] = [
  {
    title: 'Card',
    fields: [
      { key: 'title', label: 'Job title', hint: 'Kindergarten lead teacher (K2–K3)', required: true },
      { key: 'type', label: 'School type', hint: 'English kindergarten', required: true },
      { key: 'location', label: 'Location', hint: 'Gangnam · Sinnonhyeon Stn. (Line 9)', required: true },
      { key: 'salary', label: 'Salary (short)', hint: '₩2.7–3.0M / month', required: true },
      { key: 'housing', label: 'Housing (short)', hint: 'Provided' },
      { key: 'response', label: 'Response time', hint: '~6 hours' },
    ],
  },
  {
    title: 'Key highlights',
    fields: [
      { key: 'workingHours', label: 'Working hours', hint: '9:00 AM – 6:00 PM (1-hr lunch)' },
      { key: 'monthlySalary', label: 'Monthly salary', hint: '₩2.7–3.0M / month' },
      { key: 'housingType', label: 'Housing type', hint: 'Provided (studio near school)' },
      { key: 'studentAge', label: 'Student age / type', hint: 'Ages 4–5 · K2–K3 English immersion' },
      { key: 'workingDays', label: 'Working days', hint: 'Mon–Fri' },
      { key: 'openings', label: 'Number of openings', hint: '1 position' },
    ],
  },
  {
    title: 'Compensation & benefits',
    fields: [
      { key: 'salaryDetails', label: 'Salary details', long: true },
      { key: 'housingPolicy', label: 'Housing policy', long: true },
      { key: 'vacation', label: 'Vacation / sick leave', long: true },
      { key: 'severance', label: 'Severance', long: true },
      { key: 'insurance', label: 'Insurance / pension', long: true },
      { key: 'airfare', label: 'Airfare', long: true },
    ],
  },
  {
    title: 'About the school',
    fields: [{ key: 'distinctive', label: 'Why this school is distinctive', long: true }],
  },
];

export const JOB_TEXT_KEYS: JobTextKey[] = JOB_FIELD_GROUPS.flatMap((g) => g.fields.map((f) => f.key));
export const REQUIRED_JOB_KEYS: JobTextKey[] = JOB_FIELD_GROUPS.flatMap((g) =>
  g.fields.filter((f) => f.required).map((f) => f.key),
);

export const JOB_STATUS_LABEL = { draft: 'Draft', published: 'Published', closed: 'Closed' } as const;
export const JOB_BADGE_LABEL = { new: 'New', urgent: 'Urgent' } as const;

/** Korean text with English filling any blanks. */
export function localizedContent(en: JobContent, ko: Partial<JobContent>): JobContent {
  const out = { ...en };
  for (const key of JOB_TEXT_KEYS) {
    const value = ko[key];
    if (typeof value === 'string' && value.trim()) out[key] = value;
  }
  if (ko.faq?.length) out.faq = ko.faq;
  return out;
}

/** `2026-06-01` → `2026.06.01` (how dates appear on the Job Board). */
export const formatStartDate = (isoDate: string | null) => (isoDate ? isoDate.replaceAll('-', '.') : '');

// ---------------------------------------------------------------------------
// Public page URL: /jobs/<slug>/
// ---------------------------------------------------------------------------

export const jobPath = (job: { slug: string }) => `/jobs/${job.slug}/`;
