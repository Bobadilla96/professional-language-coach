"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useUiText } from "@/hooks/use-ui-text";

export function ThemeToggle() {
  const { dark, toggleTheme } = useTheme();
  const { t } = useUiText();

  return (
    <Button variant="secondary" onClick={toggleTheme}>
      {dark ? <Sun size={16} /> : <Moon size={16} />}
      <span className="ml-2">{dark ? t("light") : t("dark")}</span>
    </Button>
  );
}
