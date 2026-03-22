import { Card } from "@/components/ui/card";
import { useUiText } from "@/hooks/use-ui-text";
import type { LessonProgress } from "@/domain/models/progress";

export function LessonCompletionList({ items }: { items: LessonProgress[] }) {
  const { t, attemptCount } = useUiText();

  return (
    <Card>
      <h3 className="text-sm font-semibold">{t("lessonCompletion")}</h3>
      <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
        {items.length
          ? items.map((item) => <li key={item.lessonId}>{item.lessonId}: {item.score}% ({attemptCount(item.attempts)})</li>)
          : <li>{t("noLessonAttempts")}</li>}
      </ul>
    </Card>
  );
}
