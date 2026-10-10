import Link from 'next/link';
import { HtmlBlock } from '@/components/html-block';
import { GUIDE_SUBPAGES } from '@/lib/site-pages';

/** One sub-page of a guide in GUIDE_SUBPAGES (E-2 Visa, While in Korea), with the guide's side menu. */
export function GuideSubpage({ guide, slug }: { guide: keyof typeof GUIDE_SUBPAGES; slug: string }) {
  const { label, note, entries, footer } = GUIDE_SUBPAGES[guide]!;
  const dir = `pages/for-teachers/${guide}`;
  return (
    <div className="wrap">
      <section id={guide}>
        <div className="e2-visa-hub">
          <nav className="e2-visa-nav" aria-label={`${label} guide`}>
            <div className="e2-visa-nav-group">
              <div className="e2-visa-nav-label e2-visa-nav-label--active">{label}</div>
              {note && (
                <p style={{ fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.5, padding: '0 18px 10px', margin: 0 }}>
                  {note}
                </p>
              )}
              {entries.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/for-teachers/${guide}/${entry.slug && `${entry.slug}/`}`}
                  className={entry.slug === slug ? 'e2-visa-nav-btn active' : 'e2-visa-nav-btn'}
                  aria-current={entry.slug === slug ? 'page' : undefined}
                >
                  {entry.title}{' '}
                  <span className="e2-nav-chevron" aria-hidden="true">
                    ›
                  </span>
                </Link>
              ))}
            </div>
            <div className="e2-visa-nav-group e2-visa-nav-group--footer">
              <Link href={footer.href} className="e2-visa-nav-btn e2-visa-nav-btn--jump">
                {footer.title}
              </Link>
            </div>
          </nav>
          <HtmlBlock className="e2-visa-main" src={[`${dir}/${slug || 'index'}.html`, `${dir}/source.html`]} />
        </div>
      </section>
    </div>
  );
}
