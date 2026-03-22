"use client";

import type { PracticeQuestion } from "@/domain/models/practice";
import { Card } from "@/components/ui/card";
import { useUiText } from "@/hooks/use-ui-text";

export function PracticeSupportPanel({ question, checked }: { question: PracticeQuestion; checked: boolean }) {
  const { language, t } = useUiText();

  if (language !== "es" || !question.support) return null;

  return (
    <Card className="space-y-3 border-amber-200 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/15">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">{t("helpInSpanish")}</p>
      </div>

      {question.support.promptEs ? (
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{t("translatedInstruction")}</p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{question.support.promptEs}</p>
        </div>
      ) : null}

      {question.support.contextEs ? (
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{t("translatedContext")}</p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{question.support.contextEs}</p>
        </div>
      ) : null}

      <div>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{t("whatYouNeedToDo")}</p>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{question.support.taskEs}</p>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{t("helpfulHint")}</p>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{question.support.hintEs}</p>
      </div>

      {checked && question.support.answerMeaningEs ? (
        <div className="rounded-xl border border-slate-200 bg-white/85 px-3 py-3 dark:border-slate-700 dark:bg-slate-900/60">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{t("whatYouShouldSay")}</p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{question.support.answerMeaningEs}</p>
        </div>
      ) : null}
    </Card>
  );
}
