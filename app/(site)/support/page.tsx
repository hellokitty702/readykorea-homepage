import type { Metadata } from 'next';
import { SectionPage } from '@/components/sections/section-page';
import { SECTION_PAGES, pageMetadata } from '@/lib/site-pages';

export const metadata: Metadata = pageMetadata(SECTION_PAGES['support'], '/support/');

export default function SupportPage() {
  return <SectionPage id="support" src="pages/support.html" />;
}
