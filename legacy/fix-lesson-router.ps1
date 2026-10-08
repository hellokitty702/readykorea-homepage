# Fix encoding, rename openLesson -> openCurriculumLesson, remove stale handlers
$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Source = Join-Path $Root 'david-esl-homepage.html'
$utf8 = [System.Text.UTF8Encoding]::new($false)
$html = [System.IO.File]::ReadAllText($Source, $utf8)

# 1) Fix back-button labels (corrupted arrows / Korean)
$html = [regex]::Replace($html,
  '(class="btn btn-secondary lesson-back-to-list" data-lesson-back="[^"]+" data-lesson-lang="en">)[^<]+',
  '${1}&larr; Back to list')
$html = [regex]::Replace($html,
  '(class="btn btn-secondary lesson-back-to-list" data-lesson-back="[^"]+" data-lesson-lang="ko">)[^<]+',
  '${1}&larr; 목록으로')

# 2) Remove stale show/hide handlers that assume inline details exist
$stale = @'
// K1/K2/K3/G1 lesson detail ↔ library list
['k1', 'k2', 'k3', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6'].forEach(level => {
  document.querySelectorAll('#' + level + '-lessons-nav .lesson[data-' + level + '-lesson]').forEach(row => {
    row.addEventListener('click', () => {
      const num = row.getAttribute('data-' + level + '-lesson');
      const id = level + '-lesson-' + num;
      document.querySelectorAll('#' + level + '-lesson-panel .lesson-detail').forEach(d => d.classList.remove('active'));
      const detail = document.getElementById(id);
      if (detail) {
        detail.classList.add('active');
        document.getElementById(level + '-lesson-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      document.querySelectorAll('#' + level + '-lessons-nav .lesson').forEach(r => r.classList.remove('active'));
      row.classList.add('active');
    });
  });
});

// K1/K2/K3/G1 원장용 단원 분석 ↔ 목록 (ko-only)
['k1', 'k2', 'k3', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6'].forEach(level => {
  document.querySelectorAll('#' + level + '-ko-lessons-nav .lesson[data-' + level + '-ko-lesson]').forEach(row => {
    row.addEventListener('click', () => {
      const num = row.getAttribute('data-' + level + '-ko-lesson');
      const id = level + '-ko-lesson-' + num;
      document.querySelectorAll('#' + level + '-ko-lesson-panel .lesson-detail').forEach(d => d.classList.remove('active'));
      const detail = document.getElementById(id);
      if (detail) {
        detail.classList.add('active');
        document.getElementById(level + '-ko-lesson-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      document.querySelectorAll('#' + level + '-ko-lessons-nav .lesson').forEach(r => r.classList.remove('active'));
      row.classList.add('active');
    });
  });
});
'@

if ($html.Contains($stale)) {
  $html = $html.Replace($stale, '// (legacy inline lesson toggle removed — using lazy-load router)')
  Write-Host 'Removed stale inline lesson handlers'
} else {
  Write-Warning 'Stale handler block not found as exact match — trying regex'
  $html = [regex]::Replace($html,
    '(?s)// K1/K2/K3/G1 lesson detail.*?library list\r?\n\[''k1''.*?ko-lessons-nav \.lesson\)\.forEach\(r => r\.classList\.remove\(''active''\)\);\r?\n    \}\);\r?\n  \}\);\r?\n\}\);',
    '// (legacy inline lesson toggle removed — using lazy-load router)')
}

# 3) Replace the whole lazy-load router block with a clean UTF-8 version
$startMarker = '// ?'
# Find by unique const name
$startIdx = $html.IndexOf('const LESSON_LEVELS_ROUTE')
if ($startIdx -lt 0) { throw 'LESSON_LEVELS_ROUTE not found' }
# Walk back to comment line start
$lineStart = $html.LastIndexOf("`n", $startIdx)
$blockStart = $lineStart + 1
$endMarker = '// Legacy tab handler (kept for backward compatibility)'
$blockEnd = $html.IndexOf($endMarker, $blockStart)
if ($blockEnd -lt 0) { throw 'Legacy tab handler marker not found' }

$newBlock = @'
// Lesson list -> lazy-load detail (hash routing: #k1/01 or #k1/ko/01)
const LESSON_LEVELS_ROUTE = ['k1', 'k2', 'k3', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6'];
const lessonCache = Object.create(null);

function lessonFragmentUrl(level, lang, num) {
  return 'lessons/' + level + '/' + lang + '/' + num + '.html';
}

function lessonHash(level, lang, num) {
  return lang === 'ko' ? ('#' + level + '/ko/' + num) : ('#' + level + '/' + num);
}

function parseLessonHash(hash) {
  const m = (hash || '').replace(/^#/, '').match(/^(k[1-3]|g[1-6])(?:\/(ko))?\/(\d{2})$/i);
  if (!m) return null;
  return { level: m[1].toLowerCase(), lang: m[2] ? 'ko' : 'en', num: m[3] };
}

async function fetchLessonHtml(level, lang, num) {
  const key = level + '/' + lang + '/' + num;
  if (lessonCache[key]) return lessonCache[key];
  const res = await fetch(lessonFragmentUrl(level, lang, num), { cache: 'force-cache' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const text = await res.text();
  lessonCache[key] = text;
  return text;
}

function getLessonPanel(level, lang) {
  return document.getElementById(lang === 'ko' ? (level + '-ko-lesson-panel') : (level + '-lesson-panel'));
}

function getLessonNav(level, lang) {
  return document.getElementById(lang === 'ko' ? (level + '-ko-lessons-nav') : (level + '-lessons-nav'));
}

function getLessonHost(level, lang) {
  const panel = getLessonPanel(level, lang);
  return panel ? panel.querySelector('.lesson-detail-host') : null;
}

function setLessonListActive(level, lang, num) {
  const nav = getLessonNav(level, lang);
  if (!nav) return;
  const attr = lang === 'ko' ? ('data-' + level + '-ko-lesson') : ('data-' + level + '-lesson');
  nav.querySelectorAll('.lesson').forEach(r => {
    r.classList.toggle('active', r.getAttribute(attr) === num);
  });
}

function showLessonList(level, lang) {
  const panel = getLessonPanel(level, lang);
  const nav = getLessonNav(level, lang);
  if (panel) {
    panel.hidden = true;
    const host = panel.querySelector('.lesson-detail-host');
    if (host) host.innerHTML = '';
  }
  if (nav) {
    nav.hidden = false;
    nav.querySelectorAll('.lesson').forEach(r => r.classList.remove('active'));
    nav.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

async function openCurriculumLesson(level, lang, num, opts) {
  const options = opts || {};
  const panel = getLessonPanel(level, lang);
  const host = getLessonHost(level, lang);
  const nav = getLessonNav(level, lang);
  if (!panel || !host) return false;

  if (typeof navigateTo === 'function') navigateTo(level);
  if (nav) nav.hidden = true;
  panel.hidden = false;
  host.innerHTML = '<div class="lesson-loading">' + (lang === 'ko' ? '레슨을 불러오는 중…' : 'Loading lesson…') + '</div>';
  setLessonListActive(level, lang, num);

  try {
    const frag = await fetchLessonHtml(level, lang, num);
    host.innerHTML = frag;
    const detail = host.querySelector('.lesson-detail, article.lesson-plan');
    if (detail) detail.classList.add('active');
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (options.pushState !== false) {
      history.pushState(null, '', lessonHash(level, lang, num));
    }
    return true;
  } catch (err) {
    const msg = lang === 'ko'
      ? '레슨을 불러오지 못했습니다. 로컬 HTTP 서버로 열어주세요 (예: npx serve).'
      : 'Could not load lesson. Open via a local HTTP server (e.g. npx serve) — file:// blocks fetch.';
    host.innerHTML = '<div class="lesson-error">' + msg + '</div>';
    console.error('Lesson load failed:', level, lang, num, err);
    return false;
  }
}

LESSON_LEVELS_ROUTE.forEach(level => {
  document.querySelectorAll('#' + level + '-lessons-nav .lesson[data-' + level + '-lesson]').forEach(row => {
    row.addEventListener('click', () => {
      const num = row.getAttribute('data-' + level + '-lesson');
      if (num) openCurriculumLesson(level, 'en', num);
    });
  });
  document.querySelectorAll('#' + level + '-ko-lessons-nav .lesson[data-' + level + '-ko-lesson]').forEach(row => {
    row.addEventListener('click', () => {
      const num = row.getAttribute('data-' + level + '-ko-lesson');
      if (num) openCurriculumLesson(level, 'ko', num);
    });
  });
});

document.querySelectorAll('.lesson-back-to-list').forEach(btn => {
  btn.addEventListener('click', () => {
    const level = btn.getAttribute('data-lesson-back');
    const lang = btn.getAttribute('data-lesson-lang') || 'en';
    showLessonList(level, lang);
    history.pushState(null, '', '#' + level);
  });
});

const _origHandleHashNavigation = typeof handleHashNavigation === 'function' ? handleHashNavigation : null;
window.handleHashNavigation = function(hash) {
  const lesson = parseLessonHash(hash);
  if (lesson) {
    openCurriculumLesson(lesson.level, lesson.lang, lesson.num, { pushState: false });
    return;
  }
  const levelOnly = (hash || '').replace(/^#/, '').match(/^(k[1-3]|g[1-6])$/i);
  if (levelOnly) {
    const lv = levelOnly[1].toLowerCase();
    showLessonList(lv, 'en');
    showLessonList(lv, 'ko');
  }
  if (_origHandleHashNavigation) _origHandleHashNavigation(hash);
};

'@

$html = $html.Substring(0, $blockStart) + $newBlock + $html.Substring($blockEnd)

# 4) Add click hint under lesson library headings (once each pattern)
$html = $html.Replace(
  '<section id="k1-lessons-nav">`r`n        <h2>Lesson Plan Library</h2>',
  '<section id="k1-lessons-nav">`r`n        <h2>Lesson Plan Library</h2>`r`n        <p class="lessons-nav-hint">Click a lesson title to open the full plan.</p>')
# Generic: after each EN "Lesson Plan Library" / KO analysis h2 if missing hint
$html = [regex]::Replace($html,
  '(<section id="(k[1-3]|g[1-6])-lessons-nav">\s*<h2>[^<]+</h2>)(?!\s*<p class="lessons-nav-hint")',
  '$1' + "`n        <p class=`"lessons-nav-hint`">Click a lesson title to open the full plan.</p>")
$html = [regex]::Replace($html,
  '(<section id="(k[1-3]|g[1-6])-ko-lessons-nav">\s*<h2>[^<]+</h2>)(?!\s*<p class="lessons-nav-hint")',
  '$1' + "`n        <p class=`"lessons-nav-hint`">단원 제목을 클릭하면 상세 분석이 열립니다.</p>")

[System.IO.File]::WriteAllText($Source, $html, $utf8)
Write-Host 'Fixed encoding, renamed openCurriculumLesson, cleaned handlers.'
Write-Host ("Lines: " + ($html -split "`n").Count)
