"use client";

import { userProgressMock } from "@/data/mocks/user-progress.mock";
import type { AuthUser } from "@/domain/models/auth";
import type { CourseEnrollment } from "@/domain/models/course";
import type { LearningPreferences } from "@/domain/models/learning-preferences";
import type { LessonProgress, TopicProgress, UserProgress } from "@/domain/models/progress";
import { buildDefaultLearningPreferences } from "@/lib/learning-preferences.client";
import { createClient } from "./client";
import { isSupabaseConfigured } from "./config";

function isLessonProgress(value: unknown): value is LessonProgress {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.lessonId === "string" &&
    typeof record.completed === "boolean" &&
    typeof record.score === "number" &&
    typeof record.attempts === "number" &&
    (typeof record.lastPracticedAt === "string" || record.lastPracticedAt === null)
  );
}

function isTopicProgress(value: unknown): value is TopicProgress {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.topic === "string" &&
    typeof record.accuracy === "number" &&
    Array.isArray(record.weakPoints) &&
    Array.isArray(record.masteredTerms)
  );
}

function isUserProgress(value: unknown): value is UserProgress {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.currentLevel === "string" &&
    Array.isArray(record.completedLessons) &&
    typeof record.totalProgress === "number" &&
    typeof record.streak === "number" &&
    Array.isArray(record.commonErrors) &&
    Array.isArray(record.topicProgress) &&
    record.topicProgress.every(isTopicProgress) &&
    Array.isArray(record.lessonProgress) &&
    record.lessonProgress.every(isLessonProgress) &&
    Array.isArray(record.recentActivity)
  );
}

function isLearningPreferences(value: unknown): value is LearningPreferences {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.nativeLanguage === "string" &&
    typeof record.targetLanguage === "string" &&
    typeof record.professionalTrack === "string" &&
    typeof record.learningGoal === "string" &&
    typeof record.targetCourseId === "string" &&
    typeof record.targetLessonId === "string" &&
    typeof record.updatedAt === "string"
  );
}

function isCourseEnrollment(value: unknown): value is CourseEnrollment {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.courseId === "string" &&
    typeof record.enrolledAt === "string" &&
    typeof record.status === "string" &&
    (typeof record.currentLessonId === "string" || record.currentLessonId === null) &&
    typeof record.progressPercent === "number"
  );
}

export async function ensureProfile(user: AuthUser) {
  if (!isSupabaseConfigured()) return;

  const supabase = createClient();
  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      created_at: user.createdAt
    },
    { onConflict: "id" }
  );
}

export async function fetchLearningPreferences(userId: string, defaultCourseId: string, defaultLessonId: string) {
  if (!isSupabaseConfigured()) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("learning_preferences")
    .select("native_language, target_language, professional_track, learning_goal, target_course_id, target_lesson_id, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;

  const preferences: LearningPreferences = {
    nativeLanguage: data.native_language,
    targetLanguage: data.target_language,
    professionalTrack: data.professional_track,
    learningGoal: data.learning_goal,
    targetCourseId: data.target_course_id,
    targetLessonId: data.target_lesson_id,
    updatedAt: data.updated_at
  };

  return isLearningPreferences(preferences) ? preferences : buildDefaultLearningPreferences(defaultCourseId, defaultLessonId);
}

export async function saveLearningPreferences(userId: string, preferences: LearningPreferences) {
  if (!isSupabaseConfigured()) return;

  const supabase = createClient();
  await supabase.from("learning_preferences").upsert(
    {
      user_id: userId,
      native_language: preferences.nativeLanguage,
      target_language: preferences.targetLanguage,
      professional_track: preferences.professionalTrack,
      learning_goal: preferences.learningGoal,
      target_course_id: preferences.targetCourseId,
      target_lesson_id: preferences.targetLessonId,
      updated_at: preferences.updatedAt
    },
    { onConflict: "user_id" }
  );
}

export async function fetchUserProgress(userId: string) {
  if (!isSupabaseConfigured()) return null;

  const supabase = createClient();
  const { data, error } = await supabase.from("user_progress").select("progress").eq("user_id", userId).maybeSingle();

  if (error || !data) return null;
  return isUserProgress(data.progress) ? data.progress : structuredClone(userProgressMock);
}

export async function saveUserProgress(userId: string, progress: UserProgress) {
  if (!isSupabaseConfigured()) return;

  const supabase = createClient();
  await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      progress,
      updated_at: new Date().toISOString()
    },
    { onConflict: "user_id" }
  );
}

export async function fetchCourseEnrollments(userId: string) {
  if (!isSupabaseConfigured()) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("course_enrollments")
    .select("course_id, enrolled_at, status, current_lesson_id, progress_percent")
    .eq("user_id", userId);

  if (error || !data) return null;

  const enrollments = data.map((entry) => ({
    courseId: entry.course_id,
    enrolledAt: entry.enrolled_at,
    status: entry.status,
    currentLessonId: entry.current_lesson_id,
    progressPercent: entry.progress_percent
  }));

  return enrollments.every(isCourseEnrollment) ? enrollments : null;
}

export async function saveCourseEnrollments(userId: string, enrollments: CourseEnrollment[]) {
  if (!isSupabaseConfigured()) return;

  const supabase = createClient();
  await supabase.from("course_enrollments").delete().eq("user_id", userId);

  if (!enrollments.length) return;

  await supabase.from("course_enrollments").upsert(
    enrollments.map((enrollment) => ({
      user_id: userId,
      course_id: enrollment.courseId,
      enrolled_at: enrollment.enrolledAt,
      status: enrollment.status,
      current_lesson_id: enrollment.currentLessonId,
      progress_percent: enrollment.progressPercent,
      updated_at: new Date().toISOString()
    })),
    { onConflict: "user_id,course_id" }
  );
}
