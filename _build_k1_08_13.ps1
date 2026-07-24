# Build _k1_full_08_13.html — UTF-8
$ErrorActionPreference = 'Stop'
$Base = Split-Path -Parent $MyInvocation.MyCommand.Path
$Src = Join-Path $Base 'david-esl-homepage.html'
$Out = Join-Path $Base '_k1_full_08_13.html'
$content = [System.IO.File]::ReadAllText($Src, [System.Text.UTF8Encoding]::new($false))

function Get-LessonBlock([int]$n) {
    $marker = "<!-- K1 Lesson {0:D2} -->" -f $n
    $start = $content.IndexOf($marker)
    if ($start -lt 0) { throw "Marker not found: $marker" }
    if ($n -lt 13) {
        $endMarker = "<!-- K1 Lesson {0:D2} -->" -f ($n + 1)
        $end = $content.IndexOf($endMarker, $start)
    } else {
        $end = $content.IndexOf('<!-- K1 Lesson 14 -->', $start)
    }
    return $content.Substring($start, $end - $start).TrimEnd() + "`n"
}

function Insert-AfterFirstScript([string]$block, [string]$extra) {
    $m = [regex]::Match($block, '(?s)(<div class="teacher-script">.*?</div>\s*)')
    if (-not $m.Success) { throw 'No teacher-script found' }
    $pos = $m.Index + $m.Length
    return $block.Substring(0, $pos) + $extra + "`n" + $block.Substring($pos)
}

function Insert-BeforeWarmupEnd([string]$block, [string]$extra) {
    $anchor = "          </section>`n`n          <section class=`"main-activity`">"
    $loose = "  </section>`n`n  <section class=`"main-activity`">"
    if ($block.Contains($anchor)) {
        return $block.Replace($anchor, $extra + "`n" + $anchor)
    }
    if ($block.Contains($loose)) {
        return $block.Replace($loose, $extra + "`n" + $loose)
    }
    throw 'warm-up end anchor not found'
}

function Insert-OpeningExtra([string]$block, [string]$extra) {
    $mainStart = $block.IndexOf('<section class="main-activity">')
    $mainPart = $block.Substring($mainStart)
    $matches = [regex]::Matches($mainPart, '(?s)<div class="teacher-script">.*?</div>\s*')
    if ($matches.Count -lt 2) { throw 'Need 2+ main-activity scripts' }
    $pos = $mainStart + $matches[1].Index + $matches[1].Length
    return $block.Substring(0, $pos) + $extra + "`n" + $block.Substring($pos)
}

function Insert-PhonicsPraise([string]$block, [string]$extra) {
    $m = [regex]::Match($block, '(?s)(<h3[^>]*>Step 4.*?Cheering Up.*?</h3>.*?)(<div class="teacher-script">.*?</div>\s*)(<div class="teacher-script">.*?</div>\s*)')
    if (-not $m.Success) { throw 'Cheering Up scripts not found' }
    $pos = $m.Index + $m.Length
    return $block.Substring(0, $pos) + $extra + "`n" + $block.Substring($pos)
}

function Split-WrapupGoodbye([string]$block, [string]$newBlocks) {
    $wrapStart = $block.IndexOf('<section class="wrap-up">')
    if ($wrapStart -lt 0) { throw 'wrap-up section not found' }
    $wrapPart = $block.Substring($wrapStart)
    $matches = [regex]::Matches($wrapPart, '(?s)<div class="teacher-script">.*?</div>\s*')
    if ($matches.Count -lt 2) { throw 'Need 2+ wrap-up scripts' }
    # Replace last teacher-script in wrap-up (compliment/goodbye combined)
    $last = $matches[$matches.Count - 1]
    $absStart = $wrapStart + $last.Index
    $absEnd = $absStart + $last.Length
    return $block.Substring(0, $absStart) + $newBlocks + "`n" + $block.Substring($absEnd)
}

function Normalize-Lesson13([string]$block) {
    $lines = $block -split "`n"
    $out = foreach ($line in $lines) {
        if ($line -match '^  \S' -and $line -notmatch '^        ') {
            '        ' + $line.Substring(2)
        } else { $line }
    }
    return ($out -join "`n")
}

