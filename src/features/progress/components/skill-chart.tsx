"use client";

import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { useUiText } from "@/hooks/use-ui-text";
import { useHydrated } from "@/hooks/use-hydrated";
import type { UserProgress } from "@/domain/models/progress";

export function SkillChart({ progress }: { progress: UserProgress }) {
  const { t, topicLabel } = useUiText();
  const hydrated = useHydrated();
  const data = progress.topicProgress.map((item) => ({ topic: topicLabel(item.topic), accuracy: item.accuracy }));

  return (
    <Card className="h-96">
      <h3 className="mb-4 text-sm font-semibold">{t("skillRadar")}</h3>
      <div className="h-[320px] min-w-0">
        {hydrated ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="topic" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Accuracy" dataKey="accuracy" stroke="#0284c7" fill="#0284c7" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        )}
      </div>
    </Card>
  );
}
