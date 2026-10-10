'use server';

import { and, eq } from 'drizzle-orm';
import * as z from 'zod';
import { DEFAULT_APPLY_FIELDS, checkAnswer, standardColumns } from '@/lib/apply-forms';
import { db } from '@/lib/db';
import { applicationEvents, applications, jobs, type FormAnswer, type FormField } from '@/lib/db/schema';

export type ApplyState = {
  ok?: boolean;
  message?: string;
  /** Keyed by `fullName`, `email` or a question's id. */
  errors?: Record<string, string>;
  values?: Record<string, string | string[]>;
};

const NameEmailSchema = z.object({
  fullName: z.string().trim().min(2, { error: 'Enter your full name.' }).max(160),
  email: z.email({ error: 'Enter a valid email address.' }).trim().max(255),
});

/**
 * Application through the ReadyKorea form: for the job in `job` (its questions are in
 * `jobs.apply_fields`), or a general application with the default questions when `job` is empty.
 */
export async function submitApplication(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  // Hidden field people never see; bots tend to fill it. Pretend it worked.
  if (String(formData.get('company') ?? '')) return { ok: true };

  const code = String(formData.get('job') ?? '').trim();
  let jobId: number | null = null;
  let fields: FormField[] = DEFAULT_APPLY_FIELDS;
  if (code) {
    const [job] = await db
      .select({ id: jobs.id, applyFields: jobs.applyFields })
      .from(jobs)
      // Jobs that embed a Google Form, Typeform… take applications there, not here.
      .where(and(eq(jobs.code, code), eq(jobs.status, 'published'), eq(jobs.applyMethod, 'standard')))
      .limit(1);
    if (!job) return { message: 'This position is no longer open, so applications are closed.' };
    jobId = job.id;
    fields = job.applyFields;
  }

  const values: Record<string, string | string[]> = {
    fullName: String(formData.get('fullName') ?? ''),
    email: String(formData.get('email') ?? ''),
  };
  const errors: Record<string, string> = {};
  const person = NameEmailSchema.safeParse(values);
  if (!person.success) {
    for (const issue of person.error.issues) errors[String(issue.path[0])] ??= issue.message;
  }
  const answers: FormAnswer[] = [];
  const byId = new Map<string, string | string[]>();
  for (const field of fields) {
    const raw = formData.getAll(`q.${field.id}`).map(String);
    values[field.id] = field.type === 'checkboxes' ? raw : (raw[0] ?? '');
    const result = checkAnswer(field, raw);
    if ('error' in result) {
      errors[field.id] = result.error;
    } else {
      answers.push({ label: field.label, type: field.type, value: result.value });
      byId.set(field.id, result.value);
    }
  }
  if (!person.success || Object.keys(errors).length) {
    return { errors, values, message: 'Please check the highlighted fields.' };
  }

  try {
    await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(applications)
        .values({
          jobId,
          fullName: person.data.fullName,
          email: person.data.email.toLowerCase(),
          ...standardColumns(byId),
          answers,
          lang: formData.get('lang') === 'ko' ? 'ko' : 'en',
        })
        .returning({ id: applications.id });
      await tx.insert(applicationEvents).values({ applicationId: row.id, type: 'submitted', toStatus: 'new' });
    });
  } catch (error) {
    console.error('submitApplication failed', error);
    return { values, message: 'Something went wrong while sending your application. Please try again.' };
  }
  return { ok: true };
}
