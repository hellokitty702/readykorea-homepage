# -*- coding: utf-8 -*-
"""Build _k1_full_08_13.html from david-esl-homepage.html with 18+ teacher-script per lesson."""
from pathlib import Path
import re

BASE = Path(__file__).parent
SRC = BASE / "david-esl-homepage.html"
OUT = BASE / "_k1_full_08_13.html"

LESSON_EXTRAS = {
    8: {
        "title_tweak": (
            "Family Photo Circle Share",
            "Family Puppet Circle Share",
        ),
        "main_note_tweak": (
            "family photo circle share with puppet",
            "family puppet circle share",
        ),
        "door_greeting": """            <div class="teacher-script">
              <p>Teacher · Door greeting script</p>
              <blockquote>"Hello, <em>[name]</em>! I am so happy you came today."</blockquote>
              <blockquote>"You may wave or say Hello — both are perfect. Find your dot — same circle as always."</blockquote>
              <blockquote>"<em>[Name]</em> is here — let's count friends. One, two, three… we are a family circle today!"</blockquote>
            </div>""",
        "warm_transition": """            <div class="teacher-script">
              <p>Teacher · Transition to Main Activity</p>
              <blockquote>"Warm-up finished! You know mom, dad, brother, sister, baby."</blockquote>
              <blockquote>"Look at me. Listen. Sit. Quiet hands — family puppet circle is next!"</blockquote>
              <blockquote>"<em>[Puppet name]</em> is ready. When friends share, we listen with kind eyes. Are you ready?"</blockquote>
            </div>""",
        "opening_extra": """            <div class="teacher-script">
              <p>Teacher · Puppet circle listening round</p>
              <blockquote>"Puppet circle rule — when <em>[friend's name]</em> talks, we look and listen. No calling out — quiet hands."</blockquote>
              <blockquote>"<em>[Puppet name]</em> listens too — see? Eyes on the speaker. Ears open."</blockquote>
              <blockquote>"After each share we echo together — This is my mom! — one time only. Kind voices — family love!"</blockquote>
            </div>""",
        "phonics_praise": """            <div class="teacher-script">
              <p>Teacher · Praise frames</p>
              <blockquote>"Wow! I heard mmm — mom sound!"</blockquote>
              <blockquote>"Super dad sound — duh-duh!"</blockquote>
              <blockquote>"Your hug is perfect — mmm — family love!"</blockquote>
              <blockquote>"High five for listening — you know mom and dad sounds!"</blockquote>
            </div>""",
        "goodbye_split_search": "Goodbye Song — wave! Goodbye, goodbye, see you again! Line up — high five — bye bye!",
        "goodbye_compliment": """            <div class="teacher-script">
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
            </div>""",
        "old_compliment_block": """            <div class="teacher-script">
              <p>Teacher · Compliment &amp; goodbye</p>
              <blockquote>"Today you shared your family! You said This is my mom and dad. You made mmm and duh sounds. I am proud of you."</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for a brave share. I am proud of <em>[name]</em> for kind listening."</blockquote>
              <blockquote>"Goodbye Song — wave! Goodbye, goodbye, see you again! Line up — high five — bye bye!"</blockquote>
            </div>""",
    },
    9: {
        "door_greeting": """            <div class="teacher-script">
              <p>Teacher · Door greeting script</p>
              <blockquote>"Hello, <em>[name]</em>! Welcome back — walking feet today!"</blockquote>
              <blockquote>"Find your blue dot. Sit first — big jumps come on the obstacle course later."</blockquote>
              <blockquote>"<em>[Name]</em> is here — one more friend — our action team is ready!"</blockquote>
            </div>""",
        "warm_transition": """            <div class="teacher-script">
              <p>Teacher · Transition to Main Activity</p>
              <blockquote>"Warm-up finished! You know jump, run, walk, sit, stand."</blockquote>
              <blockquote>"Look at me. Listen. Sit. Hands in lap — obstacle course is next!"</blockquote>
              <blockquote>"Remember — Stop card means freeze. Go card means move. Walking feet to the start line!"</blockquote>
            </div>""",
        "opening_extra": """            <div class="teacher-script">
              <p>Teacher · Cheer squad script</p>
              <blockquote>"Seated friends are the cheer squad! When Minho jumps, you say — Jump! When Sora runs, you say — Run!"</blockquote>
              <blockquote>"Cheer squad rules — sit on your dot, quiet voice, kind words only."</blockquote>
              <blockquote>"Can you jump? Can you run? — we ask the runner, cheer squad answers together!"</blockquote>
            </div>""",
        "phonics_praise": """            <div class="teacher-script">
              <p>Teacher · Praise frames</p>
              <blockquote>"Wow! I heard juh — jump sound!"</blockquote>
              <blockquote>"Super run sound — rrr-rrr!"</blockquote>
              <blockquote>"Your BOING jump is perfect — juh!"</blockquote>
              <blockquote>"High five for fast feet — rrr — run!"</blockquote>
            </div>""",
        "old_compliment_block": """            <div class="teacher-script">
              <p>Teacher · Compliment &amp; goodbye</p>
              <blockquote>"Today you jumped and ran! You finished the obstacle course. You made juh and rrr sounds. I am proud of you."</blockquote>
              <blockquote>"I am proud of <em>[name]</em> for safe Stop freeze. I am proud of <em>[name]</em> for gentle jumping."</blockquote>
              <blockquote>"Goodbye Song — wave! Goodbye, goodbye, see you again! Line up — walking feet — high five!"</blockquote>
            </div>""",
        "goodbye_compliment": """            <div class="teacher-script">
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
            </div>""",
    },
    10: {
        "door_greeting": """            <div class="teacher-script">
              <p>Teacher · Door greeting script</p>
              <blockquote>"Hello, <em>[name]</em>! Welcome — today we taste yummy food with our imagination!"</blockquote>
              <blockquote>"Find your spot. No real eating in class — pretend only. Both are fun!"</blockquote>
              <blockquote>"<em>[Name]</em> is here — our fruit friends are waiting!"</blockquote>
            </div>""",
        "warm_transition": """            <div class="teacher-script">
              <p>Teacher · Transition to Main Activity</p>
              <blockquote>"Warm-up finished! You know apple, banana, orange, grape."</blockquote>
              <blockquote>"Look at me. Listen. Sit. Quiet hands — pretend taste game is next!"</blockquote>
              <blockquote>"Remember — Yummy! means we like it. Pretend bite — mmm — no real food today!"</blockquote>
            </div>""",
        "opening_extra": """            <div class="teacher-script">
              <p>Teacher · Taste reaction chorus</p>
              <blockquote>"When I pretend bite the apple — you copy — bite, chew, smile — Yummy!"</blockquote>
              <blockquote>"Banana — peel motion — pretend peel — bite — Yummy! All together!"</blockquote>
              <blockquote>"If you don't like it, gentle face — still say the fruit word — apple! banana!"</blockquote>
            </div>""",
        "phonics_praise": """            <div class="teacher-script">
              <p>Teacher · Praise frames</p>
              <blockquote>"Wow! I heard a-a-apple — ah sound!"</blockquote>
              <blockquote>"Super banana sound — buh-buh!"</blockquote>
              <blockquote>"Your apple bite face is perfect — ah!"</blockquote>
              <blockquote>"High five for yummy sounds — buh — banana!"</blockquote>
            </div>""",
        "old_compliment_block": None,  # filled dynamically from lesson text
    },
    11: {
        "door_greeting": """            <div class="teacher-script">
              <p>Teacher · Door greeting script</p>
              <blockquote>"Hello, <em>[name]</em>! Welcome — look outside — what is the weather today?"</blockquote>
              <blockquote>"Find your dot. Today we mime sun and rain with our whole body!"</blockquote>
              <blockquote>"<em>[Name]</em> is here — our weather team is complete!"</blockquote>
            </div>""",
        "warm_transition": """            <div class="teacher-script">
              <p>Teacher · Transition to Main Activity</p>
              <blockquote>"Warm-up finished! You know sunny, rainy, cloudy, snowy, hot, cold."</blockquote>
              <blockquote>"Look at me. Listen. Sit. Weather chart mime is next — follow my hands!"</blockquote>
              <blockquote>"Point to the chart — say the weather word — then mime with your body!"</blockquote>
            </div>""",
        "opening_extra": """            <div class="teacher-script">
              <p>Teacher · Season bridge script</p>
              <blockquote>"Spring — flowers grow — arms up slowly. Summer — hot — fan your face!"</blockquote>
              <blockquote>"Fall — leaves fall — hands drift down. Winter — cold — hug yourself — brrr!"</blockquote>
              <blockquote>"Weather and seasons go together — sunny summer — rainy spring — listen and mime!"</blockquote>
            </div>""",
        "phonics_praise": """            <div class="teacher-script">
              <p>Teacher · Praise frames</p>
              <blockquote>"Wow! I heard sss — sun sound!"</blockquote>
              <blockquote>"Super rain sound — rrr-rrr!"</blockquote>
              <blockquote>"Your sun arms are perfect — sss — bright!"</blockquote>
              <blockquote>"High five for rain fingers — rrr — pitter patter!"</blockquote>
            </div>""",
        "old_compliment_block": None,
    },
    12: {
        "door_greeting": """            <div class="teacher-script">
              <p>Teacher · Door greeting script</p>
              <blockquote>"Hello, <em>[name]</em>! Welcome — how do you feel today? Show me with your face!"</blockquote>
              <blockquote>"Find your spot. All feelings are OK in our circle — happy, sad, and more."</blockquote>
              <blockquote>"<em>[Name]</em> is here — we match feelings together today!"</blockquote>
            </div>""",
        "warm_transition": """            <div class="teacher-script">
              <p>Teacher · Transition to Main Activity</p>
              <blockquote>"Warm-up finished! You know happy, sad, angry, scared, surprised."</blockquote>
              <blockquote>"Look at me. Listen. Sit. Face match game is next — kind eyes only!"</blockquote>
              <blockquote>"No silly faces at friends — only match the card I show. Ready?"</blockquote>
            </div>""",
        "opening_extra": """            <div class="teacher-script">
              <p>Teacher · Mirror face round</p>
              <blockquote>"I show happy — you mirror — big smile! Hold — 1, 2, 3 — freeze!"</blockquote>
              <blockquote>"Sad face — mirror — gentle down mouth. Scared — mirror — wide eyes — oh!"</blockquote>
              <blockquote>"Mirror finished — now match the card on the floor — fast but kind!"</blockquote>
            </div>""",
        "phonics_praise": """            <div class="teacher-script">
              <p>Teacher · Praise frames</p>
              <blockquote>"Wow! I heard hhh — happy sound!"</blockquote>
              <blockquote>"Super sad sound — sss-sss!"</blockquote>
              <blockquote>"Your happy jump is perfect — hhh!"</blockquote>
              <blockquote>"High five for gentle sad face — sss — soft!"</blockquote>
            </div>""",
        "old_compliment_block": None,
    },
    13: {
        "door_greeting": """    <div class="teacher-script">
      <p>Teacher · Door greeting script</p>
      <blockquote>"Hello, <em>[name]</em>! Welcome, shape detective — circles and squares hide everywhere!"</blockquote>
      <blockquote>"Find your dot. Walking feet today — we hunt shapes in our classroom."</blockquote>
      <blockquote>"<em>[Name]</em> is here — one more detective — our team is ready!"</blockquote>
    </div>""",
        "warm_transition": """    <div class="teacher-script">
      <p>Teacher · Transition to Main Activity</p>
      <blockquote>"Warm-up finished! You know circle, square, triangle, star."</blockquote>
      <blockquote>"Look at me. Listen. Sit. Clipboard ready — Shape Hunt is next!"</blockquote>
      <blockquote>"Walking feet — follow me — point and name — no running ahead!"</blockquote>
    </div>""",
        "opening_extra": """    <div class="teacher-script">
      <p>Teacher · Hunt safety script</p>
      <blockquote>"Detective rules — eyes and point only. We do not touch the clock or window."</blockquote>
      <blockquote>"Stay behind me in a line — if you cannot see, rise on knees — still sitting when we stop."</blockquote>
      <blockquote>"Tick one box at a time — circle found? Tick! — square found? Tick! — slow and proud!"</blockquote>
    </div>""",
        "phonics_praise": """    <div class="teacher-script">
      <p>Teacher · Praise frames</p>
      <blockquote>"Wow! I heard cuh — circle sound!"</blockquote>
      <blockquote>"Super square sound — sss-sss!"</blockquote>
      <blockquote>"Your air circle is perfect — cuh — round!"</blockquote>
      <blockquote>"High five for four corners — sss — square!"</blockquote>
    </div>""",
        "old_compliment_block": None,
        "indent_style": "loose",
    },
}


