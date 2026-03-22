"use client";

import { Textarea } from "@/components/ui/textarea";
import { useUiText } from "@/hooks/use-ui-text";

export function AnswerEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { t } = useUiText();
  return <Textarea rows={6} value={value} onChange={(event) => onChange(event.target.value)} placeholder={t("writeTechnicalSentence")} />;
}
