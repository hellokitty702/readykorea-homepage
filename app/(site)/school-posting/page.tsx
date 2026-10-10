import type { Metadata } from 'next';
import { SectionPage } from '@/components/sections/section-page';
import { SECTION_PAGES, pageMetadata } from '@/lib/site-pages';

export const metadata: Metadata = pageMetadata(SECTION_PAGES['school-posting'], '/school-posting/');

export default function SchoolPostingPage() {
  return <SectionPage id="school-posting" src="sections/school-posting.html" />;
}
