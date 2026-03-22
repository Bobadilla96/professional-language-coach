"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Course, LearningGoal, ProfessionalTrack } from "@/domain/models/course";
import type { LearningPreferences } from "@/domain/models/learning-preferences";
import type { AppLanguage } from "@/lib/language.client";
import { getCourseFirstLessonId } from "@/data/courses";
import { lessonsById } from "@/data/lessons";
import { useCourseEnrollments } from "@/hooks/use-course-enrollments";
import { useLearningPreferences } from "@/hooks/use-learning-preferences";
import { useProgress } from "@/hooks/use-progress";
import { useUiText } from "@/hooks/use-ui-text";

const LANGUAGE_OPTIONS: Array<{ value: AppLanguage; label: string }> = [
  { value: "en", label: "English" },
  { value: "es", label: "Espanol" },
  { value: "pt", label: "Portugues" },
  { value: "fr", label: "Francais" }
];

const TRACK_OPTIONS: ProfessionalTrack[] = ["developer", "writing", "conversation"];
const GOAL_OPTIONS: LearningGoal[] = [
  "collaborate-at-work",
  "write-professionally",
  "speak-confidently",
  "understand-technical-docs",
  "prepare-interviews"
];

export function LearningPreferencesCard({ courses }: { courses: Course[] }) {
  const availableCourses = useMemo(() => courses.filter((course) => course.status === "published"), [courses]);
  const defaultCourseId = availableCourses[0]?.id ?? "";
  const defaultLessonId = getCourseFirstLessonId(defaultCourseId);
  const { t, trackLabel, goalLabel } = useUiText();
  const { progress } = useProgress();
  const { enrollInCourse } = useCourseEnrollments();
  const { preferences, savePreferences } = useLearningPreferences(defaultCourseId, defaultLessonId);
  const [draft, setDraft] = useState<Partial<Omit<LearningPreferences, "updatedAt">>>({});
  const [saved, setSaved] = useState(false);
  const selectedTrack = draft.professionalTrack ?? preferences.professionalTrack;
  const filteredCourses = availableCourses.filter((course) => course.professionalTrack === selectedTrack);
  const fallbackCourse = filteredCourses[0] ?? availableCourses[0];
  const selectedCourseId = draft.targetCourseId ?? preferences.targetCourseId ?? fallbackCourse?.id ?? defaultCourseId;
  const selectedCourse = availableCourses.find((course) => course.id === selectedCourseId) ?? fallbackCourse;
  const selectedCourseLessonIds = selectedCourse?.modules.flatMap((module) => module.lessonIds) ?? [];
  const formValues = {
    nativeLanguage: draft.nativeLanguage ?? preferences.nativeLanguage,
    targetLanguage: draft.targetLanguage ?? preferences.targetLanguage,
    professionalTrack: selectedTrack,
    learningGoal: draft.learningGoal ?? preferences.learningGoal,
    targetCourseId: selectedCourse?.id ?? defaultCourseId,
    targetLessonId:
      draft.targetLessonId ??
      preferences.targetLessonId ??
      getCourseFirstLessonId(selectedCourse?.id ?? defaultCourseId) ??
      defaultLessonId
  };

  const selectedLesson = lessonsById[formValues.targetLessonId] ?? lessonsById[getCourseFirstLessonId(formValues.targetCourseId)];

  const handleSave = () => {
    if (!formValues.targetCourseId || !formValues.targetLessonId) return;
    savePreferences(formValues);
    enrollInCourse(formValues.targetCourseId, progress);
    setDraft({});
    setSaved(true);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t("learningSetupKicker")}</p>
      <h3 className="mt-3 text-2xl font-semibold">{t("learningSetupTitle")}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{t("learningSetupDescription")}</p>

      <div className="mt-5 space-y-4">
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{t("nativeLanguageField")}</span>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
            value={formValues.nativeLanguage}
            onChange={(event) => {
              setSaved(false);
              setDraft((current) => ({ ...current, nativeLanguage: event.target.value as AppLanguage }));
            }}
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1 text-sm">
          <span className="font-medium">{t("targetLanguageField")}</span>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
            value={formValues.targetLanguage}
            onChange={(event) => {
              setSaved(false);
              setDraft((current) => ({ ...current, targetLanguage: event.target.value as AppLanguage }));
            }}
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1 text-sm">
          <span className="font-medium">{t("professionalTrackField")}</span>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
            value={formValues.professionalTrack}
            onChange={(event) => {
              const nextTrack = event.target.value as ProfessionalTrack;
              const nextCourse = availableCourses.find((course) => course.professionalTrack === nextTrack) ?? availableCourses[0];
              const nextLessonId = getCourseFirstLessonId(nextCourse?.id ?? defaultCourseId);
              setSaved(false);
              setDraft((current) => ({
                ...current,
                professionalTrack: nextTrack,
                targetCourseId: nextCourse?.id ?? defaultCourseId,
                targetLessonId: nextLessonId
              }));
            }}
          >
            {TRACK_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {trackLabel(option)}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1 text-sm">
          <span className="font-medium">{t("learningGoalField")}</span>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
            value={formValues.learningGoal}
            onChange={(event) => {
              setSaved(false);
              setDraft((current) => ({ ...current, learningGoal: event.target.value as LearningGoal }));
            }}
          >
            {GOAL_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {goalLabel(option)}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1 text-sm">
          <span className="font-medium">{t("targetCourseField")}</span>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
            value={formValues.targetCourseId}
            onChange={(event) => {
              const nextCourseId = event.target.value;
              const nextLessonId = getCourseFirstLessonId(nextCourseId);
              setSaved(false);
              setDraft((current) => ({ ...current, targetCourseId: nextCourseId, targetLessonId: nextLessonId }));
            }}
          >
            {filteredCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1 text-sm">
          <span className="font-medium">{t("targetLessonField")}</span>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
            value={formValues.targetLessonId}
            onChange={(event) => {
              setSaved(false);
              setDraft((current) => ({ ...current, targetLessonId: event.target.value }));
            }}
          >
            {selectedCourseLessonIds.map((lessonId) => (
              <option key={lessonId} value={lessonId}>
                {lessonsById[lessonId]?.title ?? lessonId}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 dark:border-slate-700 dark:bg-slate-800/60">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{t("selectedPathLabel")}</p>
        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{t("selectedCourseLabel")}</p>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{selectedCourse?.title}</p>
        <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{t("selectedLessonLabel")}</p>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{selectedLesson?.title}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{selectedCourse?.description}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          {t("saveLearningPath")}
        </button>
        <Link
          href={selectedCourse ? `/courses/${selectedCourse.id}` : "/courses"}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          {t("goToSelectedCourse")}
        </Link>
      </div>

      {saved ? <p className="mt-4 text-sm text-emerald-700 dark:text-emerald-300">{t("learningPathSaved")}</p> : null}
    </section>
  );
}
