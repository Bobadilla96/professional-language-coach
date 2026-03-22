import { Card } from "@/components/ui/card";
import { useUiText } from "@/hooks/use-ui-text";

export function RecentActivityCard({ activity }: { activity: string[] }) {
  const { t } = useUiText();

  return (
    <Card>
      <h3 className="text-sm font-semibold">{t("recentActivity")}</h3>
      <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
        {activity.length ? activity.map((item, index) => <li key={`${item}-${index}`}>{item}</li>) : <li>{t("noActivity")}</li>}
      </ul>
    </Card>
  );
}
