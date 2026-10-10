import type { Metadata } from 'next';
import { PlatformPerformance } from '@/components/sections/platform-performance';
import { SectionPage } from '@/components/sections/section-page';
import { SECTION_PAGES, pageMetadata } from '@/lib/site-pages';

export const metadata: Metadata = pageMetadata(SECTION_PAGES['why-readykorea'], '/why-readykorea/');

export default function WhyReadyKoreaPage() {
  return (
    <SectionPage id="why-readykorea" src={['sections/why-readykorea.html', 'sections/real-teachers.html']}>
      <PlatformPerformance />
    </SectionPage>
  );
}
