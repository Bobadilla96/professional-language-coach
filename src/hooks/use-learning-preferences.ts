"use client";

import { useCallback, useEffect, useState } from "react";
import type { LearningPreferences } from "@/domain/models/learning-preferences";
import { useAuth } from "@/hooks/use-auth";
import { LEARNING_PREFERENCES_EVENT, buildDefaultLearningPreferences, getStoredLearningPreferences, setStoredLearningPreferences } from "@/lib/learning-preferences.client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  fetchLearningPreferences as fetchRemoteLearningPreferences,
  saveLearningPreferences as saveRemoteLearningPreferences
} from "@/lib/supabase/user-data.client";

export function useLearningPreferences(defaultCourseId: string, defaultLessonId: string) {
  const [preferences, setPreferences] = useState<LearningPreferences>(() =>
    buildDefaultLearningPreferences(defaultCourseId, defaultLessonId)
  );
  const [ready, setReady] = useState(false);
  const { user, ready: authReady, isAuthenticated } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const syncPreferences = async () => {
      const localPreferences = getStoredLearningPreferences(defaultCourseId, defaultLessonId);

      if (!authReady) return;

      if (isAuthenticated && user && isSupabaseConfigured()) {
        const remotePreferences = await fetchRemoteLearningPreferences(user.id, defaultCourseId, defaultLessonId);
        const nextPreferences = remotePreferences ?? localPreferences;

        if (!remotePreferences) {
          void saveRemoteLearningPreferences(user.id, nextPreferences);
        }

        if (!cancelled) {
          setPreferences(nextPreferences);
          setReady(true);
        }
        return;
      }

      if (!cancelled) {
        setPreferences(localPreferences);
        setReady(true);
      }
    };

    void syncPreferences();
    const syncLocalPreferences = () => {
      if (isAuthenticated && user && isSupabaseConfigured()) return;
      setPreferences(getStoredLearningPreferences(defaultCourseId, defaultLessonId));
    };

    window.addEventListener(LEARNING_PREFERENCES_EVENT, syncLocalPreferences);
    window.addEventListener("storage", syncLocalPreferences);

    return () => {
      cancelled = true;
      window.removeEventListener(LEARNING_PREFERENCES_EVENT, syncLocalPreferences);
      window.removeEventListener("storage", syncLocalPreferences);
    };
  }, [authReady, defaultCourseId, defaultLessonId, isAuthenticated, user]);

  const savePreferences = useCallback((nextPreferences: Omit<LearningPreferences, "updatedAt">) => {
    const next = {
      ...nextPreferences,
      updatedAt: new Date().toISOString()
    };

    setStoredLearningPreferences(next);
    setPreferences(next);
    if (authReady && isAuthenticated && user && isSupabaseConfigured()) {
      void saveRemoteLearningPreferences(user.id, next);
    }
  }, [authReady, isAuthenticated, user]);

  return {
    preferences,
    ready,
    savePreferences
  };
}
