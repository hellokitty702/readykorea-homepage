import type { Metadata } from 'next';
import { SectionPage } from '@/components/sections/section-page';
import { SECTION_PAGES, pageMetadata } from '@/lib/site-pages';

export const metadata: Metadata = pageMetadata(SECTION_PAGES['regions'], '/regions/');

export default function RegionsPage() {
  return <SectionPage id="regions" src="pages/regions/index.html" />;
}
