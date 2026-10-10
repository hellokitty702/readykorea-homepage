# ReadyKorea — 프로젝트 안내 (Next.js + Bun)

정적 HTML 사이트를 **Next.js (App Router)** 기반으로 옮겼습니다. **Vercel** 에 배포하며, 대부분의 페이지는 미리 만들어지고 관리자에서 공고나 블로그 글을 저장하면 해당 페이지가 다시 만들어집니다. URL은 기존 사이트(www.readykoreaesl.com)와 동일합니다.

---

## 명령어

```bash
bun install        # 의존성 설치
bun run dev        # 개발 서버 (http://localhost:3000)
bun run build      # 프로덕션 빌드
bun run start      # 빌드 결과 로컬 실행 (http://localhost:3000)
bun run typecheck  # 타입 검사

bun run db:migrate     # DB 테이블 생성/업데이트 (drizzle/ 의 마이그레이션 적용)
bun run db:seed        # 기존 Job Board 공고 2개 + 블로그 글 17개와 카테고리 추가 (이미 있으면 건너뜀)
bun run admin:create admin@example.com "이름"   # 관리자 계정 생성 (비밀번호는 한 번만 출력)
bun run db:generate    # lib/db/schema.ts 수정 후 새 마이그레이션 파일 생성
bun run db:studio      # DB 데이터 보기 (Drizzle Studio)
```

### 데이터베이스 (PostgreSQL + Drizzle)

1. `.env.example` 을 `.env.local` 로 복사하고 `DATABASE_URL` 을 입력합니다.
2. `bun run db:migrate` → `bun run db:seed` → `bun run admin:create …`
3. Vercel: 프로젝트 환경 변수에 `DATABASE_URL` 을 추가합니다 (Neon / Supabase / Vercel Postgres 등). 홈페이지는 빌드할 때 공고와 블로그 글을 읽으므로 **빌드 전에 DB가 있어야 합니다.** 배포 전에 운영 DB에 `bun run db:migrate` 를 실행하세요.

### 이미지 업로드 (미디어)

관리자에서 올린 이미지는 `media` 테이블에 기록되고, 파일은 저장소에 보관됩니다 (`lib/storage.ts`).

- **로컬 개발**: 따로 설정할 것이 없습니다. 파일은 `./storage/` (git 제외)에 저장되고 `/uploads/…` 주소로 보입니다 (`app/uploads/[...key]/route.ts`).
- **운영 (Vercel)**: Cloudflare R2 를 사용합니다. R2 버킷을 만들고 공개 주소(커스텀 도메인 또는 r2.dev)를 연결한 뒤, 해당 버킷에 Object Read & Write 권한이 있는 API 토큰을 만듭니다. Vercel 환경 변수에 `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL` 을 넣으면 R2 에 저장됩니다 (`.env.example` 참고). `STORAGE_DRIVER=local|r2` 로 직접 고를 수도 있습니다.
- 한 파일은 최대 4 MB 입니다 (Vercel 요청 크기 제한 4.5 MB 때문). 큰 사진은 업로드 전에 브라우저에서 긴 변 2400px 로 줄여서 올립니다. JPEG, PNG, WebP, GIF, AVIF 만 허용합니다 (SVG 제외).
- 기존 글의 이미지(`public/images/`)는 그대로 정적 파일로 제공됩니다.

사이트 주소: 코드 안의 링크는 모두 상대 주소(`/blog/…/`)입니다. 절대 주소가 꼭 필요한 곳(canonical·OG 태그, `sitemap.xml`, `robots.txt`, JSON-LD)만 `lib/site.ts` 의 주소를 씁니다. 이 주소는 코드에 고정되어 있지 않고 `SITE_URL` 환경 변수 → Vercel 운영 도메인(가장 짧은 커스텀 도메인) → 로컬 `http://localhost:3000` 순서로 정해집니다. `www.` 로 들어온 요청은 `next.config.ts` 에서 `www` 없는 주소로 308 리다이렉트합니다 (경로·쿼리 유지). Vercel → Settings → Domains 에는 두 도메인을 모두 연결하고 `readykoreaesl.com` 을 기본으로 두세요. 확실히 하려면 Vercel 환경 변수에 `SITE_URL=https://readykoreaesl.com` 을 넣습니다.

배포: Vercel 이 Next.js 프로젝트로 자동 인식합니다 (`bun.lock` 이 있어서 `bun install` / `bun run build` 사용). 별도 설정은 필요 없습니다.

예전 주소 호환: `/apply` → `/apply/` 처럼 끝에 `/` 를 붙여 리다이렉트합니다 (`next.config.ts`). `.html` 로 끝나는 주소는 `.html` 을 뺀 주소로 리다이렉트합니다 (`/index.html` → `/`, `/blog/글.html` → `/blog/글/`).

---

## 페이지 / URL

