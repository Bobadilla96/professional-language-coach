import type { Lesson } from "@/domain/models/lesson";
import type { PracticeQuestion } from "@/domain/models/practice";
import { apiCollaborationLesson } from "./api-collaboration.lesson";
import { apiCollaborationPractice } from "./api-collaboration.practice";
import { codeReviewLesson } from "./code-review.lesson";
import { codeReviewPractice } from "./code-review.practice";
import { debuggingLesson } from "./debugging.lesson";
import { debuggingPractice } from "./debugging.practice";
import { gitWorkflowLesson } from "./git-workflow.lesson";
import { gitWorkflowPractice } from "./git-workflow.practice";
import { incidentResponseLesson } from "./incident-response.lesson";
import { incidentResponsePractice } from "./incident-response.practice";
import { technicalWritingLesson } from "./technical-writing.lesson";
import { technicalWritingPractice } from "./technical-writing.practice";

export const lessons: Lesson[] = [
  gitWorkflowLesson,
  codeReviewLesson,
  debuggingLesson,
  apiCollaborationLesson,
  technicalWritingLesson,
  incidentResponseLesson
];

export const lessonsById = Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson])) as Record<string, Lesson>;

export const practicesByLessonId: Record<string, PracticeQuestion[]> = {
  [gitWorkflowLesson.id]: gitWorkflowPractice,
  [codeReviewLesson.id]: codeReviewPractice,
  [debuggingLesson.id]: debuggingPractice,
  [apiCollaborationLesson.id]: apiCollaborationPractice,
  [technicalWritingLesson.id]: technicalWritingPractice,
  [incidentResponseLesson.id]: incidentResponsePractice
};
