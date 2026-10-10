import type { Metadata } from 'next';
import { BlogNav } from '@/components/blog/blog-nav';
import { PostList } from '@/components/blog/post-list';
import { getPublishedPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog · ReadyKorea ESL Tips for Teachers in Korea',
  description:
    'ReadyKorea blog: practical tips for teaching English in Korea, hagwon life, lesson ideas, and E-2 visa insights for native English teachers.',
  alternates: { canonical: '/blog/' },
};

// Prerendered; saving a post in the admin panel revalidates it (lib/actions/posts.ts).
export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();
  return (
    <main className="wrap">
      <div className="eyebrow">ReadyKorea Blog</div>
      <h1>Tips for teaching English in Korea</h1>
      <p className="lead">
        Practical guides for native English teachers — classroom ideas, hagwon life, and getting ready for your first
        year in Korea.
      </p>
      <BlogNav />
      <PostList posts={posts} empty="No posts yet. Check back soon." />
    </main>
  );
}
