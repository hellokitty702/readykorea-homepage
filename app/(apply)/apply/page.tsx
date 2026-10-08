import type { Metadata } from 'next';
import { TEACHER_APPLY_FORM_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Apply Now · ReadyKorea',
  description: 'Apply to teach in Korea with ReadyKorea. Submit your resume and application details.',
};

export default function ApplyPage() {
  return (
    <main className="wrap">
      <section className="intro">
        <div className="eyebrow">Teacher application</div>
        <h1>Apply Now</h1>
        <p className="lead">
          Submit your resume and application details below. We review placements for English kindergarten and
          academy roles across Korea.
        </p>
      </section>

      <section className="panel" aria-label="Application form">
        <div className="panel-top">
          <p>Fill out the form to apply. Prefer a full-page form? Open it in a new tab.</p>
          <a className="open-form" href={TEACHER_APPLY_FORM_URL} target="_blank" rel="noopener noreferrer">
            Open full form <span aria-hidden="true">→</span>
          </a>
        </div>
        <iframe
          className="form-frame"
          title="ReadyKorea teacher application form"
          src={`${TEACHER_APPLY_FORM_URL}?embedded=true`}
          loading="lazy"
        >
          Loading…
        </iframe>
      </section>

      <p className="note">
        Having trouble with the embedded form?{' '}
        <a href={TEACHER_APPLY_FORM_URL} target="_blank" rel="noopener noreferrer">
          Open the application form here
        </a>
        .
      </p>
    </main>
  );
}