$extras = @{
    8 = @{
        tweaks = @(
            @('Family Photo Circle Share', 'Family Puppet Circle Share'),
            @('family photo circle share with puppet', 'family puppet circle share')
        )
        door = @'
            <div class="teacher-script">
              <p>Teacher · Door greeting script</p>
              <blockquote>"Hello, <em>[name]</em>! I am so happy you came today."</blockquote>
              <blockquote>"You may wave or say Hello — both are perfect. Find your dot — same circle as always."</blockquote>
              <blockquote>"<em>[Name]</em> is here — let's count friends. One, two, three… we are a family circle today!"</blockquote>
            </div>
'@
        trans = @'
            <div class="teacher-script">
              <p>Teacher · Transition to Main Activity</p>
              <blockquote>"Warm-up finished! You know mom, dad, brother, sister, baby."</blockquote>
              <blockquote>"Look at me. Listen. Sit. Quiet hands — family puppet circle is next!"</blockquote>
              <blockquote>"<em>[Puppet name]</em> is ready. When friends share, we listen with kind eyes. Are you ready?"</blockquote>
            </div>
'@
        open = @'
            <div class="teacher-script">
              <p>Teacher · Puppet circle listening round</p>
              <blockquote>"Puppet circle rule — when <em>[friend's name]</em> talks, we look and listen. No calling out — quiet hands."</blockquote>
              <blockquote>"<em>[Puppet name]</em> listens too — see? Eyes on the speaker. Ears open."</blockquote>
              <blockquote>"After each share we echo together — This is my mom! — one time only. Kind voices — family love!"</blockquote>
            </div>
'@
        praise = @'
            <div class="teacher-script">
              <p>Teacher · Praise frames</p>
              <blockquote>"Wow! I heard mmm — mom sound!"</blockquote>
              <blockquote>"Super dad sound — duh-duh!"</blockquote>
              <blockquote>"Your hug is perfect — mmm — family love!"</blockquote>
              <blockquote>"High five for listening — you know mom and dad sounds!"</blockquote>
            </div>
'@
        oldGoodbye = @'
            <div class="teacher-script">
              <p>Teacher · Compliment &amp; goodbye</p>
              <blockquote>"Today you shared your family! You said This is my mom and dad. You made mmm and duh sounds. I am proud of you."</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for a brave share. I am proud of <em>[name]</em> for kind listening."</blockquote>
              <blockquote>"Goodbye Song — wave! Goodbye, goodbye, see you again! Line up — high five — bye bye!"</blockquote>
            </div>
'@
        newGoodbye = @'
            <div class="teacher-script">
              <p>Teacher · Compliment circle</p>
              <blockquote>"Today you shared your family in our puppet circle! You said This is my mom and dad. You made mmm and duh sounds."</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for a brave puppet share. I am proud of <em>[name]</em> for kind listening eyes."</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for a gentle family hug. Everyone gets a sticker — quiet feet."</blockquote>
            </div>
            <div class="teacher-script">
              <p>Teacher · Goodbye routine</p>
              <blockquote>"Stand up slowly. Stretch — big arms — family hug around yourself."</blockquote>
              <blockquote>"Goodbye Song time. Wave your hands."</blockquote>
              <blockquote>"Goodbye, goodbye, see you again. Goodbye, goodbye, see you again."</blockquote>
              <blockquote>"Goodbye <em>[name]</em>, goodbye <em>[name]</em>, goodbye everyone — see you again!"</blockquote>
              <blockquote>"Line up at the door. High five — bye bye! Tell your family — This is my mom!"</blockquote>
            </div>
'@
    }
    9 = @{
        door = @'
            <div class="teacher-script">
              <p>Teacher · Door greeting script</p>
              <blockquote>"Hello, <em>[name]</em>! Welcome back — walking feet today!"</blockquote>
              <blockquote>"Find your blue dot. Sit first — big jumps come on the obstacle course later."</blockquote>
              <blockquote>"<em>[Name]</em> is here — one more friend — our action team is ready!"</blockquote>
            </div>
'@
        trans = @'
            <div class="teacher-script">
              <p>Teacher · Transition to Main Activity</p>
              <blockquote>"Warm-up finished! You know jump, run, walk, sit, stand."</blockquote>
              <blockquote>"Look at me. Listen. Sit. Hands in lap — obstacle course is next!"</blockquote>
              <blockquote>"Remember — Stop card means freeze. Go card means move. Walking feet to the start line!"</blockquote>
            </div>
'@
        open = @'
            <div class="teacher-script">
              <p>Teacher · Cheer squad script</p>
              <blockquote>"Seated friends are the cheer squad! When Minho jumps, you say — Jump! When Sora runs, you say — Run!"</blockquote>
              <blockquote>"Cheer squad rules — sit on your dot, quiet voice, kind words only."</blockquote>
              <blockquote>"Can you jump? Can you run? — we ask the runner, cheer squad answers together!"</blockquote>
            </div>
'@
        praise = @'
            <div class="teacher-script">
              <p>Teacher · Praise frames</p>
              <blockquote>"Wow! I heard juh — jump sound!"</blockquote>
              <blockquote>"Super run sound — rrr-rrr!"</blockquote>
              <blockquote>"Your BOING jump is perfect — juh!"</blockquote>
              <blockquote>"High five for fast feet — rrr — run!"</blockquote>
            </div>
'@
        oldGoodbye = @'
            <div class="teacher-script">
              <p>Teacher · Compliment &amp; goodbye</p>
              <blockquote>"Today you jumped and ran! You finished the obstacle course. You made juh and rrr sounds. I am proud of you."</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for safe Stop freeze. I am proud of <em>[name]</em> for gentle jumping."</blockquote>
              <blockquote>"Goodbye Song — wave! Goodbye, goodbye, see you again! Line up — walking feet — high five!"</blockquote>
            </div>
'@
        newGoodbye = @'
            <div class="teacher-script">
              <p>Teacher · Compliment circle</p>
              <blockquote>"Today you jumped and ran on the obstacle course! You froze on Stop. You made juh and rrr sounds."</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for safe Stop freeze. I am proud of <em>[name]</em> for gentle jumping."</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for kind cheering. Everyone gets a sticker."</blockquote>
            </div>
            <div class="teacher-script">
              <p>Teacher · Goodbye routine</p>
              <blockquote>"Stand up slowly. Stretch — reach high — then still body."</blockquote>
              <blockquote>"Goodbye Song time. Wave your hands."</blockquote>
              <blockquote>"Goodbye, goodbye, see you again. Goodbye, goodbye, see you again."</blockquote>
              <blockquote>"Goodbye <em>[name]</em>, goodbye <em>[name]</em>, goodbye everyone — see you again!"</blockquote>
              <blockquote>"Line up — walking feet only — high five at the door. Bye bye!"</blockquote>
            </div>
'@
    }
    10 = @{
        door = @'
            <div class="teacher-script">
              <p>Teacher · Door greeting script</p>
              <blockquote>"Hello, <em>[name]</em>! Welcome — today we taste yummy food with our imagination!"</blockquote>
              <blockquote>"Find your spot. No real eating in class — pretend only. Both are fun!"</blockquote>
              <blockquote>"<em>[Name]</em> is here — our fruit friends are waiting!"</blockquote>
            </div>
'@
        trans = @'
            <div class="teacher-script">
              <p>Teacher · Transition to Main Activity</p>
              <blockquote>"Warm-up finished! You know apple, banana, orange, grape."</blockquote>
              <blockquote>"Look at me. Listen. Sit. Quiet hands — pretend taste game is next!"</blockquote>
              <blockquote>"Remember — Yummy! means we like it. Pretend bite — mmm — no real food today!"</blockquote>
            </div>
'@
        open = @'
            <div class="teacher-script">
              <p>Teacher · Taste reaction chorus</p>
              <blockquote>"When I pretend bite the apple — you copy — bite, chew, smile — Yummy!"</blockquote>
              <blockquote>"Banana — peel motion — pretend peel — bite — Yummy! All together!"</blockquote>
              <blockquote>"If you don't like it, gentle face — still say the fruit word — apple! banana!"</blockquote>
            </div>
'@
        praise = @'
            <div class="teacher-script">
              <p>Teacher · Praise frames</p>
              <blockquote>"Wow! I heard a-a-apple — ah sound!"</blockquote>
              <blockquote>"Super banana sound — buh-buh!"</blockquote>
              <blockquote>"Your apple bite face is perfect — ah!"</blockquote>
              <blockquote>"High five for yummy sounds — buh — banana!"</blockquote>
            </div>
'@
        oldGoodbye = @'
            <div class="teacher-script">
              <p>Teacher · Compliment &amp; goodbye</p>
              <blockquote>"Today you named fruit! You pretended to eat — chomp chomp! You said ah and buh. I am proud of you."</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for a brave yummy face. I am proud of <em>[name]</em> for kind listening."</blockquote>
              <blockquote>"Goodbye Song — wave! Goodbye, goodbye, see you again! Line up — high five — bye bye!"</blockquote>
            </div>
'@
        newGoodbye = @'
            <div class="teacher-script">
              <p>Teacher · Compliment circle</p>
              <blockquote>"Today you named fruit in our pretend taste game! You chomped apple and banana. You said ah and buh."</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for a brave yummy face. I am proud of <em>[name]</em> for kind listening."</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for gentle pretend bites. Everyone gets a sticker."</blockquote>
            </div>
            <div class="teacher-script">
              <p>Teacher · Goodbye routine</p>
              <blockquote>"Stand up slowly. Stretch — big arms — then quiet body."</blockquote>
              <blockquote>"Goodbye Song time. Wave your hands."</blockquote>
              <blockquote>"Goodbye, goodbye, see you again. Goodbye, goodbye, see you again."</blockquote>
              <blockquote>"Goodbye <em>[name]</em>, goodbye <em>[name]</em>, goodbye everyone — see you again!"</blockquote>
              <blockquote>"Line up at the door. High five — bye bye! Say apple and banana at home!"</blockquote>
            </div>
'@
    }
    11 = @{
        door = @'
            <div class="teacher-script">
              <p>Teacher · Door greeting script</p>
              <blockquote>"Hello, <em>[name]</em>! Welcome — look outside — what is the weather today?"</blockquote>
              <blockquote>"Find your dot. Today we mime sun and rain with our whole body!"</blockquote>
              <blockquote>"<em>[Name]</em> is here — our weather team is complete!"</blockquote>
            </div>
'@
        trans = @'
            <div class="teacher-script">
              <p>Teacher · Transition to Main Activity</p>
              <blockquote>"Warm-up finished! You know sunny, rainy, cloudy, snowy, hot, cold."</blockquote>
              <blockquote>"Look at me. Listen. Sit. Weather chart mime is next — follow my hands!"</blockquote>
              <blockquote>"Point to the chart — say the weather word — then mime with your body!"</blockquote>
            </div>
'@
        open = @'
            <div class="teacher-script">
              <p>Teacher · Season bridge script</p>
              <blockquote>"Spring — flowers grow — arms up slowly. Summer — hot — fan your face!"</blockquote>
              <blockquote>"Fall — leaves fall — hands drift down. Winter — cold — hug yourself — brrr!"</blockquote>
              <blockquote>"Weather and seasons go together — sunny summer — rainy spring — listen and mime!"</blockquote>
            </div>
'@
        praise = @'
            <div class="teacher-script">
              <p>Teacher · Praise frames</p>
              <blockquote>"Wow! I heard sss — sun sound!"</blockquote>
              <blockquote>"Super rain sound — rrr-rrr!"</blockquote>
              <blockquote>"Your sun arms are perfect — sss — bright!"</blockquote>
              <blockquote>"High five for rain fingers — rrr — pitter patter!"</blockquote>
            </div>
'@
        oldGoodbye = @'
            <div class="teacher-script">
              <p>Teacher · Compliment &amp; goodbye</p>
              <blockquote>"Today you read the weather! You dressed for sun and rain. You made sss and rrr sounds. I am proud of you."</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for chart helper. I am proud of <em>[name]</em> for gentle umbrella mime."</blockquote>
              <blockquote>"Goodbye Song — wave! Goodbye, goodbye, see you again! Line up — high five — bye bye!"</blockquote>
            </div>
'@
        newGoodbye = @'
            <div class="teacher-script">
              <p>Teacher · Compliment circle</p>
              <blockquote>"Today you read the weather chart! You mimed sun and rain. You made sss and rrr sounds."</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for chart helper. I am proud of <em>[name]</em> for gentle umbrella mime."</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for bright sun arms. Everyone gets a sticker."</blockquote>
            </div>
            <div class="teacher-script">
              <p>Teacher · Goodbye routine</p>
              <blockquote>"Stand up slowly. Stretch — reach high — then still body."</blockquote>
              <blockquote>"Goodbye Song time. Wave your hands."</blockquote>
              <blockquote>"Goodbye, goodbye, see you again. Goodbye, goodbye, see you again."</blockquote>
              <blockquote>"Goodbye <em>[name]</em>, goodbye <em>[name]</em>, goodbye everyone — see you again!"</blockquote>
              <blockquote>"Line up at the door. High five — bye bye! Mime sun and rain at home!"</blockquote>
            </div>
'@
    }
    12 = @{
        door = @'
            <div class="teacher-script">
              <p>Teacher · Door greeting script</p>
              <blockquote>"Hello, <em>[name]</em>! Welcome — how do you feel today? Show me with your face!"</blockquote>
              <blockquote>"Find your spot. All feelings are OK in our circle — happy, sad, and more."</blockquote>
              <blockquote>"<em>[Name]</em> is here — we match feelings together today!"</blockquote>
            </div>
'@
        trans = @'
            <div class="teacher-script">
              <p>Teacher · Transition to Main Activity</p>
              <blockquote>"Warm-up finished! You know happy, sad, angry, scared, surprised."</blockquote>
              <blockquote>"Look at me. Listen. Sit. Face match game is next — kind eyes only!"</blockquote>
              <blockquote>"No silly faces at friends — only match the card I show. Ready?"</blockquote>
            </div>
'@
        open = @'
            <div class="teacher-script">
              <p>Teacher · Mirror face round</p>
              <blockquote>"I show happy — you mirror — big smile! Hold — 1, 2, 3 — freeze!"</blockquote>
              <blockquote>"Sad face — mirror — gentle down mouth. Scared — mirror — wide eyes — oh!"</blockquote>
              <blockquote>"Mirror finished — now match the card on the floor — fast but kind!"</blockquote>
            </div>
'@
        praise = @'
            <div class="teacher-script">
              <p>Teacher · Praise frames</p>
              <blockquote>"Wow! I heard hhh — happy sound!"</blockquote>
              <blockquote>"Super sad sound — sss-sss!"</blockquote>
              <blockquote>"Your happy jump is perfect — hhh!"</blockquote>
              <blockquote>"High five for gentle sad face — sss — soft!"</blockquote>
            </div>
'@
        oldGoodbye = @'
            <div class="teacher-script">
              <p>Teacher · Compliment &amp; goodbye — unit close</p>
              <blockquote>"Today you matched feeling faces! You said happy and sad. You made hhhhh and sss sounds. I am proud of you."</blockquote>
              <blockquote>"Twelve lessons — you grew so much! Hello, colors, animals, family, feelings — wow!"</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for kind listening. I am proud of <em>[name]</em> for a brave happy face."</blockquote>
              <blockquote>"Goodbye Song — wave! Goodbye, goodbye, see you again! Line up — high five — K1 stars — bye bye!"</blockquote>
            </div>
'@
        newGoodbye = @'
            <div class="teacher-script">
              <p>Teacher · Compliment circle</p>
              <blockquote>"Today you matched feeling faces! You said happy and sad. You made hhhhh and sss sounds."</blockquote>
              <blockquote>"Twelve lessons — you grew so much! Hello, colors, animals, family, feelings — wow!"</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for kind listening. I am proud of <em>[name]</em> for a brave happy face."</blockquote>
              <blockquote>"Everyone gets a sticker — K1 stars!"</blockquote>
            </div>
            <div class="teacher-script">
              <p>Teacher · Goodbye routine</p>
              <blockquote>"Stand up slowly. Stretch — big smile — then quiet body."</blockquote>
              <blockquote>"Goodbye Song time. Wave your hands."</blockquote>
              <blockquote>"Goodbye, goodbye, see you again. Goodbye, goodbye, see you again."</blockquote>
              <blockquote>"Goodbye <em>[name]</em>, goodbye <em>[name]</em>, goodbye everyone — see you again!"</blockquote>
              <blockquote>"Line up at the door. High five — K1 stars — bye bye! Show happy and sad faces at home!"</blockquote>
            </div>
'@
    }
    13 = @{
        door = @'
            <div class="teacher-script">
              <p>Teacher · Door greeting script</p>
              <blockquote>"Hello, <em>[name]</em>! Welcome, shape detective — circles and squares hide everywhere!"</blockquote>
              <blockquote>"Find your dot. Walking feet today — we hunt shapes in our classroom."</blockquote>
              <blockquote>"<em>[Name]</em> is here — one more detective — our team is ready!"</blockquote>
            </div>
'@
        trans = @'
            <div class="teacher-script">
              <p>Teacher · Transition to Main Activity</p>
              <blockquote>"Warm-up finished! You know circle, square, triangle, star."</blockquote>
              <blockquote>"Look at me. Listen. Sit. Clipboard ready — Shape Hunt is next!"</blockquote>
              <blockquote>"Walking feet — follow me — point and name — no running ahead!"</blockquote>
            </div>
'@
        open = @'
            <div class="teacher-script">
              <p>Teacher · Hunt safety script</p>
              <blockquote>"Detective rules — eyes and point only. We do not touch the clock or window."</blockquote>
              <blockquote>"Stay behind me in a line — if you cannot see, rise on knees — still sitting when we stop."</blockquote>
              <blockquote>"Tick one box at a time — circle found? Tick! — square found? Tick! — slow and proud!"</blockquote>
            </div>
'@
        praise = @'
            <div class="teacher-script">
              <p>Teacher · Praise frames</p>
              <blockquote>"Wow! I heard cuh — circle sound!"</blockquote>
              <blockquote>"Super square sound — sss-sss!"</blockquote>
              <blockquote>"Your air circle is perfect — cuh — round!"</blockquote>
              <blockquote>"High five for four corners — sss — square!"</blockquote>
            </div>
'@
        oldGoodbye = @'
            <div class="teacher-script">
              <p>Teacher · Shape collage &amp; goodbye</p>
              <blockquote>"Glue one shape on your paper — say the name — circle! Square! Triangle! Star!"</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for finding a circle. I am proud of <em>[name]</em> for brave sss sounds."</blockquote>
              <blockquote>"Everyone gets a sticker. Goodbye Song — wave your hands."</blockquote>
              <blockquote>"Goodbye, goodbye, see you again. Goodbye <em>[name]</em> — see you again!"</blockquote>
            </div>
'@
        newGoodbye = @'
            <div class="teacher-script">
              <p>Teacher · Shape collage</p>
              <blockquote>"Glue one shape on your paper — say the name — circle! Square! Triangle! Star!"</blockquote>
              <blockquote>"Pat pat glue — one shape — name it loud — circle! square!"</blockquote>
              <blockquote>"Collage finished — papers on the shelf — hands in lap."</blockquote>
            </div>
            <div class="teacher-script">
              <p>Teacher · Compliment circle</p>
              <blockquote>"Today you hunted shapes! You found circle and square. You made cuh and sss sounds."</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for finding a circle. I am proud of <em>[name]</em> for brave sss sounds."</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for careful ticking. Everyone gets a sticker."</blockquote>
            </div>
            <div class="teacher-script">
              <p>Teacher · Goodbye routine</p>
              <blockquote>"Stand up slowly. Stretch — draw a big circle in the air — then quiet body."</blockquote>
              <blockquote>"Goodbye Song time. Wave your hands."</blockquote>
              <blockquote>"Goodbye, goodbye, see you again. Goodbye, goodbye, see you again."</blockquote>
              <blockquote>"Goodbye <em>[name]</em>, goodbye <em>[name]</em>, goodbye everyone — see you again!"</blockquote>
              <blockquote>"Line up at the door. High five — bye bye! Hunt shapes at home!"</blockquote>
            </div>
'@
    }
}

