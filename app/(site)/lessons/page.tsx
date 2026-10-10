import type { Metadata } from 'next';
import { SectionPage } from '@/components/sections/section-page';
import { lessonsPath, totalLessons } from '@/lib/lessons';

export const metadata: Metadata = {
  title: `${totalLessons} Free ESL Lesson Plans for Korea (K1–G6) | ReadyKorea`,
  description: `${totalLessons} complete, free ESL lesson plans for teaching English in Korea, from Kindergarten K1 to Grade 6. Ready to teach, aligned to Cambridge YLE.`,
  alternates: { canonical: lessonsPath() },
  openGraph: { title: `${totalLessons} Free ESL Lesson Plans for Korea | ReadyKorea`, url: lessonsPath() },
};

// The curriculum library: a card per level, each opening that level's lesson list (/lessons/<level>/).
export default function LessonsHubPage() {
  return <SectionPage id="lessons" src="sections/lessons-library.html" />;
}
