# -*- coding: utf-8 -*-
"""Write _k1_ko_block.html only."""
import importlib.util
from pathlib import Path

BASE = Path(__file__).parent
spec = importlib.util.spec_from_file_location("gen", BASE / "_gen_ko_blocks.py")
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)

TITLES = [
    "교실 루틴",
    "인사·헬로",
    "교실 물건·명령",
    "숫자 1-10",
    "색깔",
    "농장 동물 TPR",
    "몸 부위 Simon Says",
    "가족 그림",
    "동작 동사",
    "음식·과일",
    "날씨·계절",
    "감정",
    "도형",
    "파닉스 s,a,t",
    "파닉스 i,p,n",
    "사이트워드",
    "노래·작별",
    "K1 종합",
]

EXPANSIONS = {
    0: (
        "K1 첫 단원은 '영어=예측 가능한 루틴'이라는 신경망을 만듭니다. Look·Listen·Sit 세 명령만으로도 30분 수업의 70%를 통제할 수 있습니다.",
        "등원 직후 2주간은 발화보다 '명령에 즉시 반응' 여부를 관찰하세요. 학부모에게는 영상 한 클립으로 TPR 반응을 보여주면 만족도가 높습니다.",
        "Cambridge Pre-A1 Listening·Classroom Language와 정합되며, ORT Stage 1 첫 페이지의 교실 배경 그림과 연결해 설명하세요.",
    ),
    1: (
        "Hello Song으로 수업의 시작·종료 경계를 고정합니다. 이름 호명과 인사를 묶어 '나=개별 존재' 인식을 쌓습니다.",
        "수줍은 아이는 인형·페퍼트에게 먼저 인사하게 하면 부담이 줄어듭니다. '아직 입 밖으로 안 나와도 손 흔들기=성공'임을 부모에게 분명히 전달하세요.",
        "YLE Pre-A1 Listening의 이름·인사 영역과 맞닿으며, 이후 K2의 질문 프레임(I like / Do you…)의 정서적 토대가 됩니다.",
    ),
    2: (
        "Open·Close·Point·Give me 등 교실 통제 스크립트를 TPR로 고착합니다. 물건 명칭은 항상 '동사+명사' 한 덩어리로만 노출합니다.",
        "'영어로 책 펴세요'가 가능해지는 시점이라 학부모 설명회에 적합합니다. 교실 벽에 그림 라벨을 붙여 두면 집에서도 같은 단어가 반복됩니다.",
        "ORT Stage 1–2 교실 배경 어휘·Cambridge Classroom Language와 동일 축이며, K2 2-step 명령 루프의 직접 선행 단원입니다.",
    ),
    3: (
        "Jump·Clap 등 동작과 숫자를 결합한 Active Counting으로 수 개념을 신체 기억에 저장합니다. 1–5를 완전히 자동화한 뒤 6–10으로 확장합니다.",
        "숫자는 암송이 아니라 '몸으로 세기'로 설명하세요. 집에서는 계단·과자 개수로 1–5만 반복해도 충분합니다.",
        "Pre-Starters Numbers 예비·CEFR Pre-A1 Quantities와 연결되며, K2의 How many? 완전문으로 자연스럽게 이어집니다.",
    ),
    4: (
        "교실 전체 색깔 사냥으로 시각 인지와 어휘를 동시에 자극합니다. red apple처럼 색+명사 조합만 다루고 관사는 K2로 미룹니다.",
        "색깔은 K1에서 가장 빠르게 보이는 성과 지표입니다. Open Class·학부모 초청 수업의 대표 포트폴리오로 활용하세요.",
        "YLE Colors·Pre-A1 Vocabulary 핵심 항목이며, 이후 형용사 순서(big red…) 학습의 첫 블록입니다.",
    ),
    5: (
        "동물 소리+동작 연결로 '소리=의미' 매핑을 강화합니다. Henderson Desert Animals 등 시각 자료와 연계해 농장·사막을 구분하지 않고 '소리 게임'으로 통합합니다.",
        "동물 단원은 학부모 Open Class 최적 타이밍입니다. 소리만 내는 것도 유효한 학습 산출물임을 강조하세요.",
        "Pre-Starters Animals·ORT 비교급 없는 그림책과 호환되며, TPR 기반 YLE Listening 예비에 해당합니다.",
    ),
    6: (
        "Simon Says로 '듣고 판단하기' 인지력을 키웁니다. 한 번에 한 부위만 지시해 K1 인지 부하 한계를 지킵니다.",
        "Simon Says는 K1~K3 전 레벨 공통 게임입니다. '몸으로 영어 듣기'가 된다는 점을 상담 시 반복 언급하세요.",
        "TPR Body Parts·YLE Body 영역과 일치하며, 이후 감정·동작 동사 단원의 신체 어휘 기반을 제공합니다.",
    ),
    7: (
        "그림·사진으로 가족을 소개해 말하기 부담을 낮춥니다. This is my mom. 한 문장만 목표로 하고 확장은 K2로 미룹니다.",
        "가족 사진 활용 Open Class를 추천합니다. 한국어 혼용을 허용한 뒤 영어 한 문장만 추가하는 방식이 효과적입니다.",
        "Pre-A1 Family·ORT 가족 테마 그림책과 연계되며, K2 소유격(my/your) 단원의 시각적 선행 학습입니다.",
    ),
    8: (
        "Jump·Run·Walk 등 대근육 동작으로 동사 개념을 몸에 각인합니다. one-word answer만 허용하고 문장은 K2부터 시작합니다.",
        "에너지 발산과 학습을 동시에 해결하는 단원입니다. 좁은 교실은 제자리 동작 위주로 조정하세요.",
        "Action Verbs TPR·Pre-A1 동작 어휘와 맞물리며, K2의 I jump. She runs. 완전문 직전 단계입니다.",
    ),
    9: (
        "Taste game으로 I like ___ 한 프레임만 미리 노출합니다. 실물(플라스틱·사진) 사용이 필수이며 실제 시식은 금지합니다.",
        "알레르기·종교적 식습관 아이는 사전 확인하세요. '좋아요/싫어요' 표정만으로도 학습 목표 달성으로 인정합니다.",
        "Pre-Starters Food·감각 학습 축과 연결되며, K2 I like / I don't like 설문 활동의 예비 단계입니다.",
    ),
    10: (
        "창밖 날씨·날짜 보드와 연계해 매일 같은 질문 루틴을 만듭니다. Sunny! Cloudy!처럼 한 단어 반응부터 시작합니다.",
        "학부모에게 '아이가 Sunny! Cloudy!를 말해요'는 가시적 성과입니다. 매일 1분 날씨 코너를 브랜드 루틴으로 고정하세요.",
        "Weather YLE·계절 어휘와 정합되며, K2 주간 날씨 차트·K3 weather-clothing 연결의 출발점입니다.",
    ),
    11: (
        "Happy·Sad·Angry 얼굴 카드로 감정 어휘와 표현력 기초를 다집니다. 거울·스티커로 표정 연습을 병행합니다.",
        "감정 단원은 또래 갈등 예방 상담에 활용 가능합니다. '영어로 기분 말하기'는 정서 안정과 직결됩니다.",
        "Feelings Pre-A1·Cambridge Starters Speaking의 감정 묘사 예비 영역과 연결됩니다.",
    ),
    12: (
        "교실 내 Circle·Square·Triangle 사냥으로 공간 인지와 어휘를 동시에 자극합니다. 바닥 테이프·블록으로 형태를 몸으로 기억하게 합니다.",
        "국내 수학 교과와의 연계를 강조하면 학부모 설득력이 올라갑니다. '영어 도형=수학 도형' 동일 개념임을 명시하세요.",
        "Shapes YLE·Pre-A1 Geometry 어휘와 일치하며, K3 패턴(AB/ABB) 단원의 기하 기초가 됩니다.",
    ),
    13: (
        "Jolly Phonics Group 1 첫 3음 s·a·t를 액션+소리로 고정합니다. 글자 이름이 아닌 순수 소리(/s/ /a/ /t/)만 다룹니다.",
        "파닉스 시작은 학부모 설명회 필수 타이밍입니다. '아직 읽기 전, 귀 훈련 단계'임을 분명히 설명하세요.",
        "Jolly Phonics Group 1·Synthetic Phonics 입문과 Cambridge Pre-A1 Phonemic Awareness가 동일 목표입니다.",
    ),
    14: (
        "Group 1을 i·p·n으로 완성합니다. sat·pin·tap 등 3음 조합을 '소리 놀이'로만 다루고 CVC 블렌딩은 K2로 미룹니다.",
        "Group 1 완료=K2 CVC 블렌딩 준비 완료 신호입니다. 6글자 액션을 영상으로 보내면 학부모 만족도가 높습니다.",
        "CVC 예비·Dolch 입문과 맞물리며, ORT Stage 1–2 디코딩 준비 상태를 의미합니다.",
    ),
    15: (
        "a·I·the·see·go를 문장·노래·TPR 속에서만 반복 노출합니다. 암기 테스트는 하지 않고 인식만 목표로 합니다.",
        "사이트워드는 '읽기 시작' 신호입니다. 집에서는 책 속에서 손가락으로 가리키기만 해도 충분합니다.",
        "Dolch Pre-Primer 5개·Cambridge Pre-A1 High-Frequency Words와 동일 세트입니다.",
    ),
    16: (
        "Goodbye Song으로 수업 종료 루틴을 완성합니다. Hello와 짝을 이루어 '시작–끝' 예측 가능성을 제공합니다.",
        "하원 시 Goodbye Song은 학원 브랜드 차별화 포인트입니다. 학부모 대기실에서도 들릴 정도로 고정하세요.",
        "Classroom Songs·Routine 언어와 연결되며, 정서적 안정은 YLE Speaking 수행의 숨은 기반입니다.",
    ),
    17: (
        "18단원 TPR·파닉스·어휘를 통합 리뷰합니다. 채점 없이 관찰만 하며 K2 배치 데이터를 수집합니다.",
        "K1 수료=K2 배치 기준 데이터 수집 시점입니다. 수료증·스티커로 성취감을 주고 '다음은 읽기 시작(K2)'을 예고하세요.",
        "K1 Graduation·K2 Placement·Cambridge Pre-Starters 트랙 진입 안내를 함께 제공하세요.",
    ),
}


