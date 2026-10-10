import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostList } from '@/components/blog/post-list';
import { getPublishedPosts, getTag, tagPath } from '@/lib/blog';

type Props = { params: Promise<{ slug: string }> };

// Rendered on first visit, then cached until a post changes (lib/actions/posts.ts).
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = await getTag((await params).slug);
  if (!tag) return {};
  return {
    title: `#${tag.name} · ReadyKorea Blog`,
    description: `ReadyKorea blog posts tagged ${tag.name}.`,
    alternates: { canonical: tagPath(tag.slug) },
  };
}

export default async function TagPage({ params }: Props) {
  const tag = await getTag((await params).slug);
  if (!tag) notFound();
  const posts = await getPublishedPosts({ tagId: tag.id });
  return (
    <main className="wrap">
      <div className="eyebrow">
        <a href="/blog/">ReadyKorea Blog</a> · Tag
      </div>
      <h1>#{tag.name}</h1>
      <p className="lead">
        {posts.length} {posts.length === 1 ? 'post' : 'posts'} tagged “{tag.name}”.
      </p>
      <PostList posts={posts} empty="No published posts with this tag yet." />
    </main>
  );
}
