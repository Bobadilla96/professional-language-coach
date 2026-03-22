import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  className?: string;
}

export function Badge({ className, children }: PropsWithChildren<BadgeProps>) {
  return <span className={cn("rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200", className)}>{children}</span>;
}
