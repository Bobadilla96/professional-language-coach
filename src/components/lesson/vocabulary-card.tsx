import type { VocabularyItem } from "@/domain/models/lesson";
import { Card } from "@/components/ui/card";

export function VocabularyCard({ item }: { item: VocabularyItem }) {
  return (
    <Card>
      <p className="text-sm font-semibold">{item.term}</p>
      <p className="text-xs text-slate-500">{item.pronunciation}</p>
      <p className="mt-2 text-sm">{item.meaning}</p>
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{item.contextExample}</p>
    </Card>
  );
}
