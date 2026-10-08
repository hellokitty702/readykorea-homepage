import type { Metadata } from 'next';
import { postPath, posts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog · ReadyKorea ESL Tips for Teachers in Korea',
  description:
    'ReadyKorea blog: practical tips for teaching English in Korea, hagwon life, lesson ideas, and E-2 visa insights for native English teachers.',
  alternates: { canonical: '/blog/' },
};

export default function BlogIndexPage() {
  return (
    <main className="wrap">
      <div className="eyebrow">ReadyKorea Blog</div>
      <h1>Tips for teaching English in Korea</h1>
      <p className="lead">
        Practical guides for native English teachers — classroom ideas, hagwon life, and getting ready for your first
        year in Korea.
      </p>

      <div className="post-list">
        {posts.map((post) => (
          <a key={post.slug} className="post-card" href={postPath(post.slug)}>
            <div className="post-meta">{[post.date, ...post.tags].join(' · ')}</div>
            <h2>{post.title}</h2>
            <p>{post.summary}</p>
            <span className="read">Read article →</span>
          </a>
        ))}
      </div>
    </main>
  );
}
