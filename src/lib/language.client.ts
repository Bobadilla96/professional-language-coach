"use client";

export type AppLanguage = "en" | "es" | "pt" | "fr";

export const LANGUAGE_KEY = "tech-english-language";
export const LANGUAGE_CHANGE_EVENT = "tech-english-language-changed";

export const LANGUAGE_OPTIONS: Array<{ value: AppLanguage; label: string }> = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "pt", label: "Português" },
  { value: "fr", label: "Français" }
];

function isValidLanguage(value: string | null): value is AppLanguage {
  return value === "en" || value === "es" || value === "pt" || value === "fr";
}

export function getStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") return "en";
  const raw = localStorage.getItem(LANGUAGE_KEY);
  return isValidLanguage(raw) ? raw : "en";
}

export function setStoredLanguage(language: AppLanguage) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANGUAGE_KEY, language);
  window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
}
