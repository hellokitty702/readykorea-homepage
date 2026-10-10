// Behaviour for the pages built from the old one-page homepage (content/pages/, content/sections/):
// EN/KO text, guide sub-panels, region and support guides, calculators and modals. Loaded once by
// components/sections/page-scripts.tsx, which calls rkInitPage() after every navigation and
// rkCleanupPage() before the next one. The header is handled by components/layout/header-nav.tsx.

// ============ LANGUAGE (EN / 한국어) ============
const I18N = {
  en: {
    'nav.teachers': 'For Teachers',
    'nav.schools': 'For Schools',
    'nav.jobs.title': 'Job Board',
    'nav.jobs.sub': 'View positions posted by schools',
    'nav.lessons.title': 'Lesson Plans',
    'nav.lessons.sub': '162 plans · K1–G6',
    'nav.whyKorea.title': 'Why Korea',
    'nav.whyKorea.sub': 'Safety · savings · K-culture',
    'nav.ailab.title': 'AI Lab',
    'nav.ailab.sub': 'Tools for teachers',
    'nav.forum.title': 'Forum',
    'nav.forum.sub': 'Visa · bus · community',
    'nav.postJob.title': 'Post a Job',
    'nav.postJob.sub': 'Listed on Job Board after review',
    'nav.whyRk.title': 'Why ReadyKoreaESL',
    'nav.whyRk.sub': 'English kindergarten recruiting',
    'hero.eyebrow': '★ ReadyKoreaESL · 2026 placements open · E-2 + F-visa welcome',
    'hero.h1': 'Teach in Korea.<br>Save Money.<br>Build a Life.',
    'hero.lead': '15 years of verified placements.',
    'hero.cta.find': 'Find My Position',
    'hero.cta.join': 'Apply Now',
    'hero.cta.find.href': '/jobs/',
    'hero.cta.join.href': '/apply/',
    'hero.flags': 'Verified for E-2 Visa · 7 Countries',
    'jobs.title': 'Job Board · Open Positions',
    'jobs.meta': 'School-posted positions · Apply Now',
    'jobs.type': 'English kindergarten',
    'jobs.badge.new': 'New',
    'jobs.badge.urgent': 'Urgent',
    'jobs.col.location': 'Location',
    'jobs.col.salary': 'Salary',
    'jobs.col.start': 'Start date',
    'jobs.col.housing': 'Housing',
    'jobs.col.rating': 'Rating',
    'jobs.col.response': 'Response',
    'jobs.card1.title': 'Kindergarten lead teacher (K2–K3)',
    'jobs.card1.loc': 'Gangnam · Sinnonhyeon Stn. (Line 9)',
    'jobs.card1.housing': 'Provided',
    'jobs.card1.response': '~6 hours',
    'jobs.card2.title': 'Senior kindergarten teacher (K1–K2)',
    'jobs.card2.loc': 'Songpa · Jamsil Stn. (Line 2)',
    'jobs.card2.housing': '₩500K allowance',
    'jobs.card2.response': '~4 hours',
    'jobs.apply': 'Apply Now',
    'jobs.post': 'Post a Job',
    'jobs.viewDetail': 'View job details →',
    'whyrk.eyebrow': 'About ReadyKorea',
    'whyrk.title': 'Why ReadyKorea?',
    'whyrk.lead': 'Industry expertise built for teachers who want to succeed — not just survive — in Korea.',
    'whyrk.origin.title': 'Our Origin',
    'whyrk.origin.desc': "ReadyKorea was founded by an industry veteran with 15 years of experience in native teacher recruitment and Gangnam/Daechi-dong academy management. We don't just match; we mentor our teachers to thrive in the competitive Korean education market.",
    'whyrk.guarantee.title': 'Service Guarantee',
    'whyrk.guarantee.desc': '100% free for teachers. Our fee is covered by schools, ensuring you receive your full contracted salary without any hidden deductions or surprises. Your financial security is our priority.',
    'whyrk.flow1': '1. School posts a job',
    'whyrk.flow2': '2. Expert verification',
    'whyrk.flow3': '3. Listed on Job Board',
    'whyrk.flow4': '4. Teachers apply',
    'trust.label': 'Verified for E-2 visa · 7 countries',
    'trust.s1': 'Teachers placed',
    'trust.s2': 'Partner kindergartens',
    'trust.s3': 'Avg time to match',
    'trust.s4': "John's experience",
    'lessons.head': '9 levels. 162 lesson plans. All free for our teachers.',
    'lessons.headSub': 'From manage-day-one K1 (Ages 3-4) to KET-ready G6 (Ages 11-12). Click any card.',
    'lessons.title': '9 levels — Pick your starting point',
    'lessons.meta': 'Click any card to view full curriculum',
    'lessons.kg': 'Kindergarten · English kindergarten',
    'lessons.el': 'Elementary · Elementary school',
    'ailab.tag': '★ For native English teachers in Korean academies',
    'ailab.h1': 'The Smart Educator Hub.',
    'ailab.lead': 'Four production-grade AI tools, organized by lesson phase. Built for English teachers in Korean academies who want to operate at premium efficiency without sacrificing teaching quality.',
    'forum.tag': '★ Community · ReadyKorea Forum',
    'forum.h1': "The Educator's Lounge.",
    'forum.lead': 'Real questions from teachers on the ground in Korea — vetted answers from John (15-year recruiter) and the ReadyKorea community. Verified accounts only. No spam, no recruiter ads.',
    'whyKorea.eyebrow': 'For native English teachers considering Korea · 7 E-2 countries welcome',
    'whyKorea.h1': 'Why Korea?<br>5 reasons young teachers choose Korea.',
    'whyKorea.lead': "Korea isn't just another teach-abroad destination. It's the only place that combines world-class safety, 24/7 convenience, real savings potential, top-tier healthcare, and authentic K-culture immersion — all on a single platform.",
    'whyKorea.cta': 'Browse open positions →',
    'ft.eyebrow': 'Practical guides for native English teachers in Korea',
    'ft.h1': 'For Teachers.<br>The 5 things you must know.',
    'ft.lead': 'Before you sign a contract, read this. We focused on the 5 highest-frequency issues based on Reddit r/teachinginkorea, Korea Herald reporting, and official Korean labor law.',
  },
  ko: {
    'nav.teachers': '강사용',
    'nav.schools': '학교·학원용',
    'nav.jobs.title': '채용 공고',
    'nav.jobs.sub': '학원이 올린 포지션 보기',
    'nav.lessons.title': '레슨 플랜',
    'nav.lessons.sub': '162개 · K1–G6',
    'nav.whyKorea.title': 'Why Korea',
    'nav.whyKorea.sub': '안전 · 저축 · K-문화',
    'nav.ailab.title': 'AI Lab',
    'nav.ailab.sub': '강사용 도구',
    'nav.forum.title': '포럼',
    'nav.forum.sub': '비자 · 버스 · 커뮤니티',
    'nav.postJob.title': '채용 공고 등록',
    'nav.postJob.sub': '등록 → Job Board 노출',
    'nav.whyRk.title': 'Why ReadyKoreaESL',
    'nav.whyRk.sub': '영어유치원 전문 리크루팅',
    'hero.eyebrow': '★ ReadyKoreaESL · 2026 채용 오픈 · E-2 + F비자 환영',
    'hero.h1': '원어민 영어강사 매칭 전문 업체',
    'hero.lead': '구 김치잉글리쉬 · 15년 경력 · 검증된 E-2 비자 7개국 강사만 매칭합니다.',
    'hero.cta.find': '구인등록하기',
    'hero.cta.join': '지금 지원하기',
    'hero.cta.find.href': 'https://docs.google.com/forms/d/e/1FAIpQLSd2mex_U-3rbHk6akqp-mddBPAvtFsWSdQIzjelnV1Sp-S7tg/viewform',
    'hero.cta.join.href': '/apply/',
    'hero.flags': 'E-2 비자 인증 · 7개국',
    'jobs.title': 'Job Board · 오픈 포지션',
    'jobs.meta': '학원 등록 포지션 · 지원하기',
    'jobs.type': '영어유치원',
    'jobs.badge.new': '신규',
    'jobs.badge.urgent': '긴급',
    'jobs.col.location': '위치',
    'jobs.col.salary': '월급',
    'jobs.col.start': '시작일',
    'jobs.col.housing': '주거',
    'jobs.col.rating': '평점',
    'jobs.col.response': '응답',
    'jobs.card1.title': '유치원 주임 강사 (K2–K3)',
    'jobs.card1.loc': '강남구 · 9호선 신논현역',
    'jobs.card1.housing': '제공',
    'jobs.card1.response': '~6시간',
    'jobs.card2.title': '시니어 유치원 강사 (K1–K2)',
    'jobs.card2.loc': '송파구 · 2호선 잠실역',
    'jobs.card2.housing': '수당 50만',
    'jobs.card2.response': '~4시간',
    'jobs.apply': '지원하기',
    'jobs.post': '구인등록',
    'jobs.viewDetail': '상세 공고 보기 →',
    'whyrk.eyebrow': '레디코리아 소개',
    'whyrk.title': '왜 레디코리아인가?',
    'whyrk.lead': '한국에서 살아남는 것이 아니라 성공하는 강사를 위한 업계 전문 플랫폼.',
    'whyrk.origin.title': '우리의 시작',
    'whyrk.origin.desc': '레디코리아는 15년 원어민 강사 리크루팅 및 강남/대치동 학원 운영 경험을 가진 업계 베테랑이 설립했습니다. 단순 매칭이 아니라, 경쟁적인 한국 교육 시장에서 강사가 성장하도록 멘토링합니다.',
    'whyrk.guarantee.title': '서비스 보장',
    'whyrk.guarantee.desc': '강사에게 100% 무료. 수수료는 학원이 부담하므로 계약 급여 전액을 받으실 수 있습니다. 숨겨진 공제나 깜짝 비용 없이 재정적 안전을 보장합니다.',
    'whyrk.flow1': '1. 학원 공고 등록',
    'whyrk.flow2': '2. 전문가 검증',
    'whyrk.flow3': '3. Job Board 노출',
    'whyrk.flow4': '4. 강사 지원',
    'trust.label': 'E-2 비자 인증 · 7개국',
    'trust.s1': '배치 강사',
    'trust.s2': '파트너 유치원',
    'trust.s3': '평균 매칭 기간',
    'trust.s4': 'John의 경력',
    'lessons.head': '9레벨. 162 레슨 플랜. 강사 무료.',
    'lessons.headSub': 'K1(만 3–4세)부터 G6(만 11–12세) KET 준비까지. 카드를 클릭하세요.',
    'lessons.title': '9레벨 — 시작점 선택',
    'lessons.meta': '카드 클릭 시 전체 커리큘럼 보기',
    'lessons.kg': 'Kindergarten · 영어유치원',
    'lessons.el': 'Elementary · 초등',
    'ailab.tag': '★ 한국 학원 원어민 영어 강사용',
    'ailab.h1': '스마트 에듀케이터 허브.',
    'ailab.lead': '수업 단계별 4가지 AI 도구. 한국 학원 강사를 위한 프리미엄 효율 도구.',
    'forum.tag': '★ 커뮤니티 · ReadyKorea 포럼',
    'forum.h1': '에듀케이터 라운지.',
    'forum.lead': '한국 현지 강사들의 실제 질문 — John(15년 리크루터)과 커뮤니티의 검증된 답변. 인증 계정만. 스팸·리크루터 광고 없음.',
    'whyKorea.eyebrow': '한국 유학을 고려하는 원어민 강사 · E-2 7개국 환영',
    'whyKorea.h1': 'Why Korea?<br>젊은 강사가 한국을 선택하는 5가지 이유.',
    'whyKorea.lead': '한국은 단순한 teach-abroad가 아닙니다. 세계적 안전, 24시간 편의, 실질적 저축, 최고 수준 의료, K-문화 몰입이 한곳에 있습니다.',
    'whyKorea.cta': '오픈 포지션 보기 →',
    'ft.eyebrow': '한국 원어민 강사 실용 가이드',
    'ft.h1': 'For Teachers.<br>꼭 알아야 할 5가지.',
    'ft.lead': '계약 전에 읽으세요. Reddit r/teachinginkorea, 한국 언론 보도 및 노동법 기반 고빈도 이슈 5가지에 집중했습니다.',
  },
};

