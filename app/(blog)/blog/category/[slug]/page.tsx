import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogNav } from '@/components/blog/blog-nav';
import { PostList } from '@/components/blog/post-list';
import { categoryPath, getCategory, getPublishedPosts } from '@/lib/blog';

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
  const posts = await getPublishedPosts({ categoryId: category.id });
  return (
    <main className="wrap">
      <div className="eyebrow">
        <a href="/blog/">ReadyKorea Blog</a> · Category
      </div>
      <h1>{category.name}</h1>
      <p className="lead">{category.description || `Posts filed under ${category.name}.`}</p>
      <BlogNav current={category.slug} />
      <PostList posts={posts} empty="No posts in this category yet." />
    </main>
  );
}
