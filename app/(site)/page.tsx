import type { Metadata } from 'next';
import { LatestPosts } from '@/components/home/latest-posts';
import { OldHashRedirect } from '@/components/home/old-hash-redirect';
import { JsonLd } from '@/components/json-ld';
import { SectionPage } from '@/components/sections/section-page';
import { jobBoardCards } from '@/lib/job-board';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'ReadyKorea - 원어민 영어강사 매칭 전문',
  description:
    'ReadyKorea — premium ESL matching for Korea. E-2 Visa Master Guide hub, 162 lesson plans (K1–G6), verified hagwon jobs, 100% free for teachers. Gangnam/Daechi-dong academy expertise.',
  keywords:
    'Teaching English in Korea, Teach English in Korea, Korea ESL Jobs, Lesson Plans, ReadyKorea, ESL Games, E-2 Visa Timeline, Hagwon Jobs, English Kindergarten Korea, ESL Korea Recruiter',
  authors: [{ name: 'ReadyKorea (래디코리아)' }],
  robots: 'index, follow, max-image-preview:large',
  alternates: { canonical: '/' },
  verification: { google: 'TRHGi-T2jy4z2xzd5r-lyWtGVRuq13X7agNYFPJwpCE' },
  openGraph: {
    type: 'website',
    siteName: 'ReadyKorea',
    title: 'ReadyKorea — Teach English in Korea | The Premium Hub',
    description:
      '162 lesson plans (K1–G6), AI Lab for English teachers, E-2 Visa tracker, savings calculator, and verified Korean academy jobs. Built by a 15-year recruiter.',
    url: '/',
    locale: 'en_US',
    alternateLocale: ['ko_KR'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReadyKorea — Teach English in Korea | Lesson Vault + AI Lab',
    description:
      'The premium edutech platform for English teachers in Korean academies. Lesson plans, AI tools, visa support, jobs.',
  },
};

const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ReadyKorea',
  alternateName: '래디코리아',
  url: absoluteUrl('/'),
  description:
    'Premium edutech matching platform for native English teachers in Korea — 162 lesson plans, AI Lab, E-2 Visa support, verified hagwon jobs.',
  sameAs: [],
  knowsAbout: [
    'Teaching English in Korea',
    'Korea ESL Jobs',
    'Lesson Plans',
    'ESL Games',
    'E-2 Visa Timeline',
    'English Kindergarten Korea',
  ],
};

// Prerendered; job changes in the admin panel revalidate it (lib/actions/jobs.ts).
export default async function HomePage() {
  return (
    <>
      <JsonLd data={ORGANIZATION_LD} />
      <OldHashRedirect />
      <SectionPage
        id="home"
        src={['pages/home/hero.html', 'sections/jobs.html', 'sections/why-readykorea.html']}
        replace={await jobBoardCards()}
      >
        <LatestPosts />
      </SectionPage>
    </>
  );
}
