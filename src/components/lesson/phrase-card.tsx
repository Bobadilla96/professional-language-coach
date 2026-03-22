import type { PhraseItem } from "@/domain/models/lesson";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function PhraseCard({ item }: { item: PhraseItem }) {
  return (
    <Card>
      <Badge>{item.scenario}</Badge>
      <p className="mt-2 text-sm font-semibold">{item.sentence}</p>
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{item.explanation}</p>
    </Card>
  );
}
