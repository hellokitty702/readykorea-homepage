import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/login-form';
import { SeoulClock } from '@/components/admin/seoul-clock';
import { getCurrentUser } from '@/lib/auth/dal';

export const metadata: Metadata = { title: 'Sign in' };

// The public site's heading face, for the display type on this page only.
const display = Montserrat({ subsets: ['latin'], weight: ['700', '800'], display: 'swap' });

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const user = await getCurrentUser();
  if (user?.role === 'admin') redirect('/admin/');

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr] bg-white lg:grid-cols-[minmax(0,1fr)_minmax(460px,40%)] lg:grid-rows-none">
      {/* Brand side: a compact bar on phones, a full panel on wide screens. */}
      <aside className="relative flex items-center justify-between gap-4 overflow-hidden bg-slate-950 px-5 py-4 text-white lg:flex-col lg:items-stretch lg:px-12 lg:py-11">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="ReadyKorea home"
            className={`${display.className} rounded text-lg font-extrabold tracking-tight text-white hover:no-underline hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 lg:text-xl`}
          >
            Ready<span className="text-amber-400">Korea</span>
          </Link>
          <p className="hidden items-center gap-2 text-label text-slate-400 lg:flex">
            <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            Seoul <SeoulClock className="text-slate-200 tabular-nums" />
          </p>
        </div>

        <div className="relative z-10 hidden max-w-140 lg:block">
          <p className="mb-5 h-0.5 w-10 bg-amber-400" aria-hidden="true" />
          <h2
            className={`${display.className} text-[40px] leading-[1.08] font-extrabold tracking-[-0.03em] xl:text-5xl`}
          >
            Placing English teachers in Korean classrooms.
          </h2>
          <p className="mt-5 max-w-sm text-md leading-relaxed text-slate-400">
            Job listings, applications, blog posts and media for readykoreaesl.com.
          </p>
        </div>

        <p className="text-label text-slate-400 lg:hidden">
          Seoul <SeoulClock className="text-slate-200 tabular-nums" />
        </p>

        {/* 준비 (jun-bi): "ready". */}
        <span
          className="pointer-events-none absolute right-10 -bottom-16 hidden text-[240px] leading-none font-black tracking-[-0.06em] text-transparent select-none [-webkit-text-stroke:1.5px_rgba(251,191,36,0.28)] lg:block xl:text-[320px]"
          aria-hidden="true"
        >
          준비
        </span>
        <p className="relative z-10 hidden text-xs text-slate-500 lg:block">
          준비 <span className="text-slate-600">·</span> jun-bi <span className="text-slate-600">·</span> ready
        </p>
      </aside>

      <main className="flex flex-col px-5 py-10 sm:px-10 lg:px-14 lg:py-11">
        <div className="mx-auto my-auto w-full max-w-90">
          <p className="text-xs font-semibold tracking-[0.14em] text-amber-700 uppercase">Admin</p>
          <h1 className={`${display.className} mt-2 text-[30px] leading-tight font-extrabold tracking-[-0.025em]`}>
            Sign in
          </h1>
          <p className="mt-2 mb-7 text-slate-500">Staff accounts only. An existing admin can add you under Users.</p>
          <LoginForm
            next={next ?? ''}
            notice={error === 'forbidden' || user ? 'This account does not have admin access.' : ''}
          />
        </div>
        <Link href="/" className="mx-auto mt-10 w-full max-w-90 text-label text-slate-500 hover:text-slate-900">
          ← Back to readykoreaesl.com
        </Link>
      </main>
    </div>
  );
}
