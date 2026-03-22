"use client";

import type { AppLanguage } from "@/lib/language.client";
import { LANGUAGE_OPTIONS } from "@/lib/language.client";
import { useLanguage } from "@/hooks/use-language";
import { getUiText } from "@/lib/ui-i18n";

interface LanguageSelectorProps {
  compact?: boolean;
}

export function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();
  const label = getUiText(language, "languageLabel");

  return (
    <label className={`inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-950 ${compact ? "" : "sm:px-3 sm:py-2 sm:text-sm"}`}>
      {!compact ? <span className="text-slate-500">{label}</span> : null}
      <select
        className="bg-transparent text-xs font-medium outline-none sm:text-sm"
        value={language}
        onChange={(event) => setLanguage(event.target.value as AppLanguage)}
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
