import type { CorrectionResult } from "@/domain/models/correction";
import { Card } from "@/components/ui/card";

export function CorrectionPanel({ result }: { result: CorrectionResult | null }) {
  if (!result) return null;

  return (
    <Card>
      <h3 className="text-sm font-semibold">Correction</h3>
      <p className="mt-2 text-xs text-slate-500">Original</p>
      <p className="text-sm">{result.original}</p>
      <p className="mt-2 text-xs text-slate-500">Corrected</p>
      <p className="text-sm font-medium">{result.corrected}</p>
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{result.explanation}</p>
    </Card>
  );
}
