'use client';

import { Plus, X } from 'lucide-react';
import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from 'react';
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

/** "Add a category" button on the categories page; the form opens in a dialog. */
export function AddCategoryButton() {
  const dialog = useRef<HTMLDialogElement>(null);
  // A new form (and so a fresh message state) each time the dialog opens.
  const [opened, setOpened] = useState(0);
  const open = () => {
    setOpened((n) => n + 1);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  return (
    <>
      <button type="button" className={button('primary')} onClick={open}>
        <Plus className="size-4" aria-hidden="true" /> Add category
      </button>
      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && close()}
        aria-labelledby="new-category-title"
        className="m-auto w-[min(640px,calc(100vw-24px))] max-w-none rounded-2xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50"
      >
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3.5 sm:px-5">
          <h2 id="new-category-title" className="text-md font-bold">
            Add a category
          </h2>
          <button type="button" className={button('ghost', 'sm')} onClick={close} aria-label="Close">
            <X className="size-4" aria-hidden="true" />
          </button>
        </header>
        {opened > 0 && <NewCategoryForm key={opened} onAdded={close} onCancel={close} />}
      </dialog>
    </>
  );
}

function NewCategoryForm({ onAdded, onCancel }: { onAdded: () => void; onCancel: () => void }) {
  const { state, action, pending, onSubmit } = useCategoryAction();
  useEffect(() => {
    if (state.ok) onAdded();
  }, [state, onAdded]);

  return (
    <form action={action} onSubmit={onSubmit} className="grid gap-3.5 px-4 py-4 sm:px-5">
      {state.error && <Message state={state} />}
      <div className={formGrid}>
        <Fields />
      </div>
      <div className="flex gap-2">
        <button className={button('primary')} disabled={pending}>
          {pending ? 'Adding…' : 'Add category'}
        </button>
        <button type="button" className={button('ghost')} onClick={onCancel}>
          Cancel
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
