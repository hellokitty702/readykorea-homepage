import { fmtPostDate, getPublishedPosts, postPath } from '@/lib/blog';
import '@/styles/latest-posts.css';

/** Upcoming posts, filling the row while there are fewer than three published ones. */
const COMING_SOON = [
  {
    title: 'Hagwon interview tips that actually help',
    teaser: 'What Korean academies look for — and how to answer the questions that come up every season.',
  },
  {
    title: 'Packing list for your first year in Korea',
    teaser: 'What to bring, what to buy locally, and what teachers wish they knew before landing.',
  },
];

export async function LatestPosts() {
  const posts = await getPublishedPosts({ limit: 3 });
  return (
    <section className="latest-posts" id="latest-posts" aria-label="Latest blog posts">
      <div className="wrap">
        <div className="lp-head">
          <div className="lp-eyebrow">Blog</div>
          <h2>Latest Posts</h2>
          <p className="lp-sub">Tips for native English teachers in Korea</p>
        </div>
        <div className="lp-grid">
          {posts.map((post) => (
            <a key={post.id} className="lp-card" href={postPath(post.slug)}>
              <div className="lp-date">{fmtPostDate(post.publishedAt)}</div>
              <h3>{post.title}</h3>
              <p>{post.teaser || post.summary}</p>
              <span className="lp-more">Read article →</span>
            </a>
          ))}
          {COMING_SOON.slice(0, Math.max(0, 3 - posts.length)).map((post) => (
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
