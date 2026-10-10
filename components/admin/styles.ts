// Shared Tailwind class lists for the admin panel.

export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

const BUTTON_VARIANT = {
  default: 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50',
  primary: 'border-blue-700 bg-blue-700 text-white hover:bg-blue-800',
  ghost: 'border-transparent bg-transparent text-slate-700 hover:bg-slate-100',
  danger: 'border-red-700 bg-red-700 text-white hover:bg-red-800',
  dangerGhost: 'border-red-200 bg-white text-red-700 hover:bg-red-50',
};
const BUTTON_SIZE = {
  md: 'px-3.5 py-2 text-label',
  sm: 'px-2.5 py-1.5 text-xs',
  block: 'w-full p-2.5 text-label',
};

/** Classes for a `<button>` or a link styled as one. */
export function button(variant: keyof typeof BUTTON_VARIANT = 'default', size: keyof typeof BUTTON_SIZE = 'md') {
  return cx(
    'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border font-semibold whitespace-nowrap hover:no-underline disabled:cursor-not-allowed disabled:opacity-55',
    BUTTON_VARIANT[variant],
    BUTTON_SIZE[size],
  );
}

// ---------------------------------------------------------------------------
// Forms
// ---------------------------------------------------------------------------

/** Text inputs, selects and textareas. */
export const input =
  'w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-slate-900 focus-visible:border-blue-700 focus-visible:outline-2 focus-visible:outline-blue-300 aria-invalid:border-red-700';
/** A label wrapping its text and control. */
export const field = 'grid min-w-0 content-start gap-1.5';
export const fieldLabel = 'text-label font-semibold text-slate-700';
export const hint = 'text-xs text-slate-500';
export const fieldError = 'text-xs text-red-700';
export const formGrid = 'grid grid-cols-1 gap-x-4.5 gap-y-3.5 md:grid-cols-2';

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export const card = 'min-w-0 rounded-xl border border-slate-200 bg-white p-5';
export const dangerCard = 'min-w-0 rounded-xl border border-red-200 bg-white p-5';
/** Card holding a full-bleed table. */
export const cardFlush = 'relative min-w-0 overflow-x-auto rounded-xl border border-slate-200 bg-white';
export const cardTitle = 'mb-3.5 text-md font-bold';
export const cardHead = 'mb-3 flex items-baseline justify-between gap-3';
export const twoColumns = 'grid grid-cols-1 gap-4.5 lg:grid-cols-2';
export const twoColumnsWideLeft = 'grid grid-cols-1 gap-4.5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]';
/** Small uppercase heading inside a card; add the top margin where it's used. */
export const sectionHeading = 'mb-2 text-label font-bold tracking-wide text-slate-700 uppercase';
export const muted = 'text-slate-500';
export const small = 'text-xs';
export const strong = 'font-semibold text-slate-900';

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

/**
 * Table styling via descendant variants, so cells need no classes. `inCard` drops the outer padding
 * for tables sitting inside a padded card.
 */
export function table(inCard = false) {
  return cx(
    'w-full border-collapse',
    '[&_th]:border-b [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:px-3.5 [&_th]:py-2.5 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:whitespace-nowrap [&_th]:text-slate-500',
    '[&_td]:border-b [&_td]:border-slate-200 [&_td]:px-3.5 [&_td]:py-3 [&_td]:align-top',
    '[&_tr:last-child_td]:border-b-0 [&_tbody_tr:hover_td]:bg-blue-50/30',
    inCard && '[&_td]:pl-0 [&_th]:pl-0',
  );
}
/** Right-aligned number cell (overrides the table's left alignment). */
export const num = 'text-right! tabular-nums';

// ---------------------------------------------------------------------------
// Badges, tags, alerts
// ---------------------------------------------------------------------------

export const badge = 'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap';

/** Background + text colour per application status. */
export const STATUS_COLORS = {
  new: 'bg-amber-100 text-amber-800',
  reviewing: 'bg-sky-100 text-sky-800',
  interview: 'bg-violet-100 text-violet-800',
  offered: 'bg-blue-100 text-blue-800',
  hired: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-slate-100 text-slate-600',
} as const;
/** Bar colour per application status (dashboard). */
export const STATUS_BAR = {
  new: 'bg-amber-500',
  reviewing: 'bg-sky-500',
  interview: 'bg-violet-500',
  offered: 'bg-blue-500',
  hired: 'bg-green-500',
  rejected: 'bg-red-500',
  withdrawn: 'bg-slate-400',
} as const;
export const JOB_STATUS_COLORS = {
  published: 'bg-green-100 text-green-800',
  draft: 'bg-slate-100 text-slate-600',
  closed: 'bg-red-100 text-red-800',
} as const;

export const tag =
  'ml-1.5 inline-block rounded-full bg-slate-100 px-2 py-px align-[1px] text-2xs font-semibold text-slate-700';

export const alertError = 'rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-red-800';
export const alertOk = 'rounded-lg border border-green-200 bg-green-50 px-3.5 py-2.5 text-green-800';

// ---------------------------------------------------------------------------
// Tabs (status filters)
// ---------------------------------------------------------------------------

export const tabs = 'flex flex-wrap gap-1 border-b border-slate-200';
export const tabLink =
  '-mb-px border-b-2 border-transparent px-3 py-2 font-medium text-slate-500 hover:text-slate-900 hover:no-underline aria-[current=page]:border-amber-400 aria-[current=page]:text-slate-900';
export const tabCount =
  'ml-1 inline-block min-w-5 rounded-full bg-slate-100 px-1.5 text-center text-2xs font-semibold text-slate-500';

/** Grey bar the size of the editor toolbar, shown while the editor starts. */
export const toolbarPlaceholder = 'h-10.5 border-b border-slate-200 bg-slate-50';

/** Hides the default disclosure triangle of a `<summary>`. */
export const plainSummary = 'cursor-pointer list-none [&::-webkit-details-marker]:hidden';

// ---------------------------------------------------------------------------
// Detail lists
// ---------------------------------------------------------------------------

/** `<dl>` of label / value pairs. Wrap a pair in `<div className="contents">` if needed. */
export const specs =
  'mb-3 grid grid-cols-[minmax(110px,160px)_1fr] gap-x-3.5 gap-y-2 [&_dd]:min-w-0 [&_dd]:wrap-anywhere [&_dt]:text-slate-500';
export const code = 'rounded bg-slate-100 px-1.25 py-px font-mono text-xs';
export const TAG_COLORS = { urgent: 'bg-red-100 text-red-800', new: 'bg-green-100 text-green-800' } as const;
