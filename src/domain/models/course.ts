import type { LessonLevel } from "./lesson";

export type ProfessionalTrack = "developer" | "writing" | "conversation";
export type LearningGoal =
  | "collaborate-at-work"
  | "write-professionally"
  | "speak-confidently"
  | "understand-technical-docs"
  | "prepare-interviews";

export type CourseStatus = "published" | "coming-soon";

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessonIds: string[];
  outcome: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  level: LessonLevel;
  professionalTrack: ProfessionalTrack;
  goals: LearningGoal[];
  estimatedHours: number;
  status: CourseStatus;
  coverLabel: string;
  outcomes: string[];
  modules: CourseModule[];
}

export interface CourseEnrollment {
  courseId: string;
  enrolledAt: string;
  status: "active" | "completed";
  currentLessonId: string | null;
  progressPercent: number;
}
