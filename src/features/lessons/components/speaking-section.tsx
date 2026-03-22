import type { AudioChallenge } from "@/domain/models/lesson";
import { AudioChallengeCard } from "@/components/lesson/audio-challenge-card";

export function SpeakingSection({ challenge }: { challenge: AudioChallenge }) {
  return <AudioChallengeCard challenge={challenge} />;
}
