'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { cx, toolbarPlaceholder } from './styles';

/**
 * Tiptap runs in the browser only: it renders nothing on the server anyway, and its table plugin
 * fails when the server bundle loads it twice ("Duplicate use of selection JSON ID cell").
 */
const TiptapEditor = dynamic(() => import('./tiptap-editor').then((m) => m.TiptapEditor), {
  ssr: false,
  loading: () => (
    <>
      <div className={toolbarPlaceholder} />
      <div className="min-h-80 px-4 py-3 text-slate-400">Loading the editor…</div>
    </>
  ),
});

/**
 * Article editor. The HTML goes to the server in a hidden `name` field (present before the editor has
 * loaded, so saving early keeps the article) and is sanitized there (lib/blog-html.ts), so only the
 * formatting offered here ends up on the site.
 */
export function RichTextEditor({
  name,
  defaultValue,
  invalid,
  labelledBy,
}: {
  name: string;
  defaultValue: string;
  invalid?: boolean;
  labelledBy?: string;
}) {
  const [html, setHtml] = useState(defaultValue);
  return (
    <div
      className={cx(
        'overflow-hidden rounded-lg border bg-white focus-within:border-blue-700 focus-within:outline-2 focus-within:outline-blue-300',
        invalid ? 'border-red-700' : 'border-slate-300',
      )}
    >
      <input type="hidden" name={name} value={html} />
      <TiptapEditor defaultValue={defaultValue} labelledBy={labelledBy} onChange={setHtml} />
    </div>
  );
}
