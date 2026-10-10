'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as z from 'zod';
import { canMove } from '@/lib/application-flow';
import { requireAdmin } from '@/lib/auth/dal';
import { db } from '@/lib/db';
import { APPLICATION_STATUSES, applicationEvents, applications } from '@/lib/db/schema';

const noteOf = (formData: FormData) =>
  String(formData.get('note') ?? '')
    .trim()
    .slice(0, 4000);

/** Moves an application along the hiring flow (see lib/application-flow.ts), with an optional note. */
export async function changeApplicationStatus(formData: FormData) {
  const admin = await requireAdmin();
  const id = Number(formData.get('id'));
  const to = z.enum(APPLICATION_STATUSES).parse(formData.get('to'));

  const moved = await db.transaction(async (tx) => {
    // Lock the row so two admins can't move it at the same time.
    const [app] = await tx
      .select({ status: applications.status })
      .from(applications)
      .where(eq(applications.id, id))
      .for('update');
    if (!app || !canMove(app.status, to)) return false;
    await tx.update(applications).set({ status: to }).where(eq(applications.id, id));
    await tx.insert(applicationEvents).values({
      applicationId: id,
      type: 'status_changed',
      fromStatus: app.status,
      toStatus: to,
      note: noteOf(formData),
      userId: admin.id,
    });
    return true;
  });

  revalidatePath(`/admin/applications/${id}/`);
  if (!moved) redirect(`/admin/applications/${id}/?error=stale`);
}

export async function addApplicationNote(formData: FormData) {
  const admin = await requireAdmin();
  const id = Number(formData.get('id'));
  const note = noteOf(formData);
  if (!note) return;
  await db.insert(applicationEvents).values({ applicationId: id, type: 'note', note, userId: admin.id });
  // Bump updated_at so the list shows recent activity.
  await db.update(applications).set({ updatedAt: new Date() }).where(eq(applications.id, id));
  revalidatePath(`/admin/applications/${id}/`);
}
