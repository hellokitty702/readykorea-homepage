'use client';

import { CircleAlert, ImageUp, LoaderCircle } from 'lucide-react';
import { useId, useState, type DragEvent } from 'react';
import type { MediaItem } from '@/lib/admin/queries';
import { MEDIA_ACCEPT, MEDIA_MAX_BYTES, fmtBytes } from '@/lib/media-rules';
import { uploadImage } from './media-upload';
import { cx } from './styles';

type Job = { id: number; name: string; error?: string };
let nextJobId = 1;

/**
 * Drop area / file picker that uploads images to the media library one by one. `onUploaded` runs for
 * each stored image; failed files stay listed with the reason.
 */
export function MediaDropzone({
  onUploaded,
  multiple = true,
  compact = false,
}: {
  onUploaded: (item: MediaItem) => void;
  multiple?: boolean;
  compact?: boolean;
}) {
  const inputId = useId();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [dragging, setDragging] = useState(false);
  const busy = jobs.some((j) => !j.error);

  async function upload(files: File[]) {
    const queued = (multiple ? files : files.slice(0, 1)).map((file) => ({ file, id: nextJobId++ }));
    if (!queued.length) return;
    setJobs((list) => [...list.filter((j) => !j.error), ...queued.map(({ id, file }) => ({ id, name: file.name }))]);
    for (const { file, id } of queued) {
      const result = await uploadImage(file);
      if (result.media) {
        setJobs((list) => list.filter((j) => j.id !== id));
        onUploaded(result.media);
      } else {
        setJobs((list) => list.map((j) => (j.id === id ? { ...j, error: result.error } : j)));
      }
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    upload([...e.dataTransfer.files]);
  };

  return (
    <div className="grid gap-2">
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cx(
          'flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed text-center transition-colors',
          compact ? 'px-4 py-4' : 'flex-col px-6 py-9',
          dragging
            ? 'border-blue-600 bg-blue-50'
            : 'border-slate-300 bg-slate-50/60 hover:border-slate-400 hover:bg-slate-50',
        )}
      >
        {busy ? (
          <LoaderCircle className="size-6 shrink-0 animate-spin text-blue-700" aria-hidden="true" />
        ) : (
          <ImageUp className="size-6 shrink-0 text-slate-500" aria-hidden="true" />
        )}
        <span className={compact ? 'text-left' : ''}>
          <span className="block font-semibold text-slate-800">
            {busy
              ? 'Uploading…'
              : dragging
                ? 'Drop to upload'
                : `Drop ${multiple ? 'images' : 'an image'} here or click to choose`}
          </span>
          <span className="block text-xs text-slate-500">
            JPEG, PNG, WebP, GIF or AVIF, up to {fmtBytes(MEDIA_MAX_BYTES)}. Large photos are scaled down first.
          </span>
        </span>
        <input
          id={inputId}
          type="file"
          accept={MEDIA_ACCEPT}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => {
            upload([...(e.target.files ?? [])]);
            e.target.value = '';
          }}
        />
      </label>

      {jobs.length > 0 && (
        <ul className="grid gap-1 text-label" aria-live="polite">
          {jobs.map((job) => (
            <li key={job.id} className={cx('flex items-start gap-2', job.error ? 'text-red-700' : 'text-slate-600')}>
              {job.error ? (
                <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              ) : (
                <LoaderCircle className="mt-0.5 size-4 shrink-0 animate-spin" aria-hidden="true" />
              )}
              <span className="min-w-0 wrap-anywhere">{job.error ?? `Uploading ${job.name}…`}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
