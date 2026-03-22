import type { UserProgress } from "@/domain/models/progress";

export const userProgressMock: UserProgress = {
  currentLevel: "intermediate",
  completedLessons: [],
  totalProgress: 0,
  streak: 1,
  commonErrors: [],
  topicProgress: [
    { topic: "git-workflow", accuracy: 0, weakPoints: [], masteredTerms: [] },
    { topic: "code-review", accuracy: 0, weakPoints: [], masteredTerms: [] },
    { topic: "debugging", accuracy: 0, weakPoints: [], masteredTerms: [] },
    { topic: "apis", accuracy: 0, weakPoints: [], masteredTerms: [] },
    { topic: "technical-writing", accuracy: 0, weakPoints: [], masteredTerms: [] },
    { topic: "incident-response", accuracy: 0, weakPoints: [], masteredTerms: [] }
  ],
  lessonProgress: [],
  recentActivity: []
};