| URL | 파일 |
|-----|------|
| `/` 메인 홈페이지 | `app/(site)/page.tsx` |
| `/lessons/` 전체 레슨 | `app/(site)/lessons/page.tsx` |
| `/lessons/k1/` 학년별 목록 | `app/(site)/lessons/[grade]/page.tsx` |
| `/lessons/k1/greetings-hello-routine/` 개별 레슨 | `app/(site)/lessons/[grade]/[slug]/page.tsx` |
| `/apply/` 지원하기 | `app/(apply)/apply/page.tsx` |
| `/jobs/kindergarten-lead-teacher-k2-k3/` 공고 상세 | `app/(site)/jobs/[slug]/page.tsx` (`/jobs/` 는 `/#jobs` 로 이동) |
| `/blog/` 블로그 | `app/(blog)/blog/page.tsx` |
| `/blog/category/visa-legal/`, `/blog/tag/…/` 카테고리 / 태그 | `app/(blog)/blog/category/[slug]/page.tsx`, `app/(blog)/blog/tag/[slug]/page.tsx` |
| `/blog/hagwon-interview-success-guide/` 블로그 글 | `app/(blog-post)/blog/[slug]/page.tsx` |
| `/uploads/…` 업로드한 이미지 (로컬 개발 전용) | `app/uploads/[...key]/route.ts` |
| `/admin/` 관리자 (대시보드, 공고, 지원서, 블로그, 미디어, 사용자) | `app/(admin)/admin/` (로그인: `/admin/login/`) |
| `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts` (요청할 때마다 DB 의 공고·블로그와 레슨 목록으로 생성), `app/robots.ts` |

`(site)`, `(apply)`, `(blog)`, `(blog-post)`, `(admin)` 은 각각 별도의 루트 레이아웃입니다. 페이지마다 전역 CSS가 서로 달라서, 섞이지 않도록 나눠 두었습니다. 공개 페이지 네 레이아웃은 `components/layout/site-layout.tsx` 를 사용하므로 **모든 페이지에 같은 헤더와 푸터**가 나옵니다. 관리자 화면은 자체 레이아웃과 Tailwind 진입 파일 `styles/admin.css` 를 씁니다.

---

## 콘텐츠 수정하기

| 수정할 내용 | 위치 |
|-------------|------|
| 메인 홈페이지 각 화면 (홈, AI Lab, Forum, K1~G6 등) | `content/home/levels/*.html` |
| 지역 가이드 (서울, 부산 …) | `content/home/regions/*.html` |
| 상단 헤더 / 메뉴 (모든 페이지 공통) | `components/layout/site-header.tsx` (메뉴 항목은 파일 위쪽 목록) |
| 하단 푸터 (모든 페이지 공통) | `components/layout/site-footer.tsx` |
| 메인 화면 동작 (메뉴 이동, EN/한글 전환, 모달, 계산기 등) | `public/js/home.js` |
| Support Center 가이드 데이터 / 학년별 커리큘럼 카드 | `public/js/support-guides.js`, `public/js/grade-curriculum.js` |
| Job Board 공고 | 관리자 → Jobs (DB `jobs` 테이블). 공개/마감 시 홈페이지가 자동으로 갱신됩니다 |
| 지원서 양식 항목 | `lib/apply-options.ts`, `components/apply/apply-form.tsx`, `lib/actions/apply.ts` |
| 지원서 진행 단계 (New → Reviewing → Interview → Offered → Hired / Rejected / Withdrawn) | `lib/application-flow.ts` |
| DB 테이블 | `lib/db/schema.ts` (수정 후 `bun run db:generate`) |
| 레슨 목록 (학년, 순서, 제목, 설명) | `content/lessons/manifest.json` |
| 레슨 본문 | `content/lessons/{학년}/{slug}.html` |
| 블로그 글, 카테고리, 태그 | 관리자 → Blog (DB `posts`, `categories`, `tags`). 저장하면 블로그 목록, 글, 카테고리/태그 페이지, 메인 "Latest Posts" 가 갱신됩니다 |
| 블로그 본문에 쓸 수 있는 박스/클래스 | `lib/post-markup.ts` (스타일: `styles/blog-post.css`, 저장 시 정리: `lib/blog-html.ts`) |
| 이미지 | 관리자 → Media, 또는 글 편집기의 이미지 버튼 / 끌어다 놓기 |
| 스타일 | `styles/layout.css` (헤더 + 푸터, 모든 페이지), `styles/site.css` (홈 + 레슨), `styles/apply.css`, `styles/blog.css`, `styles/blog-post.css`, `styles/admin.css` (관리자 — Tailwind 전용, 공통 클래스는 `components/admin/styles.ts`) |
| Tailwind CSS | `styles/tailwind.css` — 공개 페이지용. 기존 디자인 보호를 위해 Preflight(리셋)는 끄고, 관리자 파일을 제외한 `app/` 와 `components/` 만 스캔합니다. 공개 페이지에서는 기존 CSS 가 우선합니다. 관리자 화면은 전부 Tailwind 로 작성되어 있으며 `styles/admin.css` (Preflight 포함) 를 따로 씁니다 |

