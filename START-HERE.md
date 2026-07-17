# ReadyKorea — 파일 구조 안내 (초보자용)

사이트가 무거워서 **메인에는 목록만**, **상세는 별도 페이지**로 나눴습니다.

---

## 어떻게 동작하나요?

1. 브라우저에서 **`index.html`** 을 엽니다. (이것이 메인 홈페이지입니다)
2. Free Lesson Plans → K1 등 레벨을 고릅니다.
3. 화면에 **레슨 제목 리스트만** 보입니다. (상세 본문 없음 → 가벼움)
4. 제목을 클릭하면 **새 페이지**로 이동합니다.  
   예: `lessons/k1/en/01.html`
5. 상세 페이지에서 **Back to K1 list** 를 누르면 메인 목록으로 돌아갑니다.

---

## 어떤 파일이 새로 생겼나요?

| 파일 / 폴더 | 역할 |
|-------------|------|
| **`index.html`** | 메인 홈페이지 (GitHub / 호스팅의 기본 시작 파일) |
| **`lessons/`** | 레슨 상세 페이지 324개 (K1~G6 × EN/KO × 18단원) |
| **`lessons/k1/en/01.html`** 등 | 각 레슨의 **완전한** HTML 페이지 |
| **`assets/lesson-page.css`** | 레슨 상세 페이지 공통 디자인 |
| **`lessons/README.md`** | 레슨 폴더 기술 메모 |
| **`build-full-lesson-pages.ps1`** | 상세 페이지를 다시 만들 때 쓰는 도구 (평소엔 안 열어도 됨) |

### 예시 경로

```
index.html                          ← 메인 (목록만)
assets/lesson-page.css              ← 상세 페이지 스타일
lessons/
  k1/
    en/
      01.html                       ← K1 영어 레슨 1 상세
      02.html
      …
    ko/
      01.html                       ← K1 한국어(원장용) 단원 1 상세
  k2/ … g6/                         ← 동일 구조
```

---

## 어떤 파일이 수정되었나요?

| 파일 | 변경 내용 |
|------|-----------|
| **`index.html`** | 새로 만든 메인. 레슨 제목이 `lessons/.../xx.html` 로 링크됨 |
| **`david-esl-homepage.html`** | 위와 같은 내용 (백업/동일본). 앞으로는 **`index.html`만** 쓰세요 |
| **`lessons/**/*.html`** | 예전엔 “조각”이었고, 지금은 **헤더·뒤로가기 있는 완성 페이지** |

### 참고용 (업로드해도 되고 안 해도 됨)

| 파일 | 설명 |
|------|------|
| `david-esl-homepage.before-lesson-split.html` | 분리 **이전** 초대형 백업. GitHub에 올리면 용량만 커짐 → **올리지 않는 것 추천** |
| `dist/` | 예전 빌드 결과물. 지금 구조와 다름 → 혼란 방지로 **올리지 않아도 됨** |
| `split-lessons.ps1`, `fix-lesson-router.ps1` 등 | 개발용 스크립트. 필수는 아님 |

---

## 로컬에서 확인하는 방법

1. 폴더 `New folder` 를 연다.
2. **`index.html`** 을 더블클릭하거나 브라우저로 연다.
3. Lesson Plans → K1 → 아무 제목이나 클릭.
4. 상세 페이지가 열리면 성공입니다.

> `file://` 로도 **페이지 이동 방식**이라 동작합니다.  
> (예전 fetch 방식과 달리 서버가 필수는 아닙니다.)

---

## GitHub에 올릴 때 주의사항

1. **시작 파일은 `index.html`**  
   GitHub Pages / Netlify / Vercel 은 보통 루트의 `index.html` 을 홈으로 씁니다.  
   → `david-esl-homepage.html` 만 올리면 홈이 안 열릴 수 있습니다.

2. **폴더를 통째로 유지**  
   반드시 같이 올리세요:
   - `index.html`
   - `lessons/` (안의 모든 html)
   - `assets/lesson-page.css`  
   하나라도 빠지면 링크가 깨집니다.

3. **대용량 백업은 제외**  
   `.gitignore` 예:
   ```
   david-esl-homepage.before-lesson-split.html
   dist/
   *.ps1
   ```
   (스크립트를 보관하고 싶으면 `*.ps1` 줄은 빼세요.)

4. **한글 파일/경로**  
   지금 레슨 경로는 모두 영문 (`k1`, `en`, `01.html`)이라 GitHub에서 문제 없습니다.

5. **커밋 메시지 예시**
   ```
   Split lesson plans into separate pages for faster main load
   ```

6. **처음 올리는 경우 (요약)**
   - GitHub에서 새 저장소 만들기
   - 이 폴더에서 필요한 파일만 추가
   - Push
   - GitHub Pages 설정 시 Source = 해당 브랜치 / root (`/`)

---

## 가이드(비자·생활 등)는?

지금 분리한 것은 **레슨 플랜(K1~G6)** 입니다.  
E-2 Visa, Why Korea 같은 가이드는 아직 메인 SPA 안에 있습니다.  
원하시면 같은 방식으로 가이드도 다음 단계에 분리할 수 있습니다.

---

## 문제가 생기면

- 클릭해도 안 열림 → `lessons` 폴더가 `index.html` 과 **같은 위치**에 있는지 확인  
- 디자인이 깨짐 → `assets/lesson-page.css` 가 있는지 확인  
- 예전 무거운 파일로 되돌리기 → `david-esl-homepage.before-lesson-split.html` 을 복사해 복구
