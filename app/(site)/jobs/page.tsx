import type { Metadata } from 'next';
import { SectionPage } from '@/components/sections/section-page';
import { jobBoardCards } from '@/lib/job-board';
import { pageMetadata } from '@/lib/site-pages';

export const metadata: Metadata = pageMetadata(
  {
    title: 'Teaching Jobs in Korea · Job Board | ReadyKorea',
    description:
      'Verified English teaching jobs in Korean academies and kindergartens. 100% free for teachers. Apply online.',
  },
  '/jobs/',
);

// Prerendered; job changes in the admin panel revalidate it (lib/actions/jobs.ts).
export default async function JobsPage() {
  return <SectionPage id="jobs" src="sections/jobs.html" replace={await jobBoardCards()} />;
}
