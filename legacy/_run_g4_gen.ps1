$ErrorActionPreference = 'Stop'
$pyPath = 'c:\Users\moomo\OneDrive\Desktop\New folder\_write_g4_en_block.py'
$outPath = 'c:\Users\moomo\OneDrive\Desktop\New folder\_g4_en_block.html'
$py = [System.IO.File]::ReadAllText($pyPath, [System.Text.UTF8Encoding]::new($false))

function Unescape-PySingle([string]$s) {
    return $s -replace "\\'", "'" -replace '\\n', "`n"
}
function Unescape-PyDouble([string]$s) {
    return $s -replace '\\"', '"' -replace '\\n', "`n"
}

function Get-PyStringList([string]$block, [string]$key) {
    if ($block -match "(?s)`"$key`":\s*\[(.*?)\]\s*,") {
        $inner = $Matches[1]
        $items = [System.Collections.Generic.List[string]]::new()
        $i = 0
        while ($i -lt $inner.Length) {
            while ($i -lt $inner.Length -and [char]::IsWhiteSpace($inner[$i])) { $i++ }
            if ($i -ge $inner.Length) { break }
            if ($inner[$i] -eq '"') {
                $i++
                $sb = [System.Text.StringBuilder]::new()
                while ($i -lt $inner.Length) {
                    $c = $inner[$i]
                    if ($c -eq '\') {
                        if ($i + 1 -lt $inner.Length) {
                            $n = $inner[$i+1]
                            if ($n -eq 'n') { [void]$sb.Append("`n"); $i += 2; continue }
                            if ($n -eq '"') { [void]$sb.Append('"'); $i += 2; continue }
                            if ($n -eq '\') { [void]$sb.Append('\'); $i += 2; continue }
                        }
                    }
                    if ($c -eq '"') { $i++; break }
                    [void]$sb.Append($c)
                    $i++
                }
                $items.Add($sb.ToString()) | Out-Null
            } elseif ($inner.Substring($i).StartsWith("('")) {
                $m = [regex]::Match($inner.Substring($i), "^\('((?:\\'|[^'])*)'\)")
                if ($m.Success) {
                    $items.Add((Unescape-PySingle $m.Groups[1].Value)) | Out-Null
                    $i += $m.Length
                } else { break }
            } else { break }
            while ($i -lt $inner.Length -and [char]::IsWhiteSpace($inner[$i])) { $i++ }
            if ($i -lt $inner.Length -and $inner[$i] -eq ',') { $i++ }
        }
        return $items.ToArray()
    }
    return @()
}

function Get-PyField([string]$block, [string]$key) {
    if ($block -match "(?s)`"$key`":\s*`"((?:\\.|[^`"\\])*)`"") {
        return (Unescape-PyDouble $Matches[1])
    }
    if ($block -match "(?s)`"$key`":\s*'((?:\\'|[^'])*)'") {
        return (Unescape-PySingle $Matches[1])
    }
    if ($block -match "(?s)'$key':\s*'((?:\\'|[^'])*)'") {
        return (Unescape-PySingle $Matches[1])
    }
    return ''
}

if (-not ($py -match '(?s)LESSONS = \[(.*)\]\r?\n\r?\n\ndef lesson_card')) {
    throw 'Could not parse LESSONS array'
}
$lessonsRaw = $Matches[1]
$blocks = [regex]::Split($lessonsRaw, '\r?\n    \},\r?\n    \{')
$lessons = @()
foreach ($b in $blocks) {
    $block = $b.Trim()
    if (-not $block.StartsWith('{')) { $block = '{' + $block }
    if (-not $block.EndsWith('}')) { $block = $block + '}' }
    $L = [ordered]@{
        title = Get-PyField $block 'title'
        objectives = Get-PyStringList $block 'objectives'
        vocab = Get-PyStringList $block 'vocab'
        warmup = Get-PyField $block 'warmup'
        main = Get-PyField $block 'main'
        wrapup = Get-PyField $block 'wrapup'
        tips = Get-PyStringList $block 'tips'
        nav_title = Get-PyField $block 'nav_title'
    }
    if (-not $L.warmup -or -not $L.main) { throw "Parse failed for lesson: $($L.title)" }
    $lessons += ,$L
}

