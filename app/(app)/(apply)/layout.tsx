import type { ReactNode } from 'react';
import '@/styles/apply.css';

// The application form. Every rule in styles/apply.css is scoped to .page-apply.
export default function ApplyLayout({ children }: { children: ReactNode }) {
  return <div className="page-apply">{children}</div>;
}
