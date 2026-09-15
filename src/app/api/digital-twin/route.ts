import { NextResponse } from "next/server";
import {
  OpenRouterError,
  getOpenRouterConfig,
  requestOpenRouterChat,
  requestOpenRouterChatStream,
} from "@/lib/openrouter";
import { buildSystemPrompt } from "@/lib/prompt";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { validateRequestBodyText } from "@/lib/request-validation";

export const runtime = "nodejs";

// No CSRF token required: this is a public unauthenticated endpoint and
// accepts no cookies. Any future authenticated or state-mutating endpoint
// must add CSRF protection before shipping.
export async function POST(req: Request) {
  const rateLimit = checkRateLimit(getClientIp(req));
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  const { apiKey, model, siteUrl } = getOpenRouterConfig(req);

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OpenRouter API key not found. Add OPENROUTER_API_KEY to your .env file.",
      },
      { status: 500 },
    );
  }

  const validation = validateRequestBodyText(await req.text());
  if (!validation.ok) {
    return NextResponse.json(
      {
        error: validation.error,
        fields: validation.fields,
      },
      { status: validation.status },
    );
  }

  try {
    if (validation.stream) {
      const stream = await requestOpenRouterChatStream({
        apiKey,
        model,
        siteUrl,
        systemPrompt: buildSystemPrompt(validation.locale),
        messages: validation.messages,
      });

      return new Response(stream, {
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    const reply = await requestOpenRouterChat({
      apiKey,
      model,
      siteUrl,
      systemPrompt: buildSystemPrompt(validation.locale),
      messages: validation.messages,
    });

    return NextResponse.json({ reply });
  } catch (error) {
    if (error instanceof OpenRouterError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    console.error("Digital twin route failed unexpectedly", error);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 },
    );
  }
}
