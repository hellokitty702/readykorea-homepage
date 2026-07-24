# ReadyKorea lesson URL separation — builds /dist from david-esl-homepage.html
# Does NOT modify the source file.

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Source = Join-Path $Root 'david-esl-homepage.html'
$Dist = Join-Path $Root 'dist'
$Domain = '__DOMAIN__'
$Email = '__EMAIL__'
$Grades = @('k1','k2','k3','g1','g2','g3','g4','g5','g6')
$GradeLabels = @{
    k1='K1'; k2='K2'; k3='K3'; g1='G1'; g2='G2'; g3='G3'; g4='G4'; g5='G5'; g6='G6'
}

function Escape-HtmlAttr([string]$s) {
    if ($null -eq $s) { return '' }
    return ($s -replace '&','&amp;' -replace '"','&quot;' -replace '<','&lt;' -replace '>','&gt;')
}

$script:writeWarnings = @()

function Write-Utf8([string]$Path, [string]$Content) {
    $dir = Split-Path $Path -Parent
    if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    if (Test-Path $Path) { attrib -R $Path 2>$null }
    $encoding = [System.Text.UTF8Encoding]::new($false)
    try {
        [System.IO.File]::WriteAllText($Path, $Content, $encoding)
        return
    } catch { }
    $tmp = "$Path.tmp"
    try {
        if (Test-Path $tmp) { Remove-Item $tmp -Force -ErrorAction SilentlyContinue }
        [System.IO.File]::WriteAllText($tmp, $Content, $encoding)
        if (Test-Path $Path) { Remove-Item $Path -Force -ErrorAction SilentlyContinue }
        Rename-Item -Path $tmp -NewName (Split-Path $Path -Leaf) -Force -ErrorAction Stop
    } catch {
        $script:writeWarnings += "Could not write: $Path ($($_.Exception.Message))"
    }
}

function Html-Decode([string]$s) {
    return [System.Net.WebUtility]::HtmlDecode($s)
}

function Strip-Html([string]$html) {
    $t = [regex]::Replace($html, '<[^>]+>', ' ')
    $t = Html-Decode $t
    return [regex]::Replace($t, '\s+', ' ').Trim()
}

function Truncate([string]$s, [int]$max = 150) {
    if ($s.Length -le $max) { return $s }
    return $s.Substring(0, $max - 3).TrimEnd() + '...'
}

