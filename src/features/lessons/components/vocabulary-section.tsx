"use client";

import type { VocabularyItem } from "@/domain/models/lesson";
import { SectionTitle } from "@/components/common/section-title";
import { VocabularyCard } from "@/components/lesson/vocabulary-card";
import { useUiText } from "@/hooks/use-ui-text";

export function VocabularySection({ vocabulary }: { vocabulary: VocabularyItem[] }) {
  const { t } = useUiText();

  return (
    <section className="space-y-3">
      <SectionTitle title={t("vocabulary")} description={t("vocabularyDescription")} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {vocabulary.map((item) => <VocabularyCard key={item.id} item={item} />)}
      </div>
    </section>
  );
}
