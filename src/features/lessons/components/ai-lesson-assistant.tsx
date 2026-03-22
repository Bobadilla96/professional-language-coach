"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/use-language";
import { useUiText } from "@/hooks/use-ui-text";

interface AiAssistantProps {
  lessonId: string;
}

export function AiLessonAssistant({ lessonId }: AiAssistantProps) {
  const { language } = useLanguage();
  const { t } = useUiText();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("");

  const askAssistant = async () => {
    if (!question.trim() || loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/lesson-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          question: question.trim(),
          language
        })
      });

      const payload = (await response.json()) as { answer?: string; model?: string; error?: string };
      if (!response.ok || !payload.answer) {
        setError(payload.error ?? "Could not fetch an answer from the AI assistant.");
        setAnswer("");
        return;
      }

      setAnswer(payload.answer);
      setModel(payload.model ?? "openrouter/free");
    } catch {
      setError("Network error while contacting AI assistant.");
      setAnswer("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex rounded-lg bg-sky-100 p-2 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
          <Bot size={16} />
        </span>
        <div>
          <p className="text-sm font-semibold">{t("aiLessonAssistant")}</p>
          <p className="text-xs text-slate-500">{t("aiLessonAssistantDescription")}</p>
        </div>
      </div>

      <Textarea
        rows={3}
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder={t("aiAskPlaceholder")}
      />

      <div className="flex justify-end">
        <Button onClick={askAssistant} disabled={loading || !question.trim()}>
          {loading ? t("thinking") : t("askAi")}
        </Button>
      </div>

      {error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/20 dark:text-rose-300">
          {error}
        </p>
      ) : null}

      {answer ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
          <p className="text-sm whitespace-pre-line">{answer}</p>
          {model ? <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-slate-500">Model: {model}</p> : null}
        </div>
      ) : null}
    </Card>
  );
}