def extract_lesson(content: str, n: int) -> str:
    marker = f"<!-- K1 Lesson {n:02d} -->"
    start = content.index(marker)
    if n < 13:
        end = content.index(f"<!-- K1 Lesson {n + 1:02d} -->", start)
    else:
        end = content.index("<!-- K1 Lesson 14 -->", start)
    return content[start:end].rstrip() + "\n"


def insert_after_first_teacher_script(block: str, extra: str) -> str:
    pat = r'(<div class="teacher-script">.*?</div>\s*)'
    m = re.search(pat, block, re.DOTALL)
    if not m:
        raise ValueError("No teacher-script found")
    pos = m.end()
    return block[:pos] + extra + "\n" + block[pos:]


def insert_before_warmup_end(block: str, extra: str) -> str:
    anchor = '          </section>\n\n          <section class="main-activity">'
    loose = '  </section>\n\n  <section class="main-activity">'
    if anchor in block:
        return block.replace(anchor, extra + "\n" + anchor, 1)
    if loose in block:
        return block.replace(loose, extra + "\n" + loose, 1)
    raise ValueError("warm-up end anchor not found")


def insert_opening_extra(block: str, extra: str) -> str:
    """Insert after 2nd teacher-script in main-activity section."""
    main_start = block.index('<section class="main-activity">')
    main_part = block[main_start:]
    scripts = list(re.finditer(r'<div class="teacher-script">.*?</div>\s*', main_part, re.DOTALL))
    if len(scripts) < 2:
        raise ValueError("Need 2+ scripts in main-activity")
    pos = main_start + scripts[1].end()
    return block[:pos] + extra + "\n" + block[pos:]


