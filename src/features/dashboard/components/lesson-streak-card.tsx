import { Card } from "@/components/ui/card";
import { useUiText } from "@/hooks/use-ui-text";

export function LessonStreakCard({ streak }: { streak: number }) {
  const { t, dayCount } = useUiText();

  return (
    <Card>
      <h3 className="text-sm font-semibold">{t("studyStreak")}</h3>
      <p className="mt-2 text-2xl font-semibold">{dayCount(streak)}</p>
    </Card>
  );
}
