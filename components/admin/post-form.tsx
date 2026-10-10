'use client';

import Link from 'next/link';
import { startTransition, useActionState, useState, type FormEvent, type ReactNode } from 'react';
import { savePost, type PostFormState } from '@/lib/actions/posts';
import type { Post } from '@/lib/db/schema';
import { SLUG_MAX, slugify } from '@/lib/slug';
import { Field } from './field';
import { RichTextEditor } from './rich-text-editor';
import { alertError, button, card, cardTitle, cx, fieldError, fieldLabel, input } from './styles';

type EditablePost = Post & { tags: string };

export function PostForm({
  post,
  viewHref,
  asideEnd,
  categories,
  tagSuggestions,
}: {
  post?: EditablePost;
  /** Public address of a published post, linked next to the Publishing heading. */
  viewHref?: string;
  /**
   * Last card of the right column (the Delete card). It sits inside this form, so its buttons must
   * submit their own form through the `form` attribute.
   */
  asideEnd?: ReactNode;
  categories: { id: number; name: string }[];
  tagSuggestions: string[];
}) {
  const [state, action, pending] = useActionState<PostFormState, FormData>(savePost, {});
  const err = (name: string) => state.errors?.[name];
  const invalid = (name: string) => (err(name) ? true : undefined);
  // A blank slug is made from the title on save; the placeholder previews it.
  const [autoSlug, setAutoSlug] = useState(() => slugify(post?.title ?? ''));

  // Submit without React's automatic form reset, so a validation error keeps what was typed.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  };

  return (
    <form
      className="grid gap-4.5"
      onSubmit={onSubmit}
      action={action}
      noValidate
      onInput={(e) => {
        const target = e.target as HTMLInputElement;
        if (target.name === 'title') setAutoSlug(slugify(target.value));
      }}
    >
      {post && <input type="hidden" name="id" value={post.id} />}
      {state.message && (
        <p className={alertError} role="alert">
          {state.message}
        </p>
      )}

      <div className="grid items-start gap-4.5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid min-w-0 gap-4.5">
          <section className={cx(card, 'grid gap-4')}>
            <Field label="Title" htmlFor="title" required error={err('title')}>
              <input
                className={cx(input, 'text-lg font-semibold')}
                id="title"
                name="title"
                defaultValue={post?.title}
                maxLength={200}
                required
                aria-invalid={invalid('title')}
              />
            </Field>
            <div className="grid gap-1.5">
              <span id="body-label" className={fieldLabel}>
                Article
              </span>
              <RichTextEditor
                name="body"
                defaultValue={post?.body ?? ''}
                invalid={Boolean(err('body'))}
                labelledBy="body-label"
              />
              {err('body') && <span className={fieldError}>{err('body')}</span>}
            </div>
          </section>

          <section className={cx(card, 'grid gap-4')}>
            <h2 className={cardTitle}>Summaries</h2>
            <Field
              label="Summary"
              htmlFor="summary"
              error={err('summary')}
              hint="One or two sentences for the blog list. Also used for search results unless an SEO description is set."
            >
              <textarea
                className={cx(input, 'resize-y')}
                id="summary"
                name="summary"
                rows={3}
                maxLength={400}
                defaultValue={post?.summary}
                aria-invalid={invalid('summary')}
              />
            </Field>
            <Field
              label="Homepage teaser"
              htmlFor="teaser"
              error={err('teaser')}
              hint="Short line for the “Latest Posts” cards on the homepage. Leave blank to use the summary."
            >
              <input
                className={input}
                id="teaser"
                name="teaser"
                maxLength={200}
                defaultValue={post?.teaser}
                aria-invalid={invalid('teaser')}
              />
            </Field>
          </section>
        </div>

        <aside className="grid min-w-0 gap-4.5">
          <section className={cx(card, 'grid gap-4')}>
            {/* Same spacing as the other card titles (cardTitle). */}
            <div className="mb-3.5 flex items-center justify-between gap-3">
              <h2 className="text-md font-bold">Publishing</h2>
              {viewHref && (
                <a className={button('default', 'sm')} href={viewHref} target="_blank" rel="noopener">
                  View ↗
                </a>
              )}
            </div>
            <Field label="Status" htmlFor="status">
              <select className={input} id="status" name="status" defaultValue={post?.status ?? 'draft'}>
                <option value="draft">Draft (hidden)</option>
                <option value="published">Published (on the blog)</option>
              </select>
            </Field>
            <label className="flex items-start gap-2.5">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={post?.isFeatured}
                className="mt-0.5 size-4 shrink-0 accent-blue-700"
              />
              <span>
                <span className={cx(fieldLabel, 'block')}>Featured</span>
                <span className="block text-xs text-slate-500">
                  The newest featured post is shown big on top of /blog/ and of its category page.
                </span>
              </span>
            </label>
            <Field
              label="Category"
              htmlFor="categoryId"
              error={err('categoryId')}
              hint={
                <a href="/admin/blog/categories/" target="_blank" rel="noopener">
                  Manage categories ↗
                </a>
              }
            >
              <select
                className={input}
                id="categoryId"
                name="categoryId"
                defaultValue={post?.categoryId ?? ''}
                aria-invalid={invalid('categoryId')}
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Tags"
              htmlFor="tags"
              error={err('tags')}
              hint="Separate with commas, e.g. Classroom, Beginners."
            >
              <input
                className={input}
                id="tags"
                name="tags"
                defaultValue={post?.tags}
                list="tag-suggestions"
                autoComplete="off"
                aria-invalid={invalid('tags')}
              />
              <datalist id="tag-suggestions">
                {tagSuggestions.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </Field>
          </section>

          <section className={cx(card, 'grid gap-4')}>
            <h2 className={cardTitle}>Page</h2>
            <Field
              label="Page URL"
              htmlFor="slug"
              error={err('slug')}
              hint={
                post
                  ? 'Changing it breaks links that were already shared. Leave blank to make it from the title.'
                  : 'Leave blank to make it from the title.'
              }
            >
              <span className="flex">
                <span className="inline-flex items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-2.5 text-slate-500">
                  /blog/
                </span>
                <input
                  className={cx(input, 'min-w-0 rounded-none')}
                  id="slug"
                  name="slug"
                  defaultValue={post?.slug}
                  placeholder={autoSlug || 'first-week-teaching-in-korea'}
                  maxLength={SLUG_MAX}
                  spellCheck={false}
                  autoCapitalize="off"
                  aria-invalid={invalid('slug')}
                />
                <span className="inline-flex items-center rounded-r-lg border border-l-0 border-slate-300 bg-slate-50 px-2.5 text-slate-500">
                  /
                </span>
              </span>
            </Field>
            <Field
              label="YouTube video"
              htmlFor="youtube"
              error={err('youtube')}
              hint="Optional. Shown above the article. Paste the video link."
            >
              <input
                className={input}
                id="youtube"
                name="youtube"
                defaultValue={post?.youtubeId ? `https://youtu.be/${post.youtubeId}` : ''}
                placeholder="https://youtu.be/…"
                aria-invalid={invalid('youtube')}
              />
            </Field>
          </section>

          <section className={cx(card, 'grid gap-4')}>
            <h2 className={cardTitle}>Search engines</h2>
            <Field label="SEO title" htmlFor="seoTitle" hint="Leave blank for “<title> | ReadyKorea Blog”.">
              <input className={input} id="seoTitle" name="seoTitle" maxLength={200} defaultValue={post?.seoTitle} />
            </Field>
            <Field label="SEO description" htmlFor="seoDescription" error={err('seoDescription')}>
              <textarea
                className={cx(input, 'resize-y')}
                id="seoDescription"
                name="seoDescription"
                rows={3}
                maxLength={400}
                defaultValue={post?.seoDescription}
                placeholder="Blank: the summary"
                aria-invalid={invalid('seoDescription')}
              />
            </Field>
          </section>
          {asideEnd}
        </aside>
      </div>

      <div className="sticky bottom-0 z-20 flex gap-2 bg-linear-to-b from-transparent to-slate-50 to-30% py-3">
        <button className={button('primary')} disabled={pending}>
          {pending ? 'Saving…' : post ? 'Save changes' : 'Save post'}
        </button>
        <Link className={button('ghost')} href="/admin/blog/">
          Cancel
        </Link>
      </div>
    </form>
  );
}
