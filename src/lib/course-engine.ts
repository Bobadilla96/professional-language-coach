import { lessonsById } from "@/data/lessons";
import type { Course, CourseEnrollment, CourseModule } from "@/domain/models/course";
import type { Lesson } from "@/domain/models/lesson";
import type { UserProgress } from "@/domain/models/progress";

export function getCourseLessons(course: Course): Lesson[] {
  return course.modules.flatMap((module) => module.lessonIds.map((lessonId) => lessonsById[lessonId]).filter(Boolean));
}

export function calculateModuleProgress(module: CourseModule, completedLessons: string[]) {
  if (!module.lessonIds.length) return 0;
  const completedCount = module.lessonIds.filter((lessonId) => completedLessons.includes(lessonId)).length;
  return Math.round((completedCount / module.lessonIds.length) * 100);
}

export function calculateCourseProgress(course: Course, progress: UserProgress) {
  const courseLessons = getCourseLessons(course);
  if (!courseLessons.length) return 0;
  const completedCount = courseLessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;
  return Math.round((completedCount / courseLessons.length) * 100);
}

export function getNextCourseLesson(course: Course, completedLessons: string[]) {
  return getCourseLessons(course).find((lesson) => !completedLessons.includes(lesson.id)) ?? getCourseLessons(course)[0] ?? null;
}

export function buildEnrollmentFromCourse(course: Course, progress: UserProgress): CourseEnrollment {
  const nextLesson = getNextCourseLesson(course, progress.completedLessons);
  const progressPercent = calculateCourseProgress(course, progress);

  return {
    courseId: course.id,
    enrolledAt: new Date().toISOString(),
    status: progressPercent >= 100 ? "completed" : "active",
    currentLessonId: nextLesson?.id ?? null,
    progressPercent
  };
}
