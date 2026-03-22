"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

const THEME_KEY = "tech-english-theme";
const THEME_CHANGE_EVENT = "tech-english-theme-changed";

function getStoredTheme() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(THEME_KEY) === "dark";
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function setStoredTheme(nextDark: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, nextDark ? "dark" : "light");
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function useTheme() {
  const dark = useSyncExternalStore(subscribe, getStoredTheme, () => false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggleTheme = useCallback(() => {
    setStoredTheme(!dark);
  }, [dark]);

  return { dark, toggleTheme };
}
