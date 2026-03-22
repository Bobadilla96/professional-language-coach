import { Suspense } from "react";
import PracticeFeaturePage from "@/features/practice/page";

export const dynamic = "force-dynamic";

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">Loading practice...</div>}>
      <PracticeFeaturePage />
    </Suspense>
  );
}
