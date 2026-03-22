export type LessonLevel = "intermediate" | "upper-intermediate" | "advanced";

export type LessonTopic =
  | "git-workflow"
  | "code-review"
  | "debugging"
  | "technical-writing"
  | "incident-response"
  | "deployment"
  | "apis"
  | "testing"
  | "frontend-collaboration"
  | "backend-communication"
  | "cloud-architecture";

export interface VocabularyItem {
  id: string;
  term: string;
  pronunciation: string;
  meaning: string;
  contextExample: string;
}

export interface PhraseItem {
  id: string;
  sentence: string;
  scenario: "daily-standup" | "code-review" | "slack" | "pull-request" | "planning" | "debugging-session";
  explanation: string;
}

export interface AudioChallenge {
  id: string;
  instruction: string;
  targetPhraseId: string;
  connectedSpeechTip: string;
}

export interface Lesson {
  id: string;
  title: string;
  topic: LessonTopic;
  level: LessonLevel;
  description: string;
  estimatedMinutes: number;
  vocabulary: VocabularyItem[];
  phrases: PhraseItem[];
  audioChallenge: AudioChallenge;
  completed: boolean;
  sourceTitle?: string;
  sourceUrl?: string;
}
