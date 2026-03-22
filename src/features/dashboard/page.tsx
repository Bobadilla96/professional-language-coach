"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SectionTitle } from "@/components/common/section-title";
import { StatCard } from "@/components/common/stat-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { publishedCourses } from "@/data/courses";
import { lessons } from "@/data/lessons";
import { useCourseEnrollments } from "@/hooks/use-course-enrollments";
import { useLearningPreferences } from "@/hooks/use-learning-preferences";
import { useProgress } from "@/hooks/use-progress";
import { useUiText } from "@/hooks/use-ui-text";
import { getCourseFirstLessonId } from "@/data/courses";
import { getNextLesson } from "@/lib/progress-engine";
import { WeakTopicsCard } from "./components/weak-topics-card";
import { LessonStreakCard } from "./components/lesson-streak-card";
import { RecentActivityCard } from "./components/recent-activity-card";

const ProgressOverview = dynamic(
  () => import("./components/progress-overview").then((m) => m.ProgressOverview),
  { ssr: false, loading: () => <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" /> }
);

export default function DashboardFeaturePage() {
  const { progress } = useProgress();
  const router = useRouter();
  const { t, levelLabel } = useUiText();
  const { enrolledCourses } = useCourseEnrollments();
  const defaultCourseId = publishedCourses[0]?.id ?? "";
  const defaultLessonId = getCourseFirstLessonId(defaultCourseId);
  const { preferences } = useLearningPreferences(defaultCourseId, defaultLessonId);
  const nextLesson = getNextLesson(lessons, progress.completedLessons);
  const recommendedCourse = publishedCourses.find((course) => course.id === preferences.targetCourseId) ?? publishedCourses[0];

  return (
    <div className="space-y-4">
      <SectionTitle kicker={t("dashboardKicker")} title={t("dashboard")} description={t("dashboardDescription")} />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t("enrolledCourses")} value={enrolledCourses.length} />
        <StatCard label={t("completedLessons")} value={progress.completedLessons.length} />
        <StatCard label={t("currentLevel")} value={levelLabel(progress.currentLevel)} />
        <StatCard label={t("totalProgress")} value={`${progress.totalProgress}%`} />
        <StatCard label={t("streak")} value={`${progress.streak}`} />
      </section>

      {recommendedCourse ? (
        <div className="flex items-center justify-between rounded-xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-900/50 dark:bg-sky-950/20">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-sky-600">{t("recommendedCourse")}</p>
            <p className="font-semibold">{recommendedCourse.title}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{recommendedCourse.subtitle}</p>
          </div>
          <Button onClick={() => router.push(`/courses/${recommendedCourse.id}`)}>{t("openCourse")}</Button>
        </div>
      ) : null}

      <section className="grid gap-3 lg:grid-cols-2">
        <Card className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-slate-500">{t("activeRoutes")}</p>
              <h3 className="text-lg font-semibold">{t("enrolledCourses")}</h3>
            </div>
            <Link href="/courses" className="text-sm font-semibold text-sky-700 dark:text-sky-300">
              {t("browseCourses")}
            </Link>
          </div>
          {enrolledCourses.length ? (
            <div className="space-y-3">
              {enrolledCourses.map(({ course, enrollment }) => (
                <div key={course.id} className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/60">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{course.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{course.subtitle}</p>
                    </div>
                    <span className="text-sm font-semibold text-sky-700 dark:text-sky-300">{enrollment.progressPercent}%</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Button variant="secondary" onClick={() => router.push(`/courses/${course.id}`)}>
                      {t("continueCourse")}
                    </Button>
                    {enrollment.currentLessonId ? (
                      <Button onClick={() => router.push(`/lessons/${enrollment.currentLessonId}`)}>{t("nextLesson")}</Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">{t("noEnrolledCourses")}</p>
          )}
        </Card>

        {nextLesson ? (
          <Card className="space-y-3">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">{t("nextLesson")}</p>
            <div>
              <p className="text-lg font-semibold">{nextLesson.title}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{nextLesson.description}</p>
            </div>
            <Button onClick={() => router.push(`/lessons/${nextLesson.id}`)}>{t("continue")}</Button>
          </Card>
        ) : null}
      </section>

      <section className="grid gap-3 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <ProgressOverview progress={progress} />
        </div>
        <div className="space-y-3 xl:col-span-4">
          <WeakTopicsCard progress={progress} />
          <LessonStreakCard streak={progress.streak} />
          <RecentActivityCard activity={progress.recentActivity} />
        </div>
      </section>
    </div>
  );
}
