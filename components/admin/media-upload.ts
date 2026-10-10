'use client';

import { uploadMedia, type UploadResult } from '@/lib/actions/media';
import { MEDIA_MAX_BYTES, MEDIA_MAX_SIDE, fmtBytes, isMediaType } from '@/lib/media-rules';

const canvasBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

/**
 * Scales big photos down to MEDIA_MAX_SIDE and re-encodes them, so camera photos fit under the upload
 * limit. Small images and GIFs (which would lose their animation) are sent as they are.
 */
async function prepareImage(file: File): Promise<File> {
  if (!isMediaType(file.type)) throw new Error(`${file.name}: use a JPEG, PNG, WebP, GIF or AVIF image.`);
  const tooBig = () =>
    new Error(`${file.name} is ${fmtBytes(file.size)}. Images can be up to ${fmtBytes(MEDIA_MAX_BYTES)}.`);
  if (file.type === 'image/gif') {
    if (file.size > MEDIA_MAX_BYTES) throw tooBig();
    return file;
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    // The browser can't decode it (e.g. AVIF in an older browser): let the server decide.
    if (file.size > MEDIA_MAX_BYTES) throw tooBig();
    return file;
  }
  const scale = Math.min(1, MEDIA_MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= MEDIA_MAX_BYTES) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  // Photos stay JPEG; anything that may be transparent becomes WebP.
  const type = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/webp';
  for (const quality of [0.86, 0.75, 0.6]) {
    const blob = await canvasBlob(canvas, type, quality);
    if (blob && blob.size <= MEDIA_MAX_BYTES) {
      const name = file.name.replace(/\.[^.]*$/, '') + (type === 'image/jpeg' ? '.jpg' : '.webp');
      return new File([blob], name, { type });
    }
  }
  throw tooBig();
}

/** Uploads one image to the media library. Never throws: problems come back as `error`. */
export async function uploadImage(file: File, alt = ''): Promise<UploadResult> {
  try {
    const data = new FormData();
    data.set('file', await prepareImage(file));
    data.set('alt', alt);
    return await uploadMedia(data);
  } catch (error) {
    return { error: error instanceof Error && error.message ? error.message : `${file.name} could not be uploaded.` };
  }
}
