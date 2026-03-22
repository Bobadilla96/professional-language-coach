"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquareText, Mic, Volume2 } from "lucide-react";
import { SectionTitle } from "@/components/common/section-title";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { conversationScenarios } from "@/data/conversation/scenarios";
import type { ConversationCoachResponse, ConversationTurn } from "@/domain/models/conversation";
import { useUiText } from "@/hooks/use-ui-text";

const SAMPLE_RATE = 24_000;

interface VibeVoiceConfigResponse {
  available: boolean;
  baseUrl: string;
  voices: string[];
  defaultVoice: string | null;
  error?: string;
}

function toWsUrl(baseUrl: string, text: string, voice: string) {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const params = new URLSearchParams({
    text,
    voice,
    cfg: "1.5",
    steps: "5"
  });

  return `${normalizedBase.replace(/^http/, "ws")}/stream?${params.toString()}`;
}

function pcm16ToWavBlob(pcmBytes: Uint8Array, sampleRate: number) {
  const headerSize = 44;
  const wav = new Uint8Array(headerSize + pcmBytes.length);
  const view = new DataView(wav.buffer);

  const writeString = (offset: number, value: string) => {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + pcmBytes.length, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, pcmBytes.length, true);
  wav.set(pcmBytes, headerSize);

  return new Blob([wav], { type: "audio/wav" });
}

function mergeChunks(chunks: Uint8Array[]) {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const merged = new Uint8Array(totalLength);
  let cursor = 0;

  for (const chunk of chunks) {
    merged.set(chunk, cursor);
    cursor += chunk.length;
  }

  return merged;
}

