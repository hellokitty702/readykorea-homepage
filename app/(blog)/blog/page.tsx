import type { Metadata } from 'next';
import { BlogTabs } from '@/components/blog/blog-tabs';
import { FeaturedPostCard, PostGrid } from '@/components/blog/post-grid';
import { getFeaturedPost, getPublishedPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog · ReadyKorea ESL Tips for Teachers in Korea',
  description:
    'ReadyKorea blog: practical tips for teaching English in Korea, hagwon life, lesson ideas, and E-2 visa insights for native English teachers.',
  alternates: { canonical: '/blog/' },
};

// The old static blog filtered its tabs with /blog/#<category>; those links now open the category page.
const hashRedirect =
  "(function(){var s=location.hash.slice(1);if(/^[a-z0-9-]+$/.test(s))location.replace('/blog/category/'+s+'/')})()";

// Prerendered; saving a post in the admin panel revalidates it (lib/actions/posts.ts).
export default async function BlogIndexPage() {
  const featured = await getFeaturedPost();
  const posts = await getPublishedPosts({ byCategory: true, exceptId: featured?.id });
  return (
    <main className="wrap">
      <script dangerouslySetInnerHTML={{ __html: hashRedirect }} />
      <div className="eyebrow">ReadyKorea Blog</div>
      <h1>Tips for teaching English in Korea</h1>
      <p className="lead">
        Practical guides for native English teachers — grouped by visa &amp; legal, settling in, career success, and
        life in Korea.
      </p>
      {featured && <FeaturedPostCard post={featured} />}
      <BlogTabs />
      <PostGrid posts={posts} empty="No posts yet. Check back soon." />
    </main>
  );
}
