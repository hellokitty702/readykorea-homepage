import 'server-only';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { readSessionUser } from './session';

export type SessionUser = NonNullable<Awaited<ReturnType<typeof readSessionUser>>>;

/** Current user, read once per request. */
export const getCurrentUser = cache(readSessionUser);

/**
 * Every admin page and Server Action calls this first. The proxy only checks that a cookie exists;
 * this is the real check (valid session + admin role).
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login/');
  if (user.role !== 'admin') redirect('/admin/login/?error=forbidden');
  return user;
}

/** False until the first admin signs up on /admin/login/; after that the page only signs in. */
export async function adminExists(): Promise<boolean> {
  const [row] = await db.select({ id: users.id }).from(users).where(eq(users.role, 'admin')).limit(1);
  return Boolean(row);
}
