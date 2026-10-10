'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState, type ComponentProps } from 'react';
import { cx, input } from './styles';

/** Password field with a show / hide (eye) toggle. */
export function PasswordInput({ className, ...props }: Omit<ComponentProps<'input'>, 'type'>) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;
  return (
    <span className="relative block">
      <input
        {...props}
        className={cx(input, 'pr-10.5', className)}
        type={visible ? 'text' : 'password'}
        autoCapitalize="off"
        spellCheck={false}
      />
      <button
        type="button"
        className="absolute top-1/2 right-1.25 grid size-7.5 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-300"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        aria-label={visible ? 'Hide password' : 'Show password'}
        title={visible ? 'Hide password' : 'Show password'}
      >
        <Icon size={18} aria-hidden="true" />
      </button>
    </span>
  );
}
