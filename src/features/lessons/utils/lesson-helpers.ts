import { lessons } from "@/data/lessons";

export function getLessonById(lessonId: string) {
  return lessons.find((lesson) => lesson.id === lessonId) ?? null;
}