### 레슨 추가

1. `content/lessons/{학년}/{새-slug}.html` 에 본문 작성
2. `content/lessons/manifest.json` 해당 학년 `lessons` 배열에 `{ "slug", "title", "description" }` 추가 (배열 순서 = 레슨 순서)
3. 페이지 제목/메타태그, 이전·다음 링크, 학년 목록, sitemap 은 자동으로 만들어집니다.

### 블로그 글 추가

관리자 → Blog → **Write a post**. 제목, 본문(편집기), 요약, 카테고리, 태그, 주소(비워 두면 제목으로 생성), YouTube 영상, 검색엔진용 제목/설명을 입력합니다. **Published** 로 저장해야 사이트에 나옵니다.

- 편집기의 **Box** 메뉴로 선택한 문단을 Highlight / Warning / Note 등의 박스에 넣을 수 있고, 태그 아이콘은 박스 위쪽의 작은 제목(label)을 만듭니다. 표는 표 버튼으로 추가하고, 표 안에 있을 때 행/열 추가·삭제 버튼이 나옵니다.
- 기존 사이트에서 가져온 글 17개(`scripts/seed-posts.json`)도 같은 편집기로 수정할 수 있으며, 박스·표·라벨이 그대로 유지됩니다.
- 이미지는 이미지 버튼(업로드 / 미디어 라이브러리에서 선택 / 주소 입력)이나 파일을 본문에 끌어다 놓거나 붙여 넣어 추가합니다. 업로드한 이미지는 미디어 라이브러리에 남습니다.

---

## 관리자 / 지원서

- **로그인**: `/admin/login/` — `admin` 역할만 로그인할 수 있습니다 (`user` 역할은 불가). 세션은 DB(`sessions`)에 저장되고 7일간 유지됩니다.
- **지원서**: `/apply/` 양식(기존 Google Form 과 같은 질문)과 Job Board 의 "Apply Now" 버튼이 DB(`applications`)에 저장합니다. 관리자 → Applications 에서 단계를 옮기고 메모를 남기면 모두 타임라인(`application_events`)에 기록됩니다.
- **공고**: 관리자 → Jobs 에서 작성/수정/공개/마감합니다. 공개(Published)된 공고만 홈페이지 Job Board, 공고 상세 페이지(`/jobs/주소/`), 지원서 양식에 나옵니다. 지원서가 있는 공고는 삭제할 수 없고 마감만 가능합니다. 공고 주소는 한 번 정하면 바꾸지 않는 것이 좋습니다 (공유된 링크가 깨집니다).
- **블로그**: 관리자 → Blog 에서 글을 쓰고, **Categories** 에서 카테고리를 관리합니다. 글마다 카테고리는 하나, 태그는 최대 12개입니다. 태그는 입력하면 만들어지고, 쓰는 글이 없어지면 자동으로 지워집니다.
- **미디어**: 관리자 → Media 에서 이미지를 올리고, 주소 복사, 대체 텍스트(alt) 수정, 삭제를 합니다. 글에서 사용 중인 이미지는 어느 글에서 쓰는지 표시되고, 그 글에서 빼기 전에는 삭제할 수 없습니다.
- 공고 상세의 한국어 입력은 선택입니다. 현재 사이트가 한국어 모드일 때는 Job Board 자체가 숨겨집니다 (기존 동작).
- 무료 자료 팝업, AI Resume 버튼, 푸터 링크는 아직 기존 Google Form 으로 연결됩니다.

## 참고

- 헤더 메뉴는 홈 화면의 각 섹션(`data-nav`)을 가리킵니다. 홈에서는 `public/js/home.js` 가 화면을 바로 전환하고, 다른 페이지에서는 `components/layout/header-nav.tsx` 가 `/#섹션` 주소로 이동시킵니다. EN/한글 선택은 모든 페이지에서 같이 유지됩니다.
- 메인 홈페이지는 기존과 같은 한 페이지 앱입니다. HTML은 서버에서 미리 렌더링되고, `public/js/home.js` 가 하이드레이션 후 로드되어 기존과 똑같이 동작합니다.
- 예전 정적 사이트 파일(`index.html`, `apply/`, `blog/`, `lessons/`, `assets/`, `support-guides.js`, `grade-curriculum.js`, `robots.txt`, `sitemap.xml`)과 생성 스크립트(`*.ps1`, `*.py`, `david-esl-homepage*.html`)는 참고용으로 `legacy/` 에 원래 폴더 구조 그대로 보관합니다. 빌드나 배포에는 포함되지 않으며, 스크립트는 예전 파일 구조 기준이라 새 구조에서는 동작하지 않습니다.
