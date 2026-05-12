import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DigitalTwinChat } from "./digital-twin-chat";

describe("DigitalTwinChat", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it("submits with Enter and sends only non-seed history", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "Ziyad is focused on mobile engineering." }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<DigitalTwinChat />);

    const textarea = screen.getByLabelText(/ask about ziyad/i);
    await user.type(textarea, "What does Ziyad build?{Enter}");

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/digital-twin",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user", content: "What does Ziyad build?" }],
          stream: true,
        }),
      }),
    );

    expect(
      await screen.findByText("Ziyad is focused on mobile engineering."),
    ).toBeInTheDocument();
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
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ reply: "Flutter, Swift, and API integration." }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<DigitalTwinChat />);

    await user.click(
      screen.getByRole("button", {
        name: "What are Ziyad's strongest technical skills?",
      }),
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/digital-twin",
      expect.objectContaining({
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: "What are Ziyad's strongest technical skills?",
            },
          ],
          stream: true,
        }),
      }),
    );
  });
});
