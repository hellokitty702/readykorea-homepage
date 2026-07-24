# ReadyKorea — 파일 구조 안내

`종합.zip` 배포 패키지 기준으로 업데이트된 사이트입니다.

---

## 어떻게 동작하나요?

1. 브라우저에서 **`index.html`** 을 엽니다. (메인 홈페이지)
2. Free Lesson Plans에서 레벨(K1~G6)을 고르거나, SEO 페이지 `lessons/` 로 들어갑니다.
3. 개별 레슨 URL 예: `lessons/k1/greetings-hello-routine/`
4. 지원하기(Apply Now) → **`apply/`** 페이지로 이동합니다.

---

## 핵심 파일

| 파일 / 폴더 | 역할 |
|-------------|------|
| **`index.html`** | 메인 홈페이지 (GitHub Pages 시작 파일) |
| **`lessons/`** | SEO용 레슨 페이지 (학년별 · 슬러그 URL) |
| **`lessons/k1/.../index.html`** | 개별 레슨 상세 |
| **`apply/`** | Apply Now 지원 페이지 |
| **`sitemap.xml`** | 검색엔진용 사이트맵 |
| **`robots.txt`** | 크롤러 안내 |

### 경로 예시

```
index.html
apply/index.html
sitemap.xml
robots.txt
lessons/
  index.html
  k1/
    index.html
    greetings-hello-routine/index.html
  k2/ … g6/
```

---

## GitHub에 올릴 때

1. 시작 파일은 **`index.html`**
2. 반드시 같이 올리세요: `index.html`, `lessons/`, `apply/`, `sitemap.xml`, `robots.txt`
3. 대용량/개발용은 제외해도 됩니다: `dist/`, `*.ps1`, `david-esl-homepage.before-lesson-split.html`

---

## 로컬 확인

1. `index.html` 을 브라우저로 연다
2. Lesson Plans → 레벨 확인
3. `lessons/k1/` 또는 개별 슬러그 페이지가 열리는지 확인
4. **Apply Now** → `apply/` 이동 확인

---

## 참고

- 예전 `lessons/k1/en/01.html` 번호 구조는 `종합.zip` SEO 슬러그 구조로 교체되었습니다.
- 소스에서 다시 빌드하려면: `build-lesson-dist.ps1` (선택)
