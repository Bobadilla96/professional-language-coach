"use client";

import { useMemo } from "react";
import { coursesById } from "@/data/courses";
import type { CourseEnrollment } from "@/domain/models/course";
import { useCourseEnrollmentStore } from "@/store/course-enrollment-store";

export function useCourseEnrollments() {
  const enrollments = useCourseEnrollmentStore((state) => state.enrollments);
  const replaceEnrollments = useCourseEnrollmentStore((state) => state.replaceEnrollments);
  const enrollInCourse = useCourseEnrollmentStore((state) => state.enrollInCourse);
  const syncProgress = useCourseEnrollmentStore((state) => state.syncProgress);
  const resetEnrollments = useCourseEnrollmentStore((state) => state.resetEnrollments);

  const enrolledCourseIds = useMemo(() => new Set(enrollments.map((entry) => entry.courseId)), [enrollments]);
  const enrolledCourses = useMemo(
    () =>
      enrollments
        .map((entry) => {
          const course = coursesById[entry.courseId];
          return course ? { enrollment: entry, course } : null;
        })
        .filter((entry): entry is { enrollment: CourseEnrollment; course: typeof coursesById[keyof typeof coursesById] } => Boolean(entry)),
    [enrollments]
  );

  return {
    enrollments,
    enrolledCourseIds,
    enrolledCourses,
    replaceEnrollments,
    enrollInCourse,
    syncProgress,
    resetEnrollments
  };
}
