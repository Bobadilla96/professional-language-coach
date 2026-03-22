"use client";

import Link from "next/link";
import type { Course } from "@/domain/models/course";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUiText } from "@/hooks/use-ui-text";

interface CourseCardProps {
  course: Course;
  progressPercent: number;
  enrolled: boolean;
  onEnroll: (courseId: string) => void;
}

export function CourseCard({ course, progressPercent, enrolled, onEnroll }: CourseCardProps) {
  const { t, trackLabel, goalLabel, courseStatusLabel } = useUiText();

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-sky-600">{course.coverLabel}</p>
          <h3 className="mt-2 text-xl font-semibold">{course.title}</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{course.subtitle}</p>
        </div>
        <span className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
          {courseStatusLabel(course.status)}
        </span>
      </div>

      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{course.description}</p>

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm dark:border-slate-700 dark:bg-slate-800/60 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{t("track")}</p>
          <p className="mt-1 font-semibold">{trackLabel(course.professionalTrack)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{t("estimatedHours")}</p>
          <p className="mt-1 font-semibold">{course.estimatedHours}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{t("routeProgress")}</p>
          <p className="mt-1 font-semibold">{progressPercent}%</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {course.goals.map((goal) => (
          <span key={goal} className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950/30 dark:text-sky-300">
            {goalLabel(goal)}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={`/courses/${course.id}`} className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
          {t("openCourse")}
        </Link>
        {course.status === "published" ? (
          <Button variant={enrolled ? "secondary" : "primary"} onClick={() => onEnroll(course.id)}>
            {enrolled ? t("continueCourse") : t("enrollNow")}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
