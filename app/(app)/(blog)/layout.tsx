import type { ReactNode } from 'react';
import '@/styles/blog.css';

// Blog index, category and tag pages. Every rule in styles/blog.css is scoped to .page-blog.
export default function BlogLayout({ children }: { children: ReactNode }) {
  return <div className="page-blog">{children}</div>;
}
