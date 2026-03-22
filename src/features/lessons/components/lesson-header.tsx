"use client";

import type { Lesson } from "@/domain/models/lesson";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useUiText } from "@/hooks/use-ui-text";

export function LessonHeader({ lesson }: { lesson: Lesson }) {
  const { t, levelLabel, topicLabel } = useUiText();

  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.15em] text-sky-600">{t("lessonDetailKicker")}</p>
      <h1 className="mt-2 text-2xl font-semibold">{lesson.title}</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{lesson.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>{topicLabel(lesson.topic)}</Badge>
        <Badge>{levelLabel(lesson.level)}</Badge>
        <Badge>{lesson.estimatedMinutes} min</Badge>
      </div>
    </Card>
  );
}
