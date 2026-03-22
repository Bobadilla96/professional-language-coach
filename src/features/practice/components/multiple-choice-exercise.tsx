"use client";

import { useState } from "react";
import type { MultipleChoiceQuestion } from "@/domain/models/practice";
import { Button } from "@/components/ui/button";
import { useUiText } from "@/hooks/use-ui-text";

export function MultipleChoiceExercise({ question, onAnswer }: { question: MultipleChoiceQuestion; onAnswer: (ok: boolean) => void }) {
  const { language, t } = useUiText();
  const [selected, setSelected] = useState("");

  return (
    <div className="space-y-3">
      <div className="grid gap-2">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            title={language === "es" ? question.support?.optionGlossary?.[option] : undefined}
            className={`rounded-lg border px-3 py-2 text-left text-sm ${selected === option ? "border-sky-500 bg-sky-50 dark:bg-sky-950/30" : "border-slate-300 dark:border-slate-700"}`}
          >
            <span className="block">{option}</span>
            {language === "es" && question.support?.optionGlossary?.[option] ? (
              <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{question.support.optionGlossary[option]}</span>
            ) : null}
          </button>
        ))}
      </div>
      <Button onClick={() => onAnswer(selected.toLowerCase() === question.correctAnswer.toLowerCase())} disabled={!selected}>{t("validate")}</Button>
    </div>
  );
}
