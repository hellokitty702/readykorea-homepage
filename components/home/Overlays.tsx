import { HtmlBlock } from '@/components/HtmlBlock';

/** Drawer and modals; their content is filled in and toggled by `public/js/home.js`. */
export function Overlays() {
  return (
    <>
      {/* Lesson plan drawer */}
      <div className="backdrop" id="backdrop" />
      <aside className="drawer" id="drawer" aria-hidden="true">
        <div className="drawer-head">
          <h3 id="d-title" />
          <button className="close" id="d-close" aria-label="Close">
            ✕
          </button>
        </div>
        <div className="drawer-body" id="d-body" />
      </aside>

      {/* Email-gate modal (shared by Game Kit downloads + Forum invite); uses inline handlers, so kept as HTML */}
      <HtmlBlock className="magnet-modal" id="magnet-modal" src="home/magnet-modal.html" />

      {/* Support Center priority guide modal */}
      <div
        className="support-guide-modal"
        id="support-guide-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-guide-modal-title"
        aria-hidden="true"
      >
        <div className="support-guide-modal-card">
          <button type="button" className="support-guide-modal-close" id="support-guide-modal-close" aria-label="Close">
            ✕
          </button>
          <div className="support-guide-modal-head">
            <span className="support-guide-modal-icon" id="support-guide-modal-icon" aria-hidden="true" />
            <div>
              <div className="support-guide-modal-cat" id="support-guide-modal-cat" />
              <h3 className="support-guide-modal-title" id="support-guide-modal-title" />
            </div>
          </div>
          <p className="support-guide-modal-summary" id="support-guide-modal-summary" />
          <p className="support-guide-modal-body" id="support-guide-modal-body" />
          <div className="support-guide-modal-actions">
            <div id="support-guide-modal-ext" hidden />
            <button type="button" className="support-guide-modal-finder" id="support-guide-modal-finder" hidden>
              Open office finder ↓
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
