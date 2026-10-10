import type { Metadata } from 'next';
import { SectionPage } from '@/components/sections/section-page';
import { SECTION_PAGES, pageMetadata } from '@/lib/site-pages';

export const metadata: Metadata = pageMetadata(SECTION_PAGES['ai-lab'], '/ai-lab/');

export default function AiLabPage() {
  return <SectionPage id="ailab" src="pages/ai-lab.html" />;
}
