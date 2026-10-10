import type { Metadata } from 'next';
import { SectionPage } from '@/components/sections/section-page';
import { SECTION_PAGES, pageMetadata } from '@/lib/site-pages';

export const metadata: Metadata = pageMetadata(SECTION_PAGES['tefl'], '/tefl/');

export default function TeflPage() {
  return <SectionPage id="tefl" src="pages/tefl.html" />;
}
