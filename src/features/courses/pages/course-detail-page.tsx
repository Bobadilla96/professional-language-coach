"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SectionTitle } from "@/components/common/section-title";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { coursesById } from "@/data/courses";
import { lessonsById } from "@/data/lessons";
import { useCourseEnrollments } from "@/hooks/use-course-enrollments";
import { useProgress } from "@/hooks/use-progress";
import { useUiText } from "@/hooks/use-ui-text";
import { calculateModuleProgress, getNextCourseLesson } from "@/lib/course-engine";

export function CourseDetailPage({ courseId }: { courseId: string }) {
  const course = coursesById[courseId];
  const router = useRouter();
  const { progress } = useProgress();
  const { enrollments, enrollInCourse } = useCourseEnrollments();
  const { t, trackLabel, goalLabel } = useUiText();

  if (!course) {
    return (
      <div className="space-y-3">
        <SectionTitle kicker={t("courses")} title={t("courseDetail")} description={t("lessonNotFoundDescription")} />
        <Link href="/courses" className="text-sm font-semibold text-sky-700 dark:text-sky-300">
          {t("browseCourses")}
        </Link>
      </div>
    );
  }

  const enrollment = enrollments.find((entry) => entry.courseId === course.id);
  const nextLesson = getNextCourseLesson(course, progress.completedLessons);

  return (
    <div className="space-y-4">
      <SectionTitle kicker={course.coverLabel} title={course.title} description={course.description} />

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <Card className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">{course.subtitle}</p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950/30 dark:text-sky-300">
              {trackLabel(course.professionalTrack)}
            </span>
            {course.goals.map((goal) => (
              <span key={goal} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {goalLabel(goal)}
              </span>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{t("modules")}</p>
              <p className="mt-1 text-lg font-semibold">{course.modules.length}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{t("lessonsCount")}</p>
              <p className="mt-1 text-lg font-semibold">{course.modules.reduce((acc, module) => acc + module.lessonIds.length, 0)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{t("routeProgress")}</p>
              <p className="mt-1 text-lg font-semibold">{enrollment?.progressPercent ?? 0}%</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {course.status === "published" ? (
              <Button
                onClick={() => {
                  enrollInCourse(course.id, progress);
                  if (nextLesson) router.push(`/lessons/${nextLesson.id}`);
                }}
              >
                {enrollment ? t("continueCourse") : t("enrollNow")}
              </Button>
            ) : null}
            {nextLesson ? (
              <Link href={`/lessons/${nextLesson.id}`} className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                {t("goToSelectedLesson")}
              </Link>
            ) : null}
          </div>
        </Card>

        <Card className="space-y-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{t("courseOutcomes")}</p>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {course.outcomes.map((outcome) => (
              <li key={outcome} className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 dark:border-slate-700 dark:bg-slate-800/60">
                {outcome}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="space-y-3">
        {course.modules.map((module) => (
          <Card key={module.id} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{module.title}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{module.description}</p>
              </div>
              <span className="text-sm font-semibold text-sky-700 dark:text-sky-300">
                {calculateModuleProgress(module, progress.completedLessons)}%
              </span>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {module.lessonIds.map((lessonId) => {
                const lesson = lessonsById[lessonId];
                if (!lesson) return null;
                return (
                  <div key={lesson.id} className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                    <p className="font-semibold">{lesson.title}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{lesson.description}</p>
                    <Link href={`/lessons/${lesson.id}`} className="mt-3 inline-flex text-sm font-semibold text-sky-700 dark:text-sky-300">
                      {t("openLesson")}
                    </Link>
                  </div>
                );
              })}
            </div>
            <div className="rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <span className="font-semibold">{t("moduleOutcome")}: </span>
              {module.outcome}
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
