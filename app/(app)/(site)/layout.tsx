import type { ReactNode } from 'react';
import '@/styles/site.css';

// Homepage, menu pages and lessons. Every rule in styles/site.css is scoped to .page-site.
export default function MainLayout({ children }: { children: ReactNode }) {
  return <div className="page-site">{children}</div>;
}
