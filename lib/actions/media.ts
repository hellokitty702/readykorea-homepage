'use server';

import { randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { imageSize } from 'image-size';
import { revalidatePath } from 'next/cache';
import { listMedia, mediaUsage, type MediaItem } from '@/lib/admin/queries';
import { requireAdmin } from '@/lib/auth/dal';
import { db } from '@/lib/db';
import { media } from '@/lib/db/schema';
import { MEDIA_MAX_BYTES, MEDIA_TYPES, fmtBytes, type MediaMimeType } from '@/lib/media-rules';
import { slugify } from '@/lib/slug';
import { getStorage, storageFor } from '@/lib/storage';

export type UploadResult = { media: MediaItem; error?: never } | { error: string; media?: never };
export type MediaActionState = { error?: string; ok?: string };

/** image-size's name for each accepted format. */
const DETECTED: Record<string, MediaMimeType> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
};

/** uploads/2026/10/classroom-k3x9qa.jpg: readable, and never the same twice. */
function newKey(filename: string, ext: string) {
  const now = new Date();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const name =
    slugify(filename.replace(/\.[^.]*$/, ''))
      .slice(0, 60)
      .replace(/-+$/, '') || 'image';
  return `uploads/${now.getUTCFullYear()}/${month}/${name}-${randomBytes(4).toString('hex')}.${ext}`;
}

/** Stores an image and adds it to the media library. FormData: `file`, optional `alt`. */
export async function uploadMedia(formData: FormData): Promise<UploadResult> {
  const admin = await requireAdmin();
  const file = formData.get('file');
  if (!(file instanceof File) || !file.size) return { error: 'Choose an image to upload.' };
  if (file.size > MEDIA_MAX_BYTES) {
    return { error: `${file.name} is ${fmtBytes(file.size)}. Images can be up to ${fmtBytes(MEDIA_MAX_BYTES)}.` };
  }
  const bytes = new Uint8Array(await file.arrayBuffer());

  // The file's content decides its type, not its name or the browser's guess.
  let info: ReturnType<typeof imageSize>;
  try {
    info = imageSize(bytes);
  } catch {
    return { error: `${file.name} is not an image this site can show (use JPEG, PNG, WebP, GIF or AVIF).` };
  }
  const mimeType = DETECTED[info.type ?? ''];
  if (!mimeType) return { error: `${file.name}: use JPEG, PNG, WebP, GIF or AVIF.` };
  // Phone photos taken upright are stored sideways with an EXIF note (orientation 5–8) to rotate them.
  const rotated = (info.orientation ?? 1) >= 5;

  const storage = getStorage();
  const key = newKey(file.name, MEDIA_TYPES[mimeType]);
  try {
    await storage.put(key, bytes, mimeType);
  } catch (error) {
    console.error('Media upload failed', error);
    return { error: 'The file could not be stored. Try again, or check the storage settings.' };
  }

  try {
    const [row] = await db
      .insert(media)
      .values({
        disk: storage.disk,
        key,
        url: storage.url(key),
        filename: file.name.slice(0, 255),
        mimeType,
        size: bytes.byteLength,
        width: (rotated ? info.height : info.width) || null,
        height: (rotated ? info.width : info.height) || null,
        alt: String(formData.get('alt') ?? '')
          .trim()
          .slice(0, 300),
        uploadedById: admin.id,
      })
      .returning();
    revalidatePath('/admin/media/');
    return { media: { ...row, usedIn: [] } };
  } catch (error) {
    await storage.remove(key).catch(() => {});
    throw error;
  }
}

/** One page of the library, newest first, for the image picker in the post editor. */
export async function browseMedia(page: number, search = '') {
  await requireAdmin();
  return listMedia({ page: Math.max(1, Math.floor(page) || 1), search: search.slice(0, 100) });
}

/** Saves the default alt text of a library image. FormData: `id`, `alt`. */
export async function saveMediaAlt(_prev: MediaActionState, formData: FormData): Promise<MediaActionState> {
  await requireAdmin();
  const id = Number(formData.get('id'));
  const alt = String(formData.get('alt') ?? '').trim();
  if (alt.length > 300) return { error: 'Keep the description under 300 characters.' };
  await db.update(media).set({ alt }).where(eq(media.id, id));
  revalidatePath('/admin/media/');
  return { ok: 'Saved.' };
}

/** Deletes an image that no post uses. FormData: `id`. */
export async function deleteMedia(_prev: MediaActionState, formData: FormData): Promise<MediaActionState> {
  await requireAdmin();
  const [row] = await db
    .select()
    .from(media)
    .where(eq(media.id, Number(formData.get('id'))));
  if (!row) return { ok: 'Deleted.' };

  const usedIn = (await mediaUsage([row.url])).get(row.url) ?? [];
  if (usedIn.length) {
    const titles = usedIn.map((p) => `“${p.title}”`).join(', ');
    return {
      error: `Still used in ${titles}. Remove it from ${usedIn.length > 1 ? 'those posts' : 'that post'} first.`,
    };
  }

  try {
    await storageFor(row.disk).remove(row.key);
  } catch (error) {
    console.error('Media delete failed', error);
    return { error: 'The file could not be removed from storage. Try again.' };
  }
  await db.delete(media).where(eq(media.id, row.id));
  revalidatePath('/admin/media/');
  return { ok: 'Deleted.' };
}
