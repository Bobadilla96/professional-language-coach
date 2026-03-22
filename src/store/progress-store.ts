"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { lessons } from "@/data/lessons";
import { userProgressMock } from "@/data/mocks/user-progress.mock";
import type { LessonTopic } from "@/domain/models/lesson";
import type { LessonProgress, UserProgress } from "@/domain/models/progress";
import { calculateTotalProgress } from "@/lib/progress-engine";

interface ProgressStore {
  progress: UserProgress;
  replaceProgress: (progress: UserProgress) => void;
  completeLesson: (lessonId: string) => void;
  savePracticeResult: (lessonId: string, score: number, topic: LessonTopic) => void;
  registerCommonError: (error: string) => void;
  toggleLevel: (level: UserProgress["currentLevel"]) => void;
  resetProgress: () => void;
}

function upsertLessonProgress(entries: LessonProgress[], patch: LessonProgress): LessonProgress[] {
  const index = entries.findIndex((e) => e.lessonId === patch.lessonId);
  if (index === -1) return [...entries, patch];
  const next = [...entries];
  next[index] = patch;
  return next;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: userProgressMock,
      replaceProgress: (progress) => set({ progress }),

      completeLesson: (lessonId) => {
        const prev = get().progress;
        const completedLessons = prev.completedLessons.includes(lessonId)
          ? prev.completedLessons
          : [...prev.completedLessons, lessonId];
        const totalProgress = calculateTotalProgress({ ...prev, completedLessons }, lessons.length);

        set({
          progress: {
            ...prev,
            completedLessons,
            totalProgress,
            recentActivity: [`Completed ${lessonId}`, ...prev.recentActivity].slice(0, 8)
          }
        });
      },

      savePracticeResult: (lessonId, score, topic) => {
        const prev = get().progress;
        const current = prev.lessonProgress.find((x) => x.lessonId === lessonId);
        const attempts = (current?.attempts ?? 0) + 1;
        const lessonProgress: LessonProgress = {
          lessonId,
          completed: score >= 70,
          score,
          attempts,
          lastPracticedAt: new Date().toISOString()
        };

        const nextLessonProgress = upsertLessonProgress(prev.lessonProgress, lessonProgress);
        const topicProgress = prev.topicProgress.map((t) =>
          t.topic === topic
            ? {
                ...t,
                accuracy: Math.round(((t.accuracy * Math.max(0, attempts - 1)) + score) / attempts),
                weakPoints: score < 70 ? [...new Set([...t.weakPoints, "grammar", "precision"])] : t.weakPoints
              }
            : t
        );

        set({
          progress: {
            ...prev,
            lessonProgress: nextLessonProgress,
            topicProgress,
            recentActivity: [`Practice ${lessonId}: ${score}%`, ...prev.recentActivity].slice(0, 8)
          }
        });
      },

      registerCommonError: (error) => {
        const prev = get().progress;
        const commonErrors = [...new Set([error, ...prev.commonErrors])].slice(0, 12);
        set({ progress: { ...prev, commonErrors } });
      },

      toggleLevel: (level) => {
        const prev = get().progress;
        set({ progress: { ...prev, currentLevel: level } });
      },

      resetProgress: () => set({ progress: userProgressMock })
    }),
    {
      name: "tech-english-progress",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
