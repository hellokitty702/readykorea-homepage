import type { Metadata } from 'next';
import Link from 'next/link';
import { LessonShell } from '@/components/lessons/lesson-shell';
import styles from '@/components/lessons/lessons.module.css';
import { gradePath, grades, lessonsPath, totalLessons } from '@/lib/lessons';

export const metadata: Metadata = {
  title: `${totalLessons} Free ESL Lesson Plans for Korea (K1–G6) | ReadyKorea`,
  description: `${totalLessons} complete, free ESL lesson plans for teaching English in Korea, from Kindergarten K1 to Grade 6. Ready to teach, aligned to Cambridge YLE.`,
  alternates: { canonical: lessonsPath() },
  openGraph: { title: `${totalLessons} Free ESL Lesson Plans for Korea | ReadyKorea`, url: lessonsPath() },
};

export default function LessonsHubPage() {
  return (
    <LessonShell>
      <h1 className={styles.title}>Free ESL Lesson Plans</h1>
      <p className={styles.intro}>
        {totalLessons} complete, ready-to-teach lessons — Kindergarten to Grade 6. 100% free for teachers.
      </p>
      {grades.map((grade) => (
        <Link key={grade.id} href={gradePath(grade.id)} className={styles.gradeCard}>
          <div className={styles.gradeCardTitle}>{grade.label}</div>
          <div className={styles.gradeCardMeta}>{grade.lessons.length} free lesson plans</div>
        </Link>
      ))}
    </LessonShell>
  );
}
