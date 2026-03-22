"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { AppLanguage } from "@/lib/language.client";
import { getStoredLanguage, LANGUAGE_CHANGE_EVENT, setStoredLanguage } from "@/lib/language.client";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useLanguage() {
  const language = useSyncExternalStore(subscribe, getStoredLanguage, () => "en" as AppLanguage);

  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  const setLanguage = useCallback((nextLanguage: AppLanguage) => {
    setStoredLanguage(nextLanguage);
  }, []);

  return { language, setLanguage };
}
