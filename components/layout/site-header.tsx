// Site header shared by every page (originally the homepage header). Styles: styles/layout.css.
// Menu entries point at homepage sections via `data-nav`: on the homepage public/js/home.js
// switches panels in place; on other pages HeaderNav.tsx sends the visitor to `/#<target>`.

type FlyoutLink = { nav: string; title: string; accent?: boolean };
type TopItem =
  | { label: string; items: FlyoutLink[] } // dropdown
  | { label: string; nav: string } // homepage section
  | { label: string; href: string }; // separate page
type MobileLink = { title: string; sub: string; accent?: boolean } & ({ nav: string } | { href: string });

const EN_NAV: TopItem[] = [
  {
    label: 'Free Lesson Plans',
    items: [
      { nav: 'lessons', title: 'All Plans' },
      { nav: 'k1', title: 'Kindergarten K1–K3' },
      { nav: 'g1', title: 'Elementary G1–G6' },
    ],
  },
  { label: 'Find a Job', nav: 'jobs' },
  { label: 'Blog', href: '/blog/' },
  {
    label: 'Life in Korea',
    items: [
      { nav: 'why-korea', title: 'Why Korea' },
      { nav: 'regions', title: 'Region Guides' },
      { nav: 'for-teachers', title: 'For Teachers' },
      { nav: 'e2-visa', title: 'E-2 Visa' },
      { nav: 'while-in-korea', title: 'While in Korea' },
    ],
  },
  {
    label: 'Teach in Korea',
    items: [
      { nav: 'why-readykorea', title: 'About ReadyKorea' },
      { nav: 'ailab', title: 'AI Lab' },
      { nav: 'forum', title: 'Forum' },
      { nav: 'tefl', title: 'TEFL' },
      { nav: 'support', title: 'Support Center' },
    ],
  },
];

const KO_NAV: TopItem[] = [
  {
    label: '교안 분석서',
    items: [
      { nav: 'lessons', title: '전체 교안', accent: true },
      { nav: 'k1', title: '유치부 K1–K3' },
      { nav: 'g1', title: '초등부 G1–G6' },
    ],
  },
  { label: '왜 레디코리아', nav: 'why-readykorea' },
  {
    label: '학원 서비스',
    items: [
      { nav: 'school-posting', title: '구인 등록' },
      { nav: 'curriculum-consulting', title: '커리큘럼 컨설팅' },
    ],
  },
];

// Compact menu shown below 1100px.
const EN_MOBILE: MobileLink[] = [
  { nav: 'lessons', title: 'Free Lesson Plans', sub: 'All · K1–K3 · G1–G6' },
  { nav: 'jobs', title: 'Find a Job', sub: 'Verified positions' },
  { href: '/blog/', title: 'Blog', sub: 'Tips for teachers in Korea' },
  { nav: 'why-korea', title: 'Why Korea', sub: 'Safety · savings · culture' },
  { nav: 'regions', title: 'Region Guides', sub: 'Seoul · Gyeonggi · Busan' },
  { nav: 'for-teachers', title: 'For Teachers', sub: 'Visa · contracts · interview' },
  { nav: 'e2-visa', title: 'E-2 Visa', sub: 'Application · consulates · forms' },
  { nav: 'while-in-korea', title: 'While in Korea', sub: 'Medical check · ARC' },
  { nav: 'ailab', title: 'AI Lab', sub: 'Teacher tools' },
  { nav: 'forum', title: 'Forum', sub: 'Community' },
  { nav: 'tefl', title: 'TEFL', sub: 'Certification guide' },
  { nav: 'support', title: 'Support Center', sub: 'Immigration · life guides' },
];

const KO_MOBILE: MobileLink[] = [
  { nav: 'lessons', title: '교안 분석서', sub: 'K1–G6 전체', accent: true },
  { nav: 'why-readykorea', title: '왜 레디코리아', sub: '검증 · 매칭' },
  { nav: 'school-posting', title: '구인 등록', sub: '셀프 구인' },
  { nav: 'curriculum-consulting', title: '커리큘럼 컨설팅', sub: '맞춤 설계' },
];

function NavRow({ items, label, lang }: { items: TopItem[]; label: string; lang: 'en' | 'ko' }) {
  return (
    <div className={`nav-center ${lang}-only`}>
      <nav className="nav-items-row" aria-label={label}>
        {items.map((item) => {
          if ('items' in item) {
            return (
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
                      <button
                        key={link.nav}
                        type="button"
                        className={link.accent ? 'nav-flyout-link nav-flyout-link--accent' : 'nav-flyout-link'}
                        data-nav={link.nav}
                        role="menuitem"
                      >
                        <span className="nav-flyout-title">{link.title}</span>
                        <span className="nav-flyout-chevron" aria-hidden="true">
                          ›
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          }
          if ('nav' in item) {
            return (
              <button key={item.label} type="button" className="nav-top-link" data-nav={item.nav}>
                {item.label}
              </button>
            );
          }
          return (
            <a key={item.label} className="nav-top-link" href={item.href} style={{ textDecoration: 'none' }}>
              {item.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}

function MobileLinks({ links, lang }: { links: MobileLink[]; lang: 'en' | 'ko' }) {
  return (
    <div className={`${lang}-only`}>
      {links.map((link) => {
        const content = (
          <>
            <span className="mnl-title">{link.title}</span>
            <span className="mnl-sub">{link.sub}</span>
          </>
        );
        if ('href' in link) {
          return (
            <a
              key={link.title}
              className="main-nav-link"
              href={link.href}
              role="menuitem"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {content}
            </a>
          );
        }
        return (
          <button
            key={link.title}
            type="button"
            className={link.accent ? 'main-nav-link main-nav-link--accent' : 'main-nav-link'}
            data-nav={link.nav}
            role="menuitem"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="site">
      <div className="wrap nav">
        <a className="brand" href="/#home" data-nav="home">
          <span className="logo">R</span>
          <span className="brand-word en-only">
            Ready<span className="brand-gold">Korea</span>
          </span>
          <span className="brand-word ko-only">
            레디<span className="brand-gold">코리아</span>
          </span>
        </a>
        <NavRow items={EN_NAV} label="Teacher navigation" lang="en" />
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
              <MobileLinks links={EN_MOBILE} lang="en" />
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
          <button type="button" className="nav-action nav-action--primary en-only" id="nav-apply-btn">
            Apply
          </button>
          <button type="button" className="nav-action nav-action--primary ko-only" id="nav-inquire-btn">
            구인 등록
          </button>
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
