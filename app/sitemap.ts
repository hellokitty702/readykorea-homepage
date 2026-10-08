import type { MetadataRoute } from 'next';
import { gradePath, grades, lessonPath, lessonsPath } from '@/lib/lessons';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE_URL}${path}`;
  return [
    { url: url('/'), changeFrequency: 'weekly', priority: 1.0 },
    { url: url('/apply/'), changeFrequency: 'monthly', priority: 0.9 },
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
