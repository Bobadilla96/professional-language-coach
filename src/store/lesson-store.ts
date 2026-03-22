"use client";

import { create } from "zustand";
import { lessons } from "@/data/lessons";

interface LessonStore {
  lessonIds: string[];
}

export const useLessonStore = create<LessonStore>(() => ({
  lessonIds: lessons.map((l) => l.id)
}));
