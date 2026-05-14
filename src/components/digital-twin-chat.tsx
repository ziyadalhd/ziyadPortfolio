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

const starterPrompts = [
  "What are Ziyad's strongest technical skills?",
  "Tell me about the WASL project impact.",
  "What type of opportunities is he looking for?",
];

const STORAGE_KEY = "ziyad-digital-twin-chat:v1";
const SEED_GREETING =
  "Hi, I am Ziyad's Digital Twin. Feel free to ask about my background, projects, skills, and career direction.";
const MAX_STORED_MESSAGES = 50;

// Evaluated at call-time inside sendMessage (browser-only) so it reflects
// the actual runtime environment rather than the SSR pre-render context.
function supportsStreaming() {
  return (
    typeof ReadableStream !== "undefined" &&
    typeof TextDecoder !== "undefined"
  );
}

function createMessage(message: ChatMessage, isSeed = false): UiMessage {
  return {
    ...message,
    id: createId(),
    isSeed,
  };
}

function createSeedMessages() {
  return [
    createMessage(
      {
        role: "assistant",
        content: SEED_GREETING,
      },
      true,
    ),
  ];
}

function createId() {
  return crypto.randomUUID();
}

function loadStoredMessages() {
  if (typeof window === "undefined") return createSeedMessages();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedMessages();

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

    return validMessages.length > 0 ? validMessages : createSeedMessages();
  } catch {
    return createSeedMessages();
  }
}

const MessageBubble = memo(function MessageBubble({
  message,
}: {
  message: UiMessage;
}) {
  return (
    <div
      className={`twin-message ${
        message.role === "user" ? "twin-user" : "twin-assistant"
      }`}
    >
      <span className="twin-role">
        {message.role === "user" ? "You" : "Digital Twin"}
      </span>
      <MessageContent content={message.content} />
    </div>
  );
});

export function DigitalTwinChat() {
  const [messages, setMessages] = useState<UiMessage[]>(createSeedMessages);
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
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [messages]);

  useEffect(() => {
    const storedMessages = loadStoredMessages();
    storageReadyRef.current = true;
    queueMicrotask(() => {
      messagesRef.current = storedMessages;
      setMessages(storedMessages);
    });
  }, []);

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
    if (!loading) {
      setShowDelayMessage(false);
      return;
    }
    const timer = setTimeout(() => setShowDelayMessage(true), 8_000);
    return () => clearTimeout(timer);
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
    const seedMessages = createSeedMessages();
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
          <h3>Digital Twin Chat</h3>
          <p>Ask about projects, skills, education, and career journey.</p>
        </div>
        <button type="button" className="twin-reset" onClick={resetChat}>
          Reset chat
        </button>
      </div>

      {!hasUserMessage ? (
        <div className="twin-prompts">
          {starterPrompts.map((prompt) => (
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
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      {loading ? (
        <p className="twin-status" role="status">
          {showDelayMessage
            ? "Still working — the AI service may be experiencing delays."
            : "Digital Twin is thinking..."}
        </p>
      ) : null}

      <form className="twin-form" onSubmit={handleSubmit}>
        <label htmlFor="digital-twin-input" className="sr-only">
          Ask about Ziyad&apos;s career
        </label>
        <textarea
          id="digital-twin-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about experience, skills, projects, education, or goals..."
          rows={3}
          disabled={loading}
        />
        <button type="submit" disabled={!canSubmit}>
          {loading ? "Sending..." : "Ask Digital Twin"}
        </button>
      </form>

      {error ? (
        <div className="twin-error" role="alert">
          <p>{error}</p>
          {lastUserPrompt ? (
            <button type="button" onClick={retryLastMessage} disabled={loading}>
              Retry
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
