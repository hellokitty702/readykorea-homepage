import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPost, getPostBody, postPath, posts } from '@/lib/blog';
import { totalLessons } from '@/lib/lessons';

// `post` is the legacy file name, e.g. "first-week-teaching-in-korea.html".
type Props = { params: Promise<{ post: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ post: `${post.slug}.html` }));
}

const findPost = (param: string) => getPost(decodeURIComponent(param).replace(/\.html$/, ''));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = findPost((await params).post);
  if (!post) return {};
  return {
    title: post.seo.title,
    description: post.seo.description,
    alternates: { canonical: postPath(post.slug) },
    openGraph: { type: 'article', title: post.seo.ogTitle, description: post.seo.ogDescription, url: postPath(post.slug) },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = findPost((await params).post);
  if (!post) notFound();

  return (
    <article className="wrap">
      <div className="eyebrow">ReadyKorea Blog</div>
      <h1>{post.title}</h1>
      <div className="meta">{[post.date, ...post.tags].join(' · ')}</div>

      {post.youtube && (
        <div className="video-embed" aria-label="Video">
          <div className="video-embed__frame">
            <iframe
              src={`https://www.youtube.com/embed/${post.youtube.id}`}
              title={post.youtube.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      )}

      <div className="article" dangerouslySetInnerHTML={{ __html: getPostBody(post.slug) }} />

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

      <div className="footer-note">
        <span>ReadyKorea Blog</span>
        <a href="/blog/">All posts</a>
      </div>
    </article>
  );
}