function Strip-LessonPrefix([string]$title) {
    return [regex]::Replace($title, '^(K[1-3]|G[1-6])\s+Lesson\s+\d{2}:\s*', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
}

function Get-Slug([string]$title, [hashtable]$used) {
    $t = Html-Decode $title
    $t = Strip-LessonPrefix $t
    $t = [regex]::Replace($t, '^(Grammar|Reading|Writing|Speaking|Listening|Vocab|Phonics|Unit)\s*:\s*', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    $t = $t.ToLower()
    $t = $t -replace '/', '-'
    $t = $t -replace '[\(\)\\:;,.\&'']', ''
    $t = $t -replace '[^a-z0-9]+', '-'
    $t = $t.Trim('-')
    if (-not $t) { $t = 'lesson' }
    $base = $t
    $n = 2
    while ($used.ContainsKey($t)) {
        $t = "$base-$n"
        $n++
    }
    $used[$t] = $true
    return $t
}

function Find-OpenTagStart([string]$html, [int]$idIndex) {
    return $html.LastIndexOf('<', $idIndex)
}

function Extract-BalancedElement([string]$html, [int]$openStart, [string]$tagName) {
    $openRe = [regex]::new("<$tagName\b", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    $closeStr = "</$tagName>"
    $closeRe = [regex]::new([regex]::Escape($closeStr), [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    $len = $html.Length
    $i = $openStart
    $depth = 0
    $start = $openStart

    while ($i -lt $len) {
        $openM = $openRe.Match($html, $i)
        $closeM = $closeRe.Match($html, $i)
        if (-not $openM.Success -and -not $closeM.Success) { break }

        $useOpen = $openM.Success -and (-not $closeM.Success -or $openM.Index -le $closeM.Index)
        if ($useOpen) {
            if ($depth -eq 0) { $start = $openM.Index }
            $depth++
            $i = $openM.Index + $openM.Length
        } else {
            $depth--
            $i = $closeM.Index + $closeM.Length
            if ($depth -eq 0) {
                return $html.Substring($start, $i - $start)
            }
        }
    }
    return $null
}

function Extract-LessonHtml([string]$html, [string]$elementId) {
    $needle = "id=`"$elementId`""
    $idx = $html.IndexOf($needle)
    if ($idx -lt 0) { return $null }
    $openStart = Find-OpenTagStart $html $idx
    $snippet = $html.Substring($openStart, [Math]::Min(20, $html.Length - $openStart))
    if ($snippet -match '^<article\b') {
        return Extract-BalancedElement $html $openStart 'article'
    }
    return Extract-BalancedElement $html $openStart 'div'
}

function Get-InnerText([string]$html, [string]$pattern) {
    $m = [regex]::Match($html, $pattern, 'IgnoreCase, Singleline')
    if ($m.Success) { return Strip-Html $m.Groups[1].Value }
    return ''
}

function Get-ListItems([string]$html, [string]$afterHeading) {
    $pattern = "(?is)$afterHeading\s*<ul[^>]*>(.*?)</ul>"
    $m = [regex]::Match($html, $pattern)
    if (-not $m.Success) { return @() }
    $items = [regex]::Matches($m.Groups[1].Value, '(?is)<li[^>]*>(.*?)</li>')
    $result = @()
    foreach ($item in $items) { $result += (Strip-Html $item.Groups[1].Value) }
    return $result
}

function Get-SectionAfterH4([string]$html, [string]$heading) {
    $esc = [regex]::Escape($heading)
    $pattern = "(?is)<h4[^>]*>\s*$esc\s*</h4>\s*(.*?)(?=<h4\b|</div>\s*</div>\s*$)"
    $m = [regex]::Match($html, $pattern)
    if ($m.Success) { return Strip-Html $m.Groups[1].Value }
    # heading may include timing like "Warm-up (5min)"
    $pattern2 = "(?is)<h4[^>]*>\s*$esc[^<]*</h4>\s*<(p|ul)[^>]*>(.*?)</\1>"
    $m2 = [regex]::Match($html, $pattern2)
    if ($m2.Success) { return Strip-Html $m2.Groups[2].Value }
    return ''
}

function Parse-DivLesson([string]$block, [string]$grade, [int]$lessonNo) {
    $title = Get-InnerText $block '(?is)<h3[^>]*>(.*?)</h3>'
    $ageRange = ''
    $am = [regex]::Match($block, '(?is)<strong>\s*Age:\s*</strong>\s*([^<]+)')
    if ($am.Success) { $ageRange = $am.Groups[1].Value.Trim() }
    $duration = ''
    $dm = [regex]::Match($block, '(?is)<strong>\s*Duration:\s*</strong>\s*([^<]+)')
    if ($dm.Success) { $duration = $dm.Groups[1].Value.Trim() }

    $objectives = Get-ListItems $block '(?is)<h4[^>]*>\s*Objectives\s*</h4>'
    $vocab = Get-ListItems $block '(?is)<h4[^>]*>\s*Vocab\s*</h4>'
    $teacherTips = Get-ListItems $block '(?is)<h4[^>]*>\s*Teacher Tips\s*</h4>'

    $warmup = ''
    $wm = [regex]::Match($block, '(?is)<h4[^>]*>\s*Warm-up[^<]*</h4>\s*<p[^>]*>(.*?)</p>')
    if ($wm.Success) { $warmup = Strip-Html $wm.Groups[1].Value }

    $mainActivity = ''
    $mm = [regex]::Match($block, '(?is)<h4[^>]*>\s*Main Activity[^<]*</h4>\s*<p[^>]*>(.*?)</p>')
    if ($mm.Success) { $mainActivity = Strip-Html $mm.Groups[1].Value }

    $wrapup = ''
    $wpm = [regex]::Match($block, '(?is)<h4[^>]*>\s*Wrap-up[^<]*</h4>\s*<p[^>]*>(.*?)</p>')
    if ($wpm.Success) { $wrapup = Strip-Html $wpm.Groups[1].Value }

    $metaDesc = if ($objectives.Count -gt 0) { Truncate ($objectives -join ' ') } else { Truncate $title }

    return [ordered]@{
        schema = 'div'
        title = $title
        grade = $grade
        lessonNo = $lessonNo
        ageRange = $ageRange
        duration = $duration
        objectives = $objectives
        vocab = $vocab
        warmup = $warmup
        mainActivity = $mainActivity
        wrapup = $wrapup
        teacherTips = $teacherTips
        metaDescription = $metaDesc
        html = $block
    }
}

function Parse-ArticleLesson([string]$block, [string]$grade, [int]$lessonNo) {
    $title = Get-InnerText $block '(?is)<h1[^>]*>(.*?)</h1>'
    $focus = ''
    $fm = [regex]::Match($block, '(?is)<span\s+class="focus"[^>]*>(.*?)</span>')
    if ($fm.Success) { $focus = Strip-Html $fm.Groups[1].Value }

    $ageRange = ''
    $gm = [regex]::Match($block, '(?is)<span\s+class="grade"[^>]*>(.*?)</span>')
    if ($gm.Success) { $ageRange = ($gm.Groups[1].Value -replace '(?i)^Grade:\s*', '').Trim() }

    $duration = ''
    $dm = [regex]::Match($block, '(?is)<span\s+class="duration"[^>]*>(.*?)</span>')
    if ($dm.Success) { $duration = ($dm.Groups[1].Value -replace '(?i)^Time:\s*', '').Trim() }

    $materialChecklist = Get-ListItems $block '(?is)<section\s+class="material-checklist"[^>]*>\s*<h2[^>]*>.*?</h2>'

    $sections = @()
    $secMatches = [regex]::Matches($block, '(?is)<section\s+class="([^"]+)"[^>]*>(.*?)</section>')
    foreach ($sm in $secMatches) {
        $cls = $sm.Groups[1].Value
        if ($cls -eq 'material-checklist') { continue }
        $heading = Get-InnerText $sm.Groups[2].Value '(?is)<h2[^>]*>(.*?)</h2>'
        $body = Strip-Html ($sm.Groups[2].Value -replace '(?is)<h2[^>]*>.*?</h2>', '')
        $sections += [ordered]@{ class = $cls; heading = $heading; body = Truncate $body 500 }
    }

    $metaDesc = if ($focus) { Truncate $focus } else { Truncate $title }

    return [ordered]@{
        schema = 'article'
        title = $title
        grade = $grade
        lessonNo = $lessonNo
        ageRange = $ageRange
        duration = $duration
        focus = $focus
        materialChecklist = $materialChecklist
        sections = $sections
        metaDescription = $metaDesc
        html = $block
    }
}

function Duration-ToIso([string]$duration) {
    $m = [regex]::Match($duration, '(\d+)')
    if ($m.Success) { return "PT$($m.Groups[1].Value)M" }
    return 'PT45M'
}

function Educational-Level([string]$grade) {
    if ($grade -match '^k') { return "Kindergarten $($GradeLabels[$grade])" }
    $n = $grade.Substring(1)
    return "Elementary Grade $n"
}

function Escape-Json([string]$s) {
    if ($null -eq $s) { return 'null' }
    $s = $s -replace '\\','\\' -replace '"','\"' -replace "`r",'' -replace "`n",'\n' -replace "`t",'\t'
    return "`"$s`""
}

function Build-LessonHead($lesson, $slug) {
    $grade = $lesson.grade
    $label = $GradeLabels[$grade]
    $url = "$Domain/lessons/$grade/$slug/"
    $pageTitle = "$(Escape-HtmlAttr (Html-Decode $lesson.title)) &mdash; $label ESL Lesson Plan | ReadyKorea"
    $desc = Escape-HtmlAttr $lesson.metaDescription
    $teaches = if ($lesson.schema -eq 'div' -and $lesson.objectives.Count) {
        ($lesson.objectives | Select-Object -First 3) -join '; '
    } elseif ($lesson.focus) { $lesson.focus } else { $lesson.title }
    $teachesEsc = Escape-HtmlAttr $teaches
    $nameEsc = Escape-HtmlAttr (Html-Decode $lesson.title)

    $jsonLd = @"
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "name": $(Escape-Json (Html-Decode $lesson.title)),
  "description": $(Escape-Json $lesson.metaDescription),
  "educationalLevel": $(Escape-Json (Educational-Level $grade)),
  "teaches": $(Escape-Json $teaches),
  "timeRequired": "$(Duration-ToIso $lesson.duration)"
}
</script>
"@

    return @"
<title>$pageTitle</title>
<meta name="description" content="$desc" />
<link rel="canonical" href="$url" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="ReadyKorea" />
<meta property="og:title" content="$nameEsc" />
<meta property="og:description" content="$desc" />
<meta property="og:url" content="$url" />
$jsonLd
"@
}

function Build-LessonHeader() {
    return @"
<header class="site">
  <div class="wrap nav">
    <a class="brand" href="/">
      <span class="logo">R</span>
      <span class="brand-word en-only">Ready<span class="brand-gold">Korea</span></span>
    </a>
    <div class="nav-right">
      <nav class="main-nav audience-nav" aria-label="Main navigation">
        <a class="main-nav-link" href="/lessons/" style="padding:8px 12px;font-size:14px;color:var(--ink-2);text-decoration:none;">Lesson Plans</a>
        <a class="main-nav-link" href="/" style="padding:8px 12px;font-size:14px;color:var(--ink-2);text-decoration:none;">Home</a>
      </nav>
    </div>
  </div>
</header>
"@
}

function Build-Breadcrumb($lesson, $slug) {
    $grade = $lesson.grade
    $label = $GradeLabels[$grade]
    $shortTitle = Html-Decode (Strip-LessonPrefix $lesson.title)
    return @"
<nav class="breadcrumb wrap" aria-label="Breadcrumb" style="padding-top:24px;font-size:13px;color:var(--ink-3);">
  <a href="/" style="color:var(--accent);text-decoration:none;">Home</a>
  <span aria-hidden="true"> › </span>
  <a href="/lessons/" style="color:var(--accent);text-decoration:none;">Lessons</a>
  <span aria-hidden="true"> › </span>
  <a href="/lessons/$grade/" style="color:var(--accent);text-decoration:none;">$label</a>
  <span aria-hidden="true"> › </span>
  <span>$shortTitle</span>
</nav>
"@
}

function Build-LessonNav($prev, $next) {
    $prevHtml = if ($prev) {
        "<a href=`"/lessons/$($prev.grade)/$($prev.slug)/`" style=`"color:var(--accent);text-decoration:none;`">&larr; $(Escape-HtmlAttr (Strip-LessonPrefix $prev.title))</a>"
    } else { '<span></span>' }
    $nextHtml = if ($next) {
        "<a href=`"/lessons/$($next.grade)/$($next.slug)/`" style=`"color:var(--accent);text-decoration:none;text-align:right;`">$(Escape-HtmlAttr (Strip-LessonPrefix $next.title)) &rarr;</a>"
    } else { '<span></span>' }
    return @"
<div class="wrap lesson-nav" style="display:flex;justify-content:space-between;gap:16px;margin:32px auto 48px;padding-top:24px;border-top:0.5px solid var(--line);font-size:14px;flex-wrap:wrap;">
  $prevHtml
  $nextHtml
</div>
"@
}

function Build-LessonPage($lesson, $slug, $style, $footer, $prev, $next) {
    $head = Build-LessonHead $lesson $slug
  $body = @"
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="index, follow" />
$head
<style>
$style
.wrap { max-width: 960px; margin: 0 auto; padding: 0 20px; }
.lesson-page-content { padding: 0 0 24px; }
</style>
</head>
<body>
$(Build-LessonHeader)
$(Build-Breadcrumb $lesson $slug)
<main class="wrap lesson-page-content">
$($lesson.html)
</main>
$(Build-LessonNav $prev $next)
$footer
</body>
</html>
"@
    return $body
}

# ── Main ──────────────────────────────────────────────────────────────

Write-Host "Reading source..."
$raw = [System.IO.File]::ReadAllText($Source)
$html = $raw.Replace("`r", '')

# Extract shared assets
$styleM = [regex]::Match($html, '(?s)<style>(.*?)</style>')
$style = if ($styleM.Success) { $styleM.Groups[1].Value } else { '' }

$headerM = [regex]::Match($html, '(?s)<header class="site">(.*?)</header>')
$footerM = [regex]::Match($html, '(?s)<footer class="site">(.*?)</footer>')
$footer = if ($footerM.Success) { "<footer class=`"site`">$($footerM.Groups[1].Value)</footer>" } else { '' }
$footer = $footer -replace 'https://readykoreaesl\.com', $Domain
$footer = $footer -replace '[\w.+-]+@[\w.-]+\.\w+', $Email

if (Test-Path $Dist) {
    attrib -R "$Dist\*" /S /D 2>$null
    Get-ChildItem $Dist -Recurse -Force | Sort-Object { $_.FullName.Length } -Descending | ForEach-Object {
        Remove-Item $_.FullName -Force -Recurse -ErrorAction SilentlyContinue
    }
} else {
    New-Item -ItemType Directory -Path $Dist -Force | Out-Null
}
if (-not (Test-Path $Dist)) { New-Item -ItemType Directory -Path $Dist -Force | Out-Null }

# Find all EN lesson IDs
$idMatches = [regex]::Matches($html, 'id="((?:k[1-3]|g[1-6])-lesson-\d{2})"')
$lessonIds = @()
foreach ($m in $idMatches) {
    $id = $m.Groups[1].Value
    if ($id -notmatch '-ko-lesson-' -and $lessonIds -notcontains $id) {
        $lessonIds += $id
    }
}
Write-Host "Found $($lessonIds.Count) lesson IDs"

$slugUsedByGrade = @{}
foreach ($g in $Grades) { $slugUsedByGrade[$g] = @{} }
$lessons = @()
$parseErrors = @()

foreach ($id in ($lessonIds | Sort-Object)) {
    if ($id -notmatch '^(k[1-3]|g[1-6])-lesson-(\d{2})$') { continue }
    $grade = $Matches[1]
    $lessonNo = [int]$Matches[2]
    $block = Extract-LessonHtml $html $id
    if (-not $block) {
        $parseErrors += "Failed to extract HTML for $id"
        continue
    }
    if ($grade -eq 'k1') {
        $lesson = Parse-ArticleLesson $block $grade $lessonNo
    } else {
        $lesson = Parse-DivLesson $block $grade $lessonNo
    }
    if (-not $lesson.title) {
        $parseErrors += "Empty title for $id"
        continue
    }
    $slug = Get-Slug $lesson.title $slugUsedByGrade[$grade]
    $lesson | Add-Member -NotePropertyName 'id' -NotePropertyValue $id -Force
    $lesson | Add-Member -NotePropertyName 'slug' -NotePropertyValue $slug -Force
    $lessons += $lesson
}

$lessons = $lessons | Sort-Object { $_.grade }, { $_.lessonNo }

# Write lessons.json
$jsonPath = Join-Path $Dist 'lessons.json'
$lessons | ConvertTo-Json -Depth 8 | Set-Content -Path $jsonPath -Encoding UTF8

# Generate lesson pages
$fileCount = 0
$canonicalMissing = @()
$byGrade = @{}
foreach ($g in $Grades) { $byGrade[$g] = @() }

for ($i = 0; $i -lt $lessons.Count; $i++) {
    $lesson = $lessons[$i]
    $byGrade[$lesson.grade] += $lesson
    $prev = if ($i -gt 0 -and $lessons[$i-1].grade -eq $lesson.grade) { $lessons[$i-1] } else { $null }
    $next = if ($i -lt $lessons.Count - 1 -and $lessons[$i+1].grade -eq $lesson.grade) { $lessons[$i+1] } else { $null }

    $pagePath = Join-Path $Dist "lessons\$($lesson.grade)\$($lesson.slug)\index.html"
    $page = Build-LessonPage $lesson $lesson.slug $style $footer $prev $next
    if ($page -notmatch 'rel="canonical"') { $canonicalMissing += $pagePath }
    Write-Utf8 $pagePath $page
    $fileCount++
}

# Grade index pages
$gradeDescriptions = @{
    k1 = 'Ages 3-4 · Classroom routine, phonics, listening'
    k2 = 'Ages 4-5 · CVC blending, Pre-Starters'
    k3 = 'Ages 5-6 · Cambridge Pre-Starters ready'
    g1 = 'Ages 6-7 · Starters entry'
    g2 = 'Ages 7-8 · Starters consolidation'
    g3 = 'Ages 8-9 · Movers entry'
    g4 = 'Ages 9-10 · Movers consolidation'
    g5 = 'Ages 10-11 · Flyers entry'
    g6 = 'Ages 11-12 · KET-ready Flyers'
}

foreach ($grade in $Grades) {
    $label = $GradeLabels[$grade]
    $gradeLessons = $byGrade[$grade]
    $cards = ($gradeLessons | ForEach-Object {
        $short = Html-Decode (Strip-LessonPrefix $_.title)
        @"
      <a class="level-card" href="/lessons/$grade/$($_.slug)/" style="text-decoration:none;color:inherit;">
        <div class="level-card-top">
          <span class="level-card-name">Lesson $($_.lessonNo.ToString('00'))</span>
          <span class="level-card-age">$($_.duration)</span>
        </div>
        <div class="level-card-desc">$short</div>
      </a>
"@
    }) -join "`n"

    $gradePage = @"
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>$label Lesson Plans — ReadyKorea</title>
<meta name="description" content="18 free $label ESL lesson plans for Korean academies. $($gradeDescriptions[$grade])." />
<link rel="canonical" href="$Domain/lessons/$grade/" />
<meta property="og:title" content="$label Lesson Plans | ReadyKorea" />
<meta property="og:description" content="18 free $label ESL lesson plans." />
<meta property="og:url" content="$Domain/lessons/$grade/" />
<style>
$style
.wrap { max-width: 960px; margin: 0 auto; padding: 0 20px; }
.level-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-top: 24px; }
</style>
</head>
<body>
$(Build-LessonHeader)
<main class="wrap" style="padding:40px 0;">
  <nav style="font-size:13px;color:var(--ink-3);margin-bottom:16px;">
    <a href="/" style="color:var(--accent);text-decoration:none;">Home</a> › <a href="/lessons/" style="color:var(--accent);text-decoration:none;">Lessons</a> › $label
  </nav>
  <h1 style="font-size:clamp(28px,4vw,40px);margin-bottom:8px;">$label Lesson Plans</h1>
  <p class="lead" style="color:var(--ink-2);margin-bottom:8px;">$($gradeDescriptions[$grade])</p>
  <p style="color:var(--ink-3);font-size:14px;">18 lesson plans</p>
  <div class="level-grid">
$cards
  </div>
</main>
$footer
</body>
</html>
"@
    Write-Utf8 (Join-Path $Dist "lessons\$grade\index.html") $gradePage
    $fileCount++
}

# Lessons hub
$hubCards = ($Grades | ForEach-Object {
    $g = $_; $label = $GradeLabels[$g]
    @"
    <a class="level-card" href="/lessons/$g/" style="text-decoration:none;color:inherit;">
      <div class="level-card-top"><span class="level-card-name">$label</span></div>
      <div class="level-card-desc">$($gradeDescriptions[$g])</div>
      <div class="level-card-stat">18 lesson plans</div>
    </a>
"@
}) -join "`n"

$hubPage = @"
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>ESL Lesson Plans K1–G6 — ReadyKorea</title>
<meta name="description" content="162 free ESL lesson plans for Korean academies. K1 through G6 — 18 units per grade." />
<link rel="canonical" href="$Domain/lessons/" />
<meta property="og:title" content="162 ESL Lesson Plans | ReadyKorea" />
<meta property="og:description" content="K1–G6 curriculum library — 18 lesson plans per grade." />
<meta property="og:url" content="$Domain/lessons/" />
<style>
$style
.wrap { max-width: 960px; margin: 0 auto; padding: 0 20px; }
.level-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; margin-top: 24px; }
</style>
</head>
<body>
$(Build-LessonHeader)
<main class="wrap" style="padding:40px 0;">
  <h1 style="font-size:clamp(28px,4vw,40px);">162 ESL Lesson Plans</h1>
  <p class="lead" style="color:var(--ink-2);">K1–G6 · 18 lesson plans per grade · Free for teachers</p>
  <div class="level-grid">
$hubCards
  </div>
</main>
$footer
</body>
</html>
"@
Write-Utf8 (Join-Path $Dist 'lessons\index.html') $hubPage
$fileCount++

function Remove-LevelContent([string]$pageHtml, [string]$levelId) {
    $marker = "id=`"$levelId`""
    $idx = $pageHtml.IndexOf($marker)
    if ($idx -lt 0) { return $pageHtml }
    $openStart = $pageHtml.LastIndexOf('<div class="level-content"', $idx)
    if ($openStart -lt 0) { return $pageHtml }
    $element = Extract-BalancedElement $pageHtml $openStart 'div'
    if (-not $element) { return $pageHtml }
    return $pageHtml.Replace($element, '')
}

# Homepage
Write-Host "Building homepage..."
$homeHtml = $html
foreach ($levelId in @('level-k1','level-k2','level-k3','level-g1','level-g2','level-g3','level-g4','level-g5','level-g6')) {
    $homeHtml = Remove-LevelContent $homeHtml $levelId
}

# Grade cards → href links
foreach ($g in $Grades) {
    $homeHtml = $homeHtml -replace "<a class=`"level-card`" data-level=`"$g`">", "<a class=`"level-card`" href=`"/lessons/$g/`">"
}

# 108 → 162
$homeHtml = $homeHtml -replace '108 lesson plans', '162 lesson plans'
$homeHtml = $homeHtml -replace '108 plans', '162 plans'
$homeHtml = $homeHtml -replace '108 ready-to-use lesson plans', '162 ready-to-use lesson plans'
$homeHtml = $homeHtml -replace '108 Lesson Plans', '162 Lesson Plans'
$homeHtml = $homeHtml -replace "'lessons\.head': '9 levels\. 108 lesson plans", "'lessons.head': '9 levels. 162 lesson plans"
$homeHtml = $homeHtml -replace '(<div style="font-size: 28px[^"]*">)108(</div>\s*<div[^>]*>Curriculum Units)', '${1}162${2}'

# Domain & email placeholders
$homeHtml = $homeHtml -replace 'https://readykoreaesl\.com', $Domain
$homeHtml = $homeHtml -replace '[\w.+-]+@[\w.-]+\.\w+', $Email

Write-Utf8 (Join-Path $Dist 'index.html') $homeHtml
$fileCount++

# Copy grade-curriculum.js if present
$gcSrc = Join-Path $Root 'grade-curriculum.js'
if (Test-Path $gcSrc) {
    Copy-Item $gcSrc (Join-Path $Dist 'grade-curriculum.js')
    $fileCount++
}

# Sitemap
$today = (Get-Date).ToString('yyyy-MM-dd')
$sitemapUrls = @()
$sitemapUrls += [ordered]@{ loc = "$Domain/"; pri = '1.0'; freq = 'weekly' }
$sitemapUrls += [ordered]@{ loc = "$Domain/lessons/"; pri = '0.9'; freq = 'weekly' }
foreach ($g in $Grades) {
    $sitemapUrls += [ordered]@{ loc = "$Domain/lessons/$g/"; pri = '0.85'; freq = 'weekly' }
}
foreach ($lesson in $lessons) {
    $sitemapUrls += [ordered]@{ loc = "$Domain/lessons/$($lesson.grade)/$($lesson.slug)/"; pri = '0.8'; freq = 'monthly' }
}

$sitemapEntries = ($sitemapUrls | ForEach-Object {
    @"
  <url>
    <loc>$($_.loc)</loc>
    <lastmod>$today</lastmod>
    <changefreq>$($_.freq)</changefreq>
    <priority>$($_.pri)</priority>
  </url>
"@
}) -join "`n"

$sitemap = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
$sitemapEntries
</urlset>
"@
Write-Utf8 (Join-Path $Dist 'sitemap.xml') $sitemap
$fileCount++

# robots.txt
Write-Utf8 (Join-Path $Dist 'robots.txt') @"
User-agent: *
Allow: /

Sitemap: $Domain/sitemap.xml
"@

# README-FIRST.txt
Write-Utf8 (Join-Path $Dist 'README-FIRST.txt') @"
READYKOREA /dist — DEPLOY CHECKLIST
===================================

BEFORE deploying or submitting to Google Search Console:

1. Replace __DOMAIN__ with your production URL (e.g. https://readykorea.net)
2. Replace __EMAIL__ with your contact email

Quick replace (bash/Git Bash on Windows):
  grep -rl '__DOMAIN__' dist/ | xargs sed -i 's|__DOMAIN__|https://readykorea.net|g'
  grep -rl '__EMAIL__'  dist/ | xargs sed -i 's|__EMAIL__|hello@readykorea.net|g'

Run ./check-placeholders.sh to verify zero placeholders remain.

DO NOT submit sitemap.xml while __DOMAIN__ is still a placeholder.
DO NOT submit sitemap on a temporary .vercel.app URL — wait for final domain.
"@

# check-placeholders.sh
Write-Utf8 (Join-Path $Dist 'check-placeholders.sh') @"
#!/usr/bin/env bash
set -euo pipefail
ROOT="`$(cd "`$(dirname "`$0")" && pwd)"
DOMAIN_COUNT=`$(grep -r '__DOMAIN__' "`$ROOT" 2>/dev/null | wc -l | tr -d ' ')
EMAIL_COUNT=`$(grep -r '__EMAIL__' "`$ROOT" 2>/dev/null | wc -l | tr -d ' ')
echo "Placeholder check:"
echo "  __DOMAIN__ occurrences: `$DOMAIN_COUNT"
echo "  __EMAIL__  occurrences: `$EMAIL_COUNT"
if [ "`$DOMAIN_COUNT" -eq 0 ] && [ "`$EMAIL_COUNT" -eq 0 ]; then
  echo "OK — ready to deploy."
  exit 0
else
  echo "WARNING — replace placeholders before production deploy."
  exit 1
fi
"@

# ── Verification report ───────────────────────────────────────────────
$totalFiles = (Get-ChildItem $Dist -Recurse -File).Count
$gradeCounts = ($lessons | ForEach-Object { $_.grade } | Group-Object | Sort-Object Name | ForEach-Object { "$($_.Name): $($_.Count)" })
$slugDupes = $lessons | Group-Object { "$($_.grade)/$($_.slug)" } | Where-Object { $_.Count -gt 1 }
$k1Lessons = $lessons | Where-Object { $_.grade -eq 'k1' }
$k1WithTitle = ($k1Lessons | Where-Object { $_.title -and $_.html }).Count
$k1WithFocus = ($k1Lessons | Where-Object { $_.focus }).Count

$domainCount = 0
$emailCount = 0
Get-ChildItem $Dist -Recurse -File | ForEach-Object {
    $c = [System.IO.File]::ReadAllText($_.FullName)
    $domainCount += ([regex]::Matches($c, '__DOMAIN__')).Count
    $emailCount += ([regex]::Matches($c, '__EMAIL__')).Count
}

Write-Host ""
Write-Host "========== BUILD COMPLETE =========="
Write-Host "Generated files (total in dist): $totalFiles"
Write-Host "Lesson pages: $($lessons.Count)"
Write-Host "Grade counts: $($gradeCounts -join ', ')"
Write-Host "K1 parsed with title: $k1WithTitle / 18"
Write-Host "K1 with focus field: $k1WithFocus / 18"
Write-Host "Slug duplicates: $($slugDupes.Count)"
Write-Host "Canonical missing: $($canonicalMissing.Count)"
Write-Host "Sitemap URLs: $($sitemapUrls.Count) (expected 173)"
Write-Host "__DOMAIN__ remaining: $domainCount"
Write-Host "__EMAIL__ remaining: $emailCount"
if ($parseErrors.Count) {
    Write-Host "Parse errors:"
    $parseErrors | ForEach-Object { Write-Host "  $_" }
}
if ($script:writeWarnings.Count) {
    Write-Host "Write warnings:"
    $script:writeWarnings | ForEach-Object { Write-Host "  $_" }
}
Write-Host "===================================="

if ($lessons.Count -ne 162) { Write-Host "WARNING: expected 162 lessons, got $($lessons.Count)" }
if ($sitemapUrls.Count -ne 173) { Write-Host "WARNING: expected 173 sitemap URLs, got $($sitemapUrls.Count)" }
