import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/styles/admin.css';

export const metadata: Metadata = {
  title: { default: 'Admin · ReadyKorea', template: '%s · ReadyKorea Admin' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 font-sans text-sm text-slate-900 antialiased">{children}</body>
    </html>
  );
}
