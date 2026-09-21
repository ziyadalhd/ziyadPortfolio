import type { ChatMessage } from "@/types/chat";

import { normalizeWhitespace } from "./text";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
// Measured against the real Arabic system prompt (Sept 2026), five questions
// each, scored for عرنجية and length. A code model was writing the Arabic
// prose and it showed: cohere/north-mini-code answered 3/5 clean at 367-585
// chars and once emitted Chinese characters mid-sentence. Nemotron scored 4/5
// at 188-370 and reads like a person. Qwen was the best writer of the three
// but 3 of 5 calls came back 429, which matters more on a live page.
const DEFAULT_MODEL = "nvidia/nemotron-3-super-120b-a12b:free";
// Free models rate-limit from a shared pool and go 503 under load, and the
// retry above only covers network faults. OpenRouter walks this list itself
// when the primary errors, so a busy provider degrades to a slightly weaker
// answer instead of an error card. Ordered by measured availability, not by
// prose quality: qwen writes the best Arabic of the three but answered only
// 2 of 5 calls, while north-mini answered 5 of 5. The API caps this list at
// three entries in total, primary included.
const FALLBACK_MODELS = [
  "qwen/qwen3.8-27b:free",
  "cohere/north-mini-code:free",
];
const MODEL_TEMPERATURE = 0.5;
// The length rule in the prompt is obeyed most of the time and ignored perhaps
// once in three, when the model pads with generic filler until it runs out of
// budget. So the budget is the real limit. Measured on this locale: a good
// Arabic answer is 275-330 characters, and these models spend roughly four
// characters per token, so ~75 tokens. 170 leaves better than 2x headroom for
// a complete answer while capping a runaway near 700 characters instead of the
// 1636 that 450 allowed.
const MAX_TOKENS = 170;
const REQUEST_TIMEOUT_MS = 30_000;
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
      models: [model, ...FALLBACK_MODELS.filter((m) => m !== model)],
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
      temperature: MODEL_TEMPERATURE,
      max_tokens: MAX_TOKENS,
      // Verified against the API: these models' hidden reasoning scales with
      // the system prompt's length, not a token cap — reasoning.max_tokens
      // is silently ignored and it still burns the whole MAX_TOKENS budget
      // on <think> chatter once the real persona prompt is used, leaving
      // content empty. Disabling reasoning outright is what actually works.
      reasoning: { enabled: false },
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

// Uses a push-based TransformStream instead of a pull-based ReadableStream.
// Next.js (Turbopack dev server) buffers pull-based streams until they close
// before forwarding to the HTTP client; with TransformStream, each write is
// flushed immediately as it is produced.
function transformOpenRouterStream(body: ReadableStream<Uint8Array>) {
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const reader = body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  void (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          flushBufferedLinesToWriter(buffer, writer, encoder);
          await writer.close();
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        await flushBufferedLinesToWriter(lines.join("\n"), writer, encoder);
      }
    } catch {
      await writer.abort().catch(() => {});
    }
  })();

  return readable;
}

async function flushBufferedLinesToWriter(
  rawLines: string,
  writer: WritableStreamDefaultWriter<Uint8Array>,
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
        await writer.write(encoder.encode(token));
      }
    } catch {
      console.warn("Skipping malformed OpenRouter stream chunk.");
    }
  }
}
