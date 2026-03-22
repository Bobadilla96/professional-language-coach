"use client";

import { EmptyState } from "@/components/common/empty-state";
import { useUiText } from "@/hooks/use-ui-text";
import { AiLessonAssistant } from "../components/ai-lesson-assistant";
import { LessonHeader } from "../components/lesson-header";
import { PhrasesSection } from "../components/phrases-section";
import { PracticeSection } from "../components/practice-section";
import { SpeakingSection } from "../components/speaking-section";
import { VocabularySection } from "../components/vocabulary-section";
import { getLessonById } from "../utils/lesson-helpers";

export default function LessonDetailPageFeature({ lessonId }: { lessonId: string }) {
  const { t } = useUiText();
  const lesson = getLessonById(lessonId);

  if (!lesson) {
    return <EmptyState title={t("lessonNotFound")} description={t("lessonNotFoundDescription")} />;
  }

  return (
    <div className="space-y-4">
      <LessonHeader lesson={lesson} />
      {lesson.vocabulary.length ? <VocabularySection vocabulary={lesson.vocabulary} /> : null}
      {lesson.phrases.length ? <PhrasesSection phrases={lesson.phrases} /> : null}
      <SpeakingSection challenge={lesson.audioChallenge} />
      <AiLessonAssistant lessonId={lesson.id} />
      <PracticeSection lessonId={lesson.id} />
    </div>
  );
}
