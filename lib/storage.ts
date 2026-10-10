import 'server-only';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { AwsClient } from 'aws4fetch';
import type { MediaDisk } from '@/lib/db/schema';

/**
 * Where uploaded files are kept.
 *
 * - `local` (development): files go to ./storage/ and app/uploads/[...key]/route.ts serves them at /uploads/….
 * - `r2` (production): Cloudflare R2 through its S3 API; the bucket's public URL serves them.
 *
 * STORAGE_DRIVER picks one; without it, R2 is used when R2_BUCKET is set.
 */
export type Storage = {
  disk: MediaDisk;
  /** Public address of a stored file. */
  url(key: string): string;
  put(key: string, body: Uint8Array, contentType: string): Promise<void>;
  remove(key: string): Promise<void>;
};

/** Upload keys never change, so the files can be cached for good. */
export const CACHE_CONTROL = 'public, max-age=31536000, immutable';

export const LOCAL_STORAGE_DIR = path.join(process.cwd(), 'storage');

/** Resolves a key inside ./storage/, refusing anything that would step outside it. */
export function localPath(key: string) {
  const file = path.resolve(LOCAL_STORAGE_DIR, key);
  if (!file.startsWith(LOCAL_STORAGE_DIR + path.sep)) throw new Error(`Invalid media key: ${key}`);
  return file;
}

const local: Storage = {
  disk: 'local',
  url: (key) => `/${key}`,
  async put(key, body) {
    const file = localPath(key);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, body, { flag: 'wx' });
  },
  async remove(key) {
    await rm(localPath(key), { force: true });
  },
};

export const readLocalFile = (key: string) => readFile(localPath(key));

function r2(): Storage {
  const env = (name: string) => {
    const value = process.env[name]?.trim();
    if (!value) throw new Error(`${name} is not set. See .env.example (media storage).`);
    return value;
  };
  const bucket = env('R2_BUCKET');
  const endpoint = `https://${env('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com/${bucket}`;
  const publicUrl = env('R2_PUBLIC_URL').replace(/\/+$/, '');
  const client = new AwsClient({
    accessKeyId: env('R2_ACCESS_KEY_ID'),
    secretAccessKey: env('R2_SECRET_ACCESS_KEY'),
    service: 's3',
    region: 'auto',
  });
  const send = async (key: string, init: RequestInit) => {
    const res = await client.fetch(`${endpoint}/${key}`, init);
    if (!res.ok && res.status !== 404) {
      throw new Error(`R2 ${init.method} ${key} failed: ${res.status} ${(await res.text()).slice(0, 300)}`);
    }
  };

  return {
    disk: 'r2',
    url: (key) => `${publicUrl}/${key}`,
    put: (key, body, contentType) =>
      send(key, {
        method: 'PUT',
        body: body as BodyInit,
        headers: { 'Content-Type': contentType, 'Cache-Control': CACHE_CONTROL },
      }),
    remove: (key) => send(key, { method: 'DELETE' }),
  };
}

let r2Storage: Storage | undefined;
const getR2 = () => (r2Storage ??= r2());

/** Storage for new uploads. */
export function getStorage(): Storage {
  const driver = process.env.STORAGE_DRIVER?.trim() || (process.env.R2_BUCKET ? 'r2' : 'local');
  if (driver !== 'local' && driver !== 'r2') throw new Error(`Unknown STORAGE_DRIVER "${driver}" (use local or r2).`);
  return driver === 'r2' ? getR2() : local;
}

/** The storage a file was written to, which can differ from the current one (e.g. files uploaded in dev). */
export const storageFor = (disk: MediaDisk): Storage => (disk === 'r2' ? getR2() : local);
