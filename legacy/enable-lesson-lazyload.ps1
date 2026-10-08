# Enable in-page lazy-loading for lesson details.
# Creates .frag.html files + wires index.html / david-esl-homepage.html

$ErrorActionPreference = 'Stop'
$Root = $PSScriptRoot
$Utf8 = [System.Text.UTF8Encoding]::new($false)
$Grades = @('k1','k2','k3','g1','g2','g3','g4','g5','g6')

function Extract-ShellInner([string]$pageHtml) {
  $m = [regex]::Match($pageHtml, '(?s)<div class="lesson-shell">\s*(.*?)\s*</div>\s*<nav class="pager"', 'IgnoreCase')
  if ($m.Success) { return $m.Groups[1].Value.Trim() }
  $m2 = [regex]::Match($pageHtml, '(?s)<div class="lesson-shell">\s*(.*?)\s*</div>\s*</main>', 'IgnoreCase')
  if ($m2.Success) { return $m2.Groups[1].Value.Trim() }
  # Already a fragment
  if ($pageHtml -notmatch '(?i)<!DOCTYPE\s+html') { return $pageHtml.Trim() }
  return $null
}

# --- 1) Build fragment files for fast fetch ---
$fragCount = 0
foreach ($grade in $Grades) {
  foreach ($lang in @('en','ko')) {
    $dir = Join-Path $Root "lessons\$grade\$lang"
    for ($i = 1; $i -le 18; $i++) {
      $nn = '{0:D2}' -f $i
      $pagePath = Join-Path $dir "$nn.html"
      if (-not (Test-Path $pagePath)) { Write-Warning "Missing $pagePath"; continue }
      $page = [IO.File]::ReadAllText($pagePath, $Utf8)
      $inner = Extract-ShellInner $page
      if (-not $inner) { Write-Warning "No shell in $pagePath"; continue }
      $fragPath = Join-Path $dir "$nn.frag.html"
      [IO.File]::WriteAllText($fragPath, $inner + "`n", $Utf8)
      $fragCount++
    }
  }
}
Write-Host "Wrote $fragCount fragment files"

