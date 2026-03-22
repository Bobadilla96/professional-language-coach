"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchCourseEnrollments, saveCourseEnrollments } from "@/lib/supabase/user-data.client";
import { useCourseEnrollmentStore } from "@/store/course-enrollment-store";
import { useProgressStore } from "@/store/progress-store";

export function CourseEnrollmentSync() {
  const { user, ready, isAuthenticated } = useAuth();
  const enrollments = useCourseEnrollmentStore((state) => state.enrollments);
  const replaceEnrollments = useCourseEnrollmentStore((state) => state.replaceEnrollments);
  const syncProgress = useCourseEnrollmentStore((state) => state.syncProgress);
  const progress = useProgressStore((state) => state.progress);
  const initializedUserIdRef = useRef<string | null>(null);
  const skipSaveRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    syncProgress(progress);
  }, [progress, syncProgress]);

  useEffect(() => {
    if (!ready) return;

    if (!isAuthenticated || !user || !isSupabaseConfigured()) {
      initializedUserIdRef.current = null;
      return;
    }

    if (initializedUserIdRef.current === user.id) return;

    let cancelled = false;

    void (async () => {
      const remoteEnrollments = await fetchCourseEnrollments(user.id);
      if (cancelled) return;

      if (remoteEnrollments) {
        skipSaveRef.current = true;
        replaceEnrollments(remoteEnrollments);
        queueMicrotask(() => {
          skipSaveRef.current = false;
        });
      } else if (enrollments.length) {
        await saveCourseEnrollments(user.id, enrollments);
      }

      initializedUserIdRef.current = user.id;
    })();

    return () => {
      cancelled = true;
    };
  }, [enrollments, isAuthenticated, ready, replaceEnrollments, user]);

  useEffect(() => {
    if (!ready || !isAuthenticated || !user || !isSupabaseConfigured()) return;
    if (initializedUserIdRef.current !== user.id || skipSaveRef.current) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      void saveCourseEnrollments(user.id, enrollments);
    }, 700);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [enrollments, isAuthenticated, ready, user]);

  return null;
}
