import 'server-only';
import { redirect } from 'next/navigation';
import { cache } from 'react';
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
