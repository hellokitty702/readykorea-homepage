import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { and, eq, gt, lt, ne } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { sessions, users } from '@/lib/db/schema';

export const SESSION_COOKIE = 'rk_session';
const SESSION_DAYS = 7;

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

/** Starts a session for the user and sets the cookie. Server Actions / Route Handlers only. */
export async function createSession(userId: number) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt });
  // Tidy up this user's expired sessions while we're here.
  await db.delete(sessions).where(and(eq(sessions.userId, userId), lt(sessions.expiresAt, new Date())));

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

/** The signed-in user for the current request, or null. */
export async function readSessionUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [row] = await db
    .select({ id: users.id, email: users.email, name: users.name })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, hashToken(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return row ?? null;
}

/** Ends the user's sessions on other devices, keeping the current one. Server Actions only. */
export async function deleteOtherSessions(userId: number) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const mine = eq(sessions.userId, userId);
  await db.delete(sessions).where(token ? and(mine, ne(sessions.id, hashToken(token))) : mine);
}

/** Ends the current session and clears the cookie. Server Actions / Route Handlers only. */
export async function deleteSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  store.delete(SESSION_COOKIE);
}
