'use server';

import { eq, sql } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import * as z from 'zod';
import { hashPassword, passwordProblem, verifyPassword } from '@/lib/auth/password';
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

  await createSession(user.id);
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
  redirect(safeNext(formData.get('next')));
}

export type SignupState = { error?: string; email?: string; name?: string };

const SignupSchema = z.object({
  name: z.string().trim().min(1, { error: 'Enter your name.' }).max(120),
  email: z.email({ error: 'Enter a valid email address.' }).trim().toLowerCase().max(255),
  password: z.string(),
});

/**
 * Creates the admin account and signs it in. Only works while no account exists; once one does,
 * /admin/login/ only signs in. The panel has a single account (no staff accounts).
 */
export async function signupFirstAdmin(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const fields = { email: String(formData.get('email') ?? ''), name: String(formData.get('name') ?? '') };
  const parsed = SignupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message, ...fields };
  const { name, email, password } = parsed.data;
  const problem = passwordProblem(password);
  if (problem) return { error: `Password: ${problem}`, ...fields };
  const passwordHash = await hashPassword(password);

  const result = await db.transaction(async (tx) => {
    // One signup at a time, so two people can't both become the admin.
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext('first-admin-signup'))`);
    const [existing] = await tx.select({ id: users.id }).from(users).limit(1);
    if (existing) return 'closed' as const;
    const [user] = await tx
      .insert(users)
      .values({ email, name, passwordHash, lastLoginAt: new Date() })
      .returning({ id: users.id });
    return user;
  });

  if (result === 'closed') redirect('/admin/login/?error=setup-closed');
  else await createSession(result.id);
  redirect('/admin/');
}

export async function logout() {
  await deleteSession();
  redirect('/admin/login/');
}
