import type { LessonTopic, LessonLevel } from "./lesson";

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  attempts: number;
  lastPracticedAt: string | null;
}

export interface TopicProgress {
  topic: LessonTopic;
  accuracy: number;
  weakPoints: string[];
  masteredTerms: string[];
}

export interface UserProgress {
  currentLevel: LessonLevel;
  completedLessons: string[];
  totalProgress: number;
  streak: number;
  commonErrors: string[];
  topicProgress: TopicProgress[];
  lessonProgress: LessonProgress[];
  recentActivity: string[];
}
