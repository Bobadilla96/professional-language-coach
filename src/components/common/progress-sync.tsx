"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchUserProgress, saveUserProgress } from "@/lib/supabase/user-data.client";
import { useProgressStore } from "@/store/progress-store";

export function ProgressSync() {
  const { user, ready, isAuthenticated } = useAuth();
  const progress = useProgressStore((state) => state.progress);
  const replaceProgress = useProgressStore((state) => state.replaceProgress);
  const initializedUserIdRef = useRef<string | null>(null);
  const skipSaveRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!ready) return;

    if (!isAuthenticated || !user || !isSupabaseConfigured()) {
      initializedUserIdRef.current = null;
      return;
    }

    if (initializedUserIdRef.current === user.id) {
      return;
    }

    let cancelled = false;

    void (async () => {
      const remoteProgress = await fetchUserProgress(user.id);
      if (cancelled) return;

      if (remoteProgress) {
        skipSaveRef.current = true;
        replaceProgress(remoteProgress);
        queueMicrotask(() => {
          skipSaveRef.current = false;
        });
      } else {
        await saveUserProgress(user.id, progress);
      }

      initializedUserIdRef.current = user.id;
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, progress, ready, replaceProgress, user]);

  useEffect(() => {
    if (!ready || !isAuthenticated || !user || !isSupabaseConfigured()) return;
    if (initializedUserIdRef.current !== user.id || skipSaveRef.current) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      void saveUserProgress(user.id, progress);
    }, 700);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [isAuthenticated, progress, ready, user]);

  return null;
}
