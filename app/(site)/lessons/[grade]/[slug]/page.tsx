import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/json-ld';
import { LessonShell } from '@/components/lessons/lesson-shell';
import styles from '@/components/lessons/lessons.module.css';
import { getLesson, getLessonBody, gradePath, grades, lessonPath, lessonsPath, type Lesson } from '@/lib/lessons';
import { SITE_NAME, absoluteUrl } from '@/lib/site';

type Props = { params: Promise<{ grade: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return grades.flatMap((grade) => grade.lessons.map((lesson) => ({ grade: grade.id, slug: lesson.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grade: gradeId, slug } = await params;
  const found = getLesson(gradeId, slug);
  if (!found) return {};
  const { grade, lesson } = found;
  const heading = `${lesson.title} — ${grade.label} ESL Lesson Plan`;
  const path = lessonPath(grade.id, lesson.slug);
  return {
    title: `${heading} | ReadyKorea`,
    description: lesson.description,
    alternates: { canonical: path },
    openGraph: { type: 'article', title: heading, description: lesson.description, url: path, siteName: SITE_NAME },
  };
}

/** Pager labels are clipped to keep the prev/next row on one line. */
const pagerLabel = (lesson: Lesson) => lesson.title.slice(0, 40);

export default async function LessonPage({ params }: Props) {
  const { grade: gradeId, slug } = await params;
  const found = getLesson(gradeId, slug);
  if (!found) notFound();
  const { grade, lesson, prev, next } = found;

  return (
    <LessonShell
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Lessons', href: lessonsPath() },
        { label: grade.label, href: gradePath(grade.id) },
        { label: lesson.title },
      ]}
    >
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: lesson.title,
          description: lesson.description,
          educationalLevel: grade.label,
          url: absoluteUrl(lessonPath(grade.id, lesson.slug)),
          isAccessibleForFree: true,
          provider: { '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/') },
        }}
      />
      <div dangerouslySetInnerHTML={{ __html: getLessonBody(grade.id, lesson.slug) }} />
      <div className={styles.pager}>
        {prev ? <Link href={lessonPath(grade.id, prev.slug)}>← {pagerLabel(prev)}</Link> : <span />}
        {next ? <Link href={lessonPath(grade.id, next.slug)}>{pagerLabel(next)} →</Link> : <span />}
      </div>
      <div className={styles.backLink}>
        <Link href={gradePath(grade.id)}>← View all {grade.label} lessons</Link>
      </div>
    </LessonShell>
  );
}
