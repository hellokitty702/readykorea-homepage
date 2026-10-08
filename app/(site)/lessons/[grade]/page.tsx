import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LessonShell } from '@/components/lessons/LessonShell';
import styles from '@/components/lessons/lessons.module.css';
import { getGrade, gradePath, grades, lessonPath, lessonsPath } from '@/lib/lessons';

type Props = { params: Promise<{ grade: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return grades.map((grade) => ({ grade: grade.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const grade = getGrade((await params).grade);
  if (!grade) return {};
  const count = grade.lessons.length;
  return {
    title: `${grade.label} ESL Lesson Plans (${count} Free Plans) | ReadyKorea`,
    description: `Free ${grade.label} English lesson plans for teaching in Korea. ${count} complete, ready-to-teach ESL lessons.`,
    alternates: { canonical: gradePath(grade.id) },
    openGraph: { title: `${grade.label} ESL Lesson Plans | ReadyKorea`, url: gradePath(grade.id) },
  };
}

export default async function GradePage({ params }: Props) {
  const grade = getGrade((await params).grade);
  if (!grade) notFound();

  return (
    <LessonShell crumbs={[{ label: 'Home', href: '/' }, { label: 'Lessons', href: lessonsPath() }, { label: grade.label }]}>
      <h1 className={styles.title}>{grade.label} Lesson Plans</h1>
      <p className={styles.intro}>
        {grade.lessons.length} free, ready-to-teach ESL lessons for {grade.label}.
      </p>
      {grade.lessons.map((lesson, i) => (
        <Link key={lesson.slug} href={lessonPath(grade.id, lesson.slug)} className={styles.card}>
          <div className={styles.cardEyebrow}>Lesson {String(i + 1).padStart(2, '0')}</div>
          <div className={styles.cardTitle}>{lesson.title}</div>
        </Link>
      ))}
    </LessonShell>
  );
}
