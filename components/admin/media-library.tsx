'use client';

import { Check, Copy } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { deleteMedia, saveMediaAlt, type MediaActionState } from '@/lib/actions/media';
import type { MediaItem } from '@/lib/admin/queries';
import { fmtBytes } from '@/lib/media-rules';
import { MediaDropzone } from './media-dropzone';
import { alertError, button, cx, input } from './styles';
import { fmtDate } from './ui';

/** Upload area of the media page: the grid below reloads after each upload. */
export function MediaUploader() {
  const router = useRouter();
  return <MediaDropzone onUploaded={() => router.refresh()} />;
}

/** Full address of a file, for pasting elsewhere. */
const absolute = (url: string) => new URL(url, window.location.origin).href;

function CopyUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={button('default', 'sm')}
      onClick={async () => {
        await navigator.clipboard.writeText(absolute(url));
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      {copied ? 'Copied' : 'Copy URL'}
    </button>
  );
}

export function MediaCard({ item }: { item: MediaItem }) {
  const [altState, saveAlt, savingAlt] = useActionState<MediaActionState, FormData>(saveMediaAlt, {});
  const [deleteState, remove, deleting] = useActionState<MediaActionState, FormData>(deleteMedia, {});
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    if (altState.ok) setEditing(false);
  }, [altState]);

  return (
    <li className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <a
        href={item.url}
        target="_blank"
        rel="noopener"
        className="block aspect-4/3 bg-[repeating-conic-gradient(#f1f5f9_0_25%,#fff_0_50%)] bg-size-[16px_16px]"
      >
        <img src={item.url} alt={item.alt} loading="lazy" className="size-full object-contain" />
      </a>
      <div className="grid flex-1 content-start gap-1 border-t border-slate-200 p-3 text-label">
        <p className="truncate font-semibold text-slate-900" title={item.filename}>
          {item.filename}
        </p>
        <p className="text-xs text-slate-500">
          {[
            item.width && item.height ? `${item.width}×${item.height}` : '',
            fmtBytes(item.size),
            fmtDate(item.createdAt),
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
        <p className={cx('text-xs', item.alt ? 'text-slate-600' : 'text-amber-700')}>
          {item.alt ? `Alt: ${item.alt}` : 'No alt text'}
        </p>
        <p className="text-xs text-slate-500">
          {item.usedIn.length ? (
            <>
              Used in{' '}
              {item.usedIn.map((post, i) => (
                <span key={post.id}>
                  {i > 0 && ', '}
                  <Link href={`/admin/blog/${post.id}/`}>{post.title}</Link>
                </span>
              ))}
            </>
          ) : (
            'Not used in any post'
          )}
        </p>
      </div>
      <div className="grid gap-2 border-t border-slate-200 p-3">
        <div className="flex flex-wrap gap-1.5">
          <CopyUrl url={item.url} />
          <button
            type="button"
            className={button('default', 'sm')}
            aria-expanded={editing}
            onClick={() => setEditing((v) => !v)}
          >
            Edit alt
          </button>
          <form
            action={remove}
            className="ml-auto"
            onSubmit={(e) => {
              if (!window.confirm(`Delete ${item.filename}? This can't be undone.`)) e.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={item.id} />
            <button className={button('dangerGhost', 'sm')} disabled={deleting}>
              Delete
            </button>
          </form>
        </div>
        {editing && (
          <form action={saveAlt} className="grid gap-1.5">
            <input type="hidden" name="id" value={item.id} />
            <textarea
              name="alt"
              rows={2}
              maxLength={300}
              defaultValue={item.alt}
              autoFocus
              aria-label="Alt text"
              placeholder="What the image shows, for screen readers and search engines"
              className={cx(input, 'resize-y text-label')}
            />
            <span>
              <button className={button('primary', 'sm')} disabled={savingAlt}>
                Save alt text
              </button>
            </span>
          </form>
        )}
        {altState.error && <p className={cx(alertError, 'text-xs')}>{altState.error}</p>}
        {deleteState.error && <p className={cx(alertError, 'text-xs')}>{deleteState.error}</p>}
      </div>
    </li>
  );
}