let currentLang = 'en';

// Teacher application Google Form: still used by the free-access popup (openTeacherApplyForm).
// Job Board "Apply Now" buttons go to the on-site form at /apply/.
const TEACHER_APPLY_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSf7MvPqQfioWQ0BugCat9gvgdYpLfhp8CSaB3R-Q2u3gy8zUw/viewform';

function openTeacherApplyForm() {
  window.open(TEACHER_APPLY_FORM, '_blank', 'noopener,noreferrer');
}

// Page text in the chosen language (header-nav.tsx stores the choice and announces it with `rk:lang`).
function applyLanguage(lang) {
  currentLang = lang === 'ko' ? 'ko' : 'en';
  const dict = I18N[currentLang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  document.querySelectorAll('[data-i18n-href]').forEach(el => {
    const key = el.getAttribute('data-i18n-href');
    if (dict[key] !== undefined) {
      el.setAttribute('href', dict[key]);
      if (dict[key].startsWith('http')) {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      } else {
        el.removeAttribute('target');
        el.removeAttribute('rel');
      }
    }
  });
}

function savedLanguage() {
  try {
    return localStorage.getItem('rk-lang') === 'ko' ? 'ko' : 'en';
  } catch (e) {
    return 'en';
  }
}
window.addEventListener('rk:lang', (e) => applyLanguage(e.detail));

// ============ NAVIGATION ============
// Buttons with data-nav="<target>" open the page for that target (window.rkRoutes, from lib/site-pages.ts).
// A target on the current page (e.g. an E-2 visa sub-panel) only changes the #hash.
function rkGo(target) {
  const href = (window.rkRoutes || {})[target];
  if (!href) return;
  const url = new URL(href, location.href);
  if (url.pathname === location.pathname) {
    history.pushState(null, '', url.hash || url.pathname);
    showHashTarget();
    return;
  }
  if (window.rkNavigate) window.rkNavigate(url.pathname + url.hash);
  else location.href = url.pathname + url.hash;
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-nav]');
  if (!el || el.closest('header.site')) return;
  e.preventDefault();
  rkGo(el.dataset.nav);
});

// ============ GUIDE SUB-PANELS (E-2 visa, While in Korea) ============
const E2_VISA_PANELS = new Set([
  'e2-hub', 'e2-process', 'e2-documents', 'e2-consular', 'e2-fukuoka',
  'e2-downloads', 'e2-consulates', 'e2-workplace', 'e2-extension', 'e2-d10', 'e2-d4-change', 'e2-c45-camp'
]);

const WHILE_IN_KOREA_PANELS = new Set(['e2-medical', 'e2-arc']);

const E2_PANEL_FROM_TARGET = {
  'e2-visa': 'e2-hub',
  'e2-hub': 'e2-hub',
  'e2-process': 'e2-process',
  'e2-workplace': 'e2-workplace',
  'e2-extension': 'e2-extension',
  'e2-d10': 'e2-d10',
  'd10-job-seeker': 'e2-d10',
  'e2-d4-change': 'e2-d4-change',
  'd4-to-e2': 'e2-d4-change',
  'e2-c45-camp': 'e2-c45-camp',
  'c4-5-camp': 'e2-c45-camp',
  'c45-camp': 'e2-c45-camp',
  'e2-documents': 'e2-documents',
  'e2-consular': 'e2-consular',
  'fukuoka-visa-run': 'e2-fukuoka',
  'e2-fukuoka': 'e2-fukuoka',
  'e2-downloads': 'e2-downloads',
  'e2-consulates': 'e2-consulates',
};

function setE2VisaPanel(panelId) {
  const hub = document.querySelector('#e2-visa .e2-visa-hub');
  if (!hub) return;
  const active = E2_VISA_PANELS.has(panelId) ? panelId : 'e2-hub';
  hub.querySelectorAll('[data-e2-panel]').forEach(p => {
    p.classList.toggle('e2-panel-visible', p.dataset.e2Panel === active);
  });
  hub.querySelectorAll('.e2-visa-nav-btn[data-e2-panel]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.e2Panel === active);
  });
}

function setWhileInKoreaPanel(panelId) {
  const hub = document.querySelector('#while-in-korea .e2-visa-hub');
  if (!hub) return;
  const active = WHILE_IN_KOREA_PANELS.has(panelId) ? panelId : 'e2-medical';
  hub.querySelectorAll('[data-wik-panel]').forEach(p => {
    p.classList.toggle('wik-panel-visible', p.dataset.wikPanel === active);
  });
  hub.querySelectorAll('.wik-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.wikPanel === active);
  });
}

