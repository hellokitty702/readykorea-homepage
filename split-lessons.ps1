# Split embedded lesson details out of david-esl-homepage.html into
# lessons/{grade}/{en|ko}/{nn}.html and leave list-only shells + lazy load.

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Source = Join-Path $Root 'david-esl-homepage.html'
$Backup = Join-Path $Root 'david-esl-homepage.before-lesson-split.html'
$LessonsRoot = Join-Path $Root 'lessons'
$Grades = @('k1','k2','k3','g1','g2','g3','g4','g5','g6')

Write-Host "Reading source..."
$raw = [System.IO.File]::ReadAllText($Source, [System.Text.UTF8Encoding]::new($false))
if (-not (Test-Path $Backup)) {
  Write-Host "Backup -> $Backup"
  [System.IO.File]::WriteAllText($Backup, $raw, [System.Text.UTF8Encoding]::new($false))
}

function Extract-Balanced([string]$html, [int]$start, [string]$tag) {
  $openRe = [regex]::new("<$tag\b", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  $closeRe = [regex]::new("</$tag>", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  $depth = 0
  $i = $start
  $begin = $start
  $n = $html.Length
  while ($i -lt $n) {
    $om = $openRe.Match($html, $i)
    $cm = $closeRe.Match($html, $i)
    if (-not $om.Success -and -not $cm.Success) { break }
    $useOpen = $om.Success -and ((-not $cm.Success) -or ($om.Index -le $cm.Index))
    if ($useOpen) {
      if ($depth -eq 0) { $begin = $om.Index }
      $depth++
      $i = $om.Index + $om.Length
    } else {
      $depth--
      $i = $cm.Index + $cm.Length
      if ($depth -eq 0) {
        return @{ Html = $html.Substring($begin, $i - $begin); Start = $begin; End = $i }
      }
    }
  }
  return $null
}

function Find-LessonBlock([string]$html, [string]$elementId) {
  $needle = "id=`"$elementId`""
  $idx = $html.IndexOf($needle)
  if ($idx -lt 0) { return $null }
  $openStart = $html.LastIndexOf('<', $idx)
  if ($openStart -lt 0) { return $null }
  $snippet = $html.Substring($openStart, [Math]::Min(20, $html.Length - $openStart)).ToLowerInvariant()
  $tag = if ($snippet.StartsWith('<article')) { 'article' } else { 'div' }
  return Extract-Balanced $html $openStart $tag
}

# --- Extract all lessons ---
$extracted = 0
foreach ($grade in $Grades) {
  foreach ($lang in @('en','ko')) {
    $dir = Join-Path $LessonsRoot "$grade\$lang"
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    for ($n = 1; $n -le 18; $n++) {
      $nn = '{0:D2}' -f $n
      $id = if ($lang -eq 'en') { "$grade-lesson-$nn" } else { "$grade-ko-lesson-$nn" }
      $block = Find-LessonBlock $raw $id
      if (-not $block) {
        Write-Warning "Missing: $id"
        continue
      }
      $path = Join-Path $dir "$nn.html"
      # Normalize: drop .active on extracted fragments (loader adds it)
      $frag = $block.Html -replace ' class="lesson-detail active', ' class="lesson-detail'
      $frag = $frag -replace ' class="lesson-detail active lesson-plan', ' class="lesson-detail lesson-plan'
      [System.IO.File]::WriteAllText($path, $frag, [System.Text.UTF8Encoding]::new($false))
      $extracted++
    }
  }
}
Write-Host "Extracted $extracted lesson fragments to $LessonsRoot"

# --- Replace each lesson-detail-panel body with a list-first shell ---
# Process from end to start so indices stay valid when replacing.

function Replace-Panel([string]$html, [string]$panelId, [string]$navId, [string]$langLabel) {
  $panelNeedle = "id=`"$panelId`""
  $pIdx = $html.IndexOf($panelNeedle)
  if ($pIdx -lt 0) { throw "Panel not found: $panelId" }
  $panelOpen = $html.LastIndexOf('<', $pIdx)
  $panel = Extract-Balanced $html $panelOpen 'div'
  if (-not $panel) { throw "Could not balance panel: $panelId" }

  $navNeedle = "<section id=`"$navId`""
  $nIdx = $html.IndexOf($navNeedle, $panel.End)
  if ($nIdx -lt 0) {
    # nav might be right after with different spacing already moved — try any remaining
    $nIdx = $html.IndexOf($navNeedle)
  }
  if ($nIdx -lt 0) { throw "Nav not found: $navId" }
  $nav = Extract-Balanced $html $nIdx 'section'
  if (-not $nav) { throw "Could not balance nav: $navId" }

  # Typical order: [optional <section>] panel </section>? → nav → footer buttons.
  # Desired order: nav → panel → footer (list first; detail loads on click).
  $afterNav = $nav.End
  $footerStart = $afterNav
  $footerEnd = $afterNav
  $trim = $html.Substring($afterNav, [Math]::Min(500, $html.Length - $afterNav))
  if ($trim -match '(?s)^\s*<div\s+style="display:\s*flex') {
    $footer = Extract-Balanced $html ($afterNav + ($trim.Length - $trim.TrimStart().Length)) 'div'
    # Re-find precisely from afterNav
    $probe = $afterNav
    while ($probe -lt $html.Length -and [char]::IsWhiteSpace($html[$probe])) { $probe++ }
    if ($probe -lt $html.Length -and $html.Substring($probe, 4) -eq '<div') {
      $footer = Extract-Balanced $html $probe 'div'
      if ($footer) {
        $footerStart = $footer.Start
        $footerEnd = $footer.End
      }
    }
  }

  $navHtml = $nav.Html
  $navHtml = [regex]::Replace($navHtml, 'class="lesson active"', 'class="lesson"')

  $grade = ($panelId -replace '-ko-lesson-panel$','' -replace '-lesson-panel$','')
  $isKo = $panelId -like '*-ko-lesson-panel'
  $backLabel = if ($isKo) { '← 목록으로' } else { '← Back to list' }
  $lang = if ($isKo) { 'ko' } else { 'en' }
  $placeholder = @"
        <div class="lesson-detail-panel lesson-detail-panel--lazy" id="$panelId" hidden>
          <div class="lesson-detail-toolbar">
            <button type="button" class="btn btn-secondary lesson-back-to-list" data-lesson-back="$grade" data-lesson-lang="$lang">$backLabel</button>
          </div>
          <div class="lesson-detail-host" data-lesson-host="$grade" data-lesson-lang="$lang" aria-live="polite"></div>
        </div>
"@

  $footerHtml = if ($footerEnd -gt $footerStart) { $html.Substring($footerStart, $footerEnd - $footerStart) } else { '' }

  # If panel sits inside a wrapping <section>, replace from that section open
  # through footer so we don't leave an orphan </section>.
  $regionStart = $panel.Start
  $lookBehind = $html.Substring([Math]::Max(0, $panel.Start - 120), [Math]::Min(120, $panel.Start))
  if ($lookBehind -match '(?s)<section\b[^>]*>\s*$') {
    $regionStart = $html.LastIndexOf('<section', $panel.Start)
  }
  $regionEnd = if ($footerEnd -gt $nav.End) { $footerEnd } else { $nav.End }

  $replacement = @"
$navHtml
$placeholder
$footerHtml
"@

  return $html.Substring(0, $regionStart) + $replacement + $html.Substring($regionEnd)
}

$html = $raw
# Replace KO panels first within each grade? Better: replace from last grade backwards
# so earlier indices unchanged... actually each Replace-Panel searches by ID so order OK,
# but string grows/shrinks — always search fresh IDs. Process g6 → k1 to be safer for any
# overlapping assumptions.
[array]::Reverse($Grades)
foreach ($grade in $Grades) {
  Write-Host "Rewriting level $grade..."
  $html = Replace-Panel $html "$grade-ko-lesson-panel" "$grade-ko-lessons-nav" 'ko'
  $html = Replace-Panel $html "$grade-lesson-panel" "$grade-lessons-nav" 'en'
}
[array]::Reverse($Grades)

# --- Inject CSS for lazy panels ---
$cssHook = '  #level-k1 .lesson-detail-panel .lesson-detail { display: none; }'
$extraCss = @'

  /* Lazy-loaded lesson detail (list-first routing) */
  .lesson-detail-panel--lazy[hidden] { display: none !important; }
  .lesson-detail-panel--lazy:not([hidden]) { display: block; margin-top: 20px; }
  .lesson-detail-toolbar { margin-bottom: 12px; }
  .lesson-detail-host .lesson-detail { display: block !important; }
  .lesson-detail-host .lesson-loading,
  .lesson-detail-host .lesson-error {
    padding: 24px; border: 0.5px solid var(--line); border-radius: 12px;
    background: white; color: var(--ink-2); font-size: 14px;
  }
  .lesson-detail-host .lesson-error { color: var(--danger); border-color: #fecaca; background: #fef2f2; }
  .lessons-nav-hint { font-size: 13px; color: var(--ink-3); margin: 0 0 12px; }
'@

if ($html.Contains($cssHook) -and -not $html.Contains('lesson-detail-panel--lazy[hidden]')) {
  $html = $html.Replace($cssHook, $extraCss + "`n" + $cssHook)
}

# Add hint under nav h2 via JS rather than editing every nav — skip.

# --- Replace click handlers with lazy-load + hash routing ---
$oldHandlers = @'
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

$newHandlers = @'
// ── Lesson list → lazy-load detail (page separation / hash routing) ──
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
  const html = await res.text();
  lessonCache[key] = html;
  return html;
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
    const n = r.getAttribute(attr);
    r.classList.toggle('active', n === num);
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

async function openLesson(level, lang, num, opts) {
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
    const html = await fetchLessonHtml(level, lang, num);
    host.innerHTML = html;
    const detail = host.querySelector('.lesson-detail, article.lesson-plan');
    if (detail) detail.classList.add('active');
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (options.pushState !== false) {
      history.pushState(null, '', lessonHash(level, lang, num));
    }
    return true;
  } catch (err) {
    const msg = lang === 'ko'
      ? '레슨을 불러오지 못했습니다. 로컬 서버로 열어주세요 (예: npx serve).'
      : 'Could not load lesson. Open via a local server (e.g. npx serve) — file:// blocks fetch.';
    host.innerHTML = '<div class="lesson-error">' + msg + '</div>';
    console.error('Lesson load failed:', level, lang, num, err);
    return false;
  }
}

LESSON_LEVELS_ROUTE.forEach(level => {
  document.querySelectorAll('#' + level + '-lessons-nav .lesson[data-' + level + '-lesson]').forEach(row => {
    row.addEventListener('click', () => {
      const num = row.getAttribute('data-' + level + '-lesson');
      if (num) openLesson(level, 'en', num);
    });
  });
  document.querySelectorAll('#' + level + '-ko-lessons-nav .lesson[data-' + level + '-ko-lesson]').forEach(row => {
    row.addEventListener('click', () => {
      const num = row.getAttribute('data-' + level + '-ko-lesson');
      if (num) openLesson(level, 'ko', num);
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
    openLesson(lesson.level, lesson.lang, lesson.num, { pushState: false });
    return;
  }
  // Leaving a lesson deep-link: show list again for that level if hash is just #k1
  const levelOnly = (hash || '').replace(/^#/, '').match(/^(k[1-3]|g[1-6])$/i);
  if (levelOnly) {
    const lv = levelOnly[1].toLowerCase();
    showLessonList(lv, 'en');
    showLessonList(lv, 'ko');
  }
  if (_origHandleHashNavigation) _origHandleHashNavigation(hash);
};
'@

if ($html.Contains($oldHandlers)) {
  $html = $html.Replace($oldHandlers, $newHandlers)
  Write-Host "Replaced lesson click handlers with lazy-load router."
} else {
  Write-Warning "Old lesson handlers not found — injecting before Legacy tab handler."
  $injectAt = '// Legacy tab handler (kept for backward compatibility)'
  if ($html.Contains($injectAt)) {
    $html = $html.Replace($injectAt, $newHandlers + "`n`n" + $injectAt)
  } else {
    throw 'Could not find injection point for lesson handlers'
  }
}

# Patch handleHashNavigation call site — we wrapped it above. Also ensure initial hash works.
# The existing code calls handleHashNavigation(location.hash) on load — our wrap covers that.

Write-Host "Writing updated david-esl-homepage.html..."
[System.IO.File]::WriteAllText($Source, $html, [System.Text.UTF8Encoding]::new($false))
$sizeMb = [math]::Round((Get-Item $Source).Length / 1MB, 2)
Write-Host "Done. Source size now ${sizeMb} MB. Fragments: $extracted"
Write-Host "Open via HTTP (not file://) so fetch() can load lessons/..."
