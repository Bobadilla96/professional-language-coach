"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { SectionTitle } from "@/components/common/section-title";
import { Card } from "@/components/ui/card";
import { publishedCourses } from "@/data/courses";
import { useCourseEnrollments } from "@/hooks/use-course-enrollments";
import { useProgress } from "@/hooks/use-progress";
import { useUiText } from "@/hooks/use-ui-text";
import { CourseCard } from "../components/course-card";

export default function CoursesPage() {
  const router = useRouter();
  const { progress } = useProgress();
  const { enrollments, enrolledCourseIds, enrollInCourse } = useCourseEnrollments();
  const { t } = useUiText();

  return (
    <div className="space-y-4">
      <SectionTitle kicker={t("project01")} title={t("courses")} description={t("coursesDescription")} />
      <Card className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{t("bbcLibrary")}</p>
            <h3 className="text-lg font-semibold">{t("bbcLibraryTitle")}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t("bbcLibraryDescription")}</p>
          </div>
          <Link href="/bbc" className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
            {t("openBbcLibrary")}
          </Link>
        </div>
      </Card>
      <section className="grid gap-4 xl:grid-cols-2">
        {publishedCourses.map((course) => {
          const enrolled = enrolledCourseIds.has(course.id);
          const enrollment = enrollments.find((entry) => entry.courseId === course.id);
          return (
            <CourseCard
              key={course.id}
              course={course}
              progressPercent={enrollment?.progressPercent ?? 0}
              enrolled={enrolled}
              onEnroll={(courseId) => {
                enrollInCourse(courseId, progress);
                router.push(`/courses/${courseId}`);
              }}
            />
          );
        })}
      </section>
    </div>
  );
}
