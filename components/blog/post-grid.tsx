import Link from 'next/link';
import { fmtPostDate, postPath, type FeaturedPost, type PostListItem } from '@/lib/blog';

/** Card grid of the blog index, category and tag pages: each card links to its post. */
export function PostGrid({ posts, empty }: { posts: PostListItem[]; empty: string }) {
  if (!posts.length) return <p className="post-empty">{empty}</p>;
  return (
    <div className="post-grid">
      {posts.map((post) => (
        <Link key={post.id} className="post-card" href={postPath(post.slug)}>
          {post.category && <span className="cat-chip">{post.category.name}</span>}
          <div className="post-meta">{fmtPostDate(post.publishedAt)}</div>
          <h3>{post.title}</h3>
          <p>{post.summary}</p>
          <span className="read">Read article →</span>
        </Link>
      ))}
    </div>
  );
}

/** The big card above the grid. */
export function FeaturedPostCard({ post }: { post: FeaturedPost }) {
  return (
    <Link className="featured" href={postPath(post.slug)}>
      <span className="featured-badge">Featured{post.category && ` · ${post.category.name}`}</span>
      <div className="post-meta">{fmtPostDate(post.publishedAt)}</div>
      <h2>{post.title}</h2>
      {post.summary && <p>{post.summary}</p>}
      <span className="read">Read featured guide →</span>
    </Link>
  );
}
