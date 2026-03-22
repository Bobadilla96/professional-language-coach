import type { Lesson } from "@/domain/models/lesson";

export const codeReviewLesson: Lesson = {
  id: "lesson-code-review-01",
  title: "Code Review Communication",
  topic: "code-review",
  level: "intermediate",
  description: "Learn how to write concise, respectful and useful review comments.",
  estimatedMinutes: 12,
  completed: false,
  sourceTitle: "GitHub PR Reviews",
  sourceUrl: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews",
  vocabulary: [
    {
      id: "cr-v1",
      term: "LGTM",
      pronunciation: "/el-dyi-ti-em/",
      meaning: "A short review approval meaning Looks Good To Me when no blocking issues remain.",
      contextExample: "I left one small nit, but overall LGTM after that fix."
    },
    {
      id: "cr-v2",
      term: "Blocking comment",
      pronunciation: "/blo-kin ko-ment/",
      meaning: "A review comment that must be addressed before merging the pull request.",
      contextExample: "This is a blocking comment because the null check is missing."
    },
    {
      id: "cr-v3",
      term: "Nitpick",
      pronunciation: "/nit-pik/",
      meaning: "A minor style or readability suggestion that does not block merge.",
      contextExample: "Nitpick: can we rename this variable to make intent clearer?"
    },
    {
      id: "cr-v4",
      term: "Rationale",
      pronunciation: "/ra-sho-nal/",
      meaning: "The technical reason that justifies a decision in the code.",
      contextExample: "Please add the rationale for using memoization in this hook."
    },
    {
      id: "cr-v5",
      term: "Edge case",
      pronunciation: "/edj keis/",
      meaning: "An uncommon input or state that can break behavior if not handled.",
      contextExample: "Could you add a test for the empty state edge case?"
    }
  ],
  phrases: [
    {
      id: "cr-p1",
      sentence: "Could you add a unit test for this edge case before merge?",
      scenario: "code-review",
      explanation: "Polite and clear request that explains the expected action."
    },
    {
      id: "cr-p2",
      sentence: "I left one blocking comment regarding error handling in this service.",
      scenario: "pull-request",
      explanation: "Professional way to mark severity and location of feedback."
    },
    {
      id: "cr-p3",
      sentence: "Thanks for the update, this change is now ready to approve.",
      scenario: "slack",
      explanation: "Natural follow-up message after the author addresses feedback."
    }
  ],
  audioChallenge: {
    id: "a-cr-1",
    instruction: "Read aloud: I left one blocking comment regarding error handling in this service.",
    targetPhraseId: "cr-p2",
    connectedSpeechTip: "Stress blocking, error handling and service to keep technical intent clear."
  }
};
