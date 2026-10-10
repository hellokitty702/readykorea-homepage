import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogTabs } from '@/components/blog/blog-tabs';
import { FeaturedPostCard, PostGrid } from '@/components/blog/post-grid';
import { categoryPath, getCategory, getFeaturedPost, getPublishedPosts } from '@/lib/blog';

type Props = { params: Promise<{ slug: string }> };

// Rendered on first visit, then cached until a post or category changes (lib/actions/posts.ts).
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory((await params).slug);
  if (!category) return {};
  return {
    title: `${category.name} · ReadyKorea Blog`,
    description: category.description || `ReadyKorea blog posts about ${category.name.toLowerCase()}.`,
    alternates: { canonical: categoryPath(category.slug) },
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = await getCategory((await params).slug);
  if (!category) notFound();
  const featured = await getFeaturedPost(category.id);
  const posts = await getPublishedPosts({ categoryId: category.id, exceptId: featured?.id });
  return (
    <main className="wrap">
      <div className="eyebrow">
        <Link href="/blog/">ReadyKorea Blog</Link> · Category
      </div>
      <h1>{category.name}</h1>
      <p className="lead">{category.description || `Posts filed under ${category.name}.`}</p>
      {featured && <FeaturedPostCard post={featured} />}
      <BlogTabs current={category.slug} />
      <PostGrid
        posts={posts}
        empty={featured ? 'No other posts in this category yet.' : 'No posts in this category yet.'}
      />
    </main>
  );
}
