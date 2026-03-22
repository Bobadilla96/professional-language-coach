"use client";

import Link from "next/link";
import { Bot, ChartLine, Languages, MicVocal } from "lucide-react";
import { LearningPreferencesCard } from "@/components/common/learning-preferences-card";
import { LanguageSelector } from "@/components/common/language-selector";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { publishedCourses } from "@/data/courses";
import { useUiText } from "@/hooks/use-ui-text";

export default function HomePage() {
  const { t } = useUiText();
  const highlights = [
    {
      title: t("highlightLessonsTitle"),
      description: t("highlightLessonsDescription"),
      icon: Languages
    },
    {
      title: t("highlightPracticeTitle"),
      description: t("highlightPracticeDescription"),
      icon: ChartLine
    },
    {
      title: t("highlightWritingTitle"),
      description: t("highlightWritingDescription"),
      icon: MicVocal
    },
    {
      title: t("highlightAiTitle"),
      description: t("highlightAiDescription"),
      icon: Bot
    }
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.16),transparent_42%),radial-gradient(circle_at_85%_15%,rgba(56,189,248,0.12),transparent_35%)]" />

      <div className="relative mx-auto w-full max-w-6xl space-y-8">
        <header className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sky-600">{t("project01")}</p>
              <h1 className="text-lg font-semibold">{t("appName")}</h1>
            </div>

            <div className="flex items-center gap-2">
              <LanguageSelector compact />
              <ThemeToggle />
              <Link href="/login" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                {t("login")}
              </Link>
              <Link href="/register" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500">
                {t("createAccount")}
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.25fr_0.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-[0.25em] text-sky-600">{t("landingKicker")}</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight">{t("landingTitle")}</h2>
            <p className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300">{t("landingDescription")}</p>

            <div className="mt-6 max-w-2xl rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{t("personalSignatureLabel")}</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{t("personalSignatureTitle")}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{t("personalSignatureDescription")}</p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/register" className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500">
                {t("startFree")}
              </Link>
              <Link href="/login" className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                {t("continueLearning")}
              </Link>
            </div>
          </div>

          <LearningPreferencesCard courses={publishedCourses} />
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="inline-flex rounded-lg bg-sky-100 p-2 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                  <Icon size={18} />
                </div>
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
              </article>
            );
          })}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{t("valuesKicker")}</p>
          <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
            <div>
              <h3 className="text-2xl font-semibold">{t("valuesTitle")}</h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">{t("valuesDescription")}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <p className="text-sm font-semibold">{t("humilityValueTitle")}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{t("humilityValueDescription")}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <p className="text-sm font-semibold">{t("clarityValueTitle")}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{t("clarityValueDescription")}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <p className="text-sm font-semibold">{t("constancyValueTitle")}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{t("constancyValueDescription")}</p>
              </article>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