def card(num, title, logic, parent, cambridge, active=False):
    mt = "0" if active else "24px"
    cls = "lesson-detail active" if active else "lesson-detail"
    nn = f"{num:02d}"
    return f"""        <div class="{cls}" id="k1-ko-lesson-{nn}" style="margin-top: {mt}; padding: 24px; background: white; border: 0.5px solid var(--line); border-radius: 12px;">
          <h3 style="margin-bottom: 16px; font-size: 18px; color: var(--ink);">K1 단원 {nn}: {title}</h3>
          <div style="font-size: 14px; color: var(--ink-2); line-height: 1.8;">
            <p><strong>대상:</strong> 한국 5세 / 만 3-4세, 수업 30분</p>
            <div style="background:#fef3c7; padding:16px; border-radius:8px; margin-top:12px;">
              <h4 style="font-size:15px; margin-bottom:8px; color:#b45309;">[대치 로직] 교수 설계 의도</h4>
              <p>{logic}</p>
            </div>
            <h4 style="margin-top: 16px; font-size: 15px;">학부모 상담 포인트</h4>
            <p>{parent}</p>
            <h4 style="margin-top: 16px; font-size: 15px;">캠브리지·파닉스 연계</h4>
            <p>{cambridge}</p>
          </div>
        </div>"""


