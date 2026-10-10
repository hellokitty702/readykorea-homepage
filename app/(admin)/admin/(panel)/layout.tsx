import type { ReactNode } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { requireAdmin } from '@/lib/auth/dal';

// Pages check access themselves too (layouts don't re-run on every navigation).
export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return (
    // The gradient keeps the sidebar column dark below the sticky sidebar on long pages.
    <div className="grid min-h-screen grid-cols-1 content-start lg:grid-cols-[232px_1fr] lg:content-stretch lg:bg-[linear-gradient(to_right,var(--color-slate-900)_232px,transparent_232px)]">
      <AdminSidebar user={{ name: user.name, email: user.email }} />
      <main className="grid w-full max-w-[1240px] min-w-0 content-start gap-4.5 px-4 pt-5 pb-12 lg:px-8 lg:pt-7 lg:pb-16">
        {children}
      </main>
    </div>
  );
}
