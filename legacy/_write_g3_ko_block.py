# -*- coding: utf-8 -*-
"""Write _g3_ko_block.html only."""
from pathlib import Path

BASE = Path(__file__).parent

TITLES = [
    "골격 어근 연구",
    "용감한 토끼 독해",
    "과거시제 기초",
    "어근·기본 의미",
    "간접화법 He said",
    "Junie B. 목소리·유머",
    "과거진행",
    "접두사 un-/re-",
    "Junie B. 감정",
    "비교급·최상급",
    "간접화법 질문·명령",
    "동물 서식지 정보 독해",
    "Junie B. 대화 쓰기",
    "조동사 must/should/can",
    "접미사 -ful/-less",
    "의견 문단 쓰기",
    "Junie B. 요약",
    "G3 종합",
]

EXPANSIONS = {
    0: (
        "G3 첫 단원은 G2 어휘 암기에서 그리스/라틴 어근(osteo-, bio-, graph-) 분석으로의 학술 전환점입니다. 골격 다이어그램에 어근을 매핑하고 osteo→bone, graph→write 연결을 시각화합니다. G2 MTH 리캡의 스토리 어휘에서 G3 '어원 추론' 독해 전략으로 격상하며, Flyers 학술 독해의 첫 블록을 이 단원에서 고정합니다.",
        "어근 연구는 '단어 외우기'가 아닌 '단어 해독하기'로 설명하면 학부모 프리미엄 이미지가 강화됩니다. osteo·bio 2개 어근만 완성해도 G3 첫 마일스톤으로 충분합니다. 완성 Root Map을 학부모 카톡으로 공유하면 학술 트랙 체감이 즉시 생깁니다.",
        "Cambridge Flyers Reading Part 5(어휘 추론)·YLE Academic vocabulary·ORT Stage 10–12·RAZ Level J–L와 정합됩니다. G2 어휘→G3 어근 분석→G4 Word Roots Deep Dive의 학술 어휘 축 시작점입니다.",
    ),
    1: (
        "The Brave Rabbit: 추론 질문·주인공 선택 분석으로 G2 Inference Game에서 G3 '학술 독해'로 격상합니다. 침묵 독해→미지 어휘 표시→추론 Q&A→그룹 토론 순으로 진행하고, brave·clever·escape 5개 핵심 어휘만 고정합니다. 정답 유무보다 '텍스트 근거 인용'이 목표입니다.",
        "용감한 토끼는 G3 첫 '독해 성과' 단원입니다. 집에서 RAZ/ORT 한 권 10분 읽기+한 가지 질문 답하기 숙제를 추천합니다. 국내 초등 독해 '추론하기'와 동일 역량임을 강조하면 학부모 설득력이 올라갑니다.",
        "Flyers Reading Part 4(짧은 이야기)·YLE Inference·ORT Stage 10–11·Harcourt Trophies 서사 독해와 1:1 매칭됩니다. G2 MTH 리캡→G3 용감한 토끼→G3 Junie B. 시리즈의 독해 심화 축입니다.",
    ),
    2: (
        "Past Tense Basics: walked/played/visited 규칙·불규칙 과거형을 G2 주말 일기에서 G3 '문법 체계화'로 격상합니다. 타임라인 쓰기→규칙/불규칙 분류→3문장 pair interview 순으로 진행합니다. yesterday/ago 시간 표현을 추가하고, G2 5문장 일기를 G3 7–8문장으로 확장합니다.",
        "과거시제는 G2 주말 일기의 자연스러운 확장입니다. '한글로 순서 적기→영어 3문장' 2단계 방식이 효과적입니다. 완성 타임라인을 포트폴리오에 누적하면 18단원 후 성장 비교 자료가 됩니다.",
        "Flyers Past Simple·Writing Part 7(짧은 이야기)·YLE Personal narrative와 정합됩니다. G2 주말 일기→G3 과거시제 기초→G3 과거진행의 시제 통합 축입니다.",
    ),
    3: (
        "Word Roots: Base Words — build/break/carry 등 기본 어근의 의미 연결과 접미사 조합 예측을 훈련합니다. G3 단원 01 골격 어근에서 G3 '어근 패밀리 확장'으로 이어집니다. Root-and-Suffix 카드로 신조어 예측 게임을 진행하고, 철자보다 '의미 추론' 인식이 목표입니다.",
        "어근·기본 의미는 '영어 사전 없이 단어 뜻 맞추기'로 설명하면 학부모 이해도가 높습니다. 집에서 un-·re- 접두사 단원 예고로 build→rebuild 맞추기 5분 숙제를 추천합니다.",
        "Flyers Word formation·YLE Vocabulary building·G3 단원 08 접두사·G3 단원 15 접미사의 중간 고리입니다. Harcourt Trophies 어휘 전략·G4 Greek/Latin Roots의 직접 선행 단원입니다.",
    ),
    4: (
        "Reported Speech: He said that ___ . — G2 20 Questions 질문 역량에서 G3 '간접 전달' 문법으로 격상합니다. Direct quote sentence strip→He said that 변환→짧은 대화 oral reporting 순으로 진행합니다. said/told/asked 3동사만 고정하고, 시제 후퇴 규칙은 이름만 소개합니다.",
        "간접화법은 '친구 말 전달하기'로 설명하면 학부모 호응이 큽니다. 집에서 '엄마가 ~라고 했어요'를 영어로 말하기 3문장 숙제가 효과적입니다. G3 핵심 문법 마일스톤으로 별도 안내하세요.",
        "Flyers Reported Speech·YLE Speaking Part 4(전달)·Pre-A2 Grammar progression와 일치합니다. G2 20 Questions→G3 He said→G3 간접화법 질문·명령의 문법 로드맵 시작점입니다.",
    ),
    5: (
        "Junie B. Jones Style: Voice and Humor — 1인칭 아동 내레이터의 솔직·유머 톤을 분석합니다. G2 MTH 리캡의 3인칭 서사에서 G3 '1인칭 voice' 장르 독해로 전환합니다. Excerpt 독해→voice 특징 표시→유머 diary entry 5문장 쓰기 순으로 진행합니다.",
        "Junie B.는 G3 브랜드 마일스톤 독서 프로젝트입니다. '챕터북 1인칭 유머'를 수료 기준 중 하나로 제시하면 프리미엄 이미지가 강화됩니다. 집에서 Junie B. 오디오북 10분+한 장면 영어 말하기를 추천합니다.",
        "Flyers Reading Part 4(이야기)·ORT Stage 10–12·RAZ Level J–L·Junie B. Jones Book 1–3와 1:1 매칭됩니다. G2 MTH→G3 Junie B. 4단원(06·09·13·17)의 장르 독해 축 시작점입니다.",
    ),
    6: (
        "Past Continuous: I was reading when ___ . — G3 과거시제 기초와 병행해 was/were + -ing 프레임을 도입합니다. Past simple + past continuous 결합 문장→그림 prompt 'What were they doing?'→while/when 접속 순으로 진행합니다. interrupt 장면 mime으로 시제 대비를 시각화합니다.",
        "과거진행은 '그때 뭐 하고 있었어?'로 설명하면 직관적입니다. 집에서 가족 사진 보고 was/were doing 3문장 말하기 5분 숙제를 추천합니다. G2 과거 일기와 연결해 '배경+사건' 구조를 강조하세요.",
        "Flyers Past Continuous·YLE Listening Part 3(장면 묘사)·Writing Part 7와 정합됩니다. G3 과거시제→G3 과거진행→G4 Present Perfect의 시제 로드맵 중간 고리입니다.",
    ),
    7: (
        "Prefixes un- and re-: unhappy, rewrite, return, unpack, rebuild — 접두사+어근 분해로 의미 예측을 훈련합니다. G3 단원 03·04 어근 기초에서 G3 '접두사 체계'로 확장합니다. Prefix word wall+학생 예시 5개 산출 순으로 진행하고, un-/re- 2개만 고정합니다.",
        "접두사는 '단어 LEGO' 이미지로 설명하면 학부모 참여율이 높습니다. 집에서 re- 단어 3개 찾기(rewrite, return, rebuild) 숙제가 효과적입니다. 국내 초등 국어 '접두사·접미사'와 연계해 설명하세요.",
        "Flyers Word formation·YLE Prefixes·G3 단원 15 접미사·G4 Prefixes Deep Dive의 직접 선행 단원입니다. Cambridge Flyers Reading 어휘 추론 고빈출 영역입니다.",
    ),
    8: (
        "Junie B. Character Feelings: embarrassed, excited, worried, proud, jealous — 장면 횡단 감정 추적+텍스트 근거 인용을 훈련합니다. G3 단원 06 voice에서 G3 '캐릭터 감정 분석'으로 심화합니다. Emotion chart→text evidence 표시→5문장 paragraph 쓰기 순으로 진행합니다.",
        "Junie B. 감정은 정서·독해 융합 단원입니다. '영어로 기분+이유 말하기'를 강조하면 학부모 호응이 큽니다. 완성 emotion chart를 Open Class 포트폴리오로 활용하세요.",
        "Flyers Reading inference·YLE Feelings·G1 감정 추측→G2 Inference→G3 Junie B. 감정의 독해·정서 축입니다. ORT Stage 10–12 character analysis와 호환됩니다.",
    ),
    9: (
        "Comparatives and Superlatives in Context: better/best, worse/worst, most — G2 최상급 음식·도시vs시골에서 G3 '맥락 속 비교급'으로 격상합니다. Drill→Best school subject debate(구조화 speaking frame) 순으로 진행합니다. 불규칙 better/best/worse/worst 4개만 고정합니다.",
        "비교급·최상급은 G2 복습+G3 심화 단원입니다. '가족 3명 the best ___ 토론' 5분 숙제가 효과적입니다. G2 대비 '문맥 속 비교'가 추가됨을 강조하세요.",
        "Flyers Comparatives/Superlatives·YLE Speaking Part 4·G2 -er/-est→G3 in context→G4 Advanced Comparison의 문법 로드맵 완성입니다.",
    ),
    10: (
        "Reported Speech: Questions and Commands — She asked if ___ . / He told me to ___ . — G3 단원 05 He said에서 G3 '간접화법 확장'으로 격상합니다. Interview question·classroom command 변환→news reporter role-play 순으로 진행합니다. asked if/told me to/wanted to know 3패턴만 고정합니다.",
        "간접화법 질문·명령은 '뉴스 리포터 놀이'로 설명하면 아이 참여율이 높습니다. 집에서 가족 한 명 인터뷰→영어로 전달하기 3문장 숙제를 추천합니다. G3 문법 2차 마일스톤으로 안내하세요.",
        "Flyers Reported Speech (questions/commands)·YLE Speaking Part 4·G3 He said→G3 질문·명령→G4 Academic Reporting의 문법 확장 축입니다.",
    ),
    11: (
        "Informational Reading: Animal Habitats — habitat, survive, adapt, species, environment — G2 추론 게임에서 G3 '비문학 정보 독해'로 격상합니다. Nonfiction passage 독해→note-taking chart→habitat fact 발표 1분 순으로 진행합니다. G3 Flyers 학술 독해 진입의 핵심 단원입니다.",
        "동물 서식지는 과학 교과 연계 Open Class 최적입니다. National Geographic Kids·RAZ nonfiction 10분 읽기 숙제를 추천합니다. '영어=정보 읽기' 이미지를 학부모에게 강조하세요.",
        "Flyers Reading Part 5(비문학)·YLE Science vocabulary·ORT Stage 10–12 Informational·G4 Research Skills의 직접 선행 단원입니다.",
    ),
    12: (
        "Junie B. Dialogue Writing: quotation marks, speaker tags, reply — G3 Junie B. 3단원(06·09)에서 G3 '대화문 쓰기'로 격상합니다. Short dialogue scene 6–8줄→quotation mark peer-edit→pair performance 순으로 진행합니다. punctuation 규칙을 시각 카드로 고정합니다.",
        "대화 쓰기는 G3 쓰기 마일스톤입니다. 완성 dialogue를 학부모에게 공유하면 '영어 창작' 체감이 큽니다. 집에서 가족 2인 대화 4줄 영어로 쓰기 숙제를 추천합니다.",
        "Flyers Writing Part 7(이야기/대화)·YLE Punctuation·G2 스토리 체인→G3 Dialogue→G4 Literary Response Writing의 서사 창작 축입니다.",
    ),
    13: (
        "Modal Verbs: Must, Should, and Can — G2 상담 Should에서 G3 '조동사 3종 체계화'로 격상합니다. must(규칙)/should(조언)/can(능력·허가) 기능 분류→school rule poster 쓰기→small group justification 순으로 진행합니다. G2 should 복습+must/can 신규 도입입니다.",
        "조동사는 '영어로 규칙·조언 말하기'로 설명하면 학부모 호응이 큽니다. 집에서 You must/should/can 한 문장씩 말하기 5분 숙제를 추천합니다. G2 should와의 연결을 상담 시 반복하세요.",
        "Flyers Modals (must/should/can)·YLE Speaking Part 4(조언/규칙)·G2 Should→G3 Modals→G4 Modal Deep Dive의 문법 로드맵 완성입니다.",
    ),
    14: (
        "Suffixes -ful and -less: careful, hopeless, helpful, fearless, meaningful — G3 접두사 un-/re-에서 G3 '접미사 체계'로 확장합니다. Suffix pattern 분석→의미 예측→original sentence 5개 산출 순으로 진행합니다. -ful(가득)/-less(없음) 의미 대비를 시각화합니다.",
        "접미사는 G3 어근 시리즈(01·04·08·15)의 마무리입니다. helpful/hopeless 대비 카드 만들기 숙제가 효과적입니다. '단어 끝 바꾸기=뜻 바꾸기' 개념을 3분 설명하세요.",
        "Flyers Word formation·YLE Suffixes·G5 Word Roots Suffixes·Cambridge Flyers Reading 어휘 추론과 정합됩니다. G3 어근 4단원 통합의 마지막 블록입니다.",
    ),
    15: (
        "Opinion Paragraph Writing: topic sentence + 2 reasons + example + conclusion — G2 휴일 의견·고양이vs개 토론에서 G3 '5문장 opinion paragraph'로 격상합니다. Graphic organizer→draft→revise for clarity 순으로 진행합니다. G2 4–5문장에서 G3 6–8문장 구조화 paragraph로 확장합니다.",
        "의견 문단은 G3 쓰기 핵심 마일스톤입니다. 완성 paragraph를 학부모에게 공유하면 '논증 쓰기' 체감이 큽니다. 한글 초안 허용 후 영어 5문장 정리 2단계 방식이 효과적입니다.",
        "Flyers Writing Part 7(의견문)·YLE Opinion expression·G2 Debate→G2 휴일 의견→G3 Opinion Paragraph→G4 Academic Writing의 논증 쓰기 축입니다.",
    ),
    16: (
        "Junie B. Story Summary: 5-sentence frame (setting–events–conclusion) — G3 Junie B. 4단원 시리즈 마무리 리캡입니다. Chapter 5-sentence summary→key events highlight→literature circle 발표 순으로 진행합니다. G3 Junie B. 독서 프로젝트의 공식 산출물 단원입니다.",
        "Junie B. 요약은 G3 브랜드 마일스톤 — 학부모 별도 안내 필요합니다. '챕터북 첫 요약 완성'을 수료 기준으로 제시하세요. 완성 summary를 포트폴리오+Open Class 자료로 활용합니다.",
        "Flyers Reading Part 4(이야기)·YLE Story Retell·ORT Stage 10–12·Junie B. Jones Book 1–4 완료 기준과 1:1 매칭됩니다. G4 Charlotte's Web Character Analysis의 독서 기반을 제공합니다.",
    ),
    17: (
        "G3 Mastery Review: 18단원 통합 — Flyers Mock 5 stations(Word Roots·Reported Speech·Junie B.·Reading·Writing)를 calm mock 형식으로 진행합니다. 채점보다 관찰·격려 우선 — G3 Final = Flyers readiness check, not high-stakes exam. 어근 5개·He said 2문장·opinion paragraph 5문장·Junie B. summary를 역량 체크리스트로 사용합니다.",
        "G3 수료=Flyers 본시험 응시·G4 Academic Entry 트랙 분기 시점입니다. 점수 공개보다 역량 체크리스트를 학부모에게 제공하세요. 수료증+Flyers 응시 안내를 함께 전달하면 재등록 전환율이 올라갑니다.",
        "Cambridge Flyers Full Mock·G3 Graduation·G4 Placement·ORT Stage 10–12·Junie B. Jones Book 1–4 완료 기준을 통합 안내하세요. Flyers Shield 5개 이상 목표·G4 조기 배치 기준을 원장이 직접 설명할 수 있어야 합니다.",
    ),
}


