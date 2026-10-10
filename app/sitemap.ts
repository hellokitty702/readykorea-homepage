import type { MetadataRoute } from 'next';
import { categoryPath, getBlogCategories, getPublishedPosts, postPath } from '@/lib/blog';
import { getPublishedJobs } from '@/lib/job-board';
import { jobPath } from '@/lib/job-fields';
import { gradePath, grades, lessonPath, lessonsPath } from '@/lib/lessons';
import { absoluteUrl } from '@/lib/site';

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sections = await Promise.all([jobEntries(), blogEntries(), lessonEntries()]);
  return [
    { url: url('/'), changeFrequency: 'weekly', priority: 1.0 },
    { url: url('/apply/'), changeFrequency: 'monthly', priority: 0.9 },
    ...sections.flat(),
  ];
}
