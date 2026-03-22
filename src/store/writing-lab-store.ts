"use client";

import { create } from "zustand";
import type { CorrectionResult } from "@/domain/models/correction";

interface WritingLabStore {
  history: CorrectionResult[];
  pushResult: (result: CorrectionResult) => void;
  clearHistory: () => void;
}

export const useWritingLabStore = create<WritingLabStore>((set) => ({
  history: [],
  pushResult: (result) => set((state) => ({ history: [result, ...state.history].slice(0, 10) })),
  clearHistory: () => set({ history: [] })
}));
