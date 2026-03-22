"use client";

import dynamic from "next/dynamic";
import { SectionTitle } from "@/components/common/section-title";
import { StatCard } from "@/components/common/stat-card";
import { useUiText } from "@/hooks/use-ui-text";
import { useProgress } from "@/hooks/use-progress";
import { LessonCompletionList } from "./components/lesson-completion-list";
import { CommonErrorsPanel } from "./components/common-errors-panel";
import { MasteredTopics } from "./components/mastered-topics";

const SkillChart = dynamic(
  () => import("./components/skill-chart").then((m) => m.SkillChart),
  { ssr: false, loading: () => <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" /> }
);

export default function ProgressFeaturePage() {
  const { progress } = useProgress();
  const { t } = useUiText();
  const averageScore = progress.lessonProgress.length
    ? Math.round(progress.lessonProgress.reduce((acc, item) => acc + item.score, 0) / progress.lessonProgress.length)
    : 0;

  return (
    <div className="space-y-4">
      <SectionTitle title={t("progress")} description={t("progressDescription")} />
      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard label={t("totalProgress")} value={`${progress.totalProgress}%`} />
        <StatCard label={t("completedLessons")} value={progress.completedLessons.length} />
        <StatCard label={t("averageScore")} value={`${averageScore}%`} />
      </section>

      <section className="grid gap-3 xl:grid-cols-12">
        <div className="xl:col-span-7"><SkillChart progress={progress} /></div>
        <div className="space-y-3 xl:col-span-5">
          <MasteredTopics progress={progress} />
          <CommonErrorsPanel errors={progress.commonErrors} />
          <LessonCompletionList items={progress.lessonProgress} />
        </div>
      </section>
    </div>
  );
}
