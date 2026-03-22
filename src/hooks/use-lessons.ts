import { lessons } from "@/data/lessons";

export function useLessons() {
  return {
    lessons,
    lessonCount: lessons.length
  };
}