# --- 2) Patch main pages ---
function Patch-MainHtml([string]$path) {
  $html = [IO.File]::ReadAllText($path, $Utf8)
  $origLen = $html.Length

  # Ensure CSS for lazy panels exists
  if ($html -notmatch 'lesson-detail-panel--lazy') {
    $css = @'

  .lesson-detail-panel--lazy[hidden] { display: none !important; }
  .lesson-detail-panel--lazy:not([hidden]) { display: block; margin-top: 20px; }
  .lesson-detail-toolbar { margin-bottom: 12px; }
  .lesson-detail-host .lesson-detail,
  .lesson-detail-host article.lesson-plan { display: block !important; }
  .lesson-detail-host .lesson-loading,
  .lesson-detail-host .lesson-error {
    padding: 16px; border-radius: 10px; border: 0.5px solid var(--line); background: #f8fafc; color: var(--ink-2);
  }
  .lesson-detail-host .lesson-error { color: var(--danger, #b91c1c); border-color: #fecaca; background: #fef2f2; }
  a.lesson.is-active { outline: 2px solid var(--info, #0284c7); outline-offset: 2px; }

'@
    $html = $html.Replace('</style>', $css + '</style>')
  }

  # Insert lazy host panels after each lessons list (before the flex nav buttons)
  # Pattern: </div></section> then flex buttons — inject panel between section and buttons
  $panelTpl = @'
      <div class="lesson-detail-panel lesson-detail-panel--lazy" id="PANEL_ID" hidden>
        <div class="lesson-detail-toolbar">
          <button type="button" class="btn btn-secondary lesson-back-btn">BACK_LABEL</button>
        </div>
        <div class="lesson-detail-host" id="HOST_ID" aria-live="polite"></div>
      </div>
'@

  foreach ($grade in $Grades) {
    foreach ($pair in @(
      @{ nav = "$grade-lessons-nav"; panel = "$grade-lesson-detail-panel"; host = "$grade-lesson-detail-host"; back = '&larr; Back to list'; lang = 'en' },
      @{ nav = "$grade-ko-lessons-nav"; panel = "$grade-ko-lesson-detail-panel"; host = "$grade-ko-lesson-detail-host"; back = '&larr; 목록으로'; lang = 'ko' }
    )) {
      # Skip if panel already present
      if ($html -match [regex]::Escape("id=`"$($pair.panel)`"")) { continue }

      $panel = $panelTpl.Replace('PANEL_ID', $pair.panel).Replace('HOST_ID', $pair.host).Replace('BACK_LABEL', $pair.back)

      # Insert after </section> that closes the lessons-nav for this id
      # Find: id="k1-lessons-nav" ... </section> then optional whitespace before <div style="display:flex
      $navId = $pair.nav
      $rx = [regex]::new(
        '(?s)(id="' + [regex]::Escape($navId) + '"[\s\S]*?</section>)(\s*)(<div style="display:flex)',
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
      )
      $m = $rx.Match($html)
      if ($m.Success) {
        $html = $html.Substring(0, $m.Groups[1].Index + $m.Groups[1].Length) +
                "`n" + $panel + "`n" +
                $html.Substring($m.Groups[3].Index)
        Write-Host "Inserted panel for $navId"
      } else {
        Write-Warning "Could not find insertion point for $navId"
      }
    }
  }

  # Update lesson <a> hrefs to point at fragments for progressive enhancement,
  # but keep full-page fallback via data-full-href. Actually: keep href to full page
  # for open-in-new-tab; JS will intercept and load .frag.html

  # Remove any prior lazy-load router block if present
  $markers = @(
    '// === LESSON LAZY LOAD ROUTER ===',
    '// Lesson list -> lazy-load detail',
    '// Lesson titles link to lessons/'
  )
  $endMarker = '// Legacy tab handler (kept for backward compatibility)'
  $endIdx = $html.IndexOf($endMarker)
  foreach ($startMarker in $markers) {
    $startIdx = $html.IndexOf($startMarker)
    if ($startIdx -ge 0 -and $endIdx -gt $startIdx) {
      $html = $html.Substring(0, $startIdx) + $html.Substring($endIdx)
      $endIdx = $html.IndexOf($endMarker)
      Write-Host "Removed old router block starting at: $startMarker"
    }
  }

  $routerJs = @'
// === LESSON LAZY LOAD ROUTER ===
(function () {
  const LESSON_GRADES = ['k1','k2','k3','g1','g2','g3','g4','g5','g6'];
  const lessonCache = Object.create(null);
  let activeLessonKey = null;

  function parseLessonHash(hash) {
    const raw = (hash || '').replace(/^#/, '');
    // #k1/01  or  #k1/ko/01
    let m = raw.match(/^(k1|k2|k3|g1|g2|g3|g4|g5|g6)\/(ko)\/(\d{1,2})$/i);
    if (m) return { grade: m[1].toLowerCase(), lang: 'ko', nn: String(m[3]).padStart(2, '0') };
    m = raw.match(/^(k1|k2|k3|g1|g2|g3|g4|g5|g6)\/(\d{1,2})$/i);
    if (m) return { grade: m[1].toLowerCase(), lang: 'en', nn: String(m[2]).padStart(2, '0') };
    return null;
  }

  function lessonHash(grade, lang, nn) {
    return lang === 'ko' ? ('#' + grade + '/ko/' + nn) : ('#' + grade + '/' + nn);
  }

  function panelIds(grade, lang) {
    if (lang === 'ko') {
      return {
        panel: grade + '-ko-lesson-detail-panel',
        host: grade + '-ko-lesson-detail-host',
        nav: grade + '-ko-lessons-nav'
      };
    }
    return {
      panel: grade + '-lesson-detail-panel',
      host: grade + '-lesson-detail-host',
      nav: grade + '-lessons-nav'
    };
  }

  function fragUrl(grade, lang, nn) {
    return 'lessons/' + grade + '/' + lang + '/' + nn + '.frag.html';
  }

  function fullUrl(grade, lang, nn) {
    return 'lessons/' + grade + '/' + lang + '/' + nn + '.html';
  }

  function setActiveRow(grade, lang, nn) {
    document.querySelectorAll('a.lesson.is-active').forEach(function (el) {
      el.classList.remove('is-active');
    });
    const attr = lang === 'ko' ? ('data-' + grade + '-ko-lesson') : ('data-' + grade + '-lesson');
    const row = document.querySelector('a.lesson[' + attr + '="' + nn + '"]');
    if (row) row.classList.add('is-active');
  }

  function hideAllPanels() {
    document.querySelectorAll('.lesson-detail-panel--lazy').forEach(function (p) {
      p.hidden = true;
      const host = p.querySelector('.lesson-detail-host');
      if (host) host.innerHTML = '';
    });
  }

  function closeLessonDetail(grade, lang) {
    const ids = panelIds(grade, lang);
    const panel = document.getElementById(ids.panel);
    if (panel) {
      panel.hidden = true;
      const host = document.getElementById(ids.host);
      if (host) host.innerHTML = '';
    }
    document.querySelectorAll('a.lesson.is-active').forEach(function (el) {
      el.classList.remove('is-active');
    });
    activeLessonKey = null;
    const levelHash = '#' + grade;
    if (location.hash !== levelHash) {
      history.replaceState(null, '', levelHash);
    }
    const nav = document.getElementById(ids.nav);
    if (nav) nav.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function loadLesson(grade, lang, nn, opts) {
    opts = opts || {};
    const key = grade + '/' + lang + '/' + nn;
    const ids = panelIds(grade, lang);
    const panel = document.getElementById(ids.panel);
    const host = document.getElementById(ids.host);
    if (!panel || !host) {
      // Fallback: navigate to full page
      location.href = fullUrl(grade, lang, nn);
      return;
    }

    // Ensure level tab visible
    if (typeof navigateTo === 'function') {
      try { navigateTo(grade); } catch (e) {}
    } else {
      document.querySelectorAll('.level-content').forEach(function (el) {
        el.style.display = (el.id === 'level-' + grade) ? '' : 'none';
      });
    }

    hideAllPanels();
    panel.hidden = false;
    setActiveRow(grade, lang, nn);
    activeLessonKey = key;

    const desiredHash = lessonHash(grade, lang, nn);
    if (!opts.skipHash && location.hash !== desiredHash) {
      history.pushState(null, '', desiredHash);
    }

    if (lessonCache[key]) {
      host.innerHTML = lessonCache[key];
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const loadingMsg = (lang === 'ko')
      ? '레슨을 불러오는 중…'
      : 'Loading lesson…';
    host.innerHTML = '<div class="lesson-loading">' + loadingMsg + '</div>';
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      const res = await fetch(fragUrl(grade, lang, nn), { cache: 'force-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const html = await res.text();
      lessonCache[key] = html;
      if (activeLessonKey === key) {
        host.innerHTML = html;
      }
    } catch (err) {
      console.warn('Lazy load failed, opening full page:', err);
      // file:// or network failure → full page
      location.href = fullUrl(grade, lang, nn);
    }
  }

  function lessonFromAnchor(a) {
    if (!a || !a.classList || !a.classList.contains('lesson')) return null;
    for (let i = 0; i < LESSON_GRADES.length; i++) {
      const g = LESSON_GRADES[i];
      const en = a.getAttribute('data-' + g + '-lesson');
      if (en) return { grade: g, lang: 'en', nn: String(en).padStart(2, '0') };
      const ko = a.getAttribute('data-' + g + '-ko-lesson');
      if (ko) return { grade: g, lang: 'ko', nn: String(ko).padStart(2, '0') };
    }
    // Parse href: lessons/k1/en/01.html
    const href = a.getAttribute('href') || '';
    const m = href.match(/lessons\/(k1|k2|k3|g1|g2|g3|g4|g5|g6)\/(en|ko)\/(\d{2})\.html/i);
    if (m) return { grade: m[1].toLowerCase(), lang: m[2].toLowerCase(), nn: m[3] };
    return null;
  }

  document.addEventListener('click', function (e) {
    const back = e.target.closest && e.target.closest('.lesson-back-btn');
    if (back) {
      e.preventDefault();
      const panel = back.closest('.lesson-detail-panel--lazy');
      if (!panel || !panel.id) return;
      const id = panel.id;
      // k1-lesson-detail-panel or k1-ko-lesson-detail-panel
      const m = id.match(/^(k1|k2|k3|g1|g2|g3|g4|g5|g6)(-ko)?-lesson-detail-panel$/);
      if (!m) return;
      closeLessonDetail(m[1], m[2] ? 'ko' : 'en');
      return;
    }

    const a = e.target.closest && e.target.closest('a.lesson');
    if (!a) return;
    // Allow modified clicks (new tab)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const info = lessonFromAnchor(a);
    if (!info) return;
    e.preventDefault();
    loadLesson(info.grade, info.lang, info.nn);
  });

  function tryOpenFromHash() {
    const info = parseLessonHash(location.hash);
    if (!info) return false;
    loadLesson(info.grade, info.lang, info.nn, { skipHash: true });
    return true;
  }

  // Hook into existing hash navigation without breaking level tabs
  const _prevHandleHash = window.handleHashNavigation;
  window.handleHashNavigation = function (hash) {
    if (parseLessonHash(hash)) {
      tryOpenFromHash();
      return;
    }
    hideAllPanels();
    activeLessonKey = null;
    if (typeof _prevHandleHash === 'function') _prevHandleHash(hash);
  };

  window.addEventListener('popstate', function () {
    if (!tryOpenFromHash()) {
      hideAllPanels();
      activeLessonKey = null;
    }
  });

  // Initial deep link
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { tryOpenFromHash(); });
  } else {
    tryOpenFromHash();
  }

  window.openCurriculumLesson = loadLesson;
  window.closeCurriculumLesson = closeLessonDetail;
  window.parseLessonHash = parseLessonHash;
})();

// Legacy tab handler (kept for backward compatibility)
'@

  if ($html.Contains($endMarker)) {
    $html = $html.Replace($endMarker, $routerJs)
  } else {
    # Insert before </body>
    $html = $html.Replace('</body>', "<script>`n$routerJs`n</script>`n</body>")
  }

  [IO.File]::WriteAllText($path, $html, $Utf8)
  Write-Host ("Patched $path : $origLen -> $($html.Length) chars")
}

$main = Join-Path $Root 'index.html'
Patch-MainHtml $main

$homepage = Join-Path $Root 'david-esl-homepage.html'
if (Test-Path $homepage) {
  [IO.File]::Copy($main, $homepage, $true)
  Write-Host 'Synced david-esl-homepage.html'
}

Write-Host 'Done.'
Write-Host ("index.html MB: " + [math]::Round((Get-Item $main).Length/1MB, 2))
Write-Host ("frag count: " + (Get-ChildItem (Join-Path $Root 'lessons') -Recurse -Filter '*.frag.html' | Measure-Object).Count)