// The #hash picks the sub-panel (e.g. /for-teachers/e2-visa/#e2-documents), or scrolls to an anchor.
function showHashTarget() {
  const id = location.hash.slice(1);
  if (document.querySelector('#e2-visa .e2-visa-hub')) {
    setE2VisaPanel(E2_PANEL_FROM_TARGET[id] || 'e2-hub');
    if (id) document.getElementById('e2-visa').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (document.querySelector('#while-in-korea .e2-visa-hub')) {
    setWhileInKoreaPanel(WHILE_IN_KOREA_PANELS.has(id) ? id : 'e2-medical');
    return;
  }
  const el = id && document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.addEventListener('hashchange', showHashTarget);

document.addEventListener('click', (e) => {
  const panelBtn = e.target.closest('#e2-visa [data-e2-panel]');
  if (panelBtn) {
    if (!panelBtn.classList.contains('e2-visa-nav-btn') && !panelBtn.classList.contains('e2-hub-spoke') && !panelBtn.classList.contains('e2-hub-back')) return;
    e.preventDefault();
    const panel = panelBtn.dataset.e2Panel;
    setE2VisaPanel(panel);
    history.pushState(null, '', panel === 'e2-hub' ? location.pathname : '#' + panel);
    return;
  }
  const wikBtn = e.target.closest('#while-in-korea .wik-nav-btn[data-wik-panel]');
  if (wikBtn) {
    e.preventDefault();
    const panel = wikBtn.dataset.wikPanel;
    setWhileInKoreaPanel(panel);
    history.pushState(null, '', '#' + panel);
  }
});

// ============ FORUM POST TOGGLE ============
function toggleForumPost(key) {
  const post = document.querySelector('.forum-post[data-post="' + key + '"]');
  if (post) post.classList.toggle('open');
}

// ============ REGION DETAIL · neighborhood guides ============
const REGION_HOOD_GUIDES = {
  seoul: {
    gangnam: {
      title: 'Gangnam — Premium hagwon corridor',
      tips: [
        'Subway: Line 2 Gangnam Station + Line 9 Sinnonhyeon — 10 min walk between major hagwon clusters.',
        'Housing: School-provided studios typical; expect 18–25 m² walk-up or officetel units.',
        'Expat infra: Starbucks density highest in Korea; Olive Young flagship; Costco Yangjae 15 min taxi.',
        'Best for: experienced teachers, higher salary targets, parents who expect Cambridge-track curriculum.',
        'Watch out: competition is fierce — schools here can replace teachers fast if performance slips.',
      ],
    },
    daechi: {
      title: 'Daechi-dong — Hagwon 1번지',
      tips: [
        'Subway: Line 3 (Daechi, Hangnyeoul), Bundang Line (Hanti, Dogok) — 4 stations within 1 km.',
        'Gyms: 24-hour chains ₩70K–110K/mo; ask director about corporate discounts.',
        'Housing: One-room studios 6 m from school typical; induction stove, no oven, rarely a bathtub.',
        'Food: Hongseong Garden (Vietnamese), Plant (vegan), El Pino 323 (Mexican) all within 1 km.',
        'ReadyKorea: We check the apartment in person before you sign — non-negotiable for Daechi placements.',
      ],
    },
    hongdae: {
      title: 'Hongdae — Nightlife & university energy',
      tips: [
        'Subway: Line 2 Hongik Univ. Station — direct airport AREX connection at nearby Gongdeok.',
        'Vibe: Buskers, indie clubs, 24-hour cafes. Popular with teachers in their 20s.',
        'Commute warning: Living here + teaching in Gangnam/Daechi = 40–50 min each way.',
        'Study: Tons of study cafes; WiFi reliable but noise varies — bring headphones.',
        'Best for: teachers at Mapo/Yeonnam/Sinchon hagwons, not Daechi commuters.',
      ],
    },
    itaewon: {
      title: 'Itaewon — International daily life',
      tips: [
        'Subway: Line 6 Itaewon Station — Line 4 transfer at Samgakji for Yongsan jobs.',
        'English: Highest concentration of English-speaking staff (clinics, dentists, shops).',
        'Food: Global cuisine — Mexican, Indian, Middle Eastern when Korean food fatigue hits.',
        'Rent: Higher than Songpa; studios often smaller for the price.',
        'Best for: teachers who want international community over Korean immersion.',
      ],
    },
    jamsil: {
      title: 'Jamsil · Songpa — Family hagwon zone',
      tips: [
        'Subway: Line 2 Jamsil + Line 8 connections — Lotte World, Olympic Park nearby.',
        'Schools: Family-oriented kindergartens; calmer parent culture than Gangnam.',
        'Rent: ₩750K–₩950K typical — cheaper than Daechi for comparable size.',
        'Weekends: Lotte Tower, Seokchon Lake cherry blossoms, easier access to Gyeonggi day trips.',
        'Best for: teachers who want structure, families, and shorter commutes within Songpa.',
      ],
    },
    yeonnam: {
      title: 'Mapo · Yeonnam-dong — Boutique academy belt',
      tips: [
        'Subway: Line 2 Hongdae-adjacent + Line 6 World Cup Stadium — 10 min to Hongdae nightlife.',
        'Schools: Smaller boutique hagwons; younger directors; less corporate than Daechi chains.',
        'Cafes: Brunch culture central — Coffee Libre, Anthracite, Onion-style spots for lesson prep.',
        'Rent: Mid-range; popular with first-year teachers who want "trendy Seoul" without Gangnam prices.',
        'Best for: teachers who want cafe culture + manageable hagwon hours.',
      ],
    },
  },
  busan: {
    haeundae: {
      title: 'Haeundae — Beach expat capital',
      tips: [
        'Subway: Line 2 Haeundae Station — boardwalk 5 min walk. Marine City towers adjacent.',
        'Rent: ₩450K–600K if housing not provided; deposit ₩5–10M. Lower than Seoul beachfront equivalent.',
        'Groceries: Lotte Mart Haeundae — ₩300K–450K/mo cooking 5 days/week.',
        'Clinics: Haeundae Paik Hospital international center; several English private clinics in Marine City.',
        'Best for: teachers who want ocean lifestyle and accept lower monthly savings.',
      ],
    },
    seomyeon: {
      title: 'Seomyeon — Busan downtown',
      tips: [
        'Subway: Line 1 & 2 transfer hub — connect anywhere in Busan from here.',
        'Hagwons: Central cluster — easier job switching than Haeundae-only placements.',
        'Nightlife: Noraebang alley, cheaper than Seoul. Shopping and street food central.',
        'Rent: Lower than Haeundae beachfront; more Korean daily life, fewer expats.',
        'Best for: teachers who prioritize transit hub over beach walkability.',
      ],
    },
    gwangalli: {
      title: 'Gwangalli — Diamond Bridge views',
      tips: [
        'Subway: Line 2 Gwangalli Station — 1 stop from Haeundae.',
        'Summer: Diamond Bridge fireworks every Saturday — free, crowded, worth it.',
        'Cafes: Beach-facing brunch spots — ₩6K–8K drinks, popular with young teachers.',
        'Vibe: Slightly younger and more local than Haeundae tourist strip.',
        'Best for: teachers who want beach access without Haeundae premium rent.',
      ],
    },
    songjeong: {
      title: 'Songjeong — Surf beach',
      tips: [
        'Access: Donghae Line or 20 min from Haeundae — weekend surf spot.',
        'Surf: Board rental ₩20K, lessons ₩50K — small English-speaking surf community.',
        'Vibe: Quieter than Haeundae — local seafood restaurants, less nightlife.',
        'Hagwons: Fewer jobs here — most teachers visit weekends, live in Haeundae/Seomyeon.',
        'Best for: weekend escape, not daily commute base.',
      ],
    },
    centum: {
      title: 'Centum City — Mall & Costco',
      tips: [
        'Subway: Line 2 Centum City — Guinness-largest department store building.',
        'Shopping: Costco, Shinsegae, Lotte Cinema — one-stop weekend errands.',
        'Jobs: Premium academies in Marine City adjacency — affluent parent base.',
        'Rent: Higher than Seomyeon, comparable to Haeundae inland blocks.',
        'Best for: teachers who want mall infrastructure + Marine City dining.',
      ],
    },
    marine: {
      title: 'Marine City — Expat dining row',
      tips: [
        'Food: El Carbon (Mexican), Namaste (Indian), Forno (Italian) — best foreign density in Busan.',
        'Bars: HQ Gwangan, Wolfhound — Saturday expat circuit (short taxi from Haeundae).',
        'Views: High-rise waterfront — popular Instagram spot, windy in winter.',
        'Housing: Officetel studios common; check hagwon commute before signing lease.',
        'Best for: teachers who cook less and eat out more.',
      ],
    },
  },
  daegu: {
    dongseongno: {
      title: 'Dongseongno — Downtown main street',
      tips: [
        'Subway: Line 1 Dongseongno · Banwoldang — pedestrian shopping and food spine.',
        'Nightlife: Noraebang, chicken & beer, street performances — Daegu\'s default evening zone.',
        'Hagwons: Central cluster accessible by metro — mix of kids and teen academies.',
        'Rent: ₩500K–₩650K if housing not provided — among the lowest metro rates in Korea.',
        'Best for: teachers who want walkable downtown energy on a provincial salary.',
      ],
    },
    banwoldang: {
      title: 'Banwoldang — Metro crossroads',
      tips: [
        'Subway: Line 1 & 2 transfer — connect anywhere in Daegu from one hub.',
        'Errands: Department stores, cafes, banks — central Daegu daily-life anchor.',
        'Commute: Most Daegu hagwon jobs cite Banwoldang ±2 stops — live on your line.',
        'Cafes: Starbucks and local chains — reliable lesson-prep WiFi.',
        'Best for: teachers who want maximum transit flexibility in a compact city.',
      ],
    },
    suseong: {
      title: 'Suseong — Lake Park affluent belt',
      tips: [
        'Subway: Line 2 Suseong · Suseongmot — lake loop running and cafe culture.',
        'Hagwons: Premium family English kindergartens — highest Daegu parent expectations.',
        'Rent: ₩600K–₩750K — top of Daegu market, still below Seoul outer wards.',
        'Vibe: Affluent families, paddle boats, seasonal festivals — calmer than Dongseongno.',
        'Best for: experienced teachers targeting premium provincial hagwon placements.',
      ],
    },
    duryu: {
      title: 'Duryu · Dalseo — West Daegu',
      tips: [
        'Subway: Line 3 Duryu Park area — green space, residential towers.',
        'Rent: Lower than Suseong — ₩450K–₩600K typical if housing not provided.',
        'Vibe: Local Korean daily life — fewer English signs, quieter evenings.',
        'Commute: Line 3 to Banwoldang ~20 min — verify school location before signing.',
        'Best for: budget-conscious teachers with provided housing near a west-Daegu school.',
      ],
    },
    sinam: {
      title: 'Sinam · KNU — University north',
      tips: [
        'Area: Kyungpook National University adjacency — student cafes, cheaper eats.',
        'Subway: Line 1 north corridor — Sinam · Ayanggyo stops.',
        'Nightlife: University bar street — younger crowd than downtown.',
        'Hospital: Kyungpook National Univ Hospital — serious care option for Daegu teachers.',
        'Best for: teachers placed north Daegu who want student-town energy and lower rent.',
      ],
    },
    palgong: {
      title: 'Palgongsan — Mountain north',
      tips: [
        'Access: Bus from east Daegu ~40 min — cable car, Gatbawi Buddha, temple trails.',
        'Weekends: Default nature escape — cooler than basin heat in summer.',
        'Not residential: Live in Suseong or Banwoldang corridor — use mountain as park.',
        'Season: Autumn foliage peak — book cable car early on clear weekends.',
        'Best for: teachers who need mountain resets without leaving the metro area.',
      ],
    },
  },
  songdo: {
    'central-park': {
      title: 'Central Park — Songdo\'s living room',
      tips: [
        'Park: 4 km canal park — kayak rentals, water taxis, marathon routes.',
        'Cafes: Brunch row along waterfront — Coffee Libre, Onion Songdo nearby.',
        'Social: Where Songdo expats meet on weekends — dog walkers, runners, families.',
        'Housing: Premium towers facing park — sea + city views, higher rent.',
        'Best for: teachers who want daily green space without leaving the city.',
      ],
    },
    ifez: {
      title: 'IFEZ · Convensia — International hub',
      tips: [
        'Schools: Chadwick International, GMU Korea, SUNY Korea — native English community.',
        'Events: Convensia hosts expos, food festivals, teacher job fairs occasionally.',
        'Architecture: Tri-bowl, Compact Smart City — Instagram landmarks, public WiFi.',
        'Hagwons: English kindergartens serving international + affluent Korean families.',
        'Best for: teachers who want international-school-adjacent social network.',
      ],
    },
    'songdo-dong': {
      title: 'Songdo-dong — Residential towers',
      tips: [
        'Housing: Studios 30% larger than Seoul — many contracts offer 투룸 (2-room).',
        'Buildings: Most under 15 years old — modern induction, in-unit laundry standard.',
        'Gyms: Commercial fitness clubs in basements — ₩70K/mo typical.',
        'Daily life: Walk or bike to hagwon — buses less critical than Seoul.',
        'Best for: teachers who prioritize apartment size over nightlife access.',
      ],
    },
    'incheon-station': {
      title: 'Incheon Station — Transit & Chinatown',
      tips: [
        'Subway: Line 1 hub — faster Seoul access than deep Songdo, older neighborhood.',
        'Chinatown: Weekend jjajangmyeon pilgrimage — 20 min from Songdo core.',
        'Rent: Cheaper than IFEZ towers — more local Korean daily life.',
        'Commute: 15–25 min to Songdo hagwons by bus or Line 1.',
        'Best for: budget-conscious teachers who don\'t mind older buildings.',
      ],
    },
    cheongna: {
      title: 'Cheongna — West Songdo growth',
      tips: [
        'Vibe: Another planned district — quieter, growing hagwon strip.',
        'Rent: Slightly below Songdo IFEZ core — newer towers still spacious.',
        'Commute: Bus to IFEZ 15–20 min — verify hagwon location before signing.',
        'Families: Local Korean parent base — less international than Chadwick zone.',
        'Best for: first-year teachers wanting space without IFEZ premium.',
      ],
    },
    airport: {
      title: 'ICN Airport corridor',
      tips: [
        'Taxi: Songdo to Incheon Airport ~20 min · ₩25K–35K — best in Korea for teachers.',
        'Bus: Airport limousine ~35 min · stops at Convensia and Central Park.',
        'Use case: 6am flights, visa runs to Japan, parents visiting from abroad.',
        'Not residential — but major reason teachers choose Songdo over Bundang.',
        'Factor airport access into your 12-month contract decision.',
      ],
    },
  },
  bundang: {
    pangyo: {
      title: 'Pangyo — Tech valley',
      tips: [
        'Vibe: Korea\'s Silicon Valley — Kakao, Naver, startups. English-friendly cafes everywhere.',
        'Subway: Shinbundang Line Pangyo Station — express to Gangnam ~17 min.',
        'Hagwons: Boutique academies serving tech-worker families. Higher parent education level.',
        'Rent: Premium but still below Daechi per m² — newer officetels with good amenities.',
        'Best for: teachers who want modern Korea + easy Seoul access without Seoul rent.',
      ],
    },
    jeongja: {
      title: 'Jeongja — Bundang heart',
      tips: [
        'Subway: Bundang Line Jeongja — transfer hub for Suwon and Seoul lines.',
        'Shopping: AK Plaza, Hyundai Department Store — central Bundang errands.',
        'Cafes: Onion Bundang, Coffee Libre — popular teacher work-coffee spots.',
        'Housing: Mix of older apartments and newer towers — verify walk to station.',
        'Best for: teachers who want Bundang center without Pangyo premium.',
      ],
    },
    seohyeon: {
      title: 'Seohyeon · Sunae',
      tips: [
        'Subway: Bundang Line Seohyeon — residential family zone.',
        'Vibe: Top school district energy — parents invest heavily in English education.',
        'Parks: Sunae wetland + Tancheon stream trail access for weekend runs.',
        'Rent: Mid-range Bundang — ₩800K–₩950K typical if housing not provided.',
        'Best for: family hagwon teachers who want calm evenings.',
      ],
    },
    yatap: {
      title: 'Yatap — East Bundang',
      tips: [
        'Subway: Bundang Line Yatap — Line 8 connection for Songpa/Jamsil jobs.',
        'Commute: Some teachers live Yatap, work Songpa — 30 min subway feasible.',
        'Cost: Slightly cheaper rent than Jeongja/Pangyo core.',
        'Gyms: Local fitness chains ₩70K–90K/mo — less crowded than Gangnam.',
        'Best for: budget-conscious teachers still in Gyeonggi premium school district.',
      ],
    },
    ori: {
      title: 'Ori — Bundang Line terminus',
      tips: [
        'Subway: End of Bundang Line — direct to Gangnam without transfers.',
        'Vibe: Quieter, more suburban — larger apartments common.',
        'Commute: 35–45 min to Gangnam off-peak — verify before signing hagwon contract.',
        'Nature: Gateway to Yongin (Everland, Korean Folk Village) weekend trips.',
        'Best for: teachers who prioritize space over nightlife.',
      ],
    },
    tancheon: {
      title: 'Tancheon stream corridor',
      tips: [
        'Trail: Paved bike/run path through all of Bundang — teachers run after hagwon.',
        'Social: Weekend cycling groups, dog walkers, picnic culture.',
        'Access: Most Bundang neighborhoods connect within 10 min walk to trail.',
        'Free gym: Outdoor exercise stations along stream — popular with expats.',
        'Best for: daily decompression without leaving the city.',
      ],
    },
  },
  suwon: {
    yeongtong: {
      title: 'Yeongtong — Samsung hagwon belt',
      tips: [
        'Subway: Suin-Bundang Line Yeongtong — links to Mangpo, Suwon, and Bundang corridor.',
        'Hagwons: Dense English kindergarten strip serving Samsung + tech families.',
        'Vibe: Busiest teacher zone in Suwon — cafes, gyms, academies within walking radius.',
        'Rent: ₩750K–₩900K typical if housing not provided — below Bundang, above Jangan.',
        'Best for: teachers placed in west Suwon hagwon cluster who want walk-to-work.',
      ],
    },
    mangpo: {
      title: 'Mangpo — Line 1 teacher housing',
      tips: [
        'Subway: Line 1 Mangpo Station — direct Seoul access ~45 min off-peak.',
        'Housing: Newer officetels and towers — popular with teachers who self-arrange rent.',
        'Cafes: Laptop-friendly rows near station — less crowded than Gangnam Starbucks.',
        'Commute: Also on Suin-Bundang — transfer to Yeongtong hagwons in 10 min.',
        'Best for: teachers who want Line 1 Seoul link + modern apartment stock.',
      ],
    },
    gwanggyo: {
      title: 'Gwanggyo — New city center',
      tips: [
        'Subway: Shinbundang Gwanggyo — ~35 min express to Gangnam when line is clear.',
        'Vibe: Planned new town — Gwanggyo Lake Park, AK Plaza, family-oriented.',
        'Hagwons: Growing English kindergarten strip — newer facilities, Shinbundang parents.',
        'Rent: Mid-high for Suwon — premium for lake-view towers and new builds.',
        'Best for: teachers who want Bundang-like modern Korea at slightly lower cost.',
      ],
    },
    ingye: {
      title: 'Ingye · Paldalmun — Old Suwon downtown',
      tips: [
        'Vibe: Historic core — Paldalmun Gate, pedestrian streets, local bar scene.',
        'Nightlife: Suwon\'s best walkable evening zone — chicken & beer, noraebang.',
        'Food: Suwon galbi specialty restaurants — regional BBQ, not tourist pricing if you go local.',
        'Housing: Older apartments — cheaper than Mangpo but verify hagwon commute time.',
        'Best for: teachers who want city energy and weekend culture at their doorstep.',
      ],
    },
    jangan: {
      title: 'Jangan-gu — North Suwon residential',
      tips: [
        'Vibe: Quieter, more local Korean daily life — fewer English signs than Yeongtong.',
        'Rent: Lowest in Suwon proper — ₩650K–₩800K range if housing not provided.',
        'Hagwons: Family academies scattered — often need bus to nearest subway.',
        'Commute: Bus to Suwon Station or Sungkyunkwan Univ Line 1 stop — plan 15–20 min.',
        'Best for: budget-conscious teachers with provided housing near a specific school.',
      ],
    },
    hwaseong: {
      title: 'Hwaseong Fortress corridor',
      tips: [
        'Culture: UNESCO fortress wall — 5.7 km loop walk, night lantern tours in season.',
        'Weekends: Default teacher decompression — free, photogenic, 15 min from Ingye.',
        'Events: Suwon cultural festivals along the wall — check city calendar spring/fall.',
        'Not residential: Live near Ingye/Mangpo — use fortress as park, not commute anchor.',
        'Best for: teachers who want historic Korea in daily life without leaving Gyeonggi.',
      ],
    },
  },
  yongin: {
    suji: {
      title: 'Suji — Bundang Line hagwon belt',
      tips: [
        'Subway: Suin-Bundang Line Suji area — direct link to Bundang, Wangsimni, Seolleung.',
        'Hagwons: Dense family English kindergarten strip — top school-district parent pressure.',
        'Housing: Newer towers and officetels — larger units than Seoul, ₩700K–₩850K typical.',
        'Cafes: Suji cafe rows — popular teacher work-coffee zone, less crowded than Gangnam.',
        'Best for: teachers who want Bundang-adjacent jobs without Bundang rent.',
      ],
    },
    sanghyeon: {
      title: 'Sanghyeon — Quiet Suji-adjacent',
      tips: [
        'Subway: Suin-Bundang Sanghyeon Station — one stop from Suji, calmer residential.',
        'Vibe: Family towers, playgrounds, school-zone energy — quieter evenings than Suji core.',
        'Rent: Slightly below Suji station frontage — still premium Yongin pricing.',
        'Commute: Walk or short bus to Suji hagwon cluster — verify hill/walk time in summer.',
        'Best for: teachers with provided housing near a specific Sanghyeon-block academy.',
      ],
    },
    giheung: {
      title: 'Giheung — Everland & city hall zone',
      tips: [
        'Subway: Suin-Bundang Giheung — south Yongin corridor toward Suwon and Everland.',
        'Attractions: Everland 15–20 min by bus — default weekend for south Gyeonggi teachers.',
        'Hagwons: Scattered family academies — often bus-linked, not walk-to-subway standard.',
        'Rent: Lower than Suji per m² — more space, fewer English-friendly daily services.',
        'Best for: teachers who prioritize apartment size + theme-park weekends over nightlife.',
      ],
    },
    dongbaek: {
      title: 'Dongbaek — Shinbundang new town',
      tips: [
        'Subway: Shinbundang Dongbaek — express toward Pangyo and Gangnam ~25–35 min.',
        'Vibe: Planned towers, malls, young families — Bundang-like without Bundang label.',
        'Hagwons: Growing English kindergarten strip serving Shinbundang commuter parents.',
        'Rent: Mid-range Yongin premium — pay for express-line access to Seoul job interviews.',
        'Best for: teachers who need Gangnam reach without living in Seocho-gu rent zone.',
      ],
    },
    'folk-village': {
      title: 'Korean Folk Village — Weekend culture',
      tips: [
        'Access: Bus from Giheung/Suwon ~30 min — not a daily commute anchor.',
        'Use case: Hagwon field trips, Joseon-era cultural days, guest entertainment.',
        'Tickets: ₩37K adult full price — watch for teacher-group or seasonal discounts.',
        'Overlap: Some Yongin hagwons book annual staff outings here — ask your director.',
        'Best for: weekend Korea immersion without a Seoul museum trip.',
      ],
    },
    costco: {
      title: 'Costco Yongin — Bulk shopping anchor',
      tips: [
        'Location: South Gyeonggi warehouse — serves Yongin, Suwon, Bundang teacher networks.',
        'Membership: ₩38,500/year — split with roommates, one trip pays for itself in imports.',
        'Transit: Car or taxi most practical — coordinate monthly runs with co-teachers.',
        'Best buys: Cheese, meat, household basics, wine — what local marts don\'t stock well.',
        'Best for: every south-Gyeonggi teacher regardless of which Yongin neighborhood you land in.',
      ],
    },
  },
  ilsan: {
    jeongbalsan: {
      title: 'Jeongbalsan — Line 3 commercial core',
      tips: [
        'Subway: Line 3 Jeongbalsan — busiest Ilsan station, Lafesta/Western Dom mall access.',
        'Hagwons: Dense family English kindergarten strip — Jeongbalsan-Janghang belt.',
        'Cafes: High cafe density — popular teacher lesson-prep and work-coffee zone.',
        'Rent: ₩750K–₩900K if housing not provided — premium for walk-to-mall convenience.',
        'Best for: teachers placed in central Ilsan hagwon cluster who want urban amenities.',
      ],
    },
    'lake-park': {
      title: 'Ilsan Lake Park — Urban green anchor',
      tips: [
        'Size: 91 hectares — one of Korea\'s largest urban parks, ringed by residential towers.',
        'Activities: Running, cycling, picnic chicken delivery, seasonal flower festivals.',
        'Commute: Not a station — live within 15 min walk if you want daily park access.',
        'Social: Weekend teacher meetups common on east lawn — informal expat network.',
        'Best for: daily decompression without leaving Goyang — Ilsan\'s signature perk.',
      ],
    },
    daehwa: {
      title: 'Daehwa — Gyeongui-Jungang new town',
      tips: [
        'Subway: Gyeongui-Jungang Daehwa + Line 3 interchange — dual-line access.',
        'Seoul link: ~30 min to Hongdae off-peak — west Gyeonggi\'s best nightlife pipeline.',
        'Housing: Newer towers, family-oriented — larger units than Seoul officetels.',
        'Hagwons: Growing English kindergarten strip serving Gyeongui commuter parents.',
        'Best for: teachers who want Hongdae access without living in Mapo rent zone.',
      ],
    },
    baekseok: {
      title: 'Baekseok · Janghang — Family residential',
      tips: [
        'Subway: Line 3 Baekseok + Janghang — calmer than Jeongbalsan, still hagwon-adjacent.',
        'Vibe: School-district towers, playgrounds, family evening quiet.',
        'Rent: Mid Ilsan — ₩700K–₩850K typical if housing not provided.',
        'Commute: Short bus or walk to Jeongbalsan hagwon cluster — verify hill routes.',
        'Best for: teachers with provided housing near a specific Baekseok-block academy.',
      ],
    },
    haengsin: {
      title: 'Haengsin — KTX & west hub',
      tips: [
        'Rail: Gyeongui-Jungang + KTX Haengsin — weekend Busan/Daegu without Seoul Station.',
        'Vibe: Transit hub, slightly older commercial strip west of Lake Park core.',
        'Commute: Gyeongui to Hongdae ~35 min — bus links to Jeongbalsan hagwons 15–20 min.',
        'Rent: Often lower than Jeongbalsan frontage — more bus-dependent daily life.',
        'Best for: teachers who travel Korea on weekends and tolerate bus-first weekdays.',
      ],
    },
    kintex: {
      title: 'KINTEX — West Ilsan convention zone',
      tips: [
        'Location: Korea International Exhibition Center — west fringe of Ilsan, Paju border.',
        'Hagwons: Scattered family academies — growing strip, often bus-linked from Line 3.',
        'Events: Expos and fairs occasionally — English-speaking volunteer/network opportunities.',
        'Commute: Bus to Jeongbalsan or Haengsin 20–30 min — test on Naver before signing.',
        'Best for: teachers with provided housing in west Goyang who want quieter evenings.',
      ],
    },
  },
  daechi: {
    'daechi-core': {
      title: 'Daechi-dong core — Eonju-ro hagwon strip',
      tips: [
        'Subway: Daechi Station Line 3 — namesake of the hagwon strip on Eonju-ro.',
        'Jobs: Densest English-academy cluster on Earth — walk-to-work housing standard.',
        'Housing: 18–25 m² studios, 6 m from school typical. No oven, rarely bathtub.',
        'Parents: Premium tuition — highest expectations and competition among teachers.',
        'ReadyKorea: Apartment checked on foot before you sign — non-negotiable.',
      ],
    },
    hanti: {
      title: 'Hanti · Dogok — Bundang Line access',
      tips: [
        'Subway: Hanti + Dogok — Bundang Line + Line 3. Weekend trips to Bundang/Suwon.',
        'Gyms: Pilates & barre studios clustered here — ₩200K–300K/mo premium tier.',
        'Commute to Gangnam Station: ~10 min. Hongdae: 35–40 min. Airport: 80–100 min.',
        'Rent: Comparable to Daechi core — check exact block before signing.',
        'Best for: teachers who want Daechi jobs + express line to Gyeonggi.',
      ],
    },
    hangnyeoul: {
      title: 'Hangnyeoul — One stop west',
      tips: [
        'Subway: Hangnyeoul Line 3 — one stop from Daechi, slightly quieter residential.',
        'Rent: Marginally lower than Eonju-ro frontage — still premium Seocho-gu.',
        'Food: Hongseong Garden (Vietnamese), Eat & Eat (Thai) within 1 km.',
        'Starbucks: Daechi Hyundai basement — most teachers\' default work cafe.',
        'Best for: teachers who want Daechi access without loudest block noise.',
      ],
    },
    cheongdam: {
      title: 'Cheongdam · Apgujeong fringe',
      tips: [
        'Subway: Cheongdam Line 7 — luxury retail zone adjacent to Daechi.',
        'Parents: Ultra-high-income families — some hagwons here pay top of market.',
        'Pressure: Highest cosmetic/presentation expectations for teachers in Korea.',
        'Food: Fine dining + hidden lunch specials — ask co-teacher for ₩10K spots.',
        'Best for: experienced teachers comfortable with luxury-hagwon culture.',
      ],
    },
    gangnam: {
      title: 'Gangnam Station corridor',
      tips: [
        'Subway: Line 2 Gangnam — 10 min from Daechi. Default Seoul mental image.',
        'Nightlife: Station basement bars — post-hagwon drinks near but not in Daechi.',
        'Costco: Yangjae 15 min taxi — monthly bulk run essential.',
        'Salaries: ₩2.8M–₩3.4M typical for premium kindergartens in this zone.',
        'Best for: teachers placed Daechi who socialize in Gangnam on weekends.',
      ],
    },
    expat: {
      title: 'Daechi expat infrastructure',
      tips: [
        'Starbucks: 6 within 600 m radius — unprecedented density.',
        'Clinics: Soonchunhyang International (Yongsan 20 min), Yonsei Severance (20 min).',
        'Local clinics: Use Papago — works for most visits.',
        'Gyms: 24-hour chains every 300 m — ask director about corporate discount.',
        'Olive Young Daechi flagship — pharmacy + cosmetics, English-speaking staff.',
      ],
    },
  },
  jeju: {
    'jeju-city': {
      title: 'Jeju City — Airport & downtown hub',
      tips: [
        'Airport: Jeju International 15 min from downtown — gateway for all island placements.',
        'Hagwons: Densest island English academy cluster — walkable downtown jobs possible.',
        'Services: Best expat infrastructure on island — banks, clinics, foreign-food options.',
        'Rent: ₩500K–₩650K if housing not provided — lower than Seoul, car costs offset savings.',
        'Best for: teachers who want island life without fully rural EPIK isolation.',
      ],
    },
    seogwipo: {
      title: 'Seogwipo — South coast base',
      tips: [
        'Vibe: Waterfalls (Cheonjiyeon, Jeongbang), Olle Trail starts, slower pace than north.',
        'Jobs: South-coast EPIK schools + scattered hagwons — verify housing distance.',
        'Commute: 1 hour from Jeju City by car — bus ~90 min; do not underestimate.',
        'Food: Seafood stew culture — haemul-tang alleys, local markets.',
        'Best for: teachers placed south Jeju who accept car-first daily life.',
      ],
    },
    aewol: {
      title: 'Aewol · Handam — Cafe coast',
      tips: [
        'Vibe: West coast cafe road — sunset drives, Instagram cliffs, digital-nomad crowd.',
        'Housing: Scenic officetels and guesthouses — popular with teachers who have cars.',
        'Work: Laptop-friendly cafes with ocean view — lesson prep with a view.',
        'Commute: 30–40 min to Jeju City by car — not viable daily without wheels.',
        'Best for: weekend living, not daily hagwon commute unless school is west Jeju.',
      ],
    },
    hyeopjae: {
      title: 'Hyeopjae · Hallim — West beach',
      tips: [
        'Beach: White sand + turquoise water — top island beach day for teachers.',
        'Nearby: Hallim Park, lava tubes — tourist zone, seasonal crowds.',
        'Housing: Scattered villas and pensions — some EPIK rural placements west.',
        'Transit: Bus from Jeju City ~60 min — car strongly recommended.',
        'Best for: teachers with provided west-side housing near a specific school.',
      ],
    },
    seongsan: {
      title: 'Seongsan · Udo — Sunrise east',
      tips: [
        'Landmark: Seongsan Ilchulbong (Sunrise Peak) — UNESCO, 30-min hike, dawn crowds.',
        'Ferry: Udo island day trip — peanut ice cream, rental bikes, teacher weekend default.',
        'Jobs: East-coast EPIK schools — rural, beautiful, car essential.',
        'Commute: 50+ min from Jeju City — batch errands, do not commute daily to city hagwon.',
        'Best for: nature-first teachers with school placement in east Jeju.',
      ],
    },
    hallasan: {
      title: 'Hallasan — Mountain core',
      tips: [
        'Peak: 1,947 m — Korea\'s highest; seasonal hiking permits, weather changes fast.',
        'Trails: Seongpanak (east) and Gwaneumsa (north) most popular — start early.',
        'Not residential: Mid-island access roads — live Jeju City or Seogwipo, hike weekends.',
        'Gear: Layers mandatory — summit cold even in summer; download trail map offline.',
        'Best for: teachers who want weekly mountain therapy without leaving the island.',
      ],
    },
  },
};

window.REGION_HOOD_GUIDES = REGION_HOOD_GUIDES;

function getRegionContainerFromBtn(btn) {
  return btn.closest('.level-content[id^="level-region-"]');
}

function getRegionKeyFromContainer(container) {
  if (!container) return '';
  if (container.dataset.region) return container.dataset.region;
  var m = container.id.match(/^level-region-(.+)$/);
  return m ? m[1] : '';
}

function handleRegionHoodBtnClick(btn) {
  var hoodKey = btn.getAttribute('data-hood-guide');
  if (!hoodKey) return false;

  var container = getRegionContainerFromBtn(btn);
  if (!container) return false;

  var region = getRegionKeyFromContainer(container);
  if (!region) return false;

  var panel = container.querySelector('.region-hood-panel');
  if (!panel) return false;

  var titleEl = panel.querySelector('.hood-panel-title');
  var listEl = panel.querySelector('.hood-panel-list');

  if (panel.classList.contains('is-open') && panel.getAttribute('data-active-hood') === hoodKey) {
    panel.classList.remove('is-open');
    panel.removeAttribute('data-active-hood');
    container.querySelectorAll('.region-hood-card.is-active').forEach(function(c) {
      c.classList.remove('is-active');
    });
    return true;
  }

  container.querySelectorAll('.region-hood-panel.is-open').forEach(function(p) {
    p.classList.remove('is-open');
    p.removeAttribute('data-active-hood');
  });
  container.querySelectorAll('.region-hood-card.is-active').forEach(function(c) {
    c.classList.remove('is-active');
  });

  var guides = window.REGION_HOOD_GUIDES || REGION_HOOD_GUIDES;
  var guide = guides && guides[region] && guides[region][hoodKey];

  if (titleEl) {
    titleEl.textContent = guide ? guide.title : 'Neighborhood guide';
  }
  if (listEl) {
    if (guide && guide.tips && guide.tips.length) {
      listEl.innerHTML = guide.tips.map(function(t) { return '<li>' + t + '</li>'; }).join('');
    } else {
      listEl.innerHTML = '<li>District guide coming soon.</li>';
    }
  }

  panel.classList.add('is-open');
  panel.setAttribute('data-active-hood', hoodKey);

  var card = btn.closest('.region-hood-card');
  if (card) card.classList.add('is-active');

  requestAnimationFrame(function() {
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  return true;
}

function initRegionHoodGuides() {
  document.querySelectorAll('.region-hood-btn').forEach(function(btn) {
    if (btn.getAttribute('data-hood-init') === '1') return;
    btn.setAttribute('data-hood-init', '1');
  });
}

window.handleRegionHoodBtnClick = handleRegionHoodBtnClick;
window.initRegionHoodGuides = initRegionHoodGuides;

document.addEventListener('click', function(e) {
  var btn = e.target.closest('.region-hood-btn');
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  handleRegionHoodBtnClick(btn);
}, true);

// ============ SUPPORT CENTER HUB ============
var SUPPORT_ICON_SVGS = {
  cal: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  bldg: '<svg viewBox="0 0 24 24"><path d="M4 21V7l8-4 8 4v14"/><path d="M9 21v-6h6v6"/><path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01"/></svg>',
  doc: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg>',
  card: '<svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
  bank: '<svg viewBox="0 0 24 24"><path d="M3 21h18"/><path d="M5 21V9l7-4 7 4v12"/><path d="M9 21v-6h6v6"/></svg>',
  health: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z"/></svg>',
  warn: '<svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M12 21s6-5.33 6-10a6 6 0 1 0-12 0c0 4.67 6 10 6 10z"/><circle cx="12" cy="11" r="2.5"/></svg>',
  plane: '<svg viewBox="0 0 24 24"><path d="M2 12h5l3-7 4 14 3-7h5"/></svg>',
  map: '<svg viewBox="0 0 24 24"><path d="M9 18l-6-3V5l6 3 6-3 6 3v10l-6-3-6 3z"/><path d="M9 5v13M15 2v13"/></svg>',
};

var SUPPORT_EXTERNAL_LINKS = {
  'How to book a HiKorea appointment': { url: 'https://www.hikorea.go.kr', label: 'HiKorea', sub: 'Official appointment portal' },
  'Find your local immigration office': { url: 'https://www.hikorea.go.kr/info/InfoFrnRelMainPage.do', label: 'HiKorea Jurisdiction Finder', sub: 'Lookup by registered address' },
};

var SUPPORT_EXTRA_BODY = {
  'How to book a HiKorea appointment': 'To book an appointment, go to the official HiKorea site. Select Non-member appointment, enter your ARC or Passport number, and save your appointment password — you will need it for cancellations.',
  'Find your local immigration office': 'Find your local office by using the official HiKorea Jurisdiction Finder. Enter your full Korean address — the system returns the correct branch for ARC renewal, visa changes, and re-entry permits.',
};

function supportGuideBody(guide) {
  var extra = SUPPORT_EXTRA_BODY[guide.title];
  if (extra) return extra;
  return guide.summary + ' Practical resource for native English teachers and E-2 visa holders settling in Korea. Always verify current rules on official government websites before acting.';
}

function supportGuideSearchText(guide) {
  return (guide.title + ' ' + guide.cat + ' ' + guide.summary + ' ' + guide.kw).toLowerCase();
}

function renderSupportArchive() {
  var list = document.getElementById('support-archive-list');
  var countEl = document.getElementById('support-archive-count');
  if (!list || typeof SUPPORT_GUIDES === 'undefined') return;

  list.innerHTML = SUPPORT_GUIDES.map(function(guide) {
    var ext = SUPPORT_EXTERNAL_LINKS[guide.title];
    var extHtml = ext
      ? '<a class="support-official-link" href="' + ext.url + '" target="_blank" rel="noopener">' +
          '<span class="sol-badge">Gov</span>' +
          '<span class="sol-text"><span class="sol-title">' + ext.label + '</span>' +
          '<span class="sol-sub">' + ext.sub + '</span></span>' +
          '<span class="sol-arrow" aria-hidden="true">↗</span></a>'
      : '';
    return '<article class="support-archive-item" id="guide-' + guide.id + '" role="listitem" data-guide-id="' + guide.id + '" data-search="' + supportGuideSearchText(guide).replace(/"/g, '&quot;') + '">' +
      '<span class="support-archive-cat">' + guide.cat + '</span>' +
      '<h3>' + guide.title + '</h3>' +
      '<p class="support-archive-summary">' + guide.summary + '</p>' +
      '<p class="support-archive-body">' + supportGuideBody(guide) + '</p>' +
      extHtml +
    '</article>';
  }).join('');

  if (countEl) countEl.textContent = SUPPORT_GUIDES.length + ' guides';
}

function renderSupportPriority() {
  var grid = document.getElementById('support-priority-grid');
  if (!grid || typeof SUPPORT_GUIDES === 'undefined') return;

  var order = [
    'How to book a HiKorea appointment',
    'Find your local immigration office',
    'Find Your Immigration Office',
    'E-2 visa document checklist 2026',
    'ARC application first week in Korea',
    'Open a Korean bank account guide',
    'National Health Insurance enrollment',
    'Contract red flags before signing',
    'Address change registration',
    'Re-entry permit single vs multiple',
  ];
  var byTitle = {};
  SUPPORT_GUIDES.forEach(function(g) { if (g.priority) byTitle[g.title] = g; });
  var priority = order.map(function(t) { return byTitle[t]; }).filter(Boolean);

  grid.innerHTML = priority.map(function(guide) {
    var iconKey = guide.icon || 'doc';
    var svg = SUPPORT_ICON_SVGS[iconKey] || SUPPORT_ICON_SVGS.doc;
    return '<button type="button" class="support-priority-card" role="listitem" data-guide-id="' + guide.id + '" data-search="' + supportGuideSearchText(guide).replace(/"/g, '&quot;') + '">' +
      '<span class="support-priority-icon" aria-hidden="true">' + svg + '</span>' +
      '<span class="support-priority-text">' +
        '<span class="support-priority-title">' + guide.title + '</span>' +
        '<span class="support-priority-summary">' + guide.summary + '</span>' +
      '</span></button>';
  }).join('');
}

function scrollToSupportGuide(guideId) {
  var el = document.getElementById('guide-' + guideId);
  var archive = document.getElementById('support-archive');
  if (!el) return;
  if (archive) archive.open = true;
  el.classList.add('is-highlight');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(function() { el.classList.remove('is-highlight'); }, 2400);
}

function filterSupportGuides(query) {
  var q = query.toLowerCase().trim();
  var items = document.querySelectorAll('.support-archive-item');
  var cards = document.querySelectorAll('.support-priority-card');
  var meta = document.getElementById('support-search-meta');
  var empty = document.getElementById('support-archive-empty');
  var archive = document.getElementById('support-archive');
  var visible = 0;

  items.forEach(function(item) {
    var text = item.getAttribute('data-search') || '';
    var match = !q || text.indexOf(q) !== -1;
    item.classList.toggle('is-hidden', !match);
    if (match) visible++;
  });

  cards.forEach(function(card) {
    var text = card.getAttribute('data-search') || '';
    var match = !q || text.indexOf(q) !== -1;
    card.classList.toggle('is-dimmed', q && !match);
  });

  if (meta) {
    if (q) {
      meta.textContent = visible + ' of ' + items.length + ' guides match';
      meta.classList.add('is-active');
    } else {
      meta.textContent = '';
      meta.classList.remove('is-active');
    }
  }

  if (empty) empty.hidden = visible > 0 || !q;
  if (archive && q) archive.open = true;
}

function openSupportGuideModal(guide) {
  var modal = document.getElementById('support-guide-modal');
  if (!modal || !guide) return;
  var iconKey = guide.icon || 'doc';
  var svg = SUPPORT_ICON_SVGS[iconKey] || SUPPORT_ICON_SVGS.doc;
  var catEl = document.getElementById('support-guide-modal-cat');
  var titleEl = document.getElementById('support-guide-modal-title');
  var summaryEl = document.getElementById('support-guide-modal-summary');
  var bodyEl = document.getElementById('support-guide-modal-body');
  var iconEl = document.getElementById('support-guide-modal-icon');
  var extWrap = document.getElementById('support-guide-modal-ext');
  var finderBtn = document.getElementById('support-guide-modal-finder');

  if (catEl) catEl.textContent = guide.cat || '';
  if (titleEl) titleEl.textContent = guide.title || '';
  if (summaryEl) summaryEl.textContent = guide.summary || '';
  if (bodyEl) bodyEl.textContent = supportGuideBody(guide);
  if (iconEl) iconEl.innerHTML = svg;

  var ext = SUPPORT_EXTERNAL_LINKS[guide.title];
  if (extWrap) {
    if (ext) {
      extWrap.hidden = false;
      extWrap.innerHTML = '<a class="support-official-link" href="' + ext.url + '" target="_blank" rel="noopener">' +
        '<span class="sol-badge">Gov</span>' +
        '<span class="sol-text"><span class="sol-title">' + ext.label + '</span>' +
        '<span class="sol-sub">' + ext.sub + '</span></span>' +
        '<span class="sol-arrow" aria-hidden="true">↗</span></a>';
    } else {
      extWrap.hidden = true;
      extWrap.innerHTML = '';
    }
  }

  if (finderBtn) {
    finderBtn.hidden = guide.title !== 'Find your local immigration office';
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  var closeBtn = document.getElementById('support-guide-modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeSupportGuideModal() {
  var modal = document.getElementById('support-guide-modal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  if (!document.getElementById('magnet-modal')?.classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

function scrollToImmigFinderFromModal() {
  closeSupportGuideModal();
  var finder = document.getElementById('support-immig-finder');
  if (finder) finder.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleSupportPriorityClick(guideId, title) {
  if (title === 'Find Your Immigration Office') {
    var finder = document.getElementById('support-immig-finder');
    if (finder) finder.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  var guide = SUPPORT_GUIDES.find(function(g) { return String(g.id) === String(guideId); });
  if (guide) openSupportGuideModal(guide);
}

function initSupportCenter(signal) {
  if (typeof SUPPORT_GUIDES === 'undefined' || !document.getElementById('support-center')) return;
  renderSupportArchive();
  renderSupportPriority();

  var search = document.getElementById('support-search');
  if (search) {
    search.addEventListener('input', function() {
      filterSupportGuides(this.value);
    }, { signal });
    // The header search sends visitors here with ?q=<query>.
    var q = new URLSearchParams(location.search).get('q');
    if (q) {
      search.value = q;
      filterSupportGuides(q);
      search.focus();
    }
  }

  var grid = document.getElementById('support-priority-grid');
  if (grid) {
    grid.addEventListener('click', function(e) {
      var card = e.target.closest('.support-priority-card');
      if (!card) return;
      var guideId = card.getAttribute('data-guide-id');
      var guide = SUPPORT_GUIDES.find(function(g) { return String(g.id) === String(guideId); });
      if (guide) handleSupportPriorityClick(guide.id, guide.title);
    }, { signal });
  }

  var supportModal = document.getElementById('support-guide-modal');
  if (supportModal) {
    supportModal.addEventListener('click', function(e) {
      if (e.target === supportModal) closeSupportGuideModal();
    }, { signal });
  }
  document.getElementById('support-guide-modal-close')?.addEventListener('click', closeSupportGuideModal, { signal });
  document.getElementById('support-guide-modal-finder')?.addEventListener('click', scrollToImmigFinderFromModal, { signal });
}

// ============ IMMIGRATION OFFICE FINDER ============
const IMMIGRATION_OFFICES = {
  seoul: {
    title: 'Seoul Metropolitan Immigration Offices',
    summary: 'Seoul is split across multiple immigration branches. Your office depends on your registered address (주소) — typically Gangseo (south/west) or Seongbuk (central/north) districts.',
    tips: [
      'Southern & western Seoul (Gangnam, Seocho, Mapo, Yeongdeungpo): often Seoul Immigration Office — Omokgyo / Gangseo area.',
      'Northern & eastern Seoul (Jongno, Seongdong, Gangbuk): often Seoul Immigration Office — Seongbuk / Hyehwa corridor.',
      'Use HiKorea Jurisdiction Finder with your exact building address before visiting.',
      'ARC renewal, visa extension, and re-entry permits all require the correct branch.',
    ],
  },
  gyeonggi: {
    title: 'Gyeonggi Province Immigration Offices',
    summary: 'Gyeonggi has several branches. Bundang teachers may visit Uijeongbu or Suwon; Ilsan teachers often use Incheon or Uijeongbu — always verify by address.',
    tips: [
      'Suwon Immigration Office — Suwon, Yongin, Hwaseong, southern Gyeonggi belt.',
      'Incheon Immigration Office — Incheon, Songdo, Bucheon, Gimpo, western Gyeonggi.',
      'Uijeongbu Immigration Office — Bundang, northern Gyeonggi, parts of northeast metro.',
      'Pyeongtaek Immigration Office — Pyeongtaek, Ansan, southern satellite cities.',
    ],
  },
  busan: {
    title: 'Busan Immigration Office',
    summary: 'Most Busan and Gyeongnam teachers use the Busan Immigration and Residence Office. Haeundae, Seomyeon, and Centum placements typically fall under Busan jurisdiction.',
    tips: [
      'Main office serves Busan metropolitan area — confirm branch on HiKorea before visiting.',
      'ARC pickup, visa extension, and address change registration handled here.',
      'Allow extra time during March (EPIK arrival season) and August (renewal peak).',
      'Bring passport, ARC (if renewing), completed forms, and passport photos.',
    ],
  },
  incheon: {
    title: 'Incheon Immigration Office',
    summary: 'Teachers in Incheon, Songdo, and western Gyeonggi corridors typically use Incheon Immigration Office — not Seoul branches.',
    tips: [
      'Songdo IFEZ teachers: Incheon jurisdiction despite Seoul proximity.',
      'Incheon Station / Chinatown area: same Incheon metro office network.',
      'Airport proximity makes Incheon office popular for re-entry permit runs before travel.',
      'Verify Songdo vs Incheon city address — both Incheon but sub-branches may differ.',
    ],
  },
  daegu: {
    title: 'Daegu Immigration Office',
    summary: 'Daegu and surrounding Gyeongsangbuk-do placements use Daegu Immigration and Residence Office — the main Yeongnam inland hub.',
    tips: [
      'EPIK teachers in Daegu metro: single primary office for most addresses.',
      'Busan immigration is separate — do not assume Yeongnam = one office.',
      'KTX to Busan immigration is possible but slow — get jurisdiction right first time.',
      'Summer humidity: offices are air-conditioned; arrive early to reduce wait.',
    ],
  },
  jeju: {
    title: 'Jeju Immigration Office',
    summary: 'Jeju Special Self-Governing Province has a dedicated immigration office in Jeju City — island teachers rarely visit mainland offices.',
    tips: [
      'Jeju City office handles ARC, visa changes, and re-entry for island residents.',
      'Flight required for mainland immigration matters — plan ahead for typhoon season.',
      'Car recommended on Jeju; office locations are bus-accessible but slower.',
      'Smaller staff — book HiKorea appointment in advance during peak months.',
    ],
  },
};

function openImmigrationOffice(cityKey) {
  var data = IMMIGRATION_OFFICES[cityKey];
  var panel = document.getElementById('immig-result-panel');
  if (!data || !panel) return;

  var titleEl = panel.querySelector('.immig-panel-title');
  var bodyEl = panel.querySelector('.immig-panel-body');
  var listEl = panel.querySelector('.immig-panel-list');

  if (titleEl) titleEl.textContent = data.title;
  if (bodyEl) bodyEl.innerHTML = data.summary;
  if (listEl) {
    listEl.innerHTML = data.tips.map(function(t) { return '<li>' + t + '</li>'; }).join('');
  }

  panel.classList.add('is-open');

  document.querySelectorAll('.immig-city-btn').forEach(function(btn) {
    btn.classList.toggle('is-active', btn.getAttribute('data-immig-city') === cityKey);
  });

  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.addEventListener('click', function(e) {
  var btn = e.target.closest('.immig-city-btn');
  if (!btn) return;
  e.preventDefault();
  openImmigrationOffice(btn.getAttribute('data-immig-city'));
});

// ============ LOCATION DATA (calculator + snapshot) ============
const LOCATIONS = {
  daechi: {
    name: 'Daechi / Gangnam',
    kr: '서울 강남구 대치동 · 학원 1번지',
    tagline: 'Highest expat infrastructure. Premium studio provided. Walkable subway & gyms. Higher cost of living.',
    salaryRange: '₩2.8M – ₩3.4M',
    rentInfo: 'Deposit ₩10M / Monthly Rent ₩950K – ₩1.2M',
    rentNoHousing: 1075000,
    defaultSpend: 1200000,
    costIndex: 5,
    specs: [
      ['🚇', 'Subway', 'Line 3 (Daechi), Bundang + Suinbundang (Hanti), Line 7 (Cheongdam) — 4 stations within 1 km'],
      ['☕', 'Expat infra', 'Starbucks every 300 m · Costco · Olive Young · multilingual clinics'],
      ['🏋️', 'Gyms', '24-hour fitness chains · ₩70K–110K/mo · pilates & barre studios premium tier'],
      ['🛡️', 'Safety', '24/7 walkable · highest CCTV density in Korea'],
    ],
  },
  songdo: {
    name: 'Songdo / Incheon',
    kr: '인천 송도국제도시 · 외국인 친화 신도시',
    tagline: 'Modern international city. Spacious housing. Eco-friendly, bike-friendly, safe vibe.',
    salaryRange: '₩2.7M – ₩3.1M',
    rentInfo: 'Deposit ₩10M / Monthly Rent ₩750K – ₩900K',
    rentNoHousing: 825000,
    defaultSpend: 850000,
    costIndex: 3,
    specs: [
      ['🚇', 'Subway', 'Incheon Line 1 · Songdo Central Park · ~70 min to central Seoul'],
      ['☕', 'Expat infra', 'Costco · Lotte Mall · Chadwick International School area · English-friendly cafes'],
      ['🚴', 'Gyms & lifestyle', 'Bike lanes everywhere · marathons · spacious gyms · ₩70K/mo'],
      ['🛡️', 'Safety', 'Planned city · low traffic · family-friendly · airport 20 min'],
    ],
  },
  bundang: {
    name: 'Bundang / Gyeonggi',
    kr: '경기 성남시 분당구 · 테크 허브 베드타운',
    tagline: 'Perfect balance of nature and city. Easy Seoul access. Calm and safe tech-hub environment.',
    salaryRange: '₩2.7M – ₩3.2M',
    rentInfo: 'Deposit ₩10M / Monthly Rent ₩800K – ₩950K',
    rentNoHousing: 875000,
    defaultSpend: 900000,
    costIndex: 4,
    specs: [
      ['🚇', 'Subway', 'Bundang Line + Shinbundang Express · Gangnam in ~17 min'],
      ['☕', 'Expat infra', 'AK Plaza · Hyundai Dept · Costco Yongin · IT-worker English-friendly scene'],
      ['🌳', 'Nature & gyms', 'Tancheon stream trails · spacious local gyms · ₩70K–90K/mo'],
      ['🛡️', 'Safety', 'Top-tier school district · low crime · clean parks · family vibe'],
    ],
  },
  busan: {
    name: 'Busan / Haeundae',
    kr: '부산 해운대구 · 바다 옆 외국인 거주지',
    tagline: 'Beautiful beach life. Popular among expats. Slightly lower salary but exceptional quality of life.',
    salaryRange: '₩2.6M – ₩3.0M',
    rentInfo: 'Deposit ₩5M – ₩10M / Monthly Rent ₩650K – ₩800K',
    rentNoHousing: 725000,
    defaultSpend: 750000,
    costIndex: 2,
    specs: [
      ['🚇', 'Subway', 'Line 2 (Haeundae) + Donghae Line · slower pace than Seoul'],
      ['🏖️', 'Beach + cafe', 'Haeundae & Gwangalli beaches · surf community · brunch cafes'],
      ['🏋️', 'Gyms', 'Beach-bod culture · 24-hr chains · CrossFit boxes · ₩60K/mo'],
      ['🛡️', 'Safety', 'Tourist district = high English signage · friendly to foreigners · cheaper rent'],
    ],
  },
};

// ============ SAVINGS CALCULATOR (with location integration) ============
function initCalculator(signal) {
  const salaryEl = document.getElementById('calc-salary');
  if (!salaryEl) return;
  const spendEl = document.getElementById('calc-spend');
  const housingEl = document.getElementById('calc-housing');
  const pensionEl = document.getElementById('calc-pension');

  let currentLoc = 'daechi';

  const fmt = n => '₩' + Math.round(n).toLocaleString('en-US');
  const fmtUsd = n => '$' + Math.round(n).toLocaleString('en-US');

  function recalc() {
    const salary = +salaryEl.value;
    const spend = +spendEl.value;
    const hasHousing = housingEl.checked;
    const hasPension = pensionEl.checked;
    const loc = LOCATIONS[currentLoc];

    const taxRate = hasPension ? 0.085 : 0.055;
    const tax = salary * taxRate;
    const rent = hasHousing ? 0 : loc.rentNoHousing;
    const net = salary - tax - rent - spend;
    const usd = net / 1320;

    document.getElementById('calc-salary-val').textContent = fmt(salary);
    document.getElementById('calc-spend-val').textContent = fmt(spend);
    document.getElementById('calc-result-usd').textContent = fmtUsd(usd);
    document.getElementById('calc-result-krw').textContent = '≈ ' + fmt(net);

    document.getElementById('br-salary').textContent = fmt(salary);
    document.getElementById('br-tax').textContent = '−' + fmt(tax);
    document.getElementById('br-rent').textContent = '−' + fmt(rent);
    document.getElementById('br-spend').textContent = '−' + fmt(spend);
    document.getElementById('br-net').textContent = fmt(net);
  }

  function applyLocation(key) {
    currentLoc = key;
    const loc = LOCATIONS[key];
    if (!loc) return;

    // Update tab active state
    document.querySelectorAll('.calc-loc-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.loc === key);
    });

    // Auto-adjust spend slider to region's default
    spendEl.value = loc.defaultSpend;

    // Update Lifestyle Snapshot
    document.getElementById('ls-name').textContent = loc.name;
    document.getElementById('ls-kr').textContent = loc.kr;
    document.getElementById('ls-tagline').textContent = loc.tagline;
    document.getElementById('ls-salary').textContent = loc.salaryRange;
    document.getElementById('ls-rent').textContent = loc.rentInfo;

    document.getElementById('ls-specs').innerHTML = loc.specs.map(([icon, label, val]) => `
      <div class="ls-spec">
        <div class="ls-spec-icon">${icon}</div>
        <div class="ls-spec-text">
          <div class="ls-spec-label">${label}</div>
          <div class="ls-spec-val">${val}</div>
        </div>
      </div>
    `).join('');

    // Cost-of-living dots (5 total, on = filled)
    let dots = '';
    for (let i = 1; i <= 5; i++) {
      dots += `<span class="ci-dot${i <= loc.costIndex ? ' on' : ''}"></span>`;
    }
    document.getElementById('ci-bar').innerHTML = dots;

    recalc();
  }

  // Wire up location tabs
  document.querySelectorAll('.calc-loc-tab').forEach(tab => {
    tab.addEventListener('click', () => applyLocation(tab.dataset.loc), { signal });
  });

  // Wire up sliders / checkboxes
  [salaryEl, spendEl, housingEl, pensionEl].forEach(el => {
    el.addEventListener('input', recalc, { signal });
    el.addEventListener('change', recalc, { signal });
  });

  // Initialize with default location
  applyLocation('daechi');
}

// ============ PET TRAVEL KIT (tabs) ============
function initPetKit(signal) {
  const tabs = document.querySelectorAll('.pet-tab');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.pettab;
      tabs.forEach(t => t.classList.toggle('active', t.dataset.pettab === key));
      document.querySelectorAll('.pet-panel').forEach(p => {
        p.classList.toggle('active', p.dataset.pettabPanel === key);
      });
    }, { signal });
  });
}

// ============ PENSION REFUND ESTIMATOR ============
function initPension(signal) {
  const monthsEl = document.getElementById('pension-months');
  if (!monthsEl) return;
  const salaryEl = document.getElementById('pension-salary');
  const employerEl = document.getElementById('pension-employer');
  const interestEl = document.getElementById('pension-interest');

  const fmt = n => '₩' + Math.round(n).toLocaleString('en-US');
  const fmtUsd = n => '~ $' + Math.round(n).toLocaleString('en-US') + ' USD';

  function recalc() {
    const months = +monthsEl.value;
    const salary = +salaryEl.value;
    const hasEmployer = employerEl.checked;
    const hasInterest = interestEl.checked;

    // 4.5% employee contribution per month
    const youMonthly = salary * 0.045;
    const youTotal = youMonthly * months;
    // 4.5% employer match
    const empTotal = hasEmployer ? (youMonthly * months) : 0;
    // ~2% annual simple interest on the pooled balance (approximation)
    const principal = youTotal + empTotal;
    const interest = hasInterest ? (principal * 0.02 * (months / 12) / 2) : 0; // halved to reflect ramp-up
    const total = principal + interest;
    const usd = total / 1320;

    monthsEl.value;
    document.getElementById('pension-months-val').textContent = months + ' month' + (months === 1 ? '' : 's');
    document.getElementById('pension-salary-val').textContent = fmt(salary);
    document.getElementById('pension-result-usd').textContent = fmtUsd(usd);

    // Message changes with refund size
    const msg = usd >= 5000 ? "That's a flight + first month's rent home!"
              : usd >= 3000 ? "That's your move-home cushion."
              : usd >= 1500 ? "That's your moving costs covered."
              : "Every dollar counts.";
    document.getElementById('pension-result-msg').textContent = msg;

    document.getElementById('pb-you').textContent = fmt(youTotal);
    document.getElementById('pb-emp').textContent = hasEmployer ? fmt(empTotal) : '— (none)';
    document.getElementById('pb-interest').textContent = hasInterest ? fmt(interest) : '— (none)';
    document.getElementById('pb-total').textContent = fmt(total);
  }

  [monthsEl, salaryEl, employerEl, interestEl].forEach(el => {
    el.addEventListener('input', recalc, { signal });
    el.addEventListener('change', recalc, { signal });
  });
  recalc();
}

// ============ E-2 VISA TRACKER ============
function toggleVisaStep(n) {
  const step = document.querySelector('.visa-step[data-step="' + n + '"]');
  if (!step) return;
  step.classList.toggle('done');
  updateVisaProgress();
  // Persist to localStorage
  try {
    const state = {};
    document.querySelectorAll('.visa-step').forEach(s => {
      state[s.dataset.step] = s.classList.contains('done');
    });
    localStorage.setItem('rk_visa_state', JSON.stringify(state));
  } catch(e) {}
}
function updateVisaProgress() {
  const total = document.querySelectorAll('.visa-step').length;
  const done = document.querySelectorAll('.visa-step.done').length;
  const bar = document.getElementById('visa-bar');
  if (bar) bar.style.width = (total ? (done / total * 100) : 0) + '%';
}
// Restore saved state
function restoreVisaState() {
  try {
    const saved = JSON.parse(localStorage.getItem('rk_visa_state') || '{}');
    Object.entries(saved).forEach(([n, done]) => {
      if (done) {
        const s = document.querySelector('.visa-step[data-step="' + n + '"]');
        if (s) s.classList.add('done');
      }
    });
    updateVisaProgress();
  } catch(e) {}
}

// ============ MAGNET MODAL (email gate) ============
function openMagnetModal(title) {
  const modal = document.getElementById('magnet-modal');
  if (!modal) return;
  document.getElementById('magnet-modal-title').textContent = title || 'Get free access';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMagnetModal() {
  const modal = document.getElementById('magnet-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}
function submitMagnetModal(e) {
  if (e) e.preventDefault();
  openTeacherApplyForm();
  closeMagnetModal();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeMagnetModal(); closeSupportGuideModal(); }
});

// ============ PAGE LIFECYCLE ============
let pageController = null;

window.rkInitPage = function () {
  window.rkCleanupPage();
  pageController = new AbortController();
  const { signal } = pageController;

  applyLanguage(savedLanguage());
  initRegionHoodGuides();
  initSupportCenter(signal);
  initCalculator(signal);
  initPetKit(signal);
  initPension(signal);
  restoreVisaState();
  document.getElementById('magnet-modal')?.addEventListener('click', function (event) {
    if (event.target === this) closeMagnetModal();
  }, { signal });
  if (location.hash) setTimeout(showHashTarget, 150);
  else showHashTarget();
};

window.rkCleanupPage = function () {
  if (pageController) pageController.abort();
  pageController = null;
  document.body.style.overflow = '';
};
