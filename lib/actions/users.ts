'use server';

import { and, count, eq, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import { requireAdmin } from '@/lib/auth/dal';
import { hashPassword, passwordProblem } from '@/lib/auth/password';
import { db } from '@/lib/db';
import { USER_ROLES, sessions, users } from '@/lib/db/schema';

export type UserFormState = { ok?: string; error?: string };

const CreateSchema = z.object({
  email: z.email({ error: 'Enter a valid email address.' }).trim().toLowerCase().max(255),
  name: z.string().trim().min(1, { error: 'Enter a name.' }).max(120),
  role: z.enum(USER_ROLES),
  password: z.string(),
});

export async function createUser(_prev: UserFormState, formData: FormData): Promise<UserFormState> {
  await requireAdmin();
  const parsed = CreateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { email, name, role, password } = parsed.data;
  const problem = passwordProblem(password);
  if (problem) return { error: `Password: ${problem}` };

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) return { error: 'A user with this email already exists.' };

  await db.insert(users).values({ email, name, role, passwordHash: await hashPassword(password) });
  revalidatePath('/admin/users/');
  return { ok: `Added ${email}.` };
}

async function otherAdminCount(userId: number) {
  const [{ value }] = await db
    .select({ value: count() })
    .from(users)
    .where(and(eq(users.role, 'admin'), ne(users.id, userId)));
  return value;
}

export async function updateUserRole(_prev: UserFormState, formData: FormData): Promise<UserFormState> {
  const admin = await requireAdmin();
  const id = Number(formData.get('id'));
  const role = z.enum(USER_ROLES).parse(formData.get('role'));
  if (id === admin.id && role !== 'admin') return { error: "You can't remove your own admin access." };
  if (role !== 'admin' && (await otherAdminCount(id)) === 0) return { error: 'There must be at least one admin.' };

  await db.update(users).set({ role }).where(eq(users.id, id));
  // A demoted admin is signed out everywhere.
  if (role !== 'admin') await db.delete(sessions).where(eq(sessions.userId, id));
  revalidatePath('/admin/users/');
  return { ok: 'Role updated.' };
}

export async function resetUserPassword(_prev: UserFormState, formData: FormData): Promise<UserFormState> {
  const admin = await requireAdmin();
  const id = Number(formData.get('id'));
  const password = String(formData.get('password') ?? '');
  const problem = passwordProblem(password);
  if (problem) return { error: problem };

  await db
    .update(users)
    .set({ passwordHash: await hashPassword(password) })
    .where(eq(users.id, id));
  // Sign the user out of other sessions (keep the current admin's own session).
  if (id !== admin.id) await db.delete(sessions).where(eq(sessions.userId, id));
  revalidatePath('/admin/users/');
  return { ok: 'Password changed.' };
}

export async function deleteUser(_prev: UserFormState, formData: FormData): Promise<UserFormState> {
  const admin = await requireAdmin();
  const id = Number(formData.get('id'));
  if (id === admin.id) return { error: "You can't delete your own account." };
  if ((await otherAdminCount(id)) === 0) return { error: 'There must be at least one admin.' };

  await db.delete(users).where(eq(users.id, id));
  revalidatePath('/admin/users/');
  return { ok: 'User deleted.' };
}
