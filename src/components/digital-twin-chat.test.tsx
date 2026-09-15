import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { en } from "@/i18n/en";

import { DigitalTwinChat } from "./digital-twin-chat";

// Render with the real dictionary, so these tests also assert that en.twin
// supplies every key the component reads.
const twin = en.twin;
const renderChat = () => render(<DigitalTwinChat content={twin} locale="en" />);

// In happy-dom, ReadableStream and TextDecoder are available, so supportsStreaming()
// returns true and the component sends stream: true. JSON-content-type responses fall
// through to the non-streaming path; text/plain responses use the streaming reader.
function makeJsonFetch(reply: string) {
  return vi.fn().mockResolvedValue({
    ok: true,
    headers: new Headers({ "content-type": "application/json" }),
    body: null,
    json: async () => ({ reply }),
  });
}

function makeEmptyStreamFetch() {
  return vi.fn().mockResolvedValue({
    ok: true,
    headers: new Headers({ "content-type": "text/plain; charset=utf-8" }),
    body: new ReadableStream({
      start(controller) {
        controller.close();
      },
    }),
    json: async () => ({}),
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
    renderChat();

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
    expect(screen.queryByText(twin.starterPrompts[0])).not.toBeInTheDocument();
  });

  it("resets the chat to the seeded greeting", async () => {
    const user = userEvent.setup();
    renderChat();

    await user.click(screen.getByRole("button", { name: /reset chat/i }));

    expect(screen.getByText(twin.seedGreeting)).toBeInTheDocument();
  });

  it("removes empty streaming bubble when the stream returns no content", async () => {
    const fetchMock = makeEmptyStreamFetch();
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    renderChat();

    await user.type(
      screen.getByLabelText(/ask about ziyad/i),
      "test question{Enter}",
    );

    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());

    // The empty streaming bubble must have been removed; only the seed greeting
    // has a "Digital Twin" label — there should be exactly one.
    expect(screen.getAllByText(twin.roles.assistant)).toHaveLength(1);
  });

  it("retry after streaming failure does not include empty messages in history", async () => {
    const fetchMock = makeEmptyStreamFetch();
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    renderChat();

    await user.type(
      screen.getByLabelText(/ask about ziyad/i),
      "What skills?{Enter}",
    );

    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /retry/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    const [, retryInit] = fetchMock.mock.calls[1] as [string, RequestInit];
    const retryBody = JSON.parse(retryInit.body as string) as {
      messages: { role: string; content: string }[];
    };
    expect(retryBody.messages.every((m) => m.content.trim().length > 0)).toBe(
      true,
    );
  });

  it("submits a suggested question when tapped", async () => {
    const fetchMock = makeJsonFetch("Flutter, Swift, and API integration.");
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    renderChat();

    await user.click(
      screen.getByRole("button", {
        name: twin.starterPrompts[0],
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
        content: twin.starterPrompts[0],
      },
    ]);
  });
});