def insert_phonics_praise(block: str, extra: str) -> str:
    """Insert after Step 4 · Cheering Up 2nd teacher-script."""
    anchor = "Step 4 · Cheering Up"
    idx = block.index(anchor)
    sub = block[idx:]
    scripts = list(re.finditer(r'<div class="teacher-script">.*?</div>\s*', sub, re.DOTALL))
    if len(scripts) < 2:
        raise ValueError("Need 2+ cheering up scripts")
    pos = idx + scripts[1].end()
    return block[:pos] + extra + "\n" + block[pos:]


def split_wrapup_goodbye(block: str, old_block: str, new_blocks: str) -> str:
    if old_block and old_block in block:
        return block.replace(old_block, new_blocks, 1)
    # generic pattern
    pat = r'<div class="teacher-script">\s*<p>Teacher · Compliment &amp; goodbye</p>.*?</div>\s*'
    m = re.search(pat, block, re.DOTALL)
    if not m:
        raise ValueError("Compliment & goodbye block not found")
    return block[: m.start()] + new_blocks + "\n" + block[m.end() :]


def make_goodbye_split(lesson_n: int) -> tuple[str, str]:
    themes = {
        10: (
            '"Today you tasted yummy fruits! You said apple and banana. You made ah and buh sounds. I am proud of you."',
            '"I am proud of [name] for a brave pretend bite. I am proud of [name] for Yummy face."',
            "apple and banana",
            "ah and buh",
        ),
        11: (
            '"Today you mimed sun and rain! You read the weather chart. You made sss and rrr sounds. I am proud of you."',
            '"I am proud of [name] for sunny arms. I am proud of [name] for gentle rain fingers."',
            "sun and rain",
            "sss and rrr",
        ),
        12: (
            '"Today you matched feeling faces! You showed happy and sad. You made hhh and sss sounds. I am proud of you."',
            '"I am proud of [name] for a kind happy face. I am proud of [name] for brave sad mirror."',
            "happy and sad",
            "hhh and sss",
        ),
        13: (
            '"Today you hunted shapes! You found circle and square. You made cuh and sss sounds. I am proud of you."',
            '"I am proud of [name] for finding a circle. I am proud of [name] for brave sss square."',
            "circle and square",
            "cuh and sss",
        ),
    }
    t = themes[lesson_n]
    indent = "    " if lesson_n == 13 else "            "
    old = f"""{indent}<div class="teacher-script">
{indent}  <p>Teacher · Compliment &amp; goodbye</p>
{indent}  <blockquote>{t[0]}</blockquote>
{indent}  <blockquote>"I am proud of <em>[name]</em> for a brave share. I am proud of <em>[name]</em> for kind listening."</blockquote>
{indent}  <blockquote>"Goodbye Song — wave! Goodbye, goodbye, see you again! Line up — high five — bye bye!"</blockquote>
{indent}</div>"""
    # lesson-specific second compliment line varies - use regex fallback in split
    return old, f"""{indent}<div class="teacher-script">
{indent}  <p>Teacher · Compliment circle</p>
{indent}  <blockquote>{t[0]}</blockquote>
{indent}  <blockquote>"I am proud of <em>[name]</em> for wonderful work today. I am proud of <em>[name]</em> for kind listening."</blockquote>
{indent}  <blockquote>"I am proud of <em>[name]</em> for brave sounds. Everyone gets a sticker."</blockquote>
{indent}</div>
{indent}<div class="teacher-script">
{indent}  <p>Teacher · Goodbye routine</p>
{indent}  <blockquote>"Stand up slowly. Stretch — big arms up — then quiet body."</blockquote>
{indent}  <blockquote>"Goodbye Song time. Wave your hands."</blockquote>
{indent}  <blockquote>"Goodbye, goodbye, see you again. Goodbye, goodbye, see you again."</blockquote>
{indent}  <blockquote>"Goodbye <em>[name]</em>, goodbye <em>[name]</em>, goodbye everyone — see you again!"</blockquote>
{indent}  <blockquote>"Line up at the door. High five — bye bye! Practice {t[2]} at home!"</blockquote>
{indent}</div>"""


