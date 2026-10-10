'use client';

import Link from 'next/link';
import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from 'react';
import { setPostsStatus, type BulkPostState } from '@/lib/actions/posts';
import { alertError, alertOk, badge, button, cx, muted, small, strong, table } from './styles';
import { PostStatusBadge, fmtDate } from './ui';

type Row = {
  id: number;
  title: string;
  status: 'draft' | 'published';
  isFeatured: boolean;
  publishedAt: Date | null;
  updatedAt: Date;
  category: string | null;
  tags: string[];
};

const checkbox = 'size-4 cursor-pointer accent-blue-700 align-middle';

/** Post list with checkboxes: publish or unpublish the selected posts at once. */
export function PostTable({ rows }: { rows: Row[] }) {
  const [state, action, pending] = useActionState<BulkPostState, FormData>(setPostsStatus, {});
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const all = useRef<HTMLInputElement>(null);

  // Only posts still in the list count (one may have left this tab after a change).
  const selected = rows.filter((r) => picked.has(r.id));
  const allPicked = rows.length > 0 && selected.length === rows.length;
  useEffect(() => {
    if (all.current) all.current.indeterminate = selected.length > 0 && !allPicked;
  }, [selected.length, allPicked]);
  useEffect(() => {
    if (state.ok) setPicked(new Set());
  }, [state]);

  const toggle = (id: number) =>
    setPicked((set) => {
      const next = new Set(set);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter;
    const data = new FormData(e.currentTarget, submitter);
    const n = selected.length;
    const what = `${n} ${n === 1 ? 'post' : 'posts'}`;
    const message =
      data.get('status') === 'published'
        ? `Publish ${what}? They appear on the blog right away.`
        : `Move ${what} to drafts? They disappear from the blog until published again.`;
    if (!window.confirm(message)) return;
    startTransition(() => action(data));
  };

  return (
    <>
      {state.error && <p className={alertError}>{state.error}</p>}
      {state.ok && <p className={alertOk}>{state.ok}</p>}

      {selected.length > 0 && (
        <form
          onSubmit={onSubmit}
          className="sticky top-14 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2.5 lg:top-3"
          aria-label="Selected posts"
        >
          {selected.map((r) => (
            <input key={r.id} type="hidden" name="ids" value={r.id} />
          ))}
          <span className="mr-auto font-semibold text-blue-900">{selected.length} selected</span>
          <button className={button('primary', 'sm')} name="status" value="published" disabled={pending}>
            Publish
          </button>
          <button className={button('default', 'sm')} name="status" value="draft" disabled={pending}>
            Move to draft
          </button>
          <button type="button" className={button('ghost', 'sm')} onClick={() => setPicked(new Set())}>
            Clear
          </button>
        </form>
      )}

      <section className="relative min-w-0 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className={table()}>
          <thead>
            <tr>
              <th className="w-px pr-0!">
                <input
                  ref={all}
                  type="checkbox"
                  className={checkbox}
                  checked={allPicked}
                  onChange={() => setPicked(allPicked ? new Set() : new Set(rows.map((r) => r.id)))}
                  aria-label="Select all posts"
                />
              </th>
              <th>Post</th>
              <th>Status</th>
              <th className="max-sm:hidden">Published</th>
              <th className="max-md:hidden">Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((post) => (
              <tr key={post.id} className={cx(picked.has(post.id) && '[&_td]:bg-blue-50/60')}>
                <td className="pr-0!">
                  <input
                    type="checkbox"
                    className={checkbox}
                    checked={picked.has(post.id)}
                    onChange={() => toggle(post.id)}
                    aria-label={`Select “${post.title}”`}
                  />
                </td>
                <td>
                  <Link className={strong} href={`/admin/blog/${post.id}/`}>
                    {post.title}
                  </Link>
                  <div className={cx(muted, small)}>
                    {[post.category ?? 'No category', post.tags.map((t) => `#${t}`).join(' ')]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                </td>
                <td>
                  <span className="flex flex-wrap gap-1.5">
                    <PostStatusBadge status={post.status} />
                    {post.isFeatured && <span className={cx(badge, 'bg-amber-100 text-amber-800')}>Featured</span>}
                  </span>
                </td>
                <td className="max-sm:hidden">{fmtDate(post.publishedAt)}</td>
                <td className={cx(muted, 'max-md:hidden')}>{fmtDate(post.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
