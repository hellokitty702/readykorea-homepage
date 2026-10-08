import { readFileSync } from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), 'content');

/** Reads a file from `content/` at build time (server components only). */
export function readContent(relativePath: string): string {
  return readFileSync(path.join(CONTENT_DIR, relativePath), 'utf8');
}
