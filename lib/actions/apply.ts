'use server';

import { and, eq } from 'drizzle-orm';
import * as z from 'zod';
import { EXPERIENCE, PASSPORT_COUNTRIES, POSITIONS, REGIONS } from '@/lib/apply-options';
import { db } from '@/lib/db';
import { applicationEvents, applications, jobs } from '@/lib/db/schema';

const ApplySchema = z.object({
  job: z.string().trim().max(40),
  position: z.enum(POSITIONS, { error: 'Choose a position.' }),
  regions: z.array(z.enum(REGIONS)).min(1, { error: 'Choose at least one region.' }),
  experience: z.enum(EXPERIENCE, { error: 'Choose your experience.' }),
  introduction: z.string().trim().max(3000, { error: 'Keep it under 3,000 characters.' }),
  email: z.email({ error: 'Enter a valid email address.' }).trim().max(255),
  fullName: z.string().trim().min(2, { error: 'Enter your full name.' }).max(160),
  passportCountry: z.enum(PASSPORT_COUNTRIES, { error: 'Choose your passport country.' }),
  lang: z.enum(['en', 'ko']).catch('en'),
});

export type ApplyField = Exclude<keyof z.infer<typeof ApplySchema>, 'lang'>;
export type ApplyValues = Partial<Record<ApplyField, string | string[]>>;
export type ApplyState = {
  ok?: boolean;
  message?: string;
  errors?: Partial<Record<ApplyField, string>>;
  values?: ApplyValues;
};

export async function submitApplication(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  const raw = {
    job: String(formData.get('job') ?? ''),
    position: formData.get('position') ?? undefined,
    regions: formData.getAll('regions').map(String),
    experience: formData.get('experience') ?? undefined,
    introduction: String(formData.get('introduction') ?? ''),
    email: String(formData.get('email') ?? ''),
    fullName: String(formData.get('fullName') ?? ''),
    passportCountry: formData.get('passportCountry') ?? undefined,
    lang: formData.get('lang') ?? 'en',
  };
  const values: ApplyValues = {
    job: raw.job,
    position: String(raw.position ?? ''),
    regions: raw.regions,
    experience: String(raw.experience ?? ''),
    introduction: raw.introduction,
    email: raw.email,
    fullName: raw.fullName,
    passportCountry: String(raw.passportCountry ?? ''),
  };

  // Hidden field people never see; bots tend to fill it. Pretend it worked.
  if (String(formData.get('company') ?? '')) return { ok: true };

  const parsed = ApplySchema.safeParse(raw);
  if (!parsed.success) {
    const errors: ApplyState['errors'] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ApplyField;
      errors[field] ??= issue.message;
    }
    return { errors, values, message: 'Please check the highlighted fields.' };
  }
  const data = parsed.data;

  let jobId: number | null = null;
  if (data.job) {
    const [job] = await db
      .select({ id: jobs.id })
      .from(jobs)
      .where(and(eq(jobs.code, data.job), eq(jobs.status, 'published')))
      .limit(1);
    if (!job) {
      return {
        errors: { job: 'This position is no longer open. Choose another one or send a general application.' },
        values: { ...values, job: '' },
        message: 'Please check the highlighted fields.',
      };
    }
    jobId = job.id;
  }

  try {
    await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(applications)
        .values({
          jobId,
          fullName: data.fullName,
          email: data.email.toLowerCase(),
          passportCountry: data.passportCountry,
          position: data.position,
          regions: data.regions,
          experience: data.experience,
          introduction: data.introduction,
          lang: data.lang,
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
