"use client";

import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { LanguageSelector } from "@/components/common/language-selector";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { useUiText } from "@/hooks/use-ui-text";
import { useProgress } from "@/hooks/use-progress";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

function resolveTitle(pathname: string, t: ReturnType<typeof useUiText>["t"]) {
  if (pathname.startsWith("/bbc/")) return t("bbcUnitDetail");
  if (pathname.startsWith("/bbc")) return t("bbcLibrary");
  if (pathname.startsWith("/courses/")) return t("courseDetail");
  if (pathname.startsWith("/lessons/")) return t("lessonDetail");
  if (pathname.startsWith("/dashboard")) return t("dashboard");
  if (pathname.startsWith("/courses")) return t("courses");
  if (pathname.startsWith("/lessons")) return t("lessons");
  if (pathname.startsWith("/practice")) return t("practice");
  if (pathname.startsWith("/conversation")) return t("conversation");
  if (pathname.startsWith("/progress")) return t("progress");
  if (pathname.startsWith("/writing-lab")) return t("writingLab");
  return t("appName");
}

export function Header() {
  const pathname = usePathname();
  const { progress } = useProgress();
  const { user, logout } = useAuth();
  const { language, t, roleLabel } = useUiText();
  const userName = user?.email === "demo@coach.dev" && language === "es" ? t("demoDeveloperName") : user?.name;

  return (
    <header className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">{t("project01")}</p>
          <h1 className="text-xl font-semibold">{resolveTitle(pathname, t)}</h1>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden rounded-lg border border-slate-200 px-3 py-1.5 text-right text-xs dark:border-slate-700 sm:block">
              <p className="font-semibold text-slate-700 dark:text-slate-100">{userName}</p>
              <p className="uppercase tracking-[0.12em] text-slate-500">{roleLabel(user.role)}</p>
            </div>
          ) : null}

          <LanguageSelector compact />
          <ThemeToggle />
          <Button variant="secondary" onClick={logout}>
            <LogOut size={15} />
            <span className="ml-2 hidden sm:inline">{t("logout")}</span>
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500">
          <span>{t("globalProgress")}</span>
          <span>{progress.totalProgress}%</span>
        </div>
        <Progress value={progress.totalProgress} />
      </div>
    </header>
  );
}
