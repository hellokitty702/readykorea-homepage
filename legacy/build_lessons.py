#!/usr/bin/env python3
"""
ReadyKorea lesson URL separation builder.
Reads david-esl-homepage.html (never modifies it) and writes /dist.

Usage:
  python build_lessons.py

On Windows without Python, use:
  powershell -ExecutionPolicy Bypass -File build-lesson-dist.ps1
"""

from __future__ import annotations

import html
import json
import re
import shutil
import subprocess
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "david-esl-homepage.html"
DIST = ROOT / "dist"
DOMAIN = "__DOMAIN__"
EMAIL = "__EMAIL__"
GRADES = ["k1", "k2", "k3", "g1", "g2", "g3", "g4", "g5", "g6"]
GRADE_LABELS = {g: g.upper() if g.startswith("k") else f"G{g[1]}" for g in GRADES}
GRADE_LABELS.update({f"g{i}": f"G{i}" for i in range(1, 7)})


def strip_lesson_prefix(title: str) -> str:
    return re.sub(r"^(K[1-3]|G[1-6])\s+Lesson\s+\d{2}:\s*", "", title, flags=re.I)


def make_slug(title: str, used: dict[str, bool]) -> str:
    t = html.unescape(strip_lesson_prefix(title))
    t = re.sub(r"^(Grammar|Reading|Writing|Speaking|Listening|Vocab|Phonics|Unit)\s*:\s*", "", t, flags=re.I)
    t = t.lower().replace("/", "-")
    t = re.sub(r"[\(\)\\:;,.\&'']", "", t)
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-") or "lesson"
    base, n = t, 2
    while t in used:
        t = f"{base}-{n}"
        n += 1
    used[t] = True
    return t


def extract_balanced(html_text: str, start: int, tag: str) -> str | None:
    open_re = re.compile(rf"<{tag}\b", re.I)
    close_re = re.compile(rf"</{tag}>", re.I)
    depth, i, n = 0, start, len(html_text)
    begin = start
    while i < n:
        om, cm = open_re.search(html_text, i), close_re.search(html_text, i)
        if not om and not cm:
            break
        use_open = om and (not cm or om.start() <= cm.start())
        if use_open:
            if depth == 0:
                begin = om.start()
            depth += 1
            i = om.end()
        else:
            depth -= 1
            i = cm.end()
            if depth == 0:
                return html_text[begin:i]
    return None


def extract_lesson(html_text: str, element_id: str) -> str | None:
    needle = f'id="{element_id}"'
    idx = html_text.find(needle)
    if idx < 0:
        return None
    open_start = html_text.rfind("<", 0, idx)
    snippet = html_text[open_start : open_start + 12]
    tag = "article" if snippet.lower().startswith("<article") else "div"
    return extract_balanced(html_text, open_start, tag)


