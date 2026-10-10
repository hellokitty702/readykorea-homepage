import type { Metadata } from 'next';
import { SectionPage } from '@/components/sections/section-page';
import { SECTION_PAGES, pageMetadata } from '@/lib/site-pages';

export const metadata: Metadata = pageMetadata(SECTION_PAGES['why-korea-survival'], '/why-korea/survival/');

export default function WhyKoreaSurvivalPage() {
  return <SectionPage id="why-korea" src="pages/why-korea/survival.html" />;
}
