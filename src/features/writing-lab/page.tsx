"use client";

import { useState } from "react";
import { SectionTitle } from "@/components/common/section-title";
import { Button } from "@/components/ui/button";
import { useUiText } from "@/hooks/use-ui-text";
import { runCorrectionEngine } from "@/lib/correction-engine";
import { useWritingLabStore } from "@/store/writing-lab-store";
import { AnswerEditor } from "./components/answer-editor";
import { CorrectionResultView } from "./components/correction-result";
import { ProfessionalRewriteCard } from "./components/professional-rewrite-card";

export default function WritingLabFeaturePage() {
  const { t } = useUiText();
  const [answer, setAnswer] = useState("");
  const [resultIndex, setResultIndex] = useState(0);
  const history = useWritingLabStore((s) => s.history);
  const pushResult = useWritingLabStore((s) => s.pushResult);
  const result = history[resultIndex] ?? null;

  const onCorrect = () => {
    const correction = runCorrectionEngine(answer);
    pushResult(correction);
    setResultIndex(0);
  };

  return (
    <div className="space-y-4">
      <SectionTitle title={t("writingLab")} description={t("writingLabDescription")} />
      <AnswerEditor value={answer} onChange={setAnswer} />
      <div className="flex gap-2">
        <Button onClick={onCorrect} disabled={!answer.trim()}>{t("correctSentence")}</Button>
        <Button variant="secondary" onClick={() => setAnswer("I do a branch for solve this issue")}>{t("loadSample")}</Button>
      </div>
      <CorrectionResultView result={result} />
      <ProfessionalRewriteCard result={result} />
    </div>
  );
}
