"use client";

import type { LearningGoal, ProfessionalTrack } from "@/domain/models/course";
import type { LearningPreferences } from "@/domain/models/learning-preferences";
import type { AppLanguage } from "@/lib/language.client";

export const LEARNING_PREFERENCES_KEY = "tech-english-learning-preferences";
export const LEARNING_PREFERENCES_EVENT = "tech-english-learning-preferences-changed";

export function buildDefaultLearningPreferences(defaultCourseId: string, defaultLessonId: string): LearningPreferences {
  return {
    nativeLanguage: "es",
    targetLanguage: "en",
    professionalTrack: "developer",
    learningGoal: "collaborate-at-work",
    targetCourseId: defaultCourseId,
    targetLessonId: defaultLessonId,
    updatedAt: new Date().toISOString()
  };
}

function isValidLanguage(value: string): value is AppLanguage {
  return value === "en" || value === "es" || value === "pt" || value === "fr";
}

function isValidTrack(value: string): value is ProfessionalTrack {
  return value === "developer" || value === "writing" || value === "conversation";
}

function isValidGoal(value: string): value is LearningGoal {
  return (
    value === "collaborate-at-work" ||
    value === "write-professionally" ||
    value === "speak-confidently" ||
    value === "understand-technical-docs" ||
    value === "prepare-interviews"
  );
}

function isValidPreferences(value: unknown): value is LearningPreferences {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.targetCourseId === "string" &&
    typeof record.targetLessonId === "string" &&
    typeof record.updatedAt === "string" &&
    typeof record.nativeLanguage === "string" &&
    typeof record.targetLanguage === "string" &&
    typeof record.professionalTrack === "string" &&
    typeof record.learningGoal === "string" &&
    isValidLanguage(record.nativeLanguage) &&
    isValidLanguage(record.targetLanguage) &&
    isValidTrack(record.professionalTrack) &&
    isValidGoal(record.learningGoal)
  );
}

export function getStoredLearningPreferences(defaultCourseId: string, defaultLessonId: string): LearningPreferences {
  if (typeof window === "undefined") return buildDefaultLearningPreferences(defaultCourseId, defaultLessonId);

  try {
    const raw = localStorage.getItem(LEARNING_PREFERENCES_KEY);
    if (!raw) return buildDefaultLearningPreferences(defaultCourseId, defaultLessonId);

    const parsed = JSON.parse(raw) as unknown;
    return isValidPreferences(parsed)
      ? parsed
      : buildDefaultLearningPreferences(defaultCourseId, defaultLessonId);
  } catch {
    return buildDefaultLearningPreferences(defaultCourseId, defaultLessonId);
  }
}

export function setStoredLearningPreferences(preferences: LearningPreferences) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LEARNING_PREFERENCES_KEY, JSON.stringify(preferences));
  window.dispatchEvent(new Event(LEARNING_PREFERENCES_EVENT));
}
