'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { logout } from '@/lib/actions/auth';
import { Brand } from './brand';
import { cx } from './styles';

const LINKS = [
  { href: '/admin/', label: 'Dashboard', match: (p: string) => p === '/admin/' || p === '/admin' },
  { href: '/admin/jobs/', label: 'Jobs', match: (p: string) => p.startsWith('/admin/jobs') },
  { href: '/admin/applications/', label: 'Applications', match: (p: string) => p.startsWith('/admin/applications') },
  { href: '/admin/blog/', label: 'Blog', match: (p: string) => p.startsWith('/admin/blog') },
  { href: '/admin/media/', label: 'Media', match: (p: string) => p.startsWith('/admin/media') },
  { href: '/admin/account/', label: 'Account', match: (p: string) => p.startsWith('/admin/account') },
];

const sidebarLink =
  'block w-full cursor-pointer rounded-lg px-2.5 py-1.5 text-left text-slate-300 hover:bg-white/5 hover:text-white hover:no-underline';

/**
 * Below `lg`: a bar at the top of the page whose menu button opens the links underneath it.
 * From `lg`: the full-height sidebar, always open.
 */
export function AdminSidebar({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside
      className="sticky top-0 z-30 bg-slate-900 text-slate-200 lg:flex lg:h-screen lg:flex-col lg:gap-4.5 lg:px-3.5 lg:py-5"
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false);
      }}
    >
      <div className="flex h-14 items-center justify-between gap-3 px-4 lg:h-auto lg:px-2">
        <Link className="text-base text-white hover:no-underline" href="/admin/" onClick={() => setOpen(false)}>
          <Brand />
        </Link>
        <button
          type="button"
          className="-mr-2 grid size-10 cursor-pointer place-items-center rounded-lg text-slate-300 hover:bg-white/5 hover:text-white lg:hidden"
          aria-expanded={open}
          aria-controls="admin-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      <div
        id="admin-menu"
        className={cx(
          open ? 'grid' : 'hidden',
          'max-h-[calc(100dvh-3.5rem)] content-start gap-4 overflow-y-auto border-t border-white/10 px-3 pt-3 pb-4',
          'lg:flex lg:max-h-none lg:flex-1 lg:flex-col lg:border-0 lg:p-0',
        )}
        // Following a link closes the menu (the layout stays mounted between pages).
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('a')) setOpen(false);
        }}
      >
        <nav className="grid gap-0.5" aria-label="Admin">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-2.5 py-2 font-medium text-slate-300 hover:bg-white/5 hover:text-white hover:no-underline aria-[current=page]:bg-amber-400/15 aria-[current=page]:text-amber-400"
              aria-current={link.match(pathname) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="grid gap-1 border-t border-white/10 pt-3.5 lg:mt-auto">
          <div className="grid px-2.5 pb-2">
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
      </div>
    </aside>
  );
}
