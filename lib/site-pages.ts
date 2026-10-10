// Pages that used to be panels of the one-page homepage.
// Client-safe: no server imports. Page markup lives in content/pages/ and content/sections/.

import type { Metadata } from 'next';

export const FOR_TEACHERS_GUIDES = [
  { slug: 'job-types', title: 'Job Types', description: 'Hagwon, public school, English kindergarten and university jobs in Korea compared.' },
  { slug: 'interview-tips', title: 'Interview Tips', description: 'How Korean academies interview native English teachers, and how to prepare.' },
  { slug: 'e2-visa', title: 'E-2 Visa Master Guide', description: 'The E-2 visa process step by step: documents, consulate interview, visa runs, extensions and changes.' },
  { slug: 'while-in-korea', title: 'While in Korea', description: 'Your first weeks in Korea: the E-2 medical exam and your Residence Card (ARC).' },
  { slug: 'contracts', title: 'Contracts', description: 'Red flags to check before you sign a Korean teaching contract.' },
  { slug: 'housing', title: 'Housing', description: 'School-provided housing and housing allowances for teachers in Korea.' },
  { slug: 'coteacher', title: 'Co-teacher', description: 'Working well with Korean co-teachers and academy staff.' },
  { slug: 'hagwon-success-manual', title: 'Hagwon Success Manual', description: 'How to thrive in a Korean hagwon: schedules, parents, reports and expectations.' },
  { slug: 'pay', title: 'Pay & Pension', description: 'Salary, tax, severance and pension refunds for English teachers in Korea.' },
  { slug: 'prearrival', title: 'Pre-arrival Checklist', description: 'What to pack, buy and set up before you fly to Korea.' },
  { slug: 'healthcare', title: 'Healthcare', description: 'Hospitals, pharmacies, national health insurance and emergency numbers in Korea.' },
  { slug: 'korean', title: 'Korean 한국어', description: 'Survival Korean and classroom phrases for English teachers.' },
] as const;

export const REGIONS = [
  { slug: 'seoul', name: 'Seoul' },
  { slug: 'busan', name: 'Busan' },
  { slug: 'daegu', name: 'Daegu' },
  { slug: 'songdo', name: 'Songdo' },
  { slug: 'jeju', name: 'Jeju' },
  { slug: 'gyeonggi', name: 'Gyeonggi' },
  { slug: 'bundang', name: 'Bundang' },
  { slug: 'suwon', name: 'Suwon' },
  { slug: 'yongin', name: 'Yongin' },
  { slug: 'ilsan', name: 'Ilsan' },
  { slug: 'daechi', name: 'Daechi-dong' },
] as const;

/**
 * Guides split into sub-pages with a side menu: `/for-teachers/<guide>/` is the first entry (slug ''),
 * the others are `/for-teachers/<guide>/<slug>/`. Each entry's markup is
 * content/pages/for-teachers/<guide>/<slug or index>.html, followed by the guide's source.html.
 */
export const GUIDE_SUBPAGES: Partial<
  Record<(typeof FOR_TEACHERS_GUIDES)[number]['slug'], { label: string; note?: string; entries: { slug: string; title: string }[]; footer: { href: string; title: string } }>
> = {
  'e2-visa': {
    label: 'E-2 Visa',
    entries: [
      { slug: '', title: 'Master Guide' },
      { slug: 'process', title: 'Visa Process' },
      { slug: 'documents', title: 'Packing Checklist' },
      { slug: 'consular', title: 'Consular Step' },
      { slug: 'fukuoka', title: 'Visa Run · Fukuoka' },
      { slug: 'downloads', title: 'Document Resource Hub' },
      { slug: 'consulates', title: 'Jurisdiction Hub' },
      { slug: 'workplace', title: 'Workplace Change' },
      { slug: 'extension', title: 'Visa Extension' },
      { slug: 'd10', title: 'D-10 Job-Seeker' },
      { slug: 'd4-change', title: 'D-4 → E-2 Change' },
      { slug: 'c45-camp', title: 'C-4-5 Camp Visa' },
    ],
    footer: { href: '/for-teachers/while-in-korea/', title: 'While in Korea →' },
  },
  'while-in-korea': {
    label: 'While in Korea',
    note: 'Post-arrival only · after your E-2 stamp',
    entries: [
      { slug: '', title: 'E-2 Visa Medical Check' },
      { slug: 'arc', title: 'Residence Card (ARC)' },
    ],
    footer: { href: '/for-teachers/e2-visa/', title: '← E-2 Visa Master Guide' },
  },
};

/** Title and description of each page made from a homepage panel (lessons, jobs and regions have their own). */
export const SECTION_PAGES = {
  'why-readykorea': {
    title: 'About ReadyKorea · Why Teachers Choose Us | ReadyKorea',
    description:
      'ReadyKorea was founded by a 15-year recruitment veteran: free for teachers, verified schools, and full contracted salary.',
  },
  'school-posting': {
    title: '구인 등록 · 학원 원어민 강사 채용 | ReadyKorea',
    description: '레디코리아에 원어민 영어강사 구인 공고를 등록하세요. 검증된 원어민 강사 매칭.',
  },
  'curriculum-consulting': {
    title: '커리큘럼 컨설팅 | ReadyKorea',
    description: '대치동 경험 기반 영어 커리큘럼 맞춤 설계 컨설팅.',
  },
  'why-korea': {
    title: 'Why Teach in Korea · Safety, Savings & Culture | ReadyKorea',
    description: 'Why native English teachers choose Korea: safety, savings, travel, and a guide to life in Korea.',
  },
  'why-korea-tools': {
    title: 'Teacher Tools · Savings Calculator & E-2 Visa Tracker | ReadyKorea',
    description: 'Savings calculator, pension refund estimator, E-2 visa tracker, ESL game kit and pet travel kit.',
  },
  'why-korea-survival': {
    title: 'Korea Survival Guide for Teachers | ReadyKorea',
    description: 'Survival Korean, FAQs and getting around Korea by bus for new English teachers.',
  },
  regions: {
    title: 'Region Guides · Where to Teach in Korea | ReadyKorea',
    description: 'Seoul, Gyeonggi, Busan, Daegu, Songdo and Jeju compared for English teachers.',
  },
  'for-teachers': {
    title: 'For Teachers · The 5 Things You Must Know | ReadyKorea',
    description: 'Practical guides for native English teachers in Korea: job types, interviews, E-2 visa, contracts and more.',
  },
  'ai-lab': {
    title: 'AI Lab · Tools for English Teachers | ReadyKorea',
    description: 'AI tools for English teachers in Korean academies.',
  },
  forum: {
    title: 'Teacher Forum | ReadyKorea',
    description: 'Community questions and answers from English teachers in Korea.',
  },
  tefl: {
    title: 'TEFL Certification Guide | ReadyKorea',
    description: 'Which TEFL certificate you need to teach English in Korea.',
  },
  support: {
    title: 'Support Center · Immigration & Life Guides | ReadyKorea',
    description: 'Guides for life in Korea: HiKorea appointments, immigration offices, banking, health and more.',
  },
} as const;

/** Title, description, canonical URL and Open Graph tags of a page. */
export function pageMetadata({ title, description }: { title: string; description: string }, path: string): Metadata {
  return { title, description, alternates: { canonical: path }, openGraph: { title, description, url: path } };
}
