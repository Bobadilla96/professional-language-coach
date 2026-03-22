"use client";

import { useProgressStore } from "@/store/progress-store";

export function useProgress() {
  const progress = useProgressStore((s) => s.progress);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const savePracticeResult = useProgressStore((s) => s.savePracticeResult);
  const registerCommonError = useProgressStore((s) => s.registerCommonError);

  return { progress, completeLesson, savePracticeResult, registerCommonError };
}
