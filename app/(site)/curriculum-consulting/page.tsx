import type { Metadata } from 'next';
import { SectionPage } from '@/components/sections/section-page';
import { SECTION_PAGES, pageMetadata } from '@/lib/site-pages';

export const metadata: Metadata = pageMetadata(SECTION_PAGES['curriculum-consulting'], '/curriculum-consulting/');

export default function CurriculumConsultingPage() {
  return <SectionPage id="curriculum-consulting" src="sections/curriculum-consulting.html" />;
}
