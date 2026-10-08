import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { baseMetadata } from '@/lib/metadata';
import '@/styles/site.css';
import '@/styles/layout.css';

// Homepage + lesson pages share the main site stylesheet. Apply and blog pages have their
// own root layouts so their (conflicting) global styles never load together with this one.
export const metadata: Metadata = baseMetadata;

export default function MainLayout({ children }: { children: ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}
