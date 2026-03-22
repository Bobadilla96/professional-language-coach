import { NextResponse } from "next/server";
import { lessons } from "@/data/lessons";

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

interface RequestBody {
  lessonId?: string;
  question?: string;
  language?: string;
}

const LANGUAGE_LABEL: Record<string, string> = {
  en: "English",
  es: "Spanish",
  pt: "Portuguese",
  fr: "French"
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OPENROUTER_API_KEY is missing. Add it to your .env.local to enable AI coaching."
      },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as RequestBody | null;
  const lessonId = body?.lessonId?.trim();
  const question = body?.question?.trim();
  const outputLanguage = LANGUAGE_LABEL[body?.language ?? ""] ?? "English";

  if (!lessonId || !question) {
    return NextResponse.json({ error: "lessonId and question are required." }, { status: 400 });
  }

  const lesson = lessons.find((item) => item.id === lessonId);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  const lessonContext = [
    `Lesson: ${lesson.title}`,
    `Topic: ${lesson.topic}`,
    `Level: ${lesson.level}`,
    `Vocabulary: ${lesson.vocabulary.map((v) => v.term).join(", ") || "N/A"}`,
    `Phrases: ${lesson.phrases.map((p) => p.sentence).join(" | ") || "N/A"}`
  ].join("\n");

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
            `You are a concise technical English tutor for software developers. Respond in ${outputLanguage}. Include one improved sentence example, and keep answer under 140 words.`
        },
        {
          role: "user",
          content: `${lessonContext}\n\nStudent question: ${question}`
        }
      ]
    })
  });

  if (!response.ok) {
    const reason = await response.text();
    return NextResponse.json(
      {
        error: "AI provider request failed.",
        details: reason.slice(0, 240)
      },
      { status: response.status }
    );
  }

  const payload = (await response.json()) as {
    model?: string;
    choices?: Array<{ message?: { content?: string } }>;
  };

  const answer = payload.choices?.[0]?.message?.content?.trim();
  if (!answer) {
    return NextResponse.json({ error: "Empty AI response." }, { status: 502 });
  }

  return NextResponse.json({
    answer,
    model: payload.model ?? "openrouter/free"
  });
}
