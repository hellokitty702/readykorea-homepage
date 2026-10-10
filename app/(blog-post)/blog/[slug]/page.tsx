import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TagLinks } from '@/components/blog/post-list';
import { categoryPath, fmtPostDate, getPublishedPost, getPublishedPosts, postPath } from '@/lib/blog';
import { totalLessons } from '@/lib/lessons';

type Props = { params: Promise<{ slug: string }> };

// Published posts are prerendered; one published later renders on its first visit. Saving a post
// in the admin panel revalidates these pages (lib/actions/posts.ts).
export async function generateStaticParams() {
  return (await getPublishedPosts()).map((post) => ({ slug: post.slug }));
}

const findPost = (slug: string) => getPublishedPost(decodeURIComponent(slug));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await findPost((await params).slug);
  if (!post) return {};
  const description = post.seoDescription || post.summary;
  return {
    title: post.seoTitle || `${post.title} | ReadyKorea Blog`,
    description,
    alternates: { canonical: postPath(post.slug) },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: postPath(post.slug),
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      section: post.category?.name,
      tags: post.tags.map((t) => t.name),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await findPost((await params).slug);
  if (!post) notFound();

  return (
    <article className="wrap">
      <div className="eyebrow">
        <a href="/blog/">ReadyKorea Blog</a>
        {post.category && (
          <>
            {' · '}
            <a href={categoryPath(post.category.slug)}>{post.category.name}</a>
          </>
        )}
      </div>
      <h1>{post.title}</h1>
      <div className="meta">{fmtPostDate(post.publishedAt)}</div>

      {post.youtubeId && (
        <div className="video-embed" aria-label="Video">
          <div className="video-embed__frame">
            <iframe
              src={`https://www.youtube.com/embed/${encodeURIComponent(post.youtubeId)}`}
              title={post.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Sanitized when saved (lib/blog-html.ts). */}
      <div className="article" dangerouslySetInnerHTML={{ __html: post.body }} />
      <TagLinks tags={post.tags} />

      {/* Posts copied from the old site carry their own call to action. */}
      {!post.body.includes('class="cta-box"') && (
        <div className="cta-box">
          <h2>Need ready-to-teach lesson plans?</h2>
          <p>
            {totalLessons} free ESL lesson plans for Kindergarten K1–K3 and Elementary G1–G6 — built for Korean
            classrooms.
          </p>
          <a className="cta-btn" href="/lessons/">
            Browse free lesson plans →
          </a>
        </div>
      )}

      <div className="footer-note">
        <span>ReadyKorea Blog</span>
        <a href="/blog/">All posts</a>
      </div>
    </article>
  );
}