def strip_html(s: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def truncate(s: str, n: int = 150) -> str:
    return s if len(s) <= n else s[: n - 3].rstrip() + "..."


def list_items(block: str, heading_pat: str) -> list[str]:
    m = re.search(heading_pat, block, re.I | re.S)
    if not m:
        return []
    return [strip_html(x) for x in re.findall(r"<li[^>]*>(.*?)</li>", m.group(1), re.I | re.S)]


def parse_div(block: str, grade: str, lesson_no: int) -> dict:
    title_m = re.search(r"<h3[^>]*>(.*?)</h3>", block, re.I | re.S)
    title = strip_html(title_m.group(1)) if title_m else ""
    age = re.search(r"<strong>\s*Age:\s*</strong>\s*([^<]+)", block, re.I)
    dur = re.search(r"<strong>\s*Duration:\s*</strong>\s*([^<]+)", block, re.I)
    objectives = list_items(block, r"<h4[^>]*>\s*Objectives\s*</h4>\s*<ul[^>]*>(.*?)</ul>")
    vocab = list_items(block, r"<h4[^>]*>\s*Vocab\s*</h4>\s*<ul[^>]*>(.*?)</ul>")
    tips = list_items(block, r"<h4[^>]*>\s*Teacher Tips\s*</h4>\s*<ul[^>]*>(.*?)</ul>")
    warmup = strip_html(re.search(r"<h4[^>]*>\s*Warm-up[^<]*</h4>\s*<p[^>]*>(.*?)</p>", block, re.I | re.S).group(1)) if re.search(r"Warm-up", block) else ""
    main = strip_html(re.search(r"<h4[^>]*>\s*Main Activity[^<]*</h4>\s*<p[^>]*>(.*?)</p>", block, re.I | re.S).group(1)) if re.search(r"Main Activity", block) else ""
    wrap = strip_html(re.search(r"<h4[^>]*>\s*Wrap-up[^<]*</h4>\s*<p[^>]*>(.*?)</p>", block, re.I | re.S).group(1)) if re.search(r"Wrap-up", block) else ""
    meta = truncate(" ".join(objectives)) if objectives else truncate(title)
    return {
        "schema": "div",
        "title": title,
        "grade": grade,
        "lessonNo": lesson_no,
        "ageRange": age.group(1).strip() if age else "",
        "duration": dur.group(1).strip() if dur else "",
        "objectives": objectives,
        "vocab": vocab,
        "warmup": warmup,
        "mainActivity": main,
        "wrapup": wrap,
        "teacherTips": tips,
        "metaDescription": meta,
        "html": block,
    }


def parse_article(block: str, grade: str, lesson_no: int) -> dict:
    title = strip_html(re.search(r"<h1[^>]*>(.*?)</h1>", block, re.I | re.S).group(1))
    focus_m = re.search(r'<span\s+class="focus"[^>]*>(.*?)</span>', block, re.I | re.S)
    focus = strip_html(focus_m.group(1)) if focus_m else ""
    grade_m = re.search(r'<span\s+class="grade"[^>]*>(.*?)</span>', block, re.I | re.S)
    age = re.sub(r"(?i)^Grade:\s*", "", strip_html(grade_m.group(1))) if grade_m else ""
    dur_m = re.search(r'<span\s+class="duration"[^>]*>(.*?)</span>', block, re.I | re.S)
    duration = re.sub(r"(?i)^Time:\s*", "", strip_html(dur_m.group(1))) if dur_m else ""
    checklist = list_items(block, r'<section\s+class="material-checklist"[^>]*>.*?<ul[^>]*>(.*?)</ul>')
    sections = []
    for sm in re.finditer(r'<section\s+class="([^"]+)"[^>]*>(.*?)</section>', block, re.I | re.S):
        cls = sm.group(1)
        if cls == "material-checklist":
            continue
        heading = strip_html(re.search(r"<h2[^>]*>(.*?)</h2>", sm.group(2), re.I | re.S).group(1))
        body = truncate(strip_html(re.sub(r"<h2[^>]*>.*?</h2>", "", sm.group(2), flags=re.I | re.S)))
        sections.append({"class": cls, "heading": heading, "body": body})
    return {
        "schema": "article",
        "title": title,
        "grade": grade,
        "lessonNo": lesson_no,
        "ageRange": age,
        "duration": duration,
        "focus": focus,
        "materialChecklist": checklist,
        "sections": sections,
        "metaDescription": truncate(focus or title),
        "html": block,
    }


def main() -> int:
    ps_script = ROOT / "build-lesson-dist.ps1"
    if not SOURCE.exists():
        print(f"Missing source: {SOURCE}", file=sys.stderr)
        return 1
    if shutil.which("python") is None and sys.executable.endswith("WindowsApps\\python.exe"):
        if ps_script.exists():
            print("Python unavailable; delegating to build-lesson-dist.ps1")
            return subprocess.call(
                ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(ps_script)]
            )
    raw = SOURCE.read_text(encoding="utf-8")
    html_text = raw.replace("\r", "")
    ids = sorted(set(m.group(1) for m in re.finditer(r'id="((?:k[1-3]|g[1-6])-lesson-\d{2})"', html_text) if "-ko-lesson-" not in m.group(1)))
    print(f"Found {len(ids)} lesson IDs — run build-lesson-dist.ps1 for full site generation.")
    print("This Python entry point validates parsing; use PowerShell script on this machine.")
    lessons = []
    slug_used: dict[str, dict[str, bool]] = {g: {} for g in GRADES}
    for lid in ids:
        m = re.match(r"^(k[1-3]|g[1-6])-lesson-(\d{2})$", lid)
        if not m:
            continue
        grade, no = m.group(1), int(m.group(2))
        block = extract_lesson(html_text, lid)
        if not block:
            print(f"  FAIL extract: {lid}")
            continue
        lesson = parse_article(block, grade, no) if grade == "k1" else parse_div(block, grade, no)
        lesson["id"] = lid
        lesson["slug"] = make_slug(lesson["title"], slug_used[grade])
        lessons.append(lesson)
    lessons.sort(key=lambda x: (GRADES.index(x["grade"]), x["lessonNo"]))
    DIST.mkdir(exist_ok=True)
    (DIST / "lessons.json").write_text(json.dumps(lessons, ensure_ascii=False, indent=2), encoding="utf-8")
    k1 = [x for x in lessons if x["grade"] == "k1"]
    print(f"Parsed {len(lessons)} lessons; K1 with focus: {sum(1 for x in k1 if x.get('focus'))}/18")
    return 0 if len(lessons) == 162 else 1


if __name__ == "__main__":
    raise SystemExit(main())
