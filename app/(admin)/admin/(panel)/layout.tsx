import Link from 'next/link';
import type { ReactNode } from 'react';
import { AdminNav } from '@/components/admin/admin-nav';
import { Brand } from '@/components/admin/brand';
import { logout } from '@/lib/actions/auth';
import { requireAdmin } from '@/lib/auth/dal';

const sidebarLink =
  'block w-full cursor-pointer rounded-lg px-2.5 py-1.5 text-left text-slate-300 hover:bg-white/5 hover:text-white hover:no-underline';

// Pages check access themselves too (layouts don't re-run on every navigation).
export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return (
    // The gradient keeps the sidebar column dark below the sticky sidebar on long pages.
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[232px_1fr] lg:bg-[linear-gradient(to_right,var(--color-slate-900)_232px,transparent_232px)]">
      <aside className="flex flex-row flex-wrap items-center gap-2.5 bg-slate-900 px-4 py-3 text-slate-200 lg:sticky lg:top-0 lg:h-screen lg:flex-col lg:flex-nowrap lg:items-stretch lg:gap-4.5 lg:px-3.5 lg:py-5">
        <Link className="px-2 text-base text-white hover:no-underline" href="/admin/">
          <Brand />
        </Link>
        <AdminNav />
        <div className="flex items-center gap-1 lg:mt-auto lg:grid lg:border-t lg:border-white/10 lg:pt-3.5">
          <div className="hidden px-2.5 pb-2 lg:grid">
            <strong className="text-label text-white">{user.name}</strong>
            <span className="truncate text-xs text-slate-400">{user.email}</span>
          </div>
          <a className={sidebarLink} href="/" target="_blank" rel="noopener">
            View site ↗
          </a>
          <form action={logout}>
            <button className={sidebarLink}>Sign out</button>
          </form>
        </div>
      </aside>
      <main className="grid w-full max-w-[1240px] content-start gap-4.5 px-4 pt-5 pb-12 lg:px-8 lg:pt-7 lg:pb-16">
        {children}
      </main>
    </div>
  );
}
