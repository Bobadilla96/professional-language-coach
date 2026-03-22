"use client";

import Link from "next/link";
import type { Lesson } from "@/domain/models/lesson";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUiText } from "@/hooks/use-ui-text";

export function LessonCard({ lesson, completed }: { lesson: Lesson; completed: boolean }) {
  const { t, levelLabel, topicLabel } = useUiText();

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">{lesson.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{lesson.description}</p>
        </div>
        <Badge className={completed ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300" : ""}>
          {completed ? t("completed") : t("pending")}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>{topicLabel(lesson.topic)}</span><span>•</span><span>{levelLabel(lesson.level)}</span><span>•</span><span>{lesson.estimatedMinutes} min</span>
      </div>
      <Link href={`/lessons/${lesson.id}`}>
        <Button variant="secondary">{t("openLesson")}</Button>
      </Link>
    </Card>
  );
}
