import { Card } from "@/components/ui/card";
import { useUiText } from "@/hooks/use-ui-text";

export function CommonErrorsPanel({ errors }: { errors: string[] }) {
  const { t } = useUiText();

  return (
    <Card>
      <h3 className="text-sm font-semibold">{t("commonErrors")}</h3>
      <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
        {errors.length ? errors.map((error) => <li key={error}>{error}</li>) : <li>{t("noRepeatedErrors")}</li>}
      </ul>
    </Card>
  );
}
