'use server';

import { and, eq, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import { requireAdmin } from '@/lib/auth/dal';
import { hashPassword, passwordProblem, verifyPassword } from '@/lib/auth/password';
import { deleteOtherSessions } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export type AccountFormState = { ok?: string; error?: string };

const ProfileSchema = z.object({
  name: z.string().trim().min(1, { error: 'Enter your name.' }).max(120),
  email: z.email({ error: 'Enter a valid email address.' }).trim().toLowerCase().max(255),
});

export async function updateProfile(_prev: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const admin = await requireAdmin();
  const parsed = ProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, email } = parsed.data;

  const [taken] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.email, email), ne(users.id, admin.id)))
    .limit(1);
  if (taken) return { error: 'Another account already uses this email.' };

  await db.update(users).set({ name, email }).where(eq(users.id, admin.id));
  revalidatePath('/admin/', 'layout');
  return { ok: 'Saved.' };
}

export async function changePassword(_prev: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const admin = await requireAdmin();
  const current = String(formData.get('current') ?? '');
  const password = String(formData.get('password') ?? '');

  const [row] = await db.select({ passwordHash: users.passwordHash }).from(users).where(eq(users.id, admin.id));
  if (!row || !(await verifyPassword(current, row.passwordHash))) return { error: 'Current password is incorrect.' };
  const problem = passwordProblem(password);
  if (problem) return { error: `New password: ${problem}` };

  await db
    .update(users)
    .set({ passwordHash: await hashPassword(password) })
    .where(eq(users.id, admin.id));
  // Signed out everywhere else; this browser stays signed in.
  await deleteOtherSessions(admin.id);
  return { ok: 'Password changed. Other devices were signed out.' };
}
