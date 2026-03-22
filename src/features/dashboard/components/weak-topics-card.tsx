import { Card } from "@/components/ui/card";
import { useUiText } from "@/hooks/use-ui-text";
import type { UserProgress } from "@/domain/models/progress";

export function WeakTopicsCard({ progress }: { progress: UserProgress }) {
  const { t, topicLabel } = useUiText();
  const weak = progress.topicProgress.filter((item) => item.accuracy < 60);

  return (
    <Card>
      <h3 className="text-sm font-semibold">{t("weakTopics")}</h3>
      <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
        {weak.length
          ? weak.map((item) => <li key={item.topic}>{topicLabel(item.topic)} ({item.accuracy}%)</li>)
          : <li>{t("noWeakTopics")}</li>}
      </ul>
    </Card>
  );
}
