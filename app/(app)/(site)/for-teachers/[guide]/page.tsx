import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuideSubpage } from '@/components/sections/guide-subpage';
import { SectionPage } from '@/components/sections/section-page';
import { FOR_TEACHERS_GUIDES, GUIDE_SUBPAGES, pageMetadata } from '@/lib/site-pages';

type Props = { params: Promise<{ guide: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return FOR_TEACHERS_GUIDES.map(({ slug }) => ({ guide: slug }));
}

const findGuide = (slug: string) => FOR_TEACHERS_GUIDES.find((guide) => guide.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = findGuide((await params).guide);
  if (!guide) return {};
  return pageMetadata(
    { title: `${guide.title} · For Teachers | ReadyKorea`, description: guide.description },
    `/for-teachers/${guide.slug}/`,
  );
}

export default async function GuidePage({ params }: Props) {
  const guide = findGuide((await params).guide);
  if (!guide) notFound();
  // Guides with sub-pages show their first one here; the others are at [guide]/[subpage]/.
  if (GUIDE_SUBPAGES[guide.slug]) {
    return <SectionPage id="for-teachers" src={[<GuideSubpage key="guide" guide={guide.slug} slug="" />]} />;
  }
  return <SectionPage id="for-teachers" src={`pages/for-teachers/${guide.slug}.html`} />;
}
