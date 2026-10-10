import { TEACHER_APPLY_FORM_URL } from '@/lib/site';

// Site footer shared by every page (originally the homepage footer). Styles: styles/layout.css.

export function SiteFooter() {
  return (
    <footer className="site">
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div
          style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}
        >
          <span>ReadyKorea · Run by John · Seoul, Korea</span>
          <a href={TEACHER_APPLY_FORM_URL} target="_blank" rel="noopener" className="cta">
            학원 채용 담당자세요? 공고 등록하기 →
          </a>
        </div>
        <div
          style={{
            borderTop: '0.5px solid var(--line)',
            paddingTop: 12,
            fontSize: 11,
            color: 'var(--ink-4)',
            lineHeight: 1.6,
          }}
        >
          ReadyKorea is an independent platform and is not affiliated with, endorsed by, or sponsored by Cambridge
          Assessment English, Jolly Learning Ltd, Oxford University Press, Learning A-Z, or any other third party.
          References to Cambridge YLE, CEFR, Oxford Reading Tree, Reading A-Z, and synthetic phonics methodologies are
          descriptive and used solely to indicate curriculum alignment for the purposes of preparing students. All
          trademarks and copyrights are the property of their respective owners.
        </div>
      </div>
    </footer>
  );
}
