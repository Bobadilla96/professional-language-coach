import type { Lesson } from "@/domain/models/lesson";

export const debuggingLesson: Lesson = {
  id: "lesson-debugging-01",
  title: "Debugging Conversations",
  topic: "debugging",
  level: "upper-intermediate",
  description: "Describe issues, hypotheses and root causes clearly.",
  estimatedMinutes: 14,
  completed: false,
  sourceTitle: "MDN + Kubernetes Debug",
  sourceUrl: "https://kubernetes.io/docs/tasks/debug/debug-application/",
  vocabulary: [
    {
      id: "db-v1",
      term: "Reproduce",
      pronunciation: "/ri-prou-dius/",
      meaning: "To trigger the same bug again with consistent steps.",
      contextExample: "I can reproduce the timeout by sending two parallel requests."
    },
    {
      id: "db-v2",
      term: "Stack trace",
      pronunciation: "/stak treis/",
      meaning: "The call sequence that shows where an error happened in code.",
      contextExample: "Please attach the full stack trace from staging logs."
    },
    {
      id: "db-v3",
      term: "Root cause",
      pronunciation: "/rut koz/",
      meaning: "The original technical reason behind a failure.",
      contextExample: "We found the root cause in the cache invalidation logic."
    },
    {
      id: "db-v4",
      term: "Flaky test",
      pronunciation: "/flei-ki test/",
      meaning: "A test that passes or fails intermittently without code changes.",
      contextExample: "This flaky test fails only on CI under high load."
    },
    {
      id: "db-v5",
      term: "Workaround",
      pronunciation: "/wer-ka-round/",
      meaning: "A temporary mitigation used before a permanent fix is deployed.",
      contextExample: "As a workaround, we disabled retries for this endpoint."
    }
  ],
  phrases: [
    {
      id: "db-p1",
      sentence: "I can reproduce the issue consistently in staging with this payload.",
      scenario: "debugging-session",
      explanation: "Useful opener to align the team on reproducible behavior."
    },
    {
      id: "db-p2",
      sentence: "The root cause appears to be a race condition in the queue worker.",
      scenario: "daily-standup",
      explanation: "Clear hypothesis statement with specific component reference."
    },
    {
      id: "db-p3",
      sentence: "We deployed a workaround and the error rate dropped to baseline.",
      scenario: "slack",
      explanation: "Natural status update after mitigation is applied."
    }
  ],
  audioChallenge: {
    id: "a-db-1",
    instruction: "Read aloud: The root cause appears to be a race condition in the queue worker.",
    targetPhraseId: "db-p2",
    connectedSpeechTip: "Pause slightly after root cause and stress race condition."
  }
};
