import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Field } from '@/components/admin/field';
import {
  alertError,
  button,
  card,
  cardTitle,
  cx,
  input,
  muted,
  sectionHeading,
  small,
  specs,
  twoColumnsWideLeft,
} from '@/components/admin/styles';
import { JobStatusBadge, PageHeader, PageSub, StatusBadge, fmtDate, fmtDateTime } from '@/components/admin/ui';
import { addApplicationNote, changeApplicationStatus } from '@/lib/actions/applications';
import { getApplication, parseId } from '@/lib/admin/queries';
import { ACTION_LABEL, EXITS, PIPELINE, STATUS_LABEL, TRANSITIONS } from '@/lib/application-flow';
import { requireAdmin } from '@/lib/auth/dal';
import type { ApplicationStatus, FormFieldType } from '@/lib/db/schema';

export const metadata: Metadata = { title: 'Application' };

export default async function ApplicationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const data = await getApplication(parseId((await params).id));
  if (!data) notFound();
  const { application: a, job, events, others } = data;
  const { error } = await searchParams;
  const moves = TRANSITIONS[a.status];
  // Applications from before the form builder have no `answers`: their questions are in the columns.
  const standardForm = !a.answers.length && Boolean(a.position);
  const closed = EXITS.includes(a.status);
  // Furthest pipeline step reached, so a rejected application still shows how far it got.
  const reached = Math.max(
    0,
    ...events.flatMap((e) => [e.toStatus, e.fromStatus]).map((s) => (s ? PIPELINE.indexOf(s) : -1)),
  );
  // Blue while in progress, green once hired, grey after leaving the flow.
  const tone = a.status === 'hired' ? FLOW_TONE.hired : closed ? FLOW_TONE.closed : FLOW_TONE.open;

  return (
    <>
      <PageHeader
        title={a.fullName}
        crumbs={[{ href: '/admin/applications/', label: 'Applications' }]}
        actions={
          <a className={button()} href={`mailto:${a.email}`}>
            Email applicant
          </a>
        }
      >
        <PageSub>
          <StatusBadge status={a.status} /> Applied {fmtDateTime(a.createdAt)} ·{' '}
          {job ? (
            <Link href={`/admin/jobs/${job.id}/`}>
              {job.en.title} ({job.code})
            </Link>
          ) : (
            'General application'
          )}
        </PageSub>
      </PageHeader>

      {error === 'stale' && (
        <p className={alertError}>
          That change wasn&apos;t saved: the application had already moved on. Here is its current status.
        </p>
      )}

      <section className={card}>
        <h2 className={cardTitle}>Hiring flow</h2>
        <ol className="mb-4 grid grid-cols-5">
          {PIPELINE.map((step, i) => {
            const state =
              a.status === 'hired' || (closed ? i <= reached : i < PIPELINE.indexOf(a.status))
                ? 'done'
                : a.status === step
                  ? 'current'
                  : 'todo';
            return (
              <li
                key={step}
                className={cx(
                  'relative grid justify-items-center gap-1.5 text-center',
                  // Line joining this step to the previous one. Every `before:` class is scoped to
                  // not-first, or the first step gets an in-flow ::before that pushes its circle down.
                  "not-first:before:absolute not-first:before:top-[15px] not-first:before:right-1/2 not-first:before:h-0.5 not-first:before:w-full not-first:before:content-['']",
                  state === 'todo' ? 'not-first:before:bg-slate-200' : tone.line,
                )}
              >
                <span
                  className={cx(
                    'relative z-1 grid size-8 place-items-center rounded-full border-2 text-label font-bold',
                    state === 'done' && tone.done,
                    state === 'current' && 'border-blue-700 bg-white text-blue-700 ring-4 ring-blue-100',
                    state === 'todo' && 'border-slate-300 bg-white text-slate-500',
                  )}
                >
                  {state === 'done' ? '✓' : i + 1}
                </span>
                <span
                  className={cx(
                    'text-label font-semibold max-sm:text-2xs',
                    state === 'todo' ? 'text-slate-500' : 'text-slate-900',
                  )}
                >
                  {STATUS_LABEL[step]}
                </span>
              </li>
            );
          })}
        </ol>
        {closed && (
          <p className="mb-4 flex items-center gap-2 text-slate-700">
            <StatusBadge status={a.status} />
            <span>
              Left the flow after <strong>{STATUS_LABEL[PIPELINE[reached]]}</strong>.
            </span>
          </p>
        )}

        {moves.length > 0 ? (
          <form action={changeApplicationStatus} className="grid gap-2.5 border-t border-slate-200 pt-4">
            <input type="hidden" name="id" value={a.id} />
            <Field label="Note (optional, saved with the change)">
              <textarea className={input} name="note" rows={2} placeholder="e.g. Interview booked for Tue 10:00 KST" />
            </Field>
            <div className="flex flex-wrap gap-2">
              {moves.map((to) => (
                <button key={to} name="to" value={to} className={button(EXITS.includes(to) ? 'ghost' : 'primary')}>
                  {closed && to === 'reviewing' ? 'Reopen (back to Reviewing)' : ACTION_LABEL[to]}
                </button>
              ))}
            </div>
          </form>
        ) : (
          <p className={muted}>This application is complete. 🎉</p>
        )}
      </section>

      <div className={twoColumnsWideLeft}>
        <section className={card}>
          <h2 className={cardTitle}>Timeline</h2>
          <form action={addApplicationNote} className="mb-4 grid justify-items-start gap-2">
            <input type="hidden" name="id" value={a.id} />
            <textarea
              className={input}
              name="note"
              rows={2}
              placeholder="Add a note for the team…"
              aria-label="Note"
              required
            />
            <button className={button('default', 'sm')}>Add note</button>
          </form>
          <ol className="grid gap-3.5 border-l-2 border-slate-200 pl-4.5">
            {events.map((e) => (
              <li
                key={e.id}
                className={cx(
                  "relative before:absolute before:top-1.25 before:-left-6 before:size-2.5 before:rounded-full before:border-2 before:border-white before:content-['']",
                  EVENT_DOT[e.type],
                )}
              >
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <EventTitle type={e.type} from={e.fromStatus} to={e.toStatus} />
                  <span className={cx(muted, small)}>
                    {fmtDateTime(e.createdAt)}
                    {e.userName ? ` · ${e.userName}` : e.type === 'submitted' ? ' · via website' : ''}
                  </span>
                </div>
                {e.note && (
                  <p className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 whitespace-pre-wrap text-slate-700">
                    {e.note}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className={card}>
          <h2 className={cardTitle}>Applicant</h2>
          <dl className={specs}>
            <dt>Name</dt>
            <dd>{a.fullName}</dd>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${a.email}`}>{a.email}</a>
            </dd>
            {standardForm && (
              <>
                <dt>Passport</dt>
                <dd>{a.passportCountry}</dd>
                <dt>Position</dt>
                <dd>{a.position}</dd>
                <dt>Regions</dt>
                <dd>{a.regions.join(', ')}</dd>
                <dt>Experience</dt>
                <dd>{a.experience}</dd>
              </>
            )}
            <dt>Site language</dt>
            <dd>{a.lang === 'ko' ? 'Korean' : 'English'}</dd>
            {job && (
              <>
                <dt>Job</dt>
                <dd>
                  <Link href={`/admin/jobs/${job.id}/`}>{job.en.title}</Link> <JobStatusBadge status={job.status} />
                  <div className={cx(muted, small)}>{job.school}</div>
                </dd>
              </>
            )}
          </dl>
          {standardForm ? (
            <>
              <h3 className={cx(sectionHeading, 'mt-4.5')}>Introduction</h3>
              {a.introduction ? (
                <p className="whitespace-pre-wrap text-slate-700">{a.introduction}</p>
              ) : (
                <p className={muted}>Not provided.</p>
              )}
            </>
          ) : (
            <>
              <h3 className={cx(sectionHeading, 'mt-4.5')}>Answers</h3>
              {a.answers.length ? (
                <dl className="grid gap-3">
                  {a.answers.map((answer, i) => (
                    <div key={i} className="grid gap-0.5">
                      <dt className="font-semibold text-slate-700">{answer.label}</dt>
                      <dd className="whitespace-pre-wrap text-slate-700 wrap-anywhere">
                        <Answer value={answer.value} type={answer.type} />
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className={muted}>The form only asked for name and email.</p>
              )}
            </>
          )}

          {others.length > 0 && (
            <>
              <h3 className={cx(sectionHeading, 'mt-4.5')}>Other applications from this email</h3>
              <ul className="grid gap-1.5">
                {others.map((o) => (
                  <li key={o.id}>
                    <Link href={`/admin/applications/${o.id}/`}>
                      {o.jobCode ?? 'General'} · {fmtDate(o.createdAt)}
                    </Link>{' '}
                    <StatusBadge status={o.status} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </>
  );
}

const FLOW_TONE = {
  open: { done: 'border-blue-700 bg-blue-700 text-white', line: 'not-first:before:bg-blue-700' },
  hired: { done: 'border-green-700 bg-green-700 text-white', line: 'not-first:before:bg-green-700' },
  closed: { done: 'border-slate-400 bg-slate-400 text-white', line: 'not-first:before:bg-slate-400' },
};

const EVENT_DOT = {
  submitted: 'before:bg-amber-400',
  status_changed: 'before:bg-blue-700',
  note: 'before:bg-slate-300',
};

function EventTitle({
  type,
  from,
  to,
}: {
  type: 'submitted' | 'status_changed' | 'note';
  from: ApplicationStatus | null;
  to: ApplicationStatus | null;
}) {
  if (type === 'submitted') return <strong>Application submitted</strong>;
  if (type === 'note') return <strong>Note</strong>;
  return (
    <strong>
      {from ? STATUS_LABEL[from] : '—'} → {to ? STATUS_LABEL[to] : '—'}
    </strong>
  );
}

function Answer({ value, type }: { value: string | string[]; type: FormFieldType }) {
  const text = Array.isArray(value) ? value.join(', ') : value;
  if (!text) return <span className={muted}>—</span>;
  if (type === 'email') return <a href={`mailto:${text}`}>{text}</a>;
  if (type === 'phone') return <a href={`tel:${text.replace(/[^+\d]/g, '')}`}>{text}</a>;
  if (type === 'url' && /^https?:\/\//.test(text)) {
    return (
      <a href={text} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    );
  }
  if (type === 'date') return <>{fmtDate(text)}</>;
  return <>{text}</>;
}
