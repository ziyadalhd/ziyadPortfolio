"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const starterPrompts = [
  "What are Ziyad's strongest technical skills?",
  "Tell me about the WASL project impact.",
  "What type of opportunities is he looking for?",
];

function renderMessageContent(content: string) {
  const cleaned = content
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/```/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const blocks = cleaned
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="twin-content">
      {blocks.map((block, index) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        if (lines.length > 0 && lines.every((line) => /^[-*•]\s+/.test(line))) {
          return (
            <ul key={`ul-${index}`}>
              {lines.map((line, lineIndex) => (
                <li key={`ul-line-${lineIndex}`}>
                  {line.replace(/^[-*•]\s+/, "")}
                </li>
              ))}
            </ul>
          );
        }

        if (lines.length > 0 && lines.every((line) => /^\d+[.)]\s+/.test(line))) {
          return (
            <ol key={`ol-${index}`}>
              {lines.map((line, lineIndex) => (
                <li key={`ol-line-${lineIndex}`}>
                  {line.replace(/^\d+[.)]\s+/, "")}
                </li>
              ))}
            </ol>
          );
        }

        return <p key={`p-${index}`}>{lines.join(" ")}</p>;
      })}
    </div>
  );
}

export function DigitalTwinChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi, I am Ziyad's Digital Twin. Feel free to ask about my background, projects, skills, and career direction.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const canSubmit = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading],
  );

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "auto",
    });
  }, [messages.length, loading]);

  async function sendMessage(content: string) {
    const userMessage: Message = { role: "user", content };
    const history = [...messages, userMessage].filter(
      (msg) => msg.role !== "assistant" || msg.content !== messages[0]?.content,
    );

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/digital-twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const payload = (await response.json()) as {
        reply?: string;
        error?: string;
      };

      if (!response.ok || !payload.reply) {
        throw new Error(payload.error ?? "Failed to get a response.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: payload.reply as string },
      ]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unexpected request error.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    await sendMessage(input.trim());
  }

  async function handleStarter(prompt: string) {
    if (loading) return;
    await sendMessage(prompt);
  }

  return (
    <div className="twin-shell">
      <div className="twin-header">
        <h3>Digital Twin Chat</h3>
        <p>Ask about projects, skills, education, and career journey.</p>
      </div>

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

      <div className="twin-messages" aria-live="polite" ref={messagesContainerRef}>
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}-${message.content.slice(0, 24)}`}
            className={`twin-message ${
              message.role === "user" ? "twin-user" : "twin-assistant"
            }`}
          >
            <span className="twin-role">
              {message.role === "user" ? "You" : "Digital Twin"}
            </span>
            {renderMessageContent(message.content)}
          </div>
        ))}
        {loading ? (
          <div className="twin-message twin-assistant">
            <span className="twin-role">Digital Twin</span>
            <div className="twin-content">
              <p>Thinking...</p>
            </div>
          </div>
        ) : null}
      </div>

      <form className="twin-form" onSubmit={handleSubmit}>
        <label htmlFor="digital-twin-input" className="sr-only">
          Ask about Ziyad&apos;s career
        </label>
        <textarea
          id="digital-twin-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about experience, skills, projects, education, or goals..."
          rows={3}
          disabled={loading}
        />
        <button type="submit" disabled={!canSubmit}>
          {loading ? "Sending..." : "Ask Digital Twin"}
        </button>
      </form>

      {error ? <p className="twin-error">{error}</p> : null}
    </div>
  );
}
