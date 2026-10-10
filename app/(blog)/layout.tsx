import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { baseMetadata } from '@/lib/metadata';
import '@/styles/blog.css';
import '@/styles/layout.css';
import '@/styles/tailwind.css';

export const metadata: Metadata = baseMetadata;

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}