def card(num, title, logic, parent, cambridge, active=False):
    mt = "0" if active else "24px"
    cls = "lesson-detail active" if active else "lesson-detail"
    nn = f"{num:02d}"
    return f"""        <div class="{cls}" id="g3-ko-lesson-{nn}" style="margin-top: {mt}; padding: 24px; background: white; border: 0.5px solid var(--line); border-radius: 12px;">
          <h3 style="margin-bottom: 16px; font-size: 18px; color: var(--ink);">G3 단원 {nn}: {title}</h3>
          <div style="font-size: 14px; color: var(--ink-2); line-height: 1.8;">
            <p><strong>대상:</strong> 초등 3학년 / Ages 8-9, 수업 60분</p>
            <div style="background:#fef3c7; padding:16px; border-radius:8px; margin-top:12px;">
              <h4 style="font-size:15px; margin-bottom:8px; color:#b45309;">[대치 로직] 교수 설계 의도</h4>
              <p>{logic}</p>
            </div>
            <h4 style="margin-top: 16px; font-size: 15px;">학부모 상담 포인트</h4>
            <p>{parent}</p>
            <h4 style="margin-top: 16px; font-size: 15px;">캠브리지 연계</h4>
            <p>{cambridge}</p>
          </div>
        </div>"""


def nav_row(num, title, active=False):
    nn = f"{num:02d}"
    ac = " active" if active else ""
    return f'          <div class="lesson{ac}" data-g3-ko-lesson="{nn}"><div class="lesson-num">{nn}</div><div class="lesson-body"><div class="lesson-title">단원 {nn}: {title}</div></div></div>'


