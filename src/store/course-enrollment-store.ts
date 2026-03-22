"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { coursesById } from "@/data/courses";
import type { CourseEnrollment } from "@/domain/models/course";
import type { UserProgress } from "@/domain/models/progress";
import { buildEnrollmentFromCourse, calculateCourseProgress, getNextCourseLesson } from "@/lib/course-engine";

interface CourseEnrollmentStore {
  enrollments: CourseEnrollment[];
  replaceEnrollments: (enrollments: CourseEnrollment[]) => void;
  enrollInCourse: (courseId: string, progress: UserProgress) => void;
  syncProgress: (progress: UserProgress) => void;
  resetEnrollments: () => void;
}

function sameEnrollment(a: CourseEnrollment, b: CourseEnrollment) {
  return (
    a.courseId === b.courseId &&
    a.status === b.status &&
    a.currentLessonId === b.currentLessonId &&
    a.progressPercent === b.progressPercent &&
    a.enrolledAt === b.enrolledAt
  );
}

export const useCourseEnrollmentStore = create<CourseEnrollmentStore>()(
  persist(
    (set, get) => ({
      enrollments: [],
      replaceEnrollments: (enrollments) => set({ enrollments }),
      enrollInCourse: (courseId, progress) => {
        const course = coursesById[courseId];
        if (!course) return;

        const existing = get().enrollments.find((entry) => entry.courseId === courseId);
        if (existing) return;

        const enrollment = buildEnrollmentFromCourse(course, progress);
        set({ enrollments: [...get().enrollments, enrollment] });
      },
      syncProgress: (progress) => {
        const nextEnrollments = get().enrollments.map((enrollment) => {
          const course = coursesById[enrollment.courseId];
          if (!course) return enrollment;

          const progressPercent = calculateCourseProgress(course, progress);
          const nextLesson = getNextCourseLesson(course, progress.completedLessons);
          return {
            ...enrollment,
            progressPercent,
            currentLessonId: nextLesson?.id ?? null,
            status: progressPercent >= 100 ? "completed" : "active"
          } satisfies CourseEnrollment;
        });

        const changed = nextEnrollments.some((entry, index) => !sameEnrollment(entry, get().enrollments[index]));
        if (!changed) return;
        set({ enrollments: nextEnrollments });
      },
      resetEnrollments: () => set({ enrollments: [] })
    }),
    {
      name: "tech-english-course-enrollments",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
