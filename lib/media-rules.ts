// Upload rules shared by the browser (checks and resizing before upload) and the server (the real
// checks, lib/actions/media.ts). No imports, so client components can use it.

/**
 * Largest upload. Vercel refuses request bodies over 4.5 MB, so uploads stay below that; bigger photos
 * are scaled down in the browser first (components/admin/media-upload.ts).
 */
export const MEDIA_MAX_BYTES = 4 * 1024 * 1024;

/** Photos wider or taller than this are scaled down in the browser before upload. */
export const MEDIA_MAX_SIDE = 2400;

/** Accepted image types and the file extension each is stored with. SVG is left out: it can carry scripts. */
export const MEDIA_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
} as const;
export type MediaMimeType = keyof typeof MEDIA_TYPES;

export const MEDIA_ACCEPT = Object.keys(MEDIA_TYPES).join(',');

export const isMediaType = (type: string): type is MediaMimeType => type in MEDIA_TYPES;

/** "1.2 MB", "840 KB". */
export function fmtBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
