import type { Metadata } from 'next';
import { SectionPage } from '@/components/sections/section-page';
import { SECTION_PAGES, pageMetadata } from '@/lib/site-pages';

export const metadata: Metadata = pageMetadata(SECTION_PAGES['why-korea-tools'], '/why-korea/tools/');

export default function WhyKoreaToolsPage() {
  return <SectionPage id="why-korea" src="pages/why-korea/tools.html" />;
}
