'use client';

import { LoaderCircle, X } from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { browseMedia } from '@/lib/actions/media';
import type { MediaItem } from '@/lib/admin/queries';
import { MediaDropzone } from './media-dropzone';
import { button, cx, fieldLabel, hint, input } from './styles';

export type PickedImage = { src: string; alt: string; width?: number; height?: number };

/**
 * Image dialog of the post editor: upload a new image or pick one from the media library, give it alt
 * text, insert it. An outside image address still works, for images hosted elsewhere.
 */
export function MediaPicker({
  open,
  onClose,
  onInsert,
}: {
  open: boolean;
  onClose: () => void;
  onInsert: (image: PickedImage) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, startLoading] = useTransition();
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [address, setAddress] = useState('');
  const [alt, setAlt] = useState('');

  const load = (n: number, q: string) =>
    startLoading(async () => {
      const result = await browseMedia(n, q);
      setItems((list) => (n === 1 ? result.items : [...list, ...result.items]));
      setPage(result.page);
      setPages(result.pages);
    });

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      setSelected(null);
      setAddress('');
      setAlt('');
      el.showModal();
      load(1, search);
    } else if (!open && el.open) {
      el.close();
    }
    // Reload only when the dialog opens.
  }, [open]);

  const choose = (item: MediaItem) => {
    setSelected(item);
    setAddress('');
    setAlt(item.alt);
  };

  const src = address.trim() || selected?.url || '';
  const insert = () => {
    if (!src) return;
    onInsert({
      src,
      alt: alt.trim(),
      ...(selected && !address.trim() && selected.width && selected.height
        ? { width: selected.width, height: selected.height }
        : {}),
    });
    onClose();
  };

  // In a portal: the editor sits inside the post form, and the dialog's fields must not submit it.
  return createPortal(
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
      aria-labelledby="media-picker-title"
      className="m-auto w-[min(960px,calc(100vw-24px))] max-w-none rounded-2xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50"
    >
      <div className="flex max-h-[calc(100dvh-24px)] flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3.5 sm:px-5">
          <h2 id="media-picker-title" className="text-md font-bold">
            Insert an image
          </h2>
          <button type="button" className={button('ghost', 'sm')} onClick={onClose} aria-label="Close">
            <X className="size-4" aria-hidden="true" />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-4 py-4 sm:px-5">
          <MediaDropzone
            compact
            onUploaded={(item) => {
              setItems((list) => [item, ...list.filter((i) => i.id !== item.id)]);
              choose(item);
            }}
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-label font-bold tracking-wide text-slate-700 uppercase">Media library</h3>
            <div role="search" className="flex flex-1 gap-1.5 sm:flex-none">
              <input
                type="search"
                className={cx(input, 'min-w-0 flex-1 py-1.5 text-label sm:w-56')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  e.preventDefault();
                  load(1, search);
                }}
                placeholder="Search file name or alt text"
                aria-label="Search media"
              />
              <button type="button" className={button('default', 'sm')} onClick={() => load(1, search)}>
                Search
              </button>
            </div>
          </div>

          {items.length ? (
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] gap-2.5" aria-label="Media library">
              {items.map((item) => {
                const active = selected?.id === item.id && !address.trim();
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => choose(item)}
                      onDoubleClick={() => {
                        choose(item);
                        onInsert({
                          src: item.url,
                          alt: item.alt,
                          ...(item.width && item.height ? { width: item.width, height: item.height } : {}),
                        });
                        onClose();
                      }}
                      aria-pressed={active}
                      title={item.filename}
                      className={cx(
                        'block aspect-square w-full cursor-pointer overflow-hidden rounded-lg border-2 bg-slate-100',
                        active ? 'border-blue-600 ring-2 ring-blue-200' : 'border-transparent hover:border-slate-300',
                      )}
                    >
                      <img
                        src={item.url}
                        alt={item.alt || item.filename}
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="py-6 text-center text-slate-500">
              {loading ? 'Loading…' : search ? 'No images match that search.' : 'No images yet. Upload one above.'}
            </p>
          )}
          {page < pages && (
            <div className="text-center">
              <button
                type="button"
                className={button('default', 'sm')}
                disabled={loading}
                onClick={() => load(page + 1, search)}
              >
                {loading && <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />}
                Show more
              </button>
            </div>
          )}

          <label className="grid gap-1">
            <span className={fieldLabel}>Or use an image address</span>
            <input
              className={cx(input, 'text-label')}
              type="url"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="https://…"
              spellCheck={false}
            />
          </label>
        </div>

        <footer className="grid gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3.5 sm:grid-cols-[auto_1fr_auto] sm:items-end sm:px-5">
          <div className="hidden size-14 overflow-hidden rounded-lg border border-slate-200 bg-white sm:block">
            {src && <img src={src} alt="" className="size-full object-cover" />}
          </div>
          <label className="grid gap-1">
            <span className={fieldLabel}>Alt text</span>
            <input
              className={cx(input, 'text-label')}
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              maxLength={300}
              placeholder="What the image shows (read out by screen readers, used by search engines)"
            />
            <span className={hint}>
              {src ? (selected && !address.trim() ? selected.filename : src) : 'Choose an image first.'}
            </span>
          </label>
          <button type="button" className={button('primary')} disabled={!src} onClick={insert}>
            Insert image
          </button>
        </footer>
      </div>
    </dialog>,
    document.body,
  );
}
