import type { Lesson } from "@/domain/models/lesson";
import type { UserProgress } from "@/domain/models/progress";

export function calculateTotalProgress(progress: UserProgress, totalLessons: number) {
  if (!totalLessons) return 0;
  return Math.min(100, Math.round((progress.completedLessons.length / totalLessons) * 100));
}

export function getNextLesson(lessons: Lesson[], completedLessons: string[]) {
  return lessons.find((lesson) => !completedLessons.includes(lesson.id)) ?? lessons[0] ?? null;
}
