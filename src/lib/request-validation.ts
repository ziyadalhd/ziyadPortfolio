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
  messages: z.array(chatMessageSchema).min(1),
  stream: z.boolean().optional(),
});

// Best-effort pattern block — not a security guarantee. The system prompt
// itself instructs the model to resist meta-instructions, which is the
// primary defence. Extend this list as new bypass patterns are observed.
const promptInjectionPatterns = [
  /ignore (all )?(previous|prior|above) (instructions|rules|prompts)/i,
  /reveal (the )?(system|developer) (prompt|message|instructions)/i,
  /show (the )?(system|developer) (prompt|message|instructions)/i,
  /you are now/i,
  /jailbreak/i,
  /pretend (you are|to be)/i,
  /roleplay as/i,
  /forget (your|all|the) (instructions?|rules?|previous)/i,
  /disregard (your|all) (instructions?|rules?)/i,
  /new (instructions?|system prompt|rules)/i,
  /override (your|the) (instructions?|system|rules)/i,
  /\bact as\b/i,
  /from now on/i,
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

  // Silently truncate to the tail so a large-history client can't inflate cost.
  // The schema has no upper-bound constraint; this slice is the enforced limit.
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
