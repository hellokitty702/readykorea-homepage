import type { Metadata } from 'next';
import { HtmlBlock } from '@/components/html-block';
import { JsonLd } from '@/components/json-ld';
import { LegacyScripts } from '@/components/legacy-scripts';
import { LatestPosts } from '@/components/home/latest-posts';
import { Overlays } from '@/components/home/overlays';
import { PlatformPerformance } from '@/components/home/platform-performance';
import { getPublishedJobs, renderJobCards } from '@/lib/job-board';
import { SCHOOL_POST_JOB_FORM_URL, absoluteUrl } from '@/lib/site';

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

// The homepage is a single-page app: every "page" is a `.level-content` panel that
// `public/js/home.js` shows/hides (hash routing, EN/KO switch, drawers, calculators…).
// Panel markup lives in `content/home/` and is rendered statically here.
const PANELS: { id: string; className?: string }[] = [
  { id: 'home', className: 'active home-simple' },
  { id: 'ailab' },
  { id: 'forum' },
  { id: 'tefl' },
  { id: 'support' },
  { id: 'why-korea', className: 'guide-mode' },
  { id: 'regions' },
];
const REGIONS = [
  'seoul',
  'busan',
  'daegu',
  'songdo',
  'jeju',
  'gyeonggi',
  'bundang',
  'suwon',
  'yongin',
  'ilsan',
  'daechi',
];
const LESSON_LEVELS = ['k1', 'k2', 'k3', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6'];

function Panel({ id, className, replace }: { id: string; className?: string; replace?: Record<string, string> }) {
  return (
    <HtmlBlock
      id={`level-${id}`}
      className={className ? `level-content ${className}` : 'level-content'}
      src={`home/levels/${id}.html`}
      replace={replace}
    />
  );
}

// Prerendered; job changes in the admin panel call revalidatePath('/') to rebuild it.
export default async function HomePage() {
  const jobs = await getPublishedJobs();
  const jobCards = { '<!--JOB_CARDS-->': renderJobCards(jobs, SCHOOL_POST_JOB_FORM_URL) };

  return (
    <>
      <JsonLd data={ORGANIZATION_LD} />

      {/* Legacy hidden tab strip — JS still uses .level-tab[data-level] for state */}
      <HtmlBlock className="level-tab-bar" aria-hidden="true" src="home/level-tab-bar.html" />

      {PANELS.map((panel) => (
        <Panel key={panel.id} {...panel} replace={panel.id === 'home' ? jobCards : undefined} />
      ))}
      {REGIONS.map((region) => (
        <HtmlBlock
          key={region}
          id={`level-region-${region}`}
          className="level-content region-detail"
          data-region={region}
          src={`home/regions/${region}.html`}
        />
      ))}
      <Panel id="for-teachers" className="guide-mode" />
      {LESSON_LEVELS.map((level) => (
        <Panel key={level} id={level} />
      ))}

      <PlatformPerformance />
      <LatestPosts />
      <Overlays />

      <LegacyScripts srcs={['/js/support-guides.js', '/js/grade-curriculum.js', '/js/home.js']} />
    </>
  );
}
