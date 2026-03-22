"use client";

import { useState } from "react";
import type { FillInTheBlankQuestion } from "@/domain/models/practice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUiText } from "@/hooks/use-ui-text";

export function FillInTheBlankExercise({ question, onAnswer }: { question: FillInTheBlankQuestion; onAnswer: (ok: boolean) => void }) {
  const { language, t } = useUiText();
  const [value, setValue] = useState("");

  return (
    <div className="space-y-3">
      <p className="text-sm">{question.sentence}</p>
      {language === "es" && question.support?.contextEs ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">{question.support.contextEs}</p>
      ) : null}
      <Input value={value} onChange={(event) => setValue(event.target.value)} placeholder={t("yourAnswer")} />
      <Button onClick={() => onAnswer(value.trim().toLowerCase() === question.correctAnswer.toLowerCase())} disabled={!value.trim()}>{t("validate")}</Button>
    </div>
  );
}
