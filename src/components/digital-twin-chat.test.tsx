import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DigitalTwinChat } from "./digital-twin-chat";

// In happy-dom, ReadableStream and TextDecoder are available, so supportsStreaming()
// returns true and the component sends stream: true. Both tests below use a JSON
// content-type response so the component falls through to the JSON (non-streaming)
// path regardless.
function makeJsonFetch(reply: string) {
  return vi.fn().mockResolvedValue({
    ok: true,
    headers: new Headers({ "content-type": "application/json" }),
    body: null,
    json: async () => ({ reply }),
  });
}

describe("DigitalTwinChat", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it("submits with Enter and sends only non-seed history", async () => {
    const fetchMock = makeJsonFetch("Ziyad is focused on mobile engineering.");
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<DigitalTwinChat />);

    const textarea = screen.getByLabelText(/ask about ziyad/i);
    await user.type(textarea, "What does Ziyad build?{Enter}");

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/digital-twin");
    const body = JSON.parse(init.body as string) as {
      messages: { role: string; content: string }[];
      stream: boolean;
    };
    expect(body.messages).toEqual([
      { role: "user", content: "What does Ziyad build?" },
    ]);
    expect(typeof body.stream).toBe("boolean");

    expect(
      await screen.findByText("Ziyad is focused on mobile engineering."),
    ).toBeInTheDocument();
    // Starter prompts should be gone once the user has sent a message
    expect(
      screen.queryByText("What are Ziyad's strongest technical skills?"),
    ).not.toBeInTheDocument();
  });

  it("resets the chat to the seeded greeting", async () => {
    const user = userEvent.setup();
    render(<DigitalTwinChat />);

    await user.click(screen.getByRole("button", { name: /reset chat/i }));

    expect(
      screen.getByText(/Hi, I am Ziyad's Digital Twin/i),
    ).toBeInTheDocument();
  });

  it("submits a suggested question when tapped", async () => {
    const fetchMock = makeJsonFetch(
      "Flutter, Swift, and API integration.",
    );
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<DigitalTwinChat />);

    await user.click(
      screen.getByRole("button", {
        name: "What are Ziyad's strongest technical skills?",
      }),
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as {
      messages: { role: string; content: string }[];
    };
    expect(body.messages).toEqual([
      {
        role: "user",
        content: "What are Ziyad's strongest technical skills?",
      },
    ]);
  });
});
