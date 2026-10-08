import { readContent } from './content';

export type BlogPost = {
  slug: string;
  title: string;
  /** Display date, e.g. "Jul 24, 2026". */
  date: string;
  tags: string[];
  /** Summary on the blog index. */
  summary: string;
  /** Shorter teaser on the homepage "Latest Posts" section. */
  teaser: string;
  seo: { title: string; description: string; ogTitle: string; ogDescription: string };
  /** Optional YouTube video shown above the article. */
  youtube?: { id: string; title: string };
};

/** Newest first. */
export const posts: BlogPost[] = [
  {
    slug: 'first-week-teaching-in-korea',
    title: 'Your first week teaching English in Korea',
    date: 'Jul 24, 2026',
    tags: ['Classroom', 'Beginners'],
    summary:
      'What to expect in a Korean kindergarten or hagwon classroom during week one — routines, energy management, and simple lesson moves that work.',
    teaser: 'Routines, energy management, and simple lesson moves for week one in a Korean classroom.',
    seo: {
      title: 'Your First Week Teaching English in Korea | ReadyKorea Blog',
      description:
        'A practical first-week guide for native English teachers in Korean kindergartens and hagwons — routines, classroom energy, and ready-to-use lesson tips.',
      ogTitle: 'Your First Week Teaching English in Korea',
      ogDescription:
        'What to expect in week one of teaching English in Korea — routines, energy, and simple lesson moves that work.',
    },
    youtube: { id: 'ysz5S6PUM-U', title: 'First week teaching English in Korea' },
  },
];

/** Upcoming posts teased on the homepage. */
export const comingSoonPosts = [
  {
    title: 'Hagwon interview tips that actually help',
    teaser: 'What Korean academies look for — and how to answer the questions that come up every season.',
  },
  {
    title: 'Packing list for your first year in Korea',
    teaser: 'What to bring, what to buy locally, and what teachers wish they knew before landing.',
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

/** Article body HTML, stored in `content/blog/{slug}.html`. */
export function getPostBody(slug: string): string {
  return readContent(`blog/${slug}.html`);
}

/** Posts keep the legacy `.html` URLs, e.g. `/blog/first-week-teaching-in-korea.html`. */
export const postPath = (slug: string) => `/blog/${slug}.html`;