export default function ConversationFeaturePage() {
  const { language, t } = useUiText();
  const [scenarioId, setScenarioId] = useState(conversationScenarios[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [vibevoiceConfig, setVibevoiceConfig] = useState<VibeVoiceConfigResponse | null>(null);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioSourceText, setAudioSourceText] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const localizedScenarios = useMemo(() => {
    if (language !== "es") return conversationScenarios;

    const translations: Record<string, { title: string; context: string; objective: string }> = {
      "daily-standup": {
        title: "Daily standup",
        context: "Estas reportando progreso, bloqueos y siguiente paso en un standup de 2 minutos.",
        objective: "Hablar con claridad usando actualizaciones breves de estado."
      },
      "code-review": {
        title: "Discusion de code review",
        context: "Necesitas explicar los cambios de tu pull request y responder dudas del reviewer.",
        objective: "Usar redaccion colaborativa y profesional."
      },
      "incident-update": {
        title: "Actualizacion de incidente en produccion",
        context: "Un servicio se degrado y necesitas comunicar impacto y mitigacion por Slack.",
        objective: "Usar vocabulario de incidentes con precision y tono calmo."
      },
      "api-alignment": {
        title: "Alineacion API frontend/backend",
        context: "Necesitas alinear contrato de payload y status codes antes del release.",
        objective: "Negociar cambios tecnicos sin ambiguedad."
      }
    };

    return conversationScenarios.map((scenario) => ({
      ...scenario,
      ...(translations[scenario.id] ?? {})
    }));
  }, [language]);

  const activeScenario = useMemo(
    () => localizedScenarios.find((item) => item.id === scenarioId) ?? localizedScenarios[0],
    [localizedScenarios, scenarioId]
  );

  useEffect(() => {
    let mounted = true;

    void fetch("/api/vibevoice/config", { cache: "no-store" })
      .then((response) => response.json() as Promise<VibeVoiceConfigResponse>)
      .then((payload) => {
        if (!mounted) return;
        setVibevoiceConfig(payload);
        if (payload.defaultVoice) setSelectedVoice(payload.defaultVoice);
        else if (payload.voices[0]) setSelectedVoice(payload.voices[0]);
      })
      .catch(() => {
        if (!mounted) return;
        setVibevoiceConfig({
          available: false,
          baseUrl: process.env.NEXT_PUBLIC_VIBEVOICE_BASE_URL ?? "http://127.0.0.1:8000",
          voices: [],
          defaultVoice: null,
          error: language === "es" ? "No se pudo cargar la configuracion de VibeVoice." : "Could not load VibeVoice configuration."
        });
      });

    return () => {
      mounted = false;
    };
  }, [language]);

  useEffect(() => {
    if (!audioUrl) return undefined;
    return () => URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  async function sendTurn() {
    if (!message.trim() || !activeScenario || loadingCoach) return;

    setLoadingCoach(true);
    setVoiceError("");

    const userTurn: ConversationTurn = {
      id: `turn-user-${Date.now()}`,
      role: "user",
      text: message.trim()
    };

    const historyInput = [...turns, userTurn].map((entry) => ({ role: entry.role, text: entry.text }));
    setTurns((previous) => [...previous, userTurn]);
    setMessage("");

    try {
      const response = await fetch("/api/ai/conversation-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: activeScenario.id,
          userMessage: userTurn.text,
          history: historyInput,
          language
        })
      });

      const payload = (await response.json()) as Partial<ConversationCoachResponse> & { error?: string };
      if (!response.ok || payload.error || !payload.coachReply || !payload.improvedSentence || !Array.isArray(payload.quickTips)) {
        setVoiceError(t("coachUnavailable"));
        return;
      }

      const coachTurn: ConversationTurn = {
        id: `turn-coach-${Date.now()}`,
        role: "coach",
        text: payload.coachReply,
        improvedSentence: payload.improvedSentence,
        quickTips: payload.quickTips
      };

      setTurns((previous) => [...previous, coachTurn]);
      setAudioSourceText(payload.coachReply);
    } catch {
      setVoiceError(t("networkErrorCoach"));
    } finally {
      setLoadingCoach(false);
    }
  }

  async function synthesizeWithVibeVoice(text: string) {
    const content = text.trim();
    if (!content) return;

    if (!vibevoiceConfig?.available || !selectedVoice) {
      setVoiceError(t("vibevoiceUnavailable"));
      return;
    }

    setVoiceStatus(t("generatingAudio"));
    setVoiceError("");
    setAudioSourceText(content);

    try {
      const wsUrl = toWsUrl(vibevoiceConfig.baseUrl, content, selectedVoice);
      const chunks: Uint8Array[] = [];

      await new Promise<void>((resolve, reject) => {
        const socket = new WebSocket(wsUrl);
        socket.binaryType = "arraybuffer";

        socket.onmessage = (event) => {
          if (typeof event.data === "string") return;
          if (event.data instanceof ArrayBuffer) {
            chunks.push(new Uint8Array(event.data));
            return;
          }

          if (event.data instanceof Blob) {
            void event.data.arrayBuffer().then((buffer) => chunks.push(new Uint8Array(buffer)));
          }
        };

        socket.onerror = () => reject(new Error("socket-error"));
        socket.onclose = () => resolve();
      });

      if (!chunks.length) {
        setVoiceError(t("noAudioGenerated"));
        setVoiceStatus("");
        return;
      }

      const merged = mergeChunks(chunks);
      const wavBlob = pcm16ToWavBlob(merged, SAMPLE_RATE);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);
      setVoiceStatus(t("audioReady"));
      requestAnimationFrame(() => {
        audioRef.current?.play().catch(() => undefined);
      });
    } catch {
      setVoiceError(t("couldNotGenerateVoice"));
      setVoiceStatus("");
    }
  }

  return (
    <div className="space-y-4">
      <SectionTitle kicker={t("conversationKicker")} title={t("conversationTitle")} description={t("conversationDescription")} />

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">{t("scenario")}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {localizedScenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setScenarioId(scenario.id)}
                  className={`rounded-lg border px-3 py-2 text-left transition ${
                    scenario.id === activeScenario?.id
                      ? "border-sky-300 bg-sky-50 dark:border-sky-700 dark:bg-sky-950/30"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                  }`}
                >
                  <p className="text-sm font-semibold">{scenario.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{scenario.objective}</p>
                </button>
              ))}
            </div>
          </div>

          {activeScenario ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
              <p className="font-semibold">{activeScenario.title}</p>
              <p className="mt-1">{activeScenario.context}</p>
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("yourMessage")}</label>
            <Textarea
              rows={4}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={t("yourMessagePlaceholder")}
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={sendTurn} disabled={loadingCoach || !message.trim()}>
                <MessageSquareText size={16} />
                <span className="ml-2">{loadingCoach ? t("coaching") : t("sendToCoach")}</span>
              </Button>
              <Button variant="secondary" onClick={() => void synthesizeWithVibeVoice(message)} disabled={!message.trim()}>
                <Mic size={16} />
                <span className="ml-2">{t("speakMyMessage")}</span>
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {turns.length ? (
              turns.map((turn) => (
                <article
                  key={turn.id}
                  className={`rounded-xl border p-3 ${
                    turn.role === "coach"
                      ? "border-sky-200 bg-sky-50/70 dark:border-sky-900/60 dark:bg-sky-950/20"
                      : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{turn.role === "coach" ? t("coachLabel") : t("youLabel")}</p>
                  <p className="mt-1 text-sm">{turn.text}</p>

                  {turn.improvedSentence ? (
                    <div className="mt-2 rounded-lg border border-slate-200 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{t("improvedSentence")}</p>
                      <p className="mt-1">{turn.improvedSentence}</p>
                    </div>
                  ) : null}

                  {turn.quickTips?.length ? (
                    <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      {turn.quickTips.map((tip) => (
                        <li key={tip}>- {tip}</li>
                      ))}
                    </ul>
                  ) : null}

                  {turn.role === "coach" ? (
                    <div className="mt-3">
                      <Button variant="secondary" onClick={() => void synthesizeWithVibeVoice(turn.text)}>
                        <Volume2 size={15} />
                        <span className="ml-2">{t("playWithVibeVoice")}</span>
                      </Button>
                    </div>
                  ) : null}
                </article>
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500 dark:border-slate-700">
                {t("startConversationPrompt")}
              </p>
            )}
          </div>
        </Card>

        <Card className="space-y-3">
          <p className="text-sm font-semibold">{t("vibevoiceEngine")}</p>
          <p className="text-xs text-slate-500">{t("vibevoiceEngineDescription")}</p>

          <label className="space-y-1 text-sm">
            <span className="font-medium">{t("serverUrl")}</span>
            <Input value={vibevoiceConfig?.baseUrl ?? process.env.NEXT_PUBLIC_VIBEVOICE_BASE_URL ?? "http://127.0.0.1:8000"} readOnly />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">{t("voicePreset")}</span>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
              value={selectedVoice}
              onChange={(event) => setSelectedVoice(event.target.value)}
              disabled={!vibevoiceConfig?.voices.length}
            >
              {vibevoiceConfig?.voices.length ? (
                vibevoiceConfig.voices.map((voice) => (
                  <option key={voice} value={voice}>
                    {voice}
                  </option>
                ))
              ) : (
                <option value="">{t("noVoicesAvailable")}</option>
              )}
            </select>
          </label>

          {voiceStatus ? <p className="text-xs text-sky-700 dark:text-sky-300">{voiceStatus}</p> : null}
          {voiceError ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/20 dark:text-rose-300">{voiceError}</p> : null}
          {vibevoiceConfig?.error ? <p className="text-xs text-amber-700 dark:text-amber-300">{vibevoiceConfig.error}</p> : null}

          {audioUrl ? (
            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{t("lastGeneratedAudio")}</p>
              <p className="text-sm text-slate-700 dark:text-slate-200">{audioSourceText}</p>
              <audio ref={audioRef} src={audioUrl} controls className="w-full" />
            </div>
          ) : null}
        </Card>
      </section>
    </div>
  );
}
