import type { ChatMessage } from "@/types/chat";

import { normalizeWhitespace } from "./text";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-oss-120b:free";
const MODEL_TEMPERATURE = 0.5;
const MAX_TOKENS = 600;
const STREAM_CHUNK_TIMEOUT_MS = 10_000;
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_RETRIES = 1;

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

type OpenRouterStreamChunk = {
  choices?: Array<{
    delta?: {
      content?: string;
    };
  }>;
};

export class OpenRouterError extends Error {
  constructor(
    message: string,
    public readonly status = 502,
  ) {
    super(message);
    this.name = "OpenRouterError";
  }
}

export function getOpenRouterConfig(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  // Prefer the env var; the Origin header fallback is attacker-controlled
  // and used only for OpenRouter attribution (no security boundary).
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    req.headers.get("origin") ??
    "http://localhost:3000";

  return {
    apiKey,
    model: process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL,
    siteUrl,
  };
}

export async function requestOpenRouterChat({
  apiKey,
  model,
  siteUrl,
  systemPrompt,
  messages,
}: {
  apiKey: string;
  model: string;
  siteUrl: string;
  systemPrompt: string;
  messages: ChatMessage[];
}) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetchOpenRouter({
        apiKey,
        model,
        siteUrl,
        systemPrompt,
        messages,
      });

      if (!response.ok) {
        const upstreamBody = await response.text().catch(() => "");
        console.error("OpenRouter request failed", {
          status: response.status,
          body: upstreamBody,
        });

        if (response.status >= 500 && attempt < MAX_RETRIES) {
          await waitWithJitter();
          continue;
        }

        throw new OpenRouterError("The AI service is temporarily unavailable.");
      }

      const data = (await response.json()) as OpenRouterResponse;
      const reply = normalizeWhitespace(
        data.choices?.[0]?.message?.content?.trim() ?? "",
      );

      if (!reply) {
        throw new OpenRouterError("The AI service returned an empty response.");
      }

      return reply;
    } catch (error) {
      if (isAbortError(error)) {
        throw new OpenRouterError(
          "The AI service took too long to respond.",
          504,
        );
      }

      if (attempt < MAX_RETRIES && !(error instanceof OpenRouterError)) {
        console.warn(
          "OpenRouter network request failed; retrying once.",
          error,
        );
        await waitWithJitter();
        continue;
      }

      if (error instanceof OpenRouterError) {
        throw error;
      }

      console.error("OpenRouter request failed unexpectedly", error);
      throw new OpenRouterError("The AI service is temporarily unavailable.");
    }
  }

  throw new OpenRouterError("The AI service is temporarily unavailable.");
}

export async function requestOpenRouterChatStream({
  apiKey,
  model,
  siteUrl,
  systemPrompt,
  messages,
}: {
  apiKey: string;
  model: string;
  siteUrl: string;
  systemPrompt: string;
  messages: ChatMessage[];
}) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetchOpenRouter({
        apiKey,
        model,
        siteUrl,
        systemPrompt,
        messages,
        stream: true,
      });

      if (!response.ok || !response.body) {
        const upstreamBody = await response.text().catch(() => "");
        console.error("OpenRouter streaming request failed", {
          status: response.status,
          body: upstreamBody,
        });

        if (response.status >= 500 && attempt < MAX_RETRIES) {
          await waitWithJitter();
          continue;
        }

        throw new OpenRouterError("The AI service is temporarily unavailable.");
      }

      return transformOpenRouterStream(response.body);
    } catch (error) {
      if (isAbortError(error)) {
        throw new OpenRouterError(
          "The AI service took too long to respond.",
          504,
        );
      }

      if (error instanceof OpenRouterError) throw error;

      if (attempt < MAX_RETRIES) {
        console.warn(
          "OpenRouter streaming request failed; retrying once.",
          error,
        );
        await waitWithJitter();
        continue;
      }

      console.error("OpenRouter streaming request failed unexpectedly", error);
      throw new OpenRouterError("The AI service is temporarily unavailable.");
    }
  }

  throw new OpenRouterError("The AI service is temporarily unavailable.");
}

async function fetchOpenRouter({
  apiKey,
  model,
  siteUrl,
  systemPrompt,
  messages,
  stream = false,
}: {
  apiKey: string;
  model: string;
  siteUrl: string;
  systemPrompt: string;
  messages: ChatMessage[];
  stream?: boolean;
}) {
  return fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": siteUrl,
      "X-Title": "Ziyad Portfolio Digital Twin",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
      temperature: MODEL_TEMPERATURE,
      max_tokens: MAX_TOKENS,
      stream,
    }),
    cache: "no-store",
    next: { revalidate: 0 },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

function isAbortError(error: unknown) {
  return (
    error instanceof DOMException &&
    (error.name === "AbortError" || error.name === "TimeoutError")
  );
}

async function waitWithJitter() {
  const delayMs = 250 + Math.floor(Math.random() * 250);
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

function transformOpenRouterStream(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      let timedOut = false;

      const timeoutId = setTimeout(() => {
        timedOut = true;
        reader.cancel().catch(() => {});
        controller.error(
          new OpenRouterError("The AI service stopped responding.", 504),
        );
      }, STREAM_CHUNK_TIMEOUT_MS);

      try {
        const { done, value } = await reader.read();
        clearTimeout(timeoutId);

        if (timedOut) return;

        if (done) {
          flushBufferedLines(buffer, controller, encoder);
          controller.close();
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        flushBufferedLines(lines.join("\n"), controller, encoder);
      } catch (error) {
        clearTimeout(timeoutId);
        if (!timedOut) {
          controller.error(error);
        }
      }
    },
    cancel() {
      return reader.cancel();
    },
  });
}

function flushBufferedLines(
  rawLines: string,
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder,
) {
  for (const rawLine of rawLines.split("\n")) {
    const line = rawLine.trim();
    if (!line.startsWith("data:")) continue;

    const payload = line.replace(/^data:\s*/, "");
    if (!payload || payload === "[DONE]") continue;

    try {
      const parsed = JSON.parse(payload) as OpenRouterStreamChunk;
      const token = parsed.choices?.[0]?.delta?.content;
      if (token) {
        controller.enqueue(encoder.encode(token));
      }
    } catch {
      console.warn("Skipping malformed OpenRouter stream chunk.");
    }
  }
}