function Get-LessonCard([int]$n, $L) {
    $num = '{0:D2}' -f $n
    $active = if ($n -eq 1) { ' active' } else { '' }
    $margin = if ($n -eq 1) { 'margin-top: 0' } else { 'margin-top: 24px' }
    $obj = ($L.objectives | ForEach-Object { "<li>$_</li>" }) -join ''
    $voc = ($L.vocab | ForEach-Object { "<li>$_</li>" }) -join ''
    $tips = ($L.tips | ForEach-Object { "<li>$_</li>" }) -join ''
    $mainLabel = if ($L.title -match ':') { ($L.title -split ':', 2)[0] } else { $L.title }
    @"
        <div class="lesson-detail$active" id="g4-lesson-$num" style="$margin; padding: 24px; background: white; border: 0.5px solid var(--line); border-radius: 12px;">
          <h3 style="margin-bottom: 16px; font-size: 18px; color: var(--ink);">G4 Lesson $num`: $($L.title)</h3>
          <div style="font-size: 14px; color: var(--ink-2); line-height: 1.8;">
            <p><strong>Age:</strong> 9-10 years</p><p><strong>Duration:</strong> 60 min</p>
            <h4 style="margin-top: 16px; font-size: 15px;">Objectives</h4>
            <ul style="padding-left: 20px;">$obj</ul>
            <h4 style="margin-top: 16px; font-size: 15px;">Vocab</h4>
            <ul style="padding-left: 20px;">$voc</ul>
            <h4 style="margin-top: 16px; font-size: 15px;">Warm-up (5min)</h4>
            <p>$($L.warmup)</p>
            <h4 style="margin-top: 16px; font-size: 15px;">Main Activity (45min): "$mainLabel"</h4>
            <p>$($L.main)</p>
            <h4 style="margin-top: 16px; font-size: 15px;">Wrap-up (5min)</h4>
            <p>$($L.wrapup)</p>
            <h4 style="margin-top: 16px; font-size: 15px; color: var(--accent);">Teacher Tips</h4>
            <ul style="padding-left: 20px; color: var(--ink-3);">$tips</ul>
          </div>
        </div>
"@
}

function Get-NavItem([int]$n, $L) {
    $num = '{0:D2}' -f $n
    $active = if ($n -eq 1) { ' active' } else { '' }
    $title = $L.nav_title
    if ($n -eq 1 -and -not $title.StartsWith('Unit')) { $title = "Unit 1: $title" }
    "          <div class=`"lesson$active`" data-g4-lesson=`"$num`"><div class=`"lesson-num`">$num</div><div class=`"lesson-body`"><div class=`"lesson-title`">$title</div></div></div>"
}

$parts = [System.Collections.Generic.List[string]]::new()
[void]$parts.Add('      <section style="padding: 24px 0;">')
[void]$parts.Add('        <div class="lesson-detail-panel" id="g4-lesson-panel">')
for ($i = 0; $i -lt $lessons.Count; $i++) {
    [void]$parts.Add((Get-LessonCard ($i+1) $lessons[$i]))
}
[void]$parts.Add('        </div>')
[void]$parts.Add('      </section>')
[void]$parts.Add('      <section id="g4-lessons-nav">')
[void]$parts.Add('        <h2>Lesson Plan Library</h2>')
[void]$parts.Add('        <div class="lessons">')
for ($i = 0; $i -lt $lessons.Count; $i++) {
    [void]$parts.Add((Get-NavItem ($i+1) $lessons[$i]))
}
[void]$parts.Add('        </div>')
[void]$parts.Add('      </section>')
[void]$parts.Add('      <div style="display:flex; justify-content:space-between; padding:24px 0;">')
[void]$parts.Add('        <button class="btn btn-secondary" onclick="document.querySelector(&quot;[data-level=''g3'']&quot;).click(); window.scrollTo(0, 0);">◀ G3: Prev</button>')
[void]$parts.Add('        <button class="btn btn-secondary" onclick="document.getElementById(''g4-lessons-nav'').scrollIntoView({behavior:''smooth'',block:''start''});">☰ List</button>')
[void]$parts.Add('        <button class="btn btn-primary" onclick="document.querySelector(&quot;[data-level=''g5'']&quot;).click(); window.scrollTo(0, 0);">G5: Next ▶</button>')
[void]$parts.Add('      </div>')

$text = ($parts -join "`n") + "`n"
$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($outPath, $text, $utf8)
Write-Output "Lessons: $($lessons.Count) Bytes: $((Get-Item $outPath).Length)"
