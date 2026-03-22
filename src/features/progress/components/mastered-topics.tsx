import { Card } from "@/components/ui/card";
import { useUiText } from "@/hooks/use-ui-text";
import type { UserProgress } from "@/domain/models/progress";

export function MasteredTopics({ progress }: { progress: UserProgress }) {
  const { t, topicLabel } = useUiText();
  const mastered = progress.topicProgress.filter((topic) => topic.accuracy >= 70);

  return (
    <Card>
      <h3 className="text-sm font-semibold">{t("masteredTopics")}</h3>
      <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
        {mastered.length
          ? mastered.map((topic) => <li key={topic.topic}>{topicLabel(topic.topic)} ({topic.accuracy}%)</li>)
          : <li>{t("noMasteredTopics")}</li>}
      </ul>
    </Card>
  );
}
