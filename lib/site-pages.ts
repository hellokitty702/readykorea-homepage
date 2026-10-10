// Pages that used to be panels of the one-page homepage, plus the `#target` names the old site used
// for them (menu entries, in-content buttons, and `/#target` links shared elsewhere).
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

const LESSON_LEVELS = ['k1', 'k2', 'k3', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6'];

/** Sub-panels of the E-2 visa guide, switched in place on /for-teachers/e2-visa/ by `#<panel>`. */
const E2_PANELS: Record<string, string> = {
  'e2-hub': '',
  'e2-process': 'e2-process',
  'e2-documents': 'e2-documents',
  'e2-consular': 'e2-consular',
  'e2-fukuoka': 'e2-fukuoka',
  'fukuoka-visa-run': 'e2-fukuoka',
  'e2-downloads': 'e2-downloads',
  'e2-consulates': 'e2-consulates',
  'e2-workplace': 'e2-workplace',
  'e2-extension': 'e2-extension',
  'e2-d10': 'e2-d10',
  'd10-job-seeker': 'e2-d10',
  'e2-d4-change': 'e2-d4-change',
  'd4-to-e2': 'e2-d4-change',
  'e2-c45-camp': 'e2-c45-camp',
  'c4-5-camp': 'e2-c45-camp',
  'c45-camp': 'e2-c45-camp',
};

/** Old `#target` name → page URL (with `#anchor` when the target is a part of the page). */
export const SITE_ROUTES: Record<string, string> = {
  home: '/',
  jobs: '/jobs/',
  lessons: '/lessons/',
  ...Object.fromEntries(LESSON_LEVELS.map((level) => [level, `/lessons/${level}/`])),
  'why-readykorea': '/why-readykorea/',
  'school-posting': '/school-posting/',
  'curriculum-consulting': '/curriculum-consulting/',
  'why-korea': '/why-korea/',
  calculators: '/why-korea/tools/',
  'savings-calculator': '/why-korea/tools/#savings-calculator',
  'visa-tracker-anchor': '/why-korea/tools/#visa-tracker-anchor',
  survival: '/why-korea/survival/',
  'k-survival': '/why-korea/survival/#k-survival',
  'survival-faq': '/why-korea/survival/#survival-faq',
  'english-bus-guide': '/why-korea/survival/#english-bus-guide',
  regions: '/regions/',
  ...Object.fromEntries(
    REGIONS.flatMap(({ slug }) => [
      [`region-${slug}`, `/regions/${slug}/`],
      [`region-${slug}-jobs`, `/regions/${slug}/#region-${slug}-jobs`],
    ]),
  ),
  teachers: '/for-teachers/',
  'for-teachers': '/for-teachers/',
  ...Object.fromEntries(FOR_TEACHERS_GUIDES.map(({ slug }) => [slug, `/for-teachers/${slug}/`])),
  ...Object.fromEntries(
    Object.entries(E2_PANELS).map(([target, panel]) => [target, `/for-teachers/e2-visa/${panel && `#${panel}`}`]),
  ),
  'e2-medical': '/for-teachers/while-in-korea/',
  'e2-arc': '/for-teachers/while-in-korea/#e2-arc',
  ailab: '/ai-lab/',
  'ai-lab': '/ai-lab/',
  forum: '/forum/',
  tefl: '/tefl/',
  support: '/support/',
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
