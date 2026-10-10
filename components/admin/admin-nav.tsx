'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin/', label: 'Dashboard', match: (p: string) => p === '/admin/' || p === '/admin' },
  { href: '/admin/jobs/', label: 'Jobs', match: (p: string) => p.startsWith('/admin/jobs') },
  { href: '/admin/applications/', label: 'Applications', match: (p: string) => p.startsWith('/admin/applications') },
  { href: '/admin/blog/', label: 'Blog', match: (p: string) => p.startsWith('/admin/blog') },
  { href: '/admin/media/', label: 'Media', match: (p: string) => p.startsWith('/admin/media') },
  { href: '/admin/users/', label: 'Users', match: (p: string) => p.startsWith('/admin/users') },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-wrap gap-0.5 lg:grid lg:flex-none" aria-label="Admin">
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
  );
}
