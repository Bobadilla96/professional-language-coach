"use client";

import type { AudioChallenge } from "@/domain/models/lesson";
import { Card } from "@/components/ui/card";
import { useUiText } from "@/hooks/use-ui-text";

export function AudioChallengeCard({ challenge }: { challenge: AudioChallenge }) {
  const { t } = useUiText();

  return (
    <Card>
      <h3 className="text-sm font-semibold">{t("speakingChallenge")}</h3>
      <p className="mt-2 text-sm">{challenge.instruction}</p>
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{t("tip")}: {challenge.connectedSpeechTip}</p>
    </Card>
  );
}
