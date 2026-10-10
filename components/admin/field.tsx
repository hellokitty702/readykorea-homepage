import type { ReactNode } from 'react';
import { cx, field, fieldError, fieldLabel, hint as hintClass } from './styles';

/** Label wrapping a form control, with optional required marker, hint and error. */
export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  className,
  children,
}: {
  label: ReactNode;
  htmlFor?: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cx(field, className)} htmlFor={htmlFor}>
      <span className={fieldLabel}>
        {label}
        {required && <span className="text-red-700"> *</span>}
      </span>
      {children}
      {error ? <span className={fieldError}>{error}</span> : hint && <span className={hintClass}>{hint}</span>}
    </label>
  );
}
