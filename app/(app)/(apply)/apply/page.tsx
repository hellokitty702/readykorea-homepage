import type { Metadata } from 'next';
import { ApplyForm } from '@/components/apply/apply-form';
import { DEFAULT_APPLY_FIELDS, EMBED_HEIGHT, standaloneFormUrl } from '@/lib/apply-forms';
import { getPublishedJobs } from '@/lib/job-board';

export const metadata: Metadata = {
  title: 'Apply Now · ReadyKorea',
  description: 'Apply to teach in Korea with ReadyKorea. Tell us about yourself and the roles you are looking for.',
  alternates: { canonical: '/apply/' },
};

/**
 * /apply/?job=<code> applies to that job, with its own form (the ReadyKorea form with the job's
 * questions, or an embedded Google Form, Typeform…). /apply/ alone is a general application.
 */
export default async function ApplyPage({ searchParams }: { searchParams: Promise<{ job?: string | string[] }> }) {
  const { job } = await searchParams;
  const requested = typeof job === 'string' ? job.toUpperCase() : '';
  const selected = requested ? (await getPublishedJobs()).find((j) => j.code === requested) : undefined;

  return (
    <main className="wrap">
      <section className="intro">
        <div className="eyebrow">Teacher application</div>
        <h1>Apply Now</h1>
        <p className="lead">
          {selected
            ? `${selected.en.title} · ${selected.school} · ${selected.en.location}`
            : 'Tell us about yourself below. We review placements for English kindergarten and academy roles across Korea.'}
        </p>
      </section>

      <section className="panel" aria-label="Application form">
        {!selected ? (
          <ApplyForm jobCode="" fields={DEFAULT_APPLY_FIELDS} />
        ) : selected.applyMethod === 'standard' ? (
          <ApplyForm jobCode={selected.code} fields={selected.applyFields} />
        ) : selected.applyFormUrl ? (
          <>
            <iframe
              className="apply-embed"
              src={selected.applyFormUrl}
              title={`Application form: ${selected.en.title}`}
              height={EMBED_HEIGHT[selected.applyMethod]}
              loading="lazy"
              allow="clipboard-write; fullscreen"
            />
            <p className="apply-embed-fallback">
              Form not showing?{' '}
              <a href={standaloneFormUrl(selected.applyFormUrl)} target="_blank" rel="noopener noreferrer">
                Open it in a new tab ↗
              </a>
            </p>
          </>
        ) : (
          <p className="apply-embed-fallback">
            Applications for this position aren&apos;t open yet. Please check back soon.
          </p>
        )}
      </section>
    </main>
  );
}
