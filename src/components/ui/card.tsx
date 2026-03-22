import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
}

export function Card({ className, children }: PropsWithChildren<CardProps>) {
  return (
    <section className={cn("rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900", className)}>
      {children}
    </section>
  );
}
