import type { Metadata } from 'next';
import { SectionPage } from '@/components/sections/section-page';
import { SECTION_PAGES, pageMetadata } from '@/lib/site-pages';

export const metadata: Metadata = pageMetadata(SECTION_PAGES['forum'], '/forum/');

export default function ForumPage() {
  return <SectionPage id="forum" src="pages/forum.html" />;
}
