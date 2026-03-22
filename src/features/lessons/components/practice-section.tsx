"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUiText } from "@/hooks/use-ui-text";

export function PracticeSection({ lessonId }: { lessonId: string }) {
  const { t } = useUiText();

  return (
    <div className="flex justify-end">
      <Link href={`/practice?lessonId=${lessonId}`}>
        <Button>{t("startPractice")}</Button>
      </Link>
    </div>
  );
}
