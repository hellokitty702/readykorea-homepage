# Build full standalone lesson pages from fragments + wire main page links.
# Safe to re-run.

$ErrorActionPreference = 'Stop'
$Root = $PSScriptRoot
$Utf8 = [System.Text.UTF8Encoding]::new($false)
$Grades = @('k1','k2','k3','g1','g2','g3','g4','g5','g6')
$GradeLabels = @{
  k1='K1'; k2='K2'; k3='K3'; g1='G1'; g2='G2'; g3='G3'; g4='G4'; g5='G5'; g6='G6'
}

# --- Shared CSS for lesson detail pages ---
$cssDir = Join-Path $Root 'assets'
New-Item -ItemType Directory -Path $cssDir -Force | Out-Null
$cssPath = Join-Path $cssDir 'lesson-page.css'
$css = @'
* { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --ink: #0f172a; --ink-2: #334155; --ink-3: #64748b;
  --line: rgba(15, 23, 42, 0.08); --bg: #ffffff; --bg-2: #f8fafc;
  --accent: #0f172a; --info: #0284c7;
}
body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
  color: var(--ink); background: var(--bg-2); line-height: 1.6; font-size: 15px;
}
h1, h2, h3 { font-family: "Montserrat", "Pretendard", sans-serif; letter-spacing: -0.02em; }
a { color: var(--info); }
.site-bar {
  background: var(--accent); color: #fff; padding: 14px 20px;
  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
}
.site-bar a { color: #fff; text-decoration: none; font-weight: 600; }
.site-bar .back { opacity: 0.9; font-weight: 500; font-size: 14px; }
.site-bar .back:hover { text-decoration: underline; }
.wrap { max-width: 860px; margin: 0 auto; padding: 28px 20px 60px; }
.lesson-shell {
  background: #fff; border: 0.5px solid var(--line); border-radius: 12px; padding: 24px;
}
.lesson-shell .lesson-detail,
.lesson-shell article.lesson-plan { display: block !important; margin-top: 0 !important; border: none !important; padding: 0 !important; }
.pager {
  display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  margin-top: 24px; padding-top: 16px; border-top: 0.5px solid var(--line);
}
.pager a {
  display: inline-block; padding: 10px 16px; border-radius: 8px;
  background: #fff; border: 0.5px solid var(--line); color: var(--ink); text-decoration: none; font-size: 14px;
}
.pager a:hover { background: var(--bg-2); }
.pager .disabled { opacity: 0.4; pointer-events: none; }
'@
[IO.File]::WriteAllText($cssPath, $css, $Utf8)
Write-Host "Wrote assets/lesson-page.css"

function Get-TitleFromFrag([string]$frag, [string]$fallback) {
  $m = [regex]::Match($frag, '<h1[^>]*>(.*?)</h1>', 'IgnoreCase,Singleline')
  if (-not $m.Success) {
    $m = [regex]::Match($frag, '<h3[^>]*>(.*?)</h3>', 'IgnoreCase,Singleline')
  }
  if ($m.Success) {
    $t = [regex]::Replace($m.Groups[1].Value, '<[^>]+>', ' ')
    $t = [System.Net.WebUtility]::HtmlDecode($t)
    return [regex]::Replace($t, '\s+', ' ').Trim()
  }
  return $fallback
}

function Wrap-LessonPage(
  [string]$frag,
  [string]$grade,
  [string]$lang,
  [string]$nn,
  [string]$title
) {
  $label = $GradeLabels[$grade]
  $langAttr = if ($lang -eq 'ko') { 'ko' } else { 'en' }
  $homeHref = '../../../index.html#' + $grade
  $listLabel = if ($lang -eq 'ko') { "Back to $label" } else { "Back to $label list" }
  $brand = 'ReadyKorea'
  $n = [int]$nn
  $prev = if ($n -gt 1) { '{0:D2}' -f ($n - 1) } else { $null }
  $next = if ($n -lt 18) { '{0:D2}' -f ($n + 1) } else { $null }
  $prevHref = if ($prev) { "./$prev.html" } else { '#' }
  $nextHref = if ($next) { "./$next.html" } else { '#' }
  $prevClass = if ($prev) { '' } else { ' class="disabled"' }
  $nextClass = if ($next) { '' } else { ' class="disabled"' }
  $prevText = '&larr; Prev'
  $nextText = 'Next &rarr;'
  $escTitle = [System.Net.WebUtility]::HtmlEncode($title)

  return @"
<!DOCTYPE html>
<html lang="$langAttr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>$escTitle | $label | $brand</title>
<meta name="description" content="$escTitle — ReadyKorea $label lesson plan" />
<link rel="stylesheet" href="../../../assets/lesson-page.css" />
</head>
<body>
  <header class="site-bar">
    <a href="../../../index.html">$brand</a>
    <a class="back" href="$homeHref">&larr; $listLabel</a>
  </header>
  <main class="wrap">
    <div class="lesson-shell">
$frag
    </div>
    <nav class="pager" aria-label="Lesson pager">
      <a href="$prevHref"$prevClass>$prevText</a>
      <a href="$homeHref">$listLabel</a>
      <a href="$nextHref"$nextClass>$nextText</a>
    </nav>
  </main>
</body>
</html>
"@
}

# --- Wrap all fragment files into full pages ---
$wrapped = 0
foreach ($grade in $Grades) {
  foreach ($lang in @('en','ko')) {
    $dir = Join-Path $Root "lessons\$grade\$lang"
    for ($i = 1; $i -le 18; $i++) {
      $nn = '{0:D2}' -f $i
      $path = Join-Path $dir "$nn.html"
      if (-not (Test-Path $path)) { Write-Warning "Missing $path"; continue }
      $frag = [IO.File]::ReadAllText($path, $Utf8)
      # Skip if already a full document
      if ($frag -match '(?i)^\s*<!DOCTYPE\s+html') {
        # Re-extract body content if re-running: pull lesson-shell inner, else leave
        $inner = [regex]::Match($frag, '(?s)<div class="lesson-shell">\s*(.*?)\s*</div>\s*<nav class="pager"', 'IgnoreCase')
        if ($inner.Success) { $frag = $inner.Groups[1].Value.Trim() }
        else { continue }
      }
      $title = Get-TitleFromFrag $frag "$($GradeLabels[$grade]) Lesson $nn"
      $page = Wrap-LessonPage -frag $frag -grade $grade -lang $lang -nn $nn -title $title
      [IO.File]::WriteAllText($path, $page, $Utf8)
      $wrapped++
    }
  }
}
Write-Host "Wrapped $wrapped lesson pages"

# --- Update main HTML: convert lesson rows to links, strip lazy panels ---
$mainPath = Join-Path $Root 'david-esl-homepage.html'
$html = [IO.File]::ReadAllText($mainPath, $Utf8)

# Convert opening tags: <div class="lesson" data-X-lesson="NN"> -> <a class="lesson" href="...">
foreach ($grade in $Grades) {
  for ($i = 1; $i -le 18; $i++) {
    $nn = '{0:D2}' -f $i
    $html = $html.Replace(
      "<div class=`"lesson`" data-$grade-lesson=`"$nn`">",
      "<a class=`"lesson`" href=`"lessons/$grade/en/$nn.html`" data-$grade-lesson=`"$nn`">")
    $html = $html.Replace(
      "<div class=`"lesson`" data-$grade-ko-lesson=`"$nn`">",
      "<a class=`"lesson`" href=`"lessons/$grade/ko/$nn.html`" data-$grade-ko-lesson=`"$nn`">")
  }
}

# Close: for each linked lesson row, change final </div> to </a>
$html = [regex]::Replace($html,
  '(?s)(<a class="lesson" href="lessons/[^"]+"[^>]*>.*?<div class="lesson-title">.*?</div>\s*</div>\s*)</div>',
  '${1}</a>')

# Remove lazy detail panels
$html = [regex]::Replace($html,
  '(?s)\s*<div class="lesson-detail-panel lesson-detail-panel--lazy"[^>]*>.*?</div>\s*</div>(?=\s*<div style="display:flex)',
  "`n")

# CSS: anchors look like lesson rows
if ($html -notmatch 'a\.lesson\s*\{') {
  $html = $html.Replace(
    '  .lesson {',
    "  a.lesson { text-decoration: none; color: inherit; }`n  .lesson, a.lesson {")
}

# Remove fetch router
$routerStart = $html.IndexOf('// Lesson list -> lazy-load detail')
if ($routerStart -lt 0) { $routerStart = $html.IndexOf('const LESSON_LEVELS_ROUTE') }
$routerEnd = $html.IndexOf('// Legacy tab handler (kept for backward compatibility)')
if ($routerStart -ge 0 -and $routerEnd -gt $routerStart) {
  $html = $html.Substring(0, $routerStart) + "// Lesson titles link to lessons/{grade}/{lang}/{nn}.html (full page).`r`n`r`n" + $html.Substring($routerEnd)
  Write-Host 'Removed fetch-based lesson router'
}

[IO.File]::WriteAllText($mainPath, $html, $Utf8)

# Public entry point
$indexPath = Join-Path $Root 'index.html'
[IO.File]::Copy($mainPath, $indexPath, $true)
Write-Host 'Wrote index.html'
Write-Host 'Done.'
