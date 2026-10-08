import { comingSoonPosts, postPath, posts } from '@/lib/blog';
import '@/styles/latest-posts.css';

export function LatestPosts() {
  return (
    <section className="latest-posts" id="latest-posts" aria-label="Latest blog posts">
      <div className="wrap">
        <div className="lp-head">
          <div className="lp-eyebrow">Blog</div>
          <h2>Latest Posts</h2>
          <p className="lp-sub">Tips for native English teachers in Korea</p>
        </div>
        <div className="lp-grid">
          {posts.slice(0, 3).map((post) => (
            <a key={post.slug} className="lp-card" href={postPath(post.slug)}>
              <div className="lp-date">{post.date}</div>
              <h3>{post.title}</h3>
              <p>{post.teaser}</p>
              <span className="lp-more">Read article →</span>
            </a>
          ))}
          {comingSoonPosts.slice(0, Math.max(0, 3 - posts.length)).map((post) => (
            <div key={post.title} className="lp-card is-soon" aria-disabled="true">
              <div className="lp-date">Coming soon</div>
              <h3>{post.title}</h3>
              <p>{post.teaser}</p>
            </div>
          ))}
        </div>
        <div className="lp-all">
          <a href="/blog/">View all posts →</a>
        </div>
      </div>
    </section>
  );
}
