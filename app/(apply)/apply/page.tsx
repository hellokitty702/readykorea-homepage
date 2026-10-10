import type { Metadata } from 'next';
import { ApplyForm } from '@/components/apply/apply-form';
import { getPublishedJobs } from '@/lib/job-board';

export const metadata: Metadata = {
  title: 'Apply Now · ReadyKorea',
  description: 'Apply to teach in Korea with ReadyKorea. Tell us about yourself and the roles you are looking for.',
  alternates: { canonical: '/apply/' },
};

export default async function ApplyPage({ searchParams }: { searchParams: Promise<{ job?: string | string[] }> }) {
  const { job } = await searchParams;
  const openJobs = (await getPublishedJobs()).map((j) => ({
    code: j.code,
    label: `${j.en.title} · ${j.school} · ${j.en.location}`,
  }));
  const requested = typeof job === 'string' ? job.toUpperCase() : '';
  const selectedJob = openJobs.some((j) => j.code === requested) ? requested : '';

  return (
    <main className="wrap">
      <section className="intro">
        <div className="eyebrow">Teacher application</div>
        <h1>Apply Now</h1>
        <p className="lead">
          Tell us about yourself below. We review placements for English kindergarten and academy roles across Korea.
        </p>
      </section>

      <section className="panel" aria-label="Application form">
        <ApplyForm jobs={openJobs} selectedJob={selectedJob} />
      </section>
    </main>
  );
}
