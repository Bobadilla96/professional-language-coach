"use client";

import { useMemo, useState } from "react";
import { lessons } from "@/data/lessons";
import { LessonCard } from "../components/lesson-card";
import { Input } from "@/components/ui/input";
import { SectionTitle } from "@/components/common/section-title";
import { useProgress } from "@/hooks/use-progress";
import { useUiText } from "@/hooks/use-ui-text";

export default function LessonsPageFeature() {
  const { progress } = useProgress();
  const { t } = useUiText();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");

  const filtered = useMemo(() => lessons.filter((lesson) => {
    const matchesLevel = level === "all" || lesson.level === level;
    const haystack = `${lesson.title} ${lesson.topic} ${lesson.description}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query.toLowerCase());
    return matchesLevel && matchesQuery;
  }), [level, query]);

  return (
    <div className="space-y-4">
      <SectionTitle title={t("lessons")} description={t("lessonsDescription")} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input placeholder={t("searchLesson")} value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="all">{t("allLevels")}</option>
          <option value="intermediate">intermediate</option>
          <option value="upper-intermediate">upper-intermediate</option>
          <option value="advanced">advanced</option>
        </select>
      </div>
      <section className="grid gap-3 lg:grid-cols-2">
        {filtered.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} completed={progress.completedLessons.includes(lesson.id)} />)}
      </section>
    </div>
  );
}