def nav_row(num, title, active=False):
    nn = f"{num:02d}"
    ac = " active" if active else ""
    return f'          <div class="lesson{ac}" data-k1-ko-lesson="{nn}"><div class="lesson-num">{nn}</div><div class="lesson-body"><div class="lesson-title">단원 {nn}: {title}</div></div></div>'


cfg = gen.LEVELS["k1"]
cards = []
nav = []
for i, title in enumerate(TITLES):
    logic, parent, cambridge = EXPANSIONS[i]
    cards.append(card(i + 1, title, logic, parent, cambridge, active=(i == 0)))
    nav.append(nav_row(i + 1, title, active=(i == 0)))

block = f"""    <div class="ko-only">
      <section class="hero" style="padding:40px 0;">
        <h1>[원장용] K1 커리큘럼 분석서</h1>
        <p class="lead" style="margin-top:12px; font-size:15px; color:var(--ink-2);"><strong>{cfg['hero']}</strong><br>{cfg['summary']}</p>
      </section>
      <section style="padding: 24px 0;">
        <div class="lesson-detail-panel" id="k1-ko-lesson-panel">
{chr(10).join(cards)}
        </div>
      </section>
      <section id="k1-ko-lessons-nav">
        <h2>단원별 교수 설계 분석서</h2>
        <div class="lessons">
{chr(10).join(nav)}
        </div>
      </section>
      <div style="display:flex; justify-content:space-between; padding:24px 0;">
        <button class="btn btn-secondary" onclick="document.getElementById('k1-ko-lessons-nav').scrollIntoView({{behavior:'smooth',block:'start'}});">☰ 목록</button>
        <button class="btn" onclick="document.querySelector(&quot;[data-level='k2']&quot;).click(); window.scrollTo(0, 0);" style="background:#fbbf24; border:none; padding:8px 16px; border-radius:6px; cursor:pointer;">K2 ▶</button>
      </div>
    </div>"""

out = BASE / "_k1_ko_block.html"
out.write_text(block, encoding="utf-8")
print(f"Written {out} ({len(block.encode('utf-8'))} bytes)")
