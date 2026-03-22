import { NextResponse } from "next/server";

const DEFAULT_VIBEVOICE_BASE_URL = "http://127.0.0.1:8000";
const CONFIG_TIMEOUT_MS = 5000;

function resolveBaseUrl() {
  return (process.env.VIBEVOICE_BASE_URL ?? process.env.NEXT_PUBLIC_VIBEVOICE_BASE_URL ?? DEFAULT_VIBEVOICE_BASE_URL).replace(/\/$/, "");
}

export async function GET() {
  const baseUrl = resolveBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/config`, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(CONFIG_TIMEOUT_MS)
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          available: false,
          baseUrl,
          voices: [],
          defaultVoice: null,
          error: "VIBEVOICE_CONFIG_UNAVAILABLE"
        },
        { status: 200 }
      );
    }

    const payload = (await response.json()) as { voices?: string[]; default_voice?: string };
    return NextResponse.json({
      available: true,
      baseUrl,
      voices: payload.voices ?? [],
      defaultVoice: payload.default_voice ?? null
    });
  } catch {
    return NextResponse.json(
      {
        available: false,
        baseUrl,
        voices: [],
        defaultVoice: null,
        error: "VIBEVOICE_UNREACHABLE"
      },
      { status: 200 }
    );
  }
}
