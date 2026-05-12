import { z } from "zod";

import type { ChatMessage } from "@/types/chat";

export const MAX_HISTORY_MESSAGES = 12;
export const MAX_MESSAGE_CONTENT_LENGTH = 4_000;
export const MAX_REQUEST_BODY_BYTES = 16 * 1024;

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(MAX_MESSAGE_CONTENT_LENGTH),
});

const requestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(MAX_HISTORY_MESSAGES),
  stream: z.boolean().optional(),
});

const promptInjectionPatterns = [
  /ignore (all )?(previous|prior|above) (instructions|rules|prompts)/i,
  /reveal (the )?(system|developer) (prompt|message|instructions)/i,
  /show (the )?(system|developer) (prompt|message|instructions)/i,
  /you are now/i,
  /jailbreak/i,
];

export type ValidationResult =
  | { ok: true; messages: ChatMessage[]; stream: boolean }
  | { ok: false; status: number; error: string; fields?: unknown };

export function validateRequestBodyText(bodyText: string): ValidationResult {
  if (new TextEncoder().encode(bodyText).length > MAX_REQUEST_BODY_BYTES) {
    return {
      ok: false,
      status: 413,
      error: "Request body is too large.",
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(bodyText);
  } catch {
    return {
      ok: false,
      status: 400,
      error: "Invalid JSON payload.",
    };
  }

  const result = requestSchema.safeParse(parsed);
  if (!result.success) {
    return {
      ok: false,
      status: 400,
      error: "Invalid chat payload.",
      fields: z.flattenError(result.error).fieldErrors,
    };
  }

  const messages = result.data.messages.slice(-MAX_HISTORY_MESSAGES);

  if (!messages.some((message) => message.role === "user")) {
    return {
      ok: false,
      status: 400,
      error: "Please include at least one user message.",
    };
  }

  const latestUserMessage = messages.findLast(
    (message) => message.role === "user",
  );

  if (
    latestUserMessage &&
    promptInjectionPatterns.some((pattern) =>
      pattern.test(latestUserMessage.content),
    )
  ) {
    return {
      ok: false,
      status: 400,
      error:
        "Please ask about Ziyad's background, projects, skills, or career direction.",
    };
  }

  return { ok: true, messages, stream: result.data.stream ?? false };
}
