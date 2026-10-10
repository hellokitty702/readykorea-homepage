import { MEDIA_TYPES } from '@/lib/media-rules';
import { CACHE_CONTROL, readLocalFile } from '@/lib/storage';

/** File extension → type, for the files the admin panel stores. */
const TYPES = Object.fromEntries(Object.entries(MEDIA_TYPES).map(([type, ext]) => [ext, type]));

/**
 * Serves media uploaded with the local storage driver (development). In production the files live in
 * R2 and posts link to the bucket's public URL, so nothing is found here.
 */
export async function GET(_request: Request, { params }: RouteContext<'/uploads/[...key]'>) {
  const { key } = await params;
  const type = TYPES[key.at(-1)?.split('.').pop()?.toLowerCase() ?? ''];
  if (!type) return new Response('Not found', { status: 404 });
  try {
    const file = await readLocalFile(['uploads', ...key].join('/'));
    return new Response(new Uint8Array(file), {
      headers: { 'Content-Type': type, 'Cache-Control': CACHE_CONTROL, 'X-Content-Type-Options': 'nosniff' },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
