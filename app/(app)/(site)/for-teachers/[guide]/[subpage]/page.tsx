import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuideSubpage } from '@/components/sections/guide-subpage';
import { SectionPage } from '@/components/sections/section-page';
import { FOR_TEACHERS_GUIDES, GUIDE_SUBPAGES, pageMetadata } from '@/lib/site-pages';

type Props = { params: Promise<{ guide: string; subpage: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.entries(GUIDE_SUBPAGES).flatMap(([guide, { entries }]) =>
    entries.filter(({ slug }) => slug).map(({ slug }) => ({ guide, subpage: slug })),
  );
}

function find(guideSlug: string, subpage: string) {
  const guide = FOR_TEACHERS_GUIDES.find(({ slug }) => slug === guideSlug);
  const entry = guide && subpage && GUIDE_SUBPAGES[guide.slug]?.entries.find(({ slug }) => slug === subpage);
  return guide && entry ? { guide, entry } : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { guide: guideSlug, subpage } = await params;
  const found = find(guideSlug, subpage);
  if (!found) return {};
  return pageMetadata(
    { title: `${found.entry.title} · ${found.guide.title} | ReadyKorea`, description: found.guide.description },
    `/for-teachers/${found.guide.slug}/${subpage}/`,
  );
}

export default async function GuideSubpagePage({ params }: Props) {
  const { guide: guideSlug, subpage } = await params;
  const found = find(guideSlug, subpage);
  if (!found) notFound();
  return (
    <SectionPage
      id="for-teachers"
      src={[<GuideSubpage key="guide" guide={found.guide.slug} slug={found.entry.slug} />]}
    />
  );
}
