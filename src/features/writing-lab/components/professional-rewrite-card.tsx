"use client";

import type { CorrectionResult } from "@/domain/models/correction";
import { Card } from "@/components/ui/card";
import { useUiText } from "@/hooks/use-ui-text";

export function ProfessionalRewriteCard({ result }: { result: CorrectionResult | null }) {
  const { t } = useUiText();
  if (!result) return null;

  return (
    <Card>
      <h3 className="text-sm font-semibold">{t("professionalRewrite")}</h3>
      <p className="mt-2 text-sm">{result.professionalRewrite}</p>
    </Card>
  );
}