def enhance_lesson(block: str, n: int) -> str:
    ex = LESSON_EXTRAS[n]
    if "title_tweak" in ex:
        block = block.replace(*ex["title_tweak"])
    if "main_note_tweak" in ex:
        block = block.replace(*ex["main_note_tweak"])

    block = insert_after_first_teacher_script(block, ex["door_greeting"])
    block = insert_before_warmup_end(block, ex["warm_transition"])
    block = insert_opening_extra(block, ex["opening_extra"])
    block = insert_phonics_praise(block, ex["phonics_praise"])

    if ex.get("old_compliment_block"):
        block = split_wrapup_goodbye(block, ex["old_compliment_block"], ex["goodbye_compliment"])
    else:
        old, new = make_goodbye_split(n)
        block = split_wrapup_goodbye(block, old, new)

    # Normalize lesson 13 article indentation to match 08-12
    if n == 13:
        lines = block.splitlines()
        normed = []
        for line in lines:
            if line.startswith("  ") and not line.startswith("        "):
                normed.append("        " + line[2:])
            else:
                normed.append(line)
        block = "\n".join(normed)

    return block


def main():
    content = SRC.read_text(encoding="utf-8")
    parts = []
    for n in range(8, 14):
        raw = extract_lesson(content, n)
        parts.append(enhance_lesson(raw, n))

    out_body = "\n\n".join(parts)
    header = "<!-- K1 Lessons 08-13 Full Plans — HTML Fragment (UTF-8) -->\n"
    OUT.write_text(header + out_body, encoding="utf-8", newline="\n")

    print(f"Wrote {OUT}")
    for i, p in enumerate(parts, 8):
        lines = p.count("\n") + 1
        scripts = p.count('class="teacher-script"')
        print(f"  Lesson {i:02d}: {lines} lines, {scripts} teacher-script divs")


if __name__ == "__main__":
    main()