cards = []
nav = []
for i, title in enumerate(TITLES):
    logic, parent, cambridge = EXPANSIONS[i]
    cards.append(card(i + 1, title, logic, parent, cambridge, active=(i == 0)))
    nav.append(nav_row(i + 1, title, active=(i == 0)))

block = f"""    <div class="ko-only">
      <section class="hero" style="padding:40px 0;">
        <h1>[원장용] G3 커리큘럼 분석서</h1>
        <p class="lead" style="margin-top:12px; font-size:15px; color:var(--ink-2);"><strong>Flyers Prep · 학술 독해 진입</strong><br>그리스/라틴 어근·간접화법(reported speech)·Junie B. Jones 장르 독해를 Flyers 대비 18단원으로 균형 배치해, G2 Movers 수료생·초등 3학년이 Cambridge Flyers 트랙에 안착하도록 설계했습니다.</p>
      </section>
      <section style="padding: 24px 0;">
        <div class="lesson-detail-panel" id="g3-ko-lesson-panel">
{chr(10).join(cards)}
        </div>
      </section>
      <section id="g3-ko-lessons-nav">
        <h2>단원별 교수 설계 분석서</h2>
        <div class="lessons">
{chr(10).join(nav)}
        </div>
      </section>
      <div style="display:flex; justify-content:space-between; padding:24px 0;">
        <button class="btn btn-secondary" onclick="document.querySelector(&quot;[data-level='g2']&quot;).click(); window.scrollTo(0, 0);">◀ G2</button>
        <button class="btn btn-secondary" onclick="document.getElementById('g3-ko-lessons-nav').scrollIntoView({behavior:'smooth',block:'start'});">☰ 목록</button>
        <button class="btn" onclick="document.querySelector(&quot;[data-level='g4']&quot;).click(); window.scrollTo(0, 0);" style="background:#fbbf24; border:none; padding:8px 16px; border-radius:6px; cursor:pointer;">G4 ▶</button>
      </div>
    </div>
  </div>
</div>"""

out = BASE / "_g3_ko_block.html"
out.write_text(block, encoding="utf-8")
print(f"Written {out} ({len(block.encode('utf-8'))} bytes)")
