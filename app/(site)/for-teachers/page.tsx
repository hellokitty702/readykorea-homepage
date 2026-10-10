import type { Metadata } from 'next';
import { SectionPage } from '@/components/sections/section-page';
import { SECTION_PAGES, pageMetadata } from '@/lib/site-pages';

export const metadata: Metadata = pageMetadata(SECTION_PAGES['for-teachers'], '/for-teachers/');

export default function ForTeachersPage() {
  return <SectionPage id="for-teachers" src="pages/for-teachers/index.html" />;
}
