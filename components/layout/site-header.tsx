import Link from 'next/link';
import { categoryPath, getBlogCategories } from '@/lib/blog';

// Site header shared by every page. Styles: styles/layout.css. Every entry is a link to its page;
// dropdowns, the compact menu, search and the EN/KO switch are handled by header-nav.tsx.

type FlyoutLink = { title: string; href: string; accent?: boolean };
type TopItem = { label: string; items: FlyoutLink[] } | { label: string; href: string };
type MobileLink = { title: string; sub: string; href: string; accent?: boolean };

/** Desktop menu; the Blog entry is filled in with the blog's categories (see SiteHeader). */
const EN_NAV: TopItem[] = [
  { label: 'Find a Job', href: '/jobs/' },
  { label: 'Blog', href: '/blog/' },
  {
    label: 'Life in Korea',
    items: [
      { href: '/why-korea/', title: 'Why Korea' },
      { href: '/regions/', title: 'Region Guides' },
      { href: '/for-teachers/', title: 'For Teachers' },
      { href: '/for-teachers/e2-visa/', title: 'E-2 Visa' },
      { href: '/for-teachers/while-in-korea/', title: 'While in Korea' },
    ],
  },
  {
    label: 'Free Lesson Plans',
    items: [
      { href: '/lessons/', title: 'All Plans' },
      { href: '/lessons/k1/', title: 'Kindergarten K1–K3' },
      { href: '/lessons/g1/', title: 'Elementary G1–G6' },
    ],
  },
  {
    label: 'Teach in Korea',
    items: [
      { href: '/why-readykorea/', title: 'About ReadyKorea' },
      { href: '/ai-lab/', title: 'AI Lab' },
      { href: '/forum/', title: 'Forum' },
      { href: '/tefl/', title: 'TEFL' },
      { href: '/support/', title: 'Support Center' },
    ],
  },
];

const KO_NAV: TopItem[] = [
  {
    label: '교안 분석서',
    items: [
      { href: '/lessons/', title: '전체 교안', accent: true },
      { href: '/lessons/k1/', title: '유치부 K1–K3' },
      { href: '/lessons/g1/', title: '초등부 G1–G6' },
    ],
  },
  { label: '왜 레디코리아', href: '/why-readykorea/' },
  {
    label: '학원 서비스',
    items: [
      { href: '/school-posting/', title: '구인 등록' },
      { href: '/curriculum-consulting/', title: '커리큘럼 컨설팅' },
    ],
  },
];

// Compact menu shown below 1100px.
const EN_MOBILE: MobileLink[] = [
  { href: '/jobs/', title: 'Find a Job', sub: 'Verified positions' },
  { href: '/blog/', title: 'Blog', sub: 'Tips for teachers in Korea' },
  { href: '/why-korea/', title: 'Why Korea', sub: 'Safety · savings · culture' },
  { href: '/regions/', title: 'Region Guides', sub: 'Seoul · Gyeonggi · Busan' },
  { href: '/for-teachers/', title: 'For Teachers', sub: 'Visa · contracts · interview' },
  { href: '/for-teachers/e2-visa/', title: 'E-2 Visa', sub: 'Application · consulates · forms' },
  { href: '/for-teachers/while-in-korea/', title: 'While in Korea', sub: 'Medical check · ARC' },
  { href: '/lessons/', title: 'Free Lesson Plans', sub: 'All · K1–K3 · G1–G6' },
  { href: '/ai-lab/', title: 'AI Lab', sub: 'Teacher tools' },
  { href: '/forum/', title: 'Forum', sub: 'Community' },
  { href: '/tefl/', title: 'TEFL', sub: 'Certification guide' },
  { href: '/support/', title: 'Support Center', sub: 'Immigration · life guides' },
];

const KO_MOBILE: MobileLink[] = [
  { href: '/lessons/', title: '교안 분석서', sub: 'K1–G6 전체', accent: true },
  { href: '/why-readykorea/', title: '왜 레디코리아', sub: '검증 · 매칭' },
  { href: '/school-posting/', title: '구인 등록', sub: '셀프 구인' },
  { href: '/curriculum-consulting/', title: '커리큘럼 컨설팅', sub: '맞춤 설계' },
];

