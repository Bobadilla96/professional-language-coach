"use client";

import { useLanguage } from "@/hooks/use-language";
import { formatAttempts, formatDays, getCourseStatusLabel, getGoalLabel, getLevelLabel, getRoleLabel, getTopicLabel, getTrackLabel, getUiText } from "@/lib/ui-i18n";

export function useUiText() {
  const { language } = useLanguage();

  return {
    language,
    t: (key: Parameters<typeof getUiText>[1]) => getUiText(language, key),
    levelLabel: (level: Parameters<typeof getLevelLabel>[1]) => getLevelLabel(language, level),
    topicLabel: (topic: Parameters<typeof getTopicLabel>[1]) => getTopicLabel(language, topic),
    trackLabel: (track: Parameters<typeof getTrackLabel>[1]) => getTrackLabel(language, track),
    goalLabel: (goal: Parameters<typeof getGoalLabel>[1]) => getGoalLabel(language, goal),
    courseStatusLabel: (status: Parameters<typeof getCourseStatusLabel>[1]) => getCourseStatusLabel(language, status),
    roleLabel: (role: Parameters<typeof getRoleLabel>[1]) => getRoleLabel(language, role),
    dayCount: (count: number) => formatDays(language, count),
    attemptCount: (count: number) => formatAttempts(language, count)
  };
}
