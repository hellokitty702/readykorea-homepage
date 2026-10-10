// Creates the admin account, or resets it when it already exists (new email, name and password).
// The panel has a single account, so this never adds a second one.
// Usage: bun run admin:create <email> "<name>"
// The password comes from ADMIN_PASSWORD, or a random one is generated and printed once.
import './env';
import { randomBytes } from 'node:crypto';
import { asc, eq } from 'drizzle-orm';
import { hashPassword, passwordProblem } from '@/lib/auth/password';
import { db, sql } from '@/lib/db';
import { sessions, users } from '@/lib/db/schema';

const [emailArg, ...nameParts] = process.argv.slice(2);
const email = emailArg?.trim().toLowerCase();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Usage: bun run admin:create <email> "<name>"');
  process.exit(1);
}
const name = nameParts.join(' ').trim() || email.split('@')[0];
const generated = !process.env.ADMIN_PASSWORD;
const password = process.env.ADMIN_PASSWORD ?? randomBytes(12).toString('base64url');
const problem = passwordProblem(password);
if (problem) {
  console.error(`ADMIN_PASSWORD: ${problem}`);
  process.exit(1);
}

const passwordHash = await hashPassword(password);
const [existing] = await db.select({ id: users.id }).from(users).orderBy(asc(users.id)).limit(1);
if (existing) {
  await db.update(users).set({ email, name, passwordHash }).where(eq(users.id, existing.id));
  // Sign out everywhere: whoever held the old password loses access.
  await db.delete(sessions).where(eq(sessions.userId, existing.id));
} else {
  await db.insert(users).values({ email, name, passwordHash });
}

console.log(`Admin ready: ${email}`);
if (generated) console.log(`Password: ${password}\n(Shown once. Change it in Admin → Account after signing in.)`);
await sql.end();