function NavRow({ items, label, lang }: { items: TopItem[]; label: string; lang: 'en' | 'ko' }) {
  return (
    <div className={`nav-center ${lang}-only`}>
      <nav className="nav-items-row" aria-label={label}>
        {items.map((item) =>
          'items' in item ? (
            <div key={item.label} className="nav-item-dd main-nav-dd">
              <button type="button" className="nav-top-trigger" aria-haspopup="true" aria-expanded="false">
                {item.label}{' '}
                <span className="caret" aria-hidden="true">
                  ▾
                </span>
              </button>
              <div className="nav-flyout" role="menu">
                <div className="nav-flyout-inner">
                  {item.items.map((link) => (
                    <Link
                      key={link.href}
                      className={link.accent ? 'nav-flyout-link nav-flyout-link--accent' : 'nav-flyout-link'}
                      href={link.href}
                      role="menuitem"
                    >
                      <span className="nav-flyout-title">{link.title}</span>
                      <span className="nav-flyout-chevron" aria-hidden="true">
                        ›
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Link key={item.label} className="nav-top-link" href={item.href}>
              {item.label}
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}

function MobileLinks({ links, lang }: { links: MobileLink[]; lang: 'en' | 'ko' }) {
  return (
    <div className={`${lang}-only`}>
      {links.map((link) => (
        <Link
          key={link.title}
          className={link.accent ? 'main-nav-link main-nav-link--accent' : 'main-nav-link'}
          href={link.href}
          role="menuitem"
        >
          <span className="mnl-title">{link.title}</span>
          <span className="mnl-sub">{link.sub}</span>
        </Link>
      ))}
    </div>
  );
}

/**
 * "Blog" opens a dropdown of the categories that have published posts. Pages are cached, so saving a
 * post or category refreshes every page (lib/actions/posts.ts).
 */
export async function SiteHeader() {
  const categories = await getBlogCategories();
  const enNav: TopItem[] = categories.length
    ? EN_NAV.map((item) =>
        'href' in item && item.href === '/blog/'
          ? {
              label: item.label,
              items: [
                { href: '/blog/', title: 'All Posts' },
                ...categories.map((c) => ({ href: categoryPath(c.slug), title: c.name })),
              ],
            }
          : item,
      )
    : EN_NAV;
  const enMobile = categories.length
    ? EN_MOBILE.map((link) =>
        'href' in link && link.href === '/blog/' ? { ...link, sub: categories.map((c) => c.name).join(' · ') } : link,
      )
    : EN_MOBILE;

  return (
    <header className="site">
      <div className="wrap nav">
        <Link className="brand" href="/">
          <span className="logo">R</span>
          <span className="brand-word en-only">
            Ready<span className="brand-gold">Korea</span>
          </span>
          <span className="brand-word ko-only">
            레디<span className="brand-gold">코리아</span>
          </span>
        </Link>
        <NavRow items={enNav} label="Teacher navigation" lang="en" />
        <NavRow items={KO_NAV} label="School navigation" lang="ko" />
        <div className="nav-right">
          <div className="main-nav-dd nav-menu-mobile" id="nav-menu-mobile">
            <button type="button" className="nav-menu-btn" aria-expanded="false" aria-haspopup="true">
              <span className="en-only">Menu</span>
              <span className="ko-only">메뉴</span>
              <span className="caret" aria-hidden="true">
                ▾
              </span>
            </button>
            <div className="main-nav-menu" role="menu">
              <MobileLinks links={enMobile} lang="en" />
              <MobileLinks links={KO_MOBILE} lang="ko" />
            </div>
          </div>
          <label className="nav-search-field">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <input
              type="search"
              id="nav-search-input"
              placeholder="Search"
              autoComplete="off"
              aria-label="Search site"
            />
          </label>
          <Link className="nav-action nav-action--primary en-only" href="/apply/">
            Apply
          </Link>
          <Link className="nav-action nav-action--primary ko-only" href="/school-posting/">
            구인 등록
          </Link>
          <div className="audience-switch" role="tablist" aria-label="Site audience">
            <button type="button" className="audience-pill active" data-lang="en" role="tab" aria-selected="true">
              EN
            </button>
            <button type="button" className="audience-pill" data-lang="ko" role="tab" aria-selected="false">
              한글
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
