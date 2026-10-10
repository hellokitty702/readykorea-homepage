'use client';

import { startTransition, useActionState, useEffect, useRef, type FormEvent } from 'react';
import { deleteCategory, saveCategory, type CategoryFormState } from '@/lib/actions/posts';
import { SLUG_MAX } from '@/lib/slug';
import { Field } from './field';
import { alertError, alertOk, button, cx, formGrid, input, plainSummary, small } from './styles';

type Category = { id: number; name: string; slug: string; description: string; posts: number };

function Message({ state }: { state: CategoryFormState }) {
  if (state.error) return <p className={cx(alertError, small)}>{state.error}</p>;
  if (state.ok) return <p className={cx(alertOk, small)}>{state.ok}</p>;
  return null;
}

function Fields({ category }: { category?: Category }) {
  return (
    <>
      <Field label="Name">
        <input className={input} name="name" defaultValue={category?.name} required maxLength={80} />
      </Field>
      <Field label="Page URL" hint="Blank: made from the name.">
        <span className="flex">
          <span className="inline-flex items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-2.5 text-slate-500">
            /blog/category/
          </span>
          <input
            className={cx(input, 'min-w-0 rounded-l-none')}
            name="slug"
            defaultValue={category?.slug}
            maxLength={SLUG_MAX}
            spellCheck={false}
            autoCapitalize="off"
          />
        </span>
      </Field>
      <Field label="Description" hint="Optional intro on the category page." className="md:col-span-2">
        <textarea
          className={cx(input, 'resize-y')}
          name="description"
          rows={2}
          maxLength={400}
          defaultValue={category?.description}
        />
      </Field>
    </>
  );
}

/** Keeps what was typed when the server rejects it (React would reset the form otherwise). */
function useCategoryAction() {
  const [state, action, pending] = useActionState<CategoryFormState, FormData>(saveCategory, {});
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  };
  return { state, action, pending, onSubmit };
}

export function NewCategoryForm() {
  const { state, action, pending, onSubmit } = useCategoryAction();
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={action} onSubmit={onSubmit} className="grid gap-3.5">
      <Message state={state} />
      <div className={formGrid}>
        <Fields />
      </div>
      <div>
        <button className={button('primary')} disabled={pending}>
          {pending ? 'Adding…' : 'Add category'}
        </button>
      </div>
    </form>
  );
}

export function CategoryRowActions({ category }: { category: Category }) {
  const { state, action, pending, onSubmit } = useCategoryAction();
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (state.ok && details.current) details.current.open = false;
  }, [state]);

  return (
    <div className="grid justify-items-end gap-1.5">
      <div className="flex items-start gap-1.5">
        {/* Opens inside the table row: the table's scroll container would clip a floating box. */}
        <details ref={details} className="open:grid open:justify-items-end">
          <summary className={cx(plainSummary, button('default', 'sm'))}>Edit</summary>
          <form
            action={action}
            onSubmit={onSubmit}
            className="mt-2 grid w-120 max-w-[80vw] gap-3 rounded-[10px] border border-slate-200 bg-white p-3.5 text-left whitespace-normal shadow-[0_10px_30px_rgba(15,23,42,0.12)]"
          >
            <input type="hidden" name="id" value={category.id} />
            <div className={formGrid}>
              <Fields category={category} />
            </div>
            <div>
              <button className={button('primary', 'sm')} disabled={pending}>
                Save category
              </button>
            </div>
          </form>
        </details>
        <form
          action={deleteCategory}
          onSubmit={(e) => {
            const note = category.posts
              ? ` Its ${category.posts} ${category.posts === 1 ? 'post stays' : 'posts stay'} on the blog without a category.`
              : '';
            if (!window.confirm(`Delete the category “${category.name}”?${note}`)) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={category.id} />
          <button className={button('dangerGhost', 'sm')}>Delete</button>
        </form>
      </div>
      <Message state={state} />
    </div>
  );
}
