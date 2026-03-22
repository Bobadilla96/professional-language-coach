import type { Lesson } from "@/domain/models/lesson";

export const gitWorkflowLesson: Lesson = {
  id: "lesson-git-workflow-01",
  title: "Git and Workflow Essentials",
  topic: "git-workflow",
  level: "intermediate",
  description: "Learn key English terms used in Git workflows, pull requests, branch management, and team collaboration.",
  estimatedMinutes: 15,
  completed: false,
  sourceTitle: "GitHub Docs + Git-SCM",
  sourceUrl: "https://docs.github.com/en/get-started/using-github/github-flow",
  vocabulary: [
    {
      id: "v1",
      term: "Branch",
      pronunciation: "/branch/",
      meaning: "A separate line of development used to work on a feature, fix, or experiment.",
      contextExample: "Create a new branch before starting the bug fix."
    },
    {
      id: "v2",
      term: "Merge Conflict",
      pronunciation: "/merge conflict/",
      meaning: "A situation where Git cannot automatically combine changes from different branches.",
      contextExample: "I need to solve the merge conflict before opening the pull request."
    },
    {
      id: "v3",
      term: "Pull Request",
      pronunciation: "/pull request/",
      meaning: "A request to review and merge code changes into another branch.",
      contextExample: "Please review my pull request before the release."
    },
    {
      id: "v4",
      term: "Rebase",
      pronunciation: "/rebase/",
      meaning: "A Git operation used to replay commits on top of another base branch.",
      contextExample: "Rebase your branch with main to keep history clean."
    },
    {
      id: "v5",
      term: "Rollback",
      pronunciation: "/rollback/",
      meaning: "The process of reverting a deployment to a previous stable version.",
      contextExample: "We had to rollback the release after production errors."
    }
  ],
  phrases: [
    {
      id: "p1",
      sentence: "I am fixing the merge conflict before I open the pull request.",
      scenario: "pull-request",
      explanation: "Natural phrase for code preparation before review."
    },
    {
      id: "p2",
      sentence: "I rebased my branch with main to avoid integration issues.",
      scenario: "daily-standup",
      explanation: "Useful in stand-ups when reporting sync work."
    },
    {
      id: "p3",
      sentence: "We may need to rollback this deployment if the bug affects production.",
      scenario: "slack",
      explanation: "Common wording in urgent release discussions."
    }
  ],
  audioChallenge: {
    id: "a1",
    instruction: "Read aloud: I rebased my branch with main to avoid integration issues.",
    targetPhraseId: "p2",
    connectedSpeechTip: "In fluent speech, branch with main is pronounced as one rhythm group."
  }
};
