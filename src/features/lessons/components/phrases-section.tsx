"use client";

import type { PhraseItem } from "@/domain/models/lesson";
import { SectionTitle } from "@/components/common/section-title";
import { PhraseCard } from "@/components/lesson/phrase-card";
import { useUiText } from "@/hooks/use-ui-text";

export function PhrasesSection({ phrases }: { phrases: PhraseItem[] }) {
  const { t } = useUiText();

  return (
    <section className="space-y-3">
      <SectionTitle title={t("workplacePhrases")} description={t("workplacePhrasesDescription")} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {phrases.map((item) => <PhraseCard key={item.id} item={item} />)}
      </div>
    </section>
  );
}
