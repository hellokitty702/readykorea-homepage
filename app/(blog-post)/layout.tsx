import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { baseMetadata } from '@/lib/metadata';
import '@/styles/blog-post.css';
import '@/styles/layout.css';

export const metadata: Metadata = baseMetadata;

export default function BlogPostLayout({ children }: { children: ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}
