# ReadyKorea — 프로젝트 안내 (Next.js + Bun)

정적 HTML 사이트를 **Next.js (App Router)** 기반으로 옮겼습니다. **Vercel** 에 배포하며, 모든 페이지는 빌드 시 정적 HTML로 미리 만들어집니다. URL은 기존과 동일합니다.

---

## 명령어

```bash
bun install        # 의존성 설치
bun run dev        # 개발 서버 (http://localhost:3000)
bun run build      # 프로덕션 빌드
bun run start      # 빌드 결과 로컬 실행 (http://localhost:3000)
bun run typecheck  # 타입 검사
```

배포: Vercel 이 Next.js 프로젝트로 자동 인식합니다 (`bun.lock` 이 있어서 `bun install` / `bun run build` 사용). 별도 설정은 필요 없습니다.

예전 주소 호환: `/apply` → `/apply/` 처럼 끝에 `/` 를 붙여 리다이렉트하고, `…/index.html` 주소는 `…/` 로 리다이렉트합니다 (`next.config.ts`).

---

## 페이지 / URL

| URL | 파일 |
|-----|------|
| `/` 메인 홈페이지 | `app/(site)/page.tsx` |
| `/lessons/` 전체 레슨 | `app/(site)/lessons/page.tsx` |
| `/lessons/k1/` 학년별 목록 | `app/(site)/lessons/[grade]/page.tsx` |
| `/lessons/k1/greetings-hello-routine/` 개별 레슨 | `app/(site)/lessons/[grade]/[slug]/page.tsx` |
| `/apply/` 지원하기 | `app/(apply)/apply/page.tsx` |
| `/blog/` 블로그 | `app/(blog)/blog/page.tsx` |
| `/blog/first-week-teaching-in-korea.html` 블로그 글 | `app/(blog-post)/blog/[post]/page.tsx` |
| `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts`, `app/robots.ts` (레슨 목록에서 자동 생성) |

`(site)`, `(apply)`, `(blog)`, `(blog-post)` 는 각각 별도의 루트 레이아웃입니다. 페이지마다 전역 CSS가 서로 달라서, 섞이지 않도록 나눠 두었습니다. 네 레이아웃 모두 `components/layout/SiteLayout.tsx` 를 사용하므로 **모든 페이지에 같은 헤더와 푸터**가 나옵니다.

---

## 콘텐츠 수정하기

| 수정할 내용 | 위치 |
|-------------|------|
| 메인 홈페이지 각 화면 (홈, AI Lab, Forum, K1~G6 등) | `content/home/levels/*.html` |
| 지역 가이드 (서울, 부산 …) | `content/home/regions/*.html` |
| 상단 헤더 / 메뉴 (모든 페이지 공통) | `components/layout/SiteHeader.tsx` (메뉴 항목은 파일 위쪽 목록) |
| 하단 푸터 (모든 페이지 공통) | `components/layout/SiteFooter.tsx` |
| 메인 화면 동작 (메뉴 이동, EN/한글 전환, 모달, 계산기 등) | `public/js/home.js` |
| Support Center 가이드 데이터 / 학년별 커리큘럼 카드 | `public/js/support-guides.js`, `public/js/grade-curriculum.js` |
| 레슨 목록 (학년, 순서, 제목, 설명) | `content/lessons/manifest.json` |
| 레슨 본문 | `content/lessons/{학년}/{slug}.html` |
| 블로그 글 목록 / 본문 | `lib/blog.ts`, `content/blog/{slug}.html` |
| 스타일 | `styles/layout.css` (헤더 + 푸터, 모든 페이지), `styles/site.css` (홈 + 레슨), `styles/apply.css`, `styles/blog.css`, `styles/blog-post.css` |

### 레슨 추가

1. `content/lessons/{학년}/{새-slug}.html` 에 본문 작성
2. `content/lessons/manifest.json` 해당 학년 `lessons` 배열에 `{ "slug", "title", "description" }` 추가 (배열 순서 = 레슨 순서)
3. 페이지 제목/메타태그, 이전·다음 링크, 학년 목록, sitemap 은 자동으로 만들어집니다.

### 블로그 글 추가

1. `content/blog/{slug}.html` 에 본문 작성
2. `lib/blog.ts` 의 `posts` 맨 앞에 글 정보 추가 → 블로그 목록과 메인 "Latest Posts" 에 자동 반영

---

## 참고

- 헤더 메뉴는 홈 화면의 각 섹션(`data-nav`)을 가리킵니다. 홈에서는 `public/js/home.js` 가 화면을 바로 전환하고, 다른 페이지에서는 `components/layout/HeaderNav.tsx` 가 `/#섹션` 주소로 이동시킵니다. EN/한글 선택은 모든 페이지에서 같이 유지됩니다.
- 메인 홈페이지는 기존과 같은 한 페이지 앱입니다. HTML은 서버에서 미리 렌더링되고, `public/js/home.js` 가 하이드레이션 후 로드되어 기존과 똑같이 동작합니다.
- 예전 정적 사이트 파일(`index.html`, `apply/`, `blog/`, `lessons/`, `assets/`, `support-guides.js`, `grade-curriculum.js`, `robots.txt`, `sitemap.xml`)과 생성 스크립트(`*.ps1`, `*.py`, `david-esl-homepage*.html`)는 참고용으로 `legacy/` 에 원래 폴더 구조 그대로 보관합니다. 빌드나 배포에는 포함되지 않으며, 스크립트는 예전 파일 구조 기준이라 새 구조에서는 동작하지 않습니다.
