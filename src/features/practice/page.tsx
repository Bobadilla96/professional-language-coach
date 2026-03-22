"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SectionTitle } from "@/components/common/section-title";
import { PracticeQuestionCard } from "@/components/lesson/practice-question-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { practicesByLessonId, lessons } from "@/data/lessons";
import { useProgress } from "@/hooks/use-progress";
import { useUiText } from "@/hooks/use-ui-text";
import { FillInTheBlankExercise } from "./components/fill-in-the-blank-exercise";
import { MultipleChoiceExercise } from "./components/multiple-choice-exercise";
import { PracticeSupportPanel } from "./components/practice-support-panel";
import { ScenarioSelectionExercise } from "./components/scenario-selection-exercise";
import { SentenceCorrectionExercise } from "./components/sentence-correction-exercise";

export default function PracticeFeaturePage() {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId") ?? "lesson-git-workflow-01";
  const questions = useMemo(() => practicesByLessonId[lessonId] ?? [], [lessonId]);
  const lesson = lessons.find((item) => item.id === lessonId);
  const { savePracticeResult, registerCommonError, completeLesson } = useProgress();
  const { language, t } = useUiText();
  const [index, setIndex] = useState(0);
  const [hits, setHits] = useState(0);
  const [checked, setChecked] = useState(false);

  const question = questions[index];
  const done = index >= questions.length;
  const score = questions.length ? Math.round((hits / questions.length) * 100) : 0;

  const onAnswer = (ok: boolean) => {
    if (checked) return;
    setChecked(true);
    if (ok) setHits((currentHits) => currentHits + 1);
    else registerCommonError(question.type);
  };

  const next = () => {
    setChecked(false);
    if (index + 1 < questions.length) {
      setIndex((currentIndex) => currentIndex + 1);
      return;
    }
    if (lesson) {
      savePracticeResult(lesson.id, score, lesson.topic);
      if (score >= 70) completeLesson(lesson.id);
    }
    setIndex(questions.length);
  };

  if (!questions.length) return <Card>{t("noPracticeFound")}</Card>;

  if (done) {
    return (
      <div className="space-y-4">
        <SectionTitle title={t("practiceCompleted")} description={t("practiceCompletedDescription")} />
        <Card className="space-y-3">
          <p className="text-lg font-semibold">{t("finalScore")}: {score}%</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{score >= 70 ? t("lessonMarkedCompleted") : t("retryToComplete")}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SectionTitle title={t("practice")} description={t("practiceDescription")} />
      <PracticeQuestionCard question={question} index={index} total={questions.length} />
      <PracticeSupportPanel question={question} checked={checked} />
      <Card className="space-y-3">
        {question.type === "multiple-choice" ? <MultipleChoiceExercise question={question} onAnswer={onAnswer} /> : null}
        {question.type === "fill-in-the-blank" ? <FillInTheBlankExercise question={question} onAnswer={onAnswer} /> : null}
        {question.type === "sentence-correction" ? <SentenceCorrectionExercise question={question} onAnswer={onAnswer} /> : null}
        {question.type === "scenario-selection" ? <ScenarioSelectionExercise question={question} onAnswer={onAnswer} /> : null}

        {checked ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="font-semibold">{t("explanation")}</p>
            <p>{language === "es" && question.support?.explanationEs ? question.support.explanationEs : question.explanation}</p>
            {language === "es" && question.support?.answerMeaningEs ? (
              <p className="mt-2 text-slate-700 dark:text-slate-200"><span className="font-semibold">{t("whatYouShouldSay")}:</span> {question.support.answerMeaningEs}</p>
            ) : null}
          </div>
        ) : null}

        <div className="flex justify-end">
          <Button variant="secondary" onClick={next} disabled={!checked}>
            {index + 1 < questions.length ? t("nextQuestion") : t("finish")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
