import manifest from '@/content/lessons/manifest.json';
import { readContent } from './content';

export type Lesson = { slug: string; title: string; description: string };
export type Grade = { id: string; label: string; lessons: Lesson[] };

/** Grades in display order; each grade's lessons are in curriculum order. */
export const grades: Grade[] = manifest;

export const totalLessons = grades.reduce((sum, grade) => sum + grade.lessons.length, 0);

export function getGrade(gradeId: string): Grade | undefined {
  return grades.find((grade) => grade.id === gradeId);
}

export function getLesson(gradeId: string, slug: string) {
  const grade = getGrade(gradeId);
  const index = grade?.lessons.findIndex((lesson) => lesson.slug === slug) ?? -1;
  if (!grade || index < 0) return undefined;
  return {
    grade,
    lesson: grade.lessons[index],
    prev: grade.lessons[index - 1] as Lesson | undefined,
    next: grade.lessons[index + 1] as Lesson | undefined,
  };
}

/** Lesson body HTML, stored in `content/lessons/{grade}/{slug}.html`. */
export function getLessonBody(gradeId: string, slug: string): string {
  return readContent(`lessons/${gradeId}/${slug}.html`);
}

export const lessonsPath = () => '/lessons/';
export const gradePath = (gradeId: string) => `/lessons/${gradeId}/`;
export const lessonPath = (gradeId: string, slug: string) => `/lessons/${gradeId}/${slug}/`;
