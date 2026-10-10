import type { ReactNode } from 'react';
import '@/styles/blog-post.css';

// Blog posts. Every rule in styles/blog-post.css is scoped to .page-blog-post.
export default function BlogPostLayout({ children }: { children: ReactNode }) {
  return <div className="page-blog-post">{children}</div>;
}
