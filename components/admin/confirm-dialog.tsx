'use client';

import { X } from 'lucide-react';
import { useId, useRef, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { button, cx } from './styles';

/**
 * A button that opens a confirmation dialog; confirming submits `action` with `fields` as hidden
 * inputs. For destructive actions (delete) from lists, where a native confirm() is too easy to click through.
 */
export function ConfirmDialogButton({
  action,
  fields,
  title,
  children,
  confirmLabel,
  pendingLabel,
  trigger,
  triggerClassName,
  triggerLabel,
  disabled,
  disabledReason,
}: {
  action: (formData: FormData) => void | Promise<void>;
  fields: Record<string, string | number>;
  title: string;
  /** The dialog's message. */
  children: ReactNode;
  confirmLabel: string;
  pendingLabel: string;
  /** Contents of the button that opens the dialog. */
  trigger: ReactNode;
  triggerClassName: string;
  /** Accessible name of the trigger, when it shows only an icon. */
  triggerLabel?: string;
  disabled?: boolean;
  /** Shown as the trigger's tooltip while it is disabled. */
  disabledReason?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        className={triggerClassName}
        onClick={() => dialog.current?.showModal()}
        disabled={disabled}
        aria-label={triggerLabel}
        title={disabled ? disabledReason : triggerLabel}
      >
        {trigger}
      </button>
      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && close()}
        aria-labelledby={titleId}
        className="m-auto w-[min(440px,calc(100vw-24px))] max-w-none rounded-2xl bg-white p-0 text-left whitespace-normal text-slate-900 shadow-2xl backdrop:bg-slate-950/50"
      >
        <form action={action} className="grid gap-4 p-5">
          {Object.entries(fields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <div className="flex items-start justify-between gap-3">
            <h2 id={titleId} className="text-md font-bold">
              {title}
            </h2>
            <button type="button" className={cx(button('ghost', 'sm'), '-mt-1 -mr-1')} onClick={close} aria-label="Close">
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="text-slate-600">{children}</div>
          <div className="flex justify-end gap-2">
            {/* First in the tab order, so Enter doesn't confirm by accident. */}
            <button type="button" className={button('ghost')} onClick={close} autoFocus>
              Cancel
            </button>
            <ConfirmButton label={confirmLabel} pendingLabel={pendingLabel} />
          </div>
        </form>
      </dialog>
    </>
  );
}

function ConfirmButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button className={button('danger')} disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}
