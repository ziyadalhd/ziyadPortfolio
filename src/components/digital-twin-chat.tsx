"use client";

import {
  FormEvent,
  KeyboardEvent,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { ChatMessage } from "@/types/chat";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import {
  MAX_HISTORY_MESSAGES,
  MAX_MESSAGE_CONTENT_LENGTH,
} from "@/lib/request-validation";

import { MessageContent } from "./DigitalTwinChat/renderMessageContent";

type ChatStatus = "idle" | "sending" | "success" | "error";

type UiMessage = ChatMessage & {
  id: string;
  isSeed?: boolean;
};

// v2 + locale: seed messages are persisted, so a shared key would restore an
// English greeting and English history on the Arabic page.
function storageKey(locale: Locale) {
  return `ziyad-digital-twin-chat:v2:${locale}`;
}
const MAX_STORED_MESSAGES = 50;

// Evaluated at call-time inside sendMessage (browser-only) so it reflects
// the actual runtime environment rather than the SSR pre-render context.
function supportsStreaming() {
  return (
    typeof ReadableStream !== "undefined" && typeof TextDecoder !== "undefined"
  );
}

function createMessage(message: ChatMessage, isSeed = false): UiMessage {
  return {
    ...message,
    id: createId(),
    isSeed,
  };
}

function createSeedMessages(greeting: string) {
  return [createMessage({ role: "assistant", content: greeting }, true)];
}

function createId() {
  return crypto.randomUUID();
}

function loadStoredMessages(locale: Locale, greeting: string) {
  if (typeof window === "undefined") return createSeedMessages(greeting);

  try {
    const raw = window.localStorage.getItem(storageKey(locale));
    if (!raw) return createSeedMessages(greeting);

    const parsed = JSON.parse(raw) as UiMessage[];
    const validMessages = parsed.filter(
      (message) =>
        typeof message.id === "string" &&
        message.id.length > 0 &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0 &&
        message.content.length <= MAX_MESSAGE_CONTENT_LENGTH,
    );

    return validMessages.length > 0
      ? validMessages
      : createSeedMessages(greeting);
  } catch {
    return createSeedMessages(greeting);
  }
}

const MessageBubble = memo(function MessageBubble({
  message,
  roles,
}: {
  message: UiMessage;
  roles: Dictionary["twin"]["roles"];
}) {
  return (
    <div
      className={`twin-message ${
        message.role === "user" ? "twin-user" : "twin-assistant"
      }`}
    >
      <span className="twin-role">
        {message.role === "user" ? roles.user : roles.assistant}
      </span>
      <MessageContent content={message.content} />
    </div>
  );
});

export function DigitalTwinChat({
  content,
  locale,
}: {
  content: Dictionary["twin"];
  locale: Locale;
}) {
  const [messages, setMessages] = useState<UiMessage[]>(() =>
    createSeedMessages(content.seedGreeting),
  );
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastUserPrompt, setLastUserPrompt] = useState<string | null>(null);
  const [showDelayMessage, setShowDelayMessage] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef(messages);
  const abortControllerRef = useRef<AbortController | null>(null);
  const storageReadyRef = useRef(false);

  const loading = status === "sending";

  const canSubmit = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading],
  );

  const hasUserMessage = useMemo(
    () => messages.some((message) => message.role === "user"),
    [messages],
  );

  const lastMessageContentLength =
    messages[messages.length - 1]?.content.length ?? 0;

  useEffect(() => {
    messagesRef.current = messages;
    if (!storageReadyRef.current) return;

    const toStore =
      messages.length > MAX_STORED_MESSAGES
        ? messages.slice(-MAX_STORED_MESSAGES)
        : messages;
    window.localStorage.setItem(storageKey(locale), JSON.stringify(toStore));
  }, [messages, locale]);

  // Hydrate once per locale. The switcher does a full document load, so
  // locale is stable for the lifetime of this component.
  useEffect(() => {
    const storedMessages = loadStoredMessages(locale, content.seedGreeting);
    storageReadyRef.current = true;
    queueMicrotask(() => {
      messagesRef.current = storedMessages;
      setMessages(storedMessages);
    });
  }, [locale, content.seedGreeting]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "auto",
    });
  }, [messages.length, lastMessageContentLength, loading]);

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setShowDelayMessage(true), 8_000);
    return () => {
      clearTimeout(timer);
      setShowDelayMessage(false);
    };
  }, [loading]);

  async function sendMessage(content: string, appendUserMessage = true) {
    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const userMessage = createMessage({ role: "user", content });
    const nextMessages = appendUserMessage
      ? [...messagesRef.current, userMessage]
      : messagesRef.current;
    const history = nextMessages
      .filter((message) => !message.isSeed && message.content.trim().length > 0)
      .slice(-MAX_HISTORY_MESSAGES)
      .map(({ role, content }) => ({ role, content }));

    if (appendUserMessage) {
      setMessages(nextMessages);
    }

    setLastUserPrompt(content);
    setInput("");
    setError(null);
    setStatus("sending");

    let pendingStreamingMsgId: string | null = null;

    try {
      const streamingEnabled = supportsStreaming();
      const response = await fetch("/api/digital-twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          stream: streamingEnabled,
          locale,
        }),
        signal: abortController.signal,
      });

      const contentType = response.headers?.get("content-type") ?? "";
      if (
        streamingEnabled &&
        response.ok &&
        response.body &&
        contentType.includes("text/plain")
      ) {
        const assistantMessage = createMessage({
          role: "assistant",
          content: "",
        });

        pendingStreamingMsgId = assistantMessage.id;
        setMessages((prev) => [...prev, assistantMessage]);
        const streamedReply = await readTextStream(response.body, (content) => {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantMessage.id
                ? { ...message, content }
                : message,
            ),
          );
        });

        if (!streamedReply) {
          throw new Error("The AI service returned an empty response.");
        }

        pendingStreamingMsgId = null;
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: streamedReply }
              : message,
          ),
        );
        setStatus("success");
        return;
      }

      const payload = (await response.json()) as {
        reply?: string;
        error?: string;
      };

      if (!response.ok || !payload.reply) {
        throw new Error(payload.error ?? "Failed to get a response.");
      }

      setMessages((prev) => [
        ...prev,
        createMessage({ role: "assistant", content: payload.reply as string }),
      ]);
      setStatus("success");
    } catch (err) {
      if (pendingStreamingMsgId !== null) {
        const msgId = pendingStreamingMsgId;
        setMessages((prev) => prev.filter((m) => m.id !== msgId));
        pendingStreamingMsgId = null;
      }

      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      const message =
        err instanceof Error ? err.message : "Unexpected request error.";
      setError(message);
      setStatus("error");
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    await sendMessage(input.trim());
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    event.preventDefault();
    if (canSubmit) {
      void sendMessage(input.trim());
    }
  }

  async function handleStarter(prompt: string) {
    if (loading) return;
    await sendMessage(prompt);
  }

  function resetChat() {
    abortControllerRef.current?.abort();
    const seedMessages = createSeedMessages(content.seedGreeting);
    setMessages(seedMessages);
    messagesRef.current = seedMessages;
    setInput("");
    setError(null);
    setLastUserPrompt(null);
    setStatus("idle");
  }

  function retryLastMessage() {
    if (!lastUserPrompt || loading) return;
    void sendMessage(lastUserPrompt, false);
  }

  return (
    <div className="twin-shell">
      <div className="twin-header">
        <div>
          <h3>{content.panelTitle}</h3>
          <p>{content.panelSubtitle}</p>
        </div>
        <button
          type="button"
          className="twin-reset"
          onClick={resetChat}
          aria-label={content.reset}
          title={content.reset}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {!hasUserMessage ? (
        <div className="twin-prompts">
          {content.starterPrompts.map((prompt: string) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void handleStarter(prompt)}
              className="twin-prompt"
            >
              {prompt}
            </button>
          ))}
        </div>
      ) : null}

      <div
        className="twin-messages"
        aria-live="polite"
        aria-busy={loading}
        role="log"
        ref={messagesContainerRef}
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            roles={content.roles}
          />
        ))}
      </div>

      {loading ? (
        <p className="twin-status" role="status">
          {showDelayMessage ? content.stillWorking : content.thinking}
        </p>
      ) : null}

      <form className="twin-form" onSubmit={handleSubmit}>
        <label htmlFor="digital-twin-input" className="sr-only">
          {content.inputLabel}
        </label>
        <div className="twin-form-row">
          <textarea
            id="digital-twin-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={content.placeholder}
            rows={3}
            disabled={loading}
          />
          <button
            type="submit"
            className="twin-send"
            disabled={!canSubmit}
            aria-label={loading ? content.sending : content.send}
          >
            {loading ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
                style={{ animation: "spin 1s linear infinite" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
      </form>

      {error ? (
        <div className="twin-error" role="alert">
          <p>{error}</p>
          {lastUserPrompt ? (
            <button type="button" onClick={retryLastMessage} disabled={loading}>
              {content.retry}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

async function readTextStream(
  body: ReadableStream<Uint8Array>,
  onContent: (content: string) => void,
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let content = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    content += decoder.decode(value, { stream: true });
    onContent(content);
  }

  const trimmed = content.trim();
  if (trimmed !== content) {
    onContent(trimmed);
  }

  return trimmed;
}
