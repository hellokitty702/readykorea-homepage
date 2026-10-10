import { categoryPath, fmtPostDate, postPath, tagPath, type PostListItem } from '@/lib/blog';

/** Post cards for the blog index, category and tag pages. */
export function PostList({ posts, empty }: { posts: PostListItem[]; empty: string }) {
  if (!posts.length) return <p className="post-empty">{empty}</p>;
  return (
    <div className="post-list">
      {posts.map((post) => (
        <article key={post.id} className="post-card">
          <div className="post-meta">
            {fmtPostDate(post.publishedAt)}
            {post.category && (
              <>
                {' · '}
                <a className="post-category" href={categoryPath(post.category.slug)}>
                  {post.category.name}
                </a>
              </>
            )}
          </div>
          <h2>
            <a href={postPath(post.slug)}>{post.title}</a>
          </h2>
          {post.summary && <p>{post.summary}</p>}
          <div className="post-foot">
            <a className="read" href={postPath(post.slug)}>
              Read article →
            </a>
            <TagLinks tags={post.tags} />
          </div>
        </article>
      ))}
    </div>
  );
}

export function TagLinks({ tags }: { tags: { slug: string; name: string }[] }) {
  if (!tags.length) return null;
  return (
    <ul className="post-tags" aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag.slug}>
          <a href={tagPath(tag.slug)}>#{tag.name}</a>
        </li>
      ))}
    </ul>
  );
}
