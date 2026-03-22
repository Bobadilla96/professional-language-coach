"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, ChartColumnBig, GraduationCap, Headphones, LayoutDashboard, MessagesSquare, PenSquare, PencilRuler } from "lucide-react";
import { AudioLessonPlayer } from "@/components/common/audio-lesson-player";
import { useUiText } from "@/hooks/use-ui-text";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useUiText();
  const bbcUnitMatch = pathname.match(/^\/bbc\/(\d+)$/);
  const currentBbcUnit = bbcUnitMatch ? Number(bbcUnitMatch[1]) : null;

  const items = [
    { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/courses", label: t("courses"), icon: BookOpenText },
    { href: "/lessons", label: t("lessons"), icon: GraduationCap },
    { href: "/bbc", label: t("bbcLibrary"), icon: Headphones },
    { href: "/practice", label: t("practice"), icon: PencilRuler },
    { href: "/conversation", label: t("conversation"), icon: MessagesSquare },
    { href: "/progress", label: t("progress"), icon: ChartColumnBig },
    { href: "/writing-lab", label: t("writingLab"), icon: PenSquare }
  ];

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto">
      <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-800/70">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t("appName")}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{t("personalSignatureTitle")}</p>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                active ? "bg-sky-100 text-sky-700 dark:bg-sky-950/30 dark:text-sky-300" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 px-3 py-3 dark:border-slate-700">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t("humilityValueTitle")}</p>
        <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{t("humilityValueDescription")}</p>
      </div>

      {currentBbcUnit ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3 dark:border-slate-700 dark:bg-slate-800/60">
          <AudioLessonPlayer
            src={`/api/bbc/${currentBbcUnit}/audio`}
            title={`Audio Unit ${String(currentBbcUnit).padStart(2, "0")}`}
            description="Reproductor rapido visible mientras lees la unidad."
            compact
            preloadMode="auto"
          />
        </div>
      ) : null}
    </aside>
  );
}
