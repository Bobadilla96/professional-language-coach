"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquareText, Mic, RotateCcw, Sparkles, Volume2, Waves } from "lucide-react";
import { SectionTitle } from "@/components/common/section-title";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { conversationScenarios } from "@/data/conversation/scenarios";
import type { ConversationCoachResponse, ConversationScenario, ConversationTurn } from "@/domain/models/conversation";
import { useUiText } from "@/hooks/use-ui-text";

const SAMPLE_RATE = 24_000;

interface VibeVoiceConfigResponse {
  available: boolean;
  baseUrl: string;
  voices: string[];
  defaultVoice: string | null;
  error?: string;
}

interface BrowserSpeechRecognitionResult {
  results: ArrayLike<{
    isFinal?: boolean;
    0: { transcript: string };
    length: number;
  }>;
}

interface BrowserSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: BrowserSpeechRecognitionResult) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
}

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

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

function isLoopbackUrl(value: string) {
  return /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/i.test(value.trim());
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

function buildScenarioTranslations(language: string, scenarios: ConversationScenario[]) {
  if (language !== "es") return scenarios;

  const translations: Record<
    string,
    Pick<ConversationScenario, "title" | "context" | "objective" | "starterPrompts" | "coachFocus">
  > = {
    "daily-standup": {
      title: "Daily standup",
      context: "Estas reportando progreso, bloqueos y siguiente paso en un standup de 2 minutos.",
      objective: "Hablar con claridad usando actualizaciones breves de estado.",
      starterPrompts: [
        "Ayer corregi el bug de reintentos en el worker de pagos.",
        "Hoy voy a terminar las pruebas de integracion del API.",
        "Estoy bloqueado porque expiraron las credenciales de staging."
      ],
      coachFocus: [
        "Usa marcadores de tiempo como ayer, hoy y siguiente paso.",
        "Nombra un bloqueo y una accion concreta.",
        "Mantene la actualizacion en tres frases cortas o menos."
      ]
    },
    "code-review": {
      title: "Discusion de code review",
      context: "Necesitas explicar los cambios de tu pull request y responder dudas del reviewer.",
      objective: "Usar redaccion colaborativa y profesional.",
      starterPrompts: [
        "Separe el componente para reducir efectos secundarios y mejorar legibilidad.",
        "Mantengo la forma anterior del API para no romper el cliente mobile.",
        "Puedo agregar un test para el empty state en un commit de seguimiento."
      ],
      coachFocus: [
        "Explica la razon del cambio, no solo el diff.",
        "Usa frases colaborativas como puedo ajustar o podemos mantener.",
        "Reconoce el riesgo y menciona validacion o tests."
      ]
    },
    "incident-update": {
      title: "Actualizacion de incidente en produccion",
      context: "Un servicio se degrado y necesitas comunicar impacto y mitigacion por Slack.",
      objective: "Usar vocabulario de incidentes con precision y tono calmo.",
      starterPrompts: [
        "Identificamos latencia elevada en el servicio de checkout.",
        "El impacto por ahora esta limitado a tenants de Europa.",
        "Hicimos rollback del ultimo deploy y la tasa de error esta bajando."
      ],
      coachFocus: [
        "Declara impacto, mitigacion y siguiente actualizacion.",
        "Evita tono emocional y mantene calma.",
        "Usa sustantivos concretos como latencia, rollback o tasa de error."
      ]
    },
    "api-alignment": {
      title: "Alineacion API frontend/backend",
      context: "Necesitas alinear contrato de payload y status codes antes del release.",
      objective: "Negociar cambios tecnicos sin ambiguedad.",
      starterPrompts: [
        "Podemos confirmar si este endpoint devuelve 200 o 204 en caso de exito?",
        "El frontend necesita una forma de error estable para mostrar validaciones.",
        "Si renombramos este campo, deberiamos mantener compatibilidad una release."
      ],
      coachFocus: [
        "Haz una pregunta tecnica a la vez.",
        "Se explicito sobre contrato, payload y compatibilidad.",
        "Cierra con una decision o una confirmacion pendiente."
      ]
    }
  };

  return scenarios.map((scenario) => ({
    ...scenario,
    ...(translations[scenario.id] ?? {})
  }));
}

export default function ConversationFeaturePage() {
  const { language, t } = useUiText();
  const localizedScenarios = useMemo(() => buildScenarioTranslations(language, conversationScenarios), [language]);
  const [scenarioId, setScenarioId] = useState(localizedScenarios[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [vibevoiceConfig, setVibevoiceConfig] = useState<VibeVoiceConfigResponse | null>(null);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioSourceText, setAudioSourceText] = useState("");
  const [browserVoiceReady, setBrowserVoiceReady] = useState(false);
  const [dictationAvailable, setDictationAvailable] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [isLocalEnvironment, setIsLocalEnvironment] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  const activeScenario = useMemo(
    () => localizedScenarios.find((item) => item.id === scenarioId) ?? localizedScenarios[0],
    [localizedScenarios, scenarioId]
  );
  const latestCoachTurn = useMemo(() => [...turns].reverse().find((turn) => turn.role === "coach") ?? null, [turns]);

  useEffect(() => {
    setScenarioId((current) => (localizedScenarios.some((scenario) => scenario.id === current) ? current : localizedScenarios[0]?.id ?? ""));
  }, [localizedScenarios]);

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
          error: "VIBEVOICE_UNREACHABLE"
        });
      });

    return () => {
      mounted = false;
    };
  }, [language]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hostname = window.location.hostname;
    setIsLocalEnvironment(hostname === "localhost" || hostname === "127.0.0.1");

    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const voices = synth?.getVoices() ?? [];
      setBrowserVoiceReady(voices.length > 0 || Boolean(synth));
    };

    loadVoices();
    synth?.addEventListener?.("voiceschanged", loadVoices);

    const RecognitionCtor = (window as typeof window & { SpeechRecognition?: BrowserSpeechRecognitionConstructor; webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor }).SpeechRecognition
      ?? (window as typeof window & { webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor }).webkitSpeechRecognition;
    setDictationAvailable(Boolean(RecognitionCtor));

    return () => {
      synth?.removeEventListener?.("voiceschanged", loadVoices);
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const resolvedVibevoiceError = useMemo(() => {
    if (!vibevoiceConfig?.error) return "";
    if (vibevoiceConfig.error === "VIBEVOICE_UNREACHABLE") return t("vibevoiceUnavailableHint");
    if (vibevoiceConfig.error === "VIBEVOICE_CONFIG_UNAVAILABLE") return t("vibevoiceUnavailableHint");
    return vibevoiceConfig.error;
  }, [t, vibevoiceConfig?.error]);

  const hasConfiguredRemoteVibevoice = useMemo(() => {
    if (!vibevoiceConfig?.baseUrl) return false;
    return !isLoopbackUrl(vibevoiceConfig.baseUrl);
  }, [vibevoiceConfig?.baseUrl]);

  const showVibevoiceAdvancedPanel = isLocalEnvironment || hasConfiguredRemoteVibevoice || Boolean(vibevoiceConfig?.available);

  useEffect(() => {
    if (!audioUrl) return undefined;
    return () => URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  function resetConversation() {
    setTurns([]);
    setMessage("");
    setVoiceError("");
    setVoiceStatus("");
    setAudioSourceText("");
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl("");
    }
  }

  function applyStarterPrompt(prompt: string) {
    setMessage(prompt);
  }

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

  function speakWithBrowserVoice(text: string) {
    const content = text.trim();
    if (!content || typeof window === "undefined" || !window.speechSynthesis) {
      setVoiceError(t("browserVoiceUnavailable"));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = language === "es" ? "es-ES" : language === "pt" ? "pt-BR" : language === "fr" ? "fr-FR" : "en-US";
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith(utterance.lang.slice(0, 2).toLowerCase()));
    if (matchingVoice) utterance.voice = matchingVoice;

    setVoiceStatus(t("browserVoiceReady"));
    setVoiceError("");
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function toggleDictation() {
    if (typeof window === "undefined") return;

    const SpeechRecognitionCtor = (window as typeof window & { SpeechRecognition?: BrowserSpeechRecognitionConstructor; webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor }).SpeechRecognition
      ?? (window as typeof window & { webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor }).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setVoiceError(t("dictationUnavailable"));
      return;
    }

    if (isDictating) {
      recognitionRef.current?.stop();
      setIsDictating(false);
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = language === "es" ? "es-ES" : language === "pt" ? "pt-BR" : language === "fr" ? "fr-FR" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0]?.transcript ?? "").join(" ").trim();
      if (transcript) {
        setMessage(transcript);
      }
    };
    recognition.onerror = () => {
      setVoiceError(t("dictationUnavailable"));
      setIsDictating(false);
    };
    recognition.onend = () => {
      setIsDictating(false);
    };

    recognitionRef.current = recognition;
    setVoiceError("");
    setIsDictating(true);
    recognition.start();
  }

  async function synthesizeWithVibeVoice(text: string) {
    const content = text.trim();
    if (!content) return;

    if (!vibevoiceConfig?.available || !selectedVoice) {
      speakWithBrowserVoice(content);
      setVoiceError(t("vibevoiceUnavailableHint"));
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

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
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
              <Button variant="secondary" onClick={() => speakWithBrowserVoice(message)} disabled={!message.trim()}>
                <Volume2 size={16} />
                <span className="ml-2">{t("speakMyMessage")}</span>
              </Button>
              <Button variant="secondary" onClick={toggleDictation} disabled={!dictationAvailable && !isDictating}>
                <Mic size={16} />
                <span className="ml-2">{isDictating ? t("dictationStop") : t("dictationStart")}</span>
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
                  <p className="mt-1 text-sm leading-6">{turn.text}</p>

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
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button variant="secondary" onClick={() => speakWithBrowserVoice(turn.text)}>
                        <Volume2 size={15} />
                        <span className="ml-2">{t("listenCoachReply")}</span>
                      </Button>
                      <Button variant="ghost" onClick={() => void synthesizeWithVibeVoice(turn.text)}>
                        <Waves size={15} />
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

        <div className="space-y-4">
          {activeScenario ? (
            <Card className="space-y-4">
              <div>
                <p className="text-sm font-semibold">{t("scenarioGuide")}</p>
                <p className="mt-1 text-xs text-slate-500">{t("scenarioGuideDescription")}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{t("goal")}</p>
                <p className="mt-1 text-sm">{activeScenario.objective}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{t("coachFocusTitle")}</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {activeScenario.coachFocus.map((item) => (
                    <li key={item} className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{t("starterPromptsTitle")}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeScenario.starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => applyStarterPrompt(prompt)}
                      className="rounded-full border border-slate-300 bg-white px-3 py-2 text-left text-xs text-slate-700 transition hover:border-sky-400 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-700 dark:hover:text-sky-300"
                    >
                      <Sparkles size={12} className="mr-1 inline-flex" />
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          ) : null}

          <Card className="space-y-3">
            <p className="text-sm font-semibold">{t("browserVoiceTitle")}</p>
            <p className="text-xs text-slate-500">{t("browserVoiceDescription")}</p>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/70">
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {browserVoiceReady ? t("browserVoiceReady") : t("browserVoiceUnavailable")}
              </p>
              <p className="mt-1 text-xs text-slate-500">{t("browserVoiceFallbackActive")}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => latestCoachTurn && speakWithBrowserVoice(latestCoachTurn.text)} disabled={!latestCoachTurn}>
                <Volume2 size={15} />
                <span className="ml-2">{t("listenCoachReply")}</span>
              </Button>
              <Button variant="secondary" onClick={toggleDictation} disabled={!dictationAvailable && !isDictating}>
                <Mic size={15} />
                <span className="ml-2">{isDictating ? t("dictationStop") : t("dictationStart")}</span>
              </Button>
            </div>

            {!dictationAvailable ? <p className="text-xs text-amber-700 dark:text-amber-300">{t("dictationUnavailable")}</p> : null}
            {isDictating ? <p className="text-xs text-sky-700 dark:text-sky-300">{t("dictationListening")}</p> : null}
          </Card>

          {showVibevoiceAdvancedPanel ? (
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

              {!vibevoiceConfig?.available ? (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-300">
                  {t("vibevoiceUnavailableHint")}
                </p>
              ) : null}

              {voiceStatus ? <p className="text-xs text-sky-700 dark:text-sky-300">{voiceStatus}</p> : null}
              {voiceError ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/20 dark:text-rose-300">{voiceError}</p> : null}
              {resolvedVibevoiceError ? <p className="text-xs text-amber-700 dark:text-amber-300">{resolvedVibevoiceError}</p> : null}

              {audioUrl ? (
                <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{t("lastGeneratedAudio")}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{audioSourceText}</p>
                  <audio ref={audioRef} src={audioUrl} controls className="w-full" />
                </div>
              ) : null}
            </Card>
          ) : (
            <Card className="space-y-3">
              <p className="text-sm font-semibold">{t("vibevoiceEngine")}</p>
              <p className="text-xs text-slate-500">{t("vibevoiceEngineDescription")}</p>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/70">
                <p className="font-medium text-slate-900 dark:text-slate-100">{t("browserVoiceFallbackActive")}</p>
                <p className="mt-1 text-xs text-slate-500">{t("vibevoiceUnavailableHint")}</p>
              </div>
              {voiceError ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/20 dark:text-rose-300">{voiceError}</p> : null}
            </Card>
          )}

          <Card className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{t("sessionStatus")}</p>
              <Button variant="ghost" onClick={resetConversation}>
                <RotateCcw size={15} />
                <span className="ml-2">{t("resetConversation")}</span>
              </Button>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-800/70">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{t("totalTurns")}</p>
              <p className="mt-1 text-2xl font-semibold">{turns.length}</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/70">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{t("latestCoachReply")}</p>
              <p className="mt-1 text-slate-700 dark:text-slate-200">{latestCoachTurn?.text ?? t("noCoachReplyYet")}</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
