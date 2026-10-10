'use server';

import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { createSession, deleteSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export type LoginState = { error?: string; email?: string };

// Compared against when the email is unknown, so both cases take the same time.
const dummyHash = hashPassword('not-a-real-password');

/** Only allow redirects back into the admin panel. */
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === 'string' ? value : '';
  return next.startsWith('/admin') && !next.startsWith('/admin/login') && !next.includes('//') ? next : '/admin/';
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { error: 'Enter your email and password.', email };

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const valid = await verifyPassword(password, user?.passwordHash ?? (await dummyHash));
  if (!user || !valid) return { error: 'Email or password is incorrect.', email };
  if (user.role !== 'admin') return { error: 'This account does not have admin access.', email };

  await createSession(user.id);
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
  redirect(safeNext(formData.get('next')));
}

export async function logout() {
  await deleteSession();
  redirect('/admin/login/');
}
