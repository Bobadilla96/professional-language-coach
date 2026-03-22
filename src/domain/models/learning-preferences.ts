import type { LearningGoal, ProfessionalTrack } from "./course";
import type { AppLanguage } from "@/lib/language.client";

export interface LearningPreferences {
  nativeLanguage: AppLanguage;
  targetLanguage: AppLanguage;
  professionalTrack: ProfessionalTrack;
  learningGoal: LearningGoal;
  targetCourseId: string;
  targetLessonId: string;
  updatedAt: string;
}
