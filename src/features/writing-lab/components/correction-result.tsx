"use client";

import type { CorrectionResult } from "@/domain/models/correction";
import { Card } from "@/components/ui/card";
import { useUiText } from "@/hooks/use-ui-text";

export function CorrectionResultView({ result }: { result: CorrectionResult | null }) {
  const { t } = useUiText();
  if (!result) return null;

  return (
    <Card className="space-y-2">
      <h3 className="text-sm font-semibold">{t("correctionResult")}</h3>
      <p className="text-xs text-slate-500">{t("original")}</p>
      <p className="text-sm">{result.original}</p>
      <p className="text-xs text-slate-500">{t("corrected")}</p>
      <p className="text-sm font-medium">{result.corrected}</p>
      <p className="text-xs text-slate-600 dark:text-slate-300">{result.explanation}</p>
    </Card>
  );
}
