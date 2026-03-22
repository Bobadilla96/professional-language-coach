import { NextResponse } from "next/server";
import { conversationScenarios } from "@/data/conversation/scenarios";
import type { ConversationCoachResponse } from "@/domain/models/conversation";
import { runCorrectionEngine } from "@/lib/correction-engine";

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

interface ConversationRequest {
  scenarioId?: string;
  userMessage?: string;
  history?: Array<{ role: "user" | "coach"; text: string }>;
  language?: string;
}

const LANGUAGE_LABEL: Record<string, string> = {
  en: "English",
  es: "Spanish",
  pt: "Portuguese",
  fr: "French"
};

function buildFallbackResponse(userMessage: string, language: string): ConversationCoachResponse {
  const correction = runCorrectionEngine(userMessage);
  if (language === "es") {
    return {
      coachReply:
        "Buen intento. Mantén la frase corta, específica y orientada a la acción. Explica qué pasó, impacto y siguiente paso.",
      improvedSentence: correction.professionalRewrite,
      quickTips: [
        "Usa un verbo principal por frase.",
        "Incluye sustantivos técnicos concretos.",
        "Cierra con una acción siguiente explícita."
      ]
    };
  }

  if (language === "pt") {
    return {
      coachReply:
        "Boa tentativa. Mantenha a frase curta, específica e orientada à ação. Explique o ocorrido, impacto e próximo passo.",
      improvedSentence: correction.professionalRewrite,
      quickTips: [
        "Use um verbo principal por frase.",
        "Inclua termos técnicos concretos.",
        "Feche com uma próxima ação explícita."
      ]
    };
  }

  if (language === "fr") {
    return {
      coachReply:
        "Bonne tentative. Garde une phrase courte, précise et orientée action. Décris le problème, l'impact et la prochaine étape.",
      improvedSentence: correction.professionalRewrite,
      quickTips: [
        "Utilise un verbe principal par phrase.",
        "Ajoute des termes techniques concrets.",
        "Termine avec une action suivante explicite."
      ]
    };
  }

  return {
    coachReply:
      "Good attempt. Keep your sentence short, specific and action-oriented. Mention what happened, impact and your next step.",
    improvedSentence: correction.professionalRewrite,
    quickTips: [
      "Use one main verb per sentence.",
      "Add technical nouns (endpoint, payload, merge conflict).",
      "Close with an explicit next action."
    ]
  };
}

function tryParseModelJson(raw: string): ConversationCoachResponse | null {
  const normalized = raw.trim();

  try {
    const parsed = JSON.parse(normalized) as Partial<ConversationCoachResponse>;
    if (!parsed.coachReply || !parsed.improvedSentence || !Array.isArray(parsed.quickTips)) return null;
    return {
      coachReply: parsed.coachReply,
      improvedSentence: parsed.improvedSentence,
      quickTips: parsed.quickTips.slice(0, 3)
    };
  } catch {
    const match = normalized.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      const parsed = JSON.parse(match[0]) as Partial<ConversationCoachResponse>;
      if (!parsed.coachReply || !parsed.improvedSentence || !Array.isArray(parsed.quickTips)) return null;
      return {
        coachReply: parsed.coachReply,
        improvedSentence: parsed.improvedSentence,
        quickTips: parsed.quickTips.slice(0, 3)
      };
    } catch {
      return null;
    }
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ConversationRequest | null;
  const scenarioId = body?.scenarioId?.trim();
  const userMessage = body?.userMessage?.trim();
  const language = body?.language ?? "en";
  const outputLanguage = LANGUAGE_LABEL[language] ?? "English";

  if (!scenarioId || !userMessage) {
    return NextResponse.json({ error: "scenarioId and userMessage are required." }, { status: 400 });
  }

  const scenario = conversationScenarios.find((item) => item.id === scenarioId);
  if (!scenario) {
    return NextResponse.json({ error: "Scenario not found." }, { status: 404 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(buildFallbackResponse(userMessage, language));
  }

  const recentHistory = (body?.history ?? []).slice(-6).map((entry) => `${entry.role.toUpperCase()}: ${entry.text}`).join("\n");

  const prompt = [
    `Scenario: ${scenario.title}`,
    `Context: ${scenario.context}`,
    `Objective: ${scenario.objective}`,
    recentHistory ? `Conversation history:\n${recentHistory}` : "",
    `Learner message: ${userMessage}`,
    `Respond in ${outputLanguage}.`,
    "Respond as strict JSON with keys: coachReply (string), improvedSentence (string), quickTips (array of exactly 3 short strings)."
  ]
    .filter(Boolean)
    .join("\n\n");

  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "Tech English Coach"
    },
    body: JSON.stringify({
      model: "openrouter/free",
      temperature: 0.35,
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content:
            "You are an English conversation coach for software professionals. Keep feedback concise and practical."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    return NextResponse.json(buildFallbackResponse(userMessage, language));
  }

  const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const rawContent = payload.choices?.[0]?.message?.content;
  if (!rawContent) {
    return NextResponse.json(buildFallbackResponse(userMessage, language));
  }

  const parsed = tryParseModelJson(rawContent);
  if (!parsed) {
    return NextResponse.json(buildFallbackResponse(userMessage, language));
  }

  return NextResponse.json(parsed);
}
