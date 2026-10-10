import 'server-only';
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
 * this is the real check (valid session). Every account is the admin, so there is no role to check.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login/');
  return user;
}

/** False until the admin signs up on /admin/login/; after that the page only signs in. */
export async function adminExists(): Promise<boolean> {
  const [row] = await db.select({ id: users.id }).from(users).limit(1);
  return Boolean(row);
}
