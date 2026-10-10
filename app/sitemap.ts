import type { MetadataRoute } from 'next';
import { categoryPath, getBlogCategories, getPublishedPosts, postPath } from '@/lib/blog';
import { getPublishedJobs } from '@/lib/job-board';
import { jobPath } from '@/lib/job-fields';
import { gradePath, grades, lessonPath, lessonsPath } from '@/lib/lessons';
import { absoluteUrl } from '@/lib/site';
import { FOR_TEACHERS_GUIDES, GUIDE_SUBPAGES, REGIONS } from '@/lib/site-pages';

// Built on every request, so jobs and posts appear as soon as they are published.
export const dynamic = 'force-dynamic';

type Entry = MetadataRoute.Sitemap[number];
// Sitemaps must list absolute URLs (sitemaps.org protocol).
const url = absoluteUrl;

async function jobEntries(): Promise<Entry[]> {
  return (await getPublishedJobs()).map((job) => ({
    url: url(jobPath(job)),
    lastModified: job.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
}

async function blogEntries(): Promise<Entry[]> {
  const [posts, categories] = await Promise.all([getPublishedPosts(), getBlogCategories()]);
  return [
    { url: url('/blog/'), lastModified: posts[0]?.updatedAt, changeFrequency: 'weekly', priority: 0.8 },
    ...posts.map((post) => ({
      url: url(postPath(post.slug)),
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...categories.map((category) => ({
      url: url(categoryPath(category.slug)),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ];
}

// Lessons still come from content files (lib/lessons.ts).
async function lessonEntries(): Promise<Entry[]> {
  return [
    { url: url(lessonsPath()), changeFrequency: 'weekly', priority: 0.9 },
    ...grades.map((grade) => ({ url: url(gradePath(grade.id)), changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...grades.flatMap((grade) =>
      grade.lessons.map((lesson) => ({
        url: url(lessonPath(grade.id, lesson.slug)),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
    ),
  ];
}

// Guides and info pages (lib/site-pages.ts), stored in content/pages/.
function pageEntries(): Entry[] {
  const paths = [
    '/why-korea/',
    '/why-korea/tools/',
    '/why-korea/survival/',
    '/regions/',
    ...REGIONS.map(({ slug }) => `/regions/${slug}/`),
    '/for-teachers/',
    ...FOR_TEACHERS_GUIDES.map(({ slug }) => `/for-teachers/${slug}/`),
    ...Object.entries(GUIDE_SUBPAGES).flatMap(([guide, { entries }]) =>
      entries.filter(({ slug }) => slug).map(({ slug }) => `/for-teachers/${guide}/${slug}/`),
    ),
    '/why-readykorea/',
    '/school-posting/',
    '/curriculum-consulting/',
    '/ai-lab/',
    '/forum/',
    '/tefl/',
    '/support/',
  ];
  return paths.map((path) => ({ url: url(path), changeFrequency: 'monthly', priority: 0.7 }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sections = await Promise.all([jobEntries(), blogEntries(), lessonEntries()]);
  return [
    { url: url('/'), changeFrequency: 'weekly', priority: 1.0 },
    { url: url('/apply/'), changeFrequency: 'monthly', priority: 0.9 },
    { url: url('/jobs/'), changeFrequency: 'daily', priority: 0.9 },
    ...sections.flat(),
    ...pageEntries(),
  ];
}
