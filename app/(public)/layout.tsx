import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { baseMetadata } from '@/lib/metadata';
import '@/styles/layout.css';
import '@/styles/tailwind.css';

// Root layout of the public site (the admin panel has its own). Navigating between any two public
// pages stays client-side. Each route group's layout below loads that group's page stylesheet,
// scoped to its `.page-*` wrapper, so the stylesheets never affect each other's pages.
export const metadata: Metadata = baseMetadata;

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}
