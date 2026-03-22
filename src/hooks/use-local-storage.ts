"use client";

import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    const raw = localStorage.getItem(key);
    if (!raw) return initialValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  });

  const updateValue = (next: T) => {
    setValue(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(next));
    }
  };

  return [value, updateValue] as const;
}
