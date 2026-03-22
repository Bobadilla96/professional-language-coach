"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { useUiText } from "@/hooks/use-ui-text";
import { useHydrated } from "@/hooks/use-hydrated";
import type { UserProgress } from "@/domain/models/progress";

export function ProgressOverview({ progress }: { progress: UserProgress }) {
  const { t, topicLabel } = useUiText();
  const hydrated = useHydrated();
  const chartData = progress.topicProgress.map((topic) => ({ topic: topicLabel(topic.topic), accuracy: topic.accuracy }));

  return (
    <Card className="h-80">
      <h3 className="mb-4 text-sm font-semibold">{t("progressByTopic")}</h3>
      <div className="h-[260px] min-w-0">
        {hydrated ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" hide />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#0284c7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        )}
      </div>
    </Card>
  );
}