$parts = New-Object System.Collections.Generic.List[string]
$parts.Add('<!-- K1 Lessons 08-13 Full Plans — HTML Fragment (UTF-8) -->')

$report = @()
foreach ($n in 8..13) {
    $block = Get-LessonBlock $n
    $e = $extras[$n]
    if ($e.tweaks) {
        foreach ($pair in $e.tweaks) { $block = $block.Replace($pair[0], $pair[1]) }
    }
    $block = Insert-AfterFirstScript $block $e.door
    $block = Insert-BeforeWarmupEnd $block $e.trans
    $block = Insert-OpeningExtra $block $e.open
    $block = Insert-PhonicsPraise $block $e.praise
    $block = Split-WrapupGoodbye $block $e.newGoodbye
    if ($n -eq 13) { $block = Normalize-Lesson13 $block }
    $parts.Add($block.TrimEnd())
    $lines = ($block -split "`n").Count
    $scripts = ([regex]::Matches($block, 'class="teacher-script"')).Count
    $report += "Lesson $($n.ToString('00')): $lines lines, $scripts teacher-script divs"
}

$final = ($parts -join "`n`n") + "`n"
[System.IO.File]::WriteAllText($Out, $final, [System.Text.UTF8Encoding]::new($false))
Write-Output "Wrote $Out"
$report | ForEach-Object { Write-Output "  $_" }
