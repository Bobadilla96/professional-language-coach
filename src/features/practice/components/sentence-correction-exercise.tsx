"use client";

import { useState } from "react";
import type { SentenceCorrectionQuestion } from "@/domain/models/practice";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUiText } from "@/hooks/use-ui-text";

export function SentenceCorrectionExercise({ question, onAnswer }: { question: SentenceCorrectionQuestion; onAnswer: (ok: boolean) => void }) {
  const { language, t } = useUiText();
  const [value, setValue] = useState("");

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600 dark:text-slate-300">{t("incorrect")}: {question.incorrectSentence}</p>
      {language === "es" && question.support?.contextEs ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">{question.support.contextEs}</p>
      ) : null}
      <Textarea value={value} onChange={(event) => setValue(event.target.value)} rows={3} placeholder={t("writeCorrectedSentence")} />
      <Button onClick={() => onAnswer(value.trim().toLowerCase() === question.correctedSentence.toLowerCase())} disabled={!value.trim()}>{t("validate")}</Button>
    </div>
  );
}
