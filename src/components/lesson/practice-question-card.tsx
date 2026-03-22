"use client";

import type { PracticeQuestion } from "@/domain/models/practice";
import { Card } from "@/components/ui/card";
import { useUiText } from "@/hooks/use-ui-text";

export function PracticeQuestionCard({ question, index, total }: { question: PracticeQuestion; index: number; total: number }) {
  const { language, t } = useUiText();

  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-600">{t("question")} {index + 1} / {total}</p>
      <h3 className="mt-2 text-base font-semibold">{question.prompt}</h3>
      {language === "es" && question.support?.promptEs ? (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{question.support.promptEs}</p>
      ) : null}
    </Card>
  );
}
