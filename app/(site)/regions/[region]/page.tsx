import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SectionPage } from '@/components/sections/section-page';
import { REGIONS, pageMetadata } from '@/lib/site-pages';

type Props = { params: Promise<{ region: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return REGIONS.map(({ slug }) => ({ region: slug }));
}

const findRegion = (slug: string) => REGIONS.find((region) => region.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = findRegion((await params).region);
  if (!region) return {};
  return pageMetadata(
    {
      title: `Teaching English in ${region.name} · Region Guide | ReadyKorea`,
      description: `${region.name} for English teachers: neighbourhoods, academies, cost of living and jobs.`,
    },
    `/regions/${region.slug}/`,
  );
}

export default async function RegionPage({ params }: Props) {
  const region = findRegion((await params).region);
  if (!region) notFound();
  return (
    <SectionPage
      id={`region-${region.slug}`}
      className="region-detail"
      region={region.slug}
      src={`pages/regions/${region.slug}.html`}
    />
  );
}
