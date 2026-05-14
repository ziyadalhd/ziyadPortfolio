import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { OpenRouterError, requestOpenRouterChat } from "./openrouter";

const BASE_ARGS = {
  apiKey: "test-key",
  model: "test-model",
  siteUrl: "http://localhost:3000",
  systemPrompt: "You are a test assistant.",
  messages: [{ role: "user" as const, content: "Hello" }],
};

function makeFetchResponse(
  ok: boolean,
  body: unknown,
  status = ok ? 200 : 500,
) {
  return {
    ok,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}

describe("requestOpenRouterChat", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        makeFetchResponse(true, {
          choices: [{ message: { content: "  Hello back!  " } }],
        }),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the trimmed reply on success", async () => {
    const reply = await requestOpenRouterChat(BASE_ARGS);
    expect(reply).toBe("Hello back!");
  });

  it("throws OpenRouterError when choices array is empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeFetchResponse(true, { choices: [] })),
    );
    await expect(requestOpenRouterChat(BASE_ARGS)).rejects.toBeInstanceOf(
      OpenRouterError,
    );
  });

  it("throws OpenRouterError when content is an empty string", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        makeFetchResponse(true, {
          choices: [{ message: { content: "   " } }],
        }),
      ),
    );
    await expect(requestOpenRouterChat(BASE_ARGS)).rejects.toBeInstanceOf(
      OpenRouterError,
    );
  });

  it("retries once on a 5xx error then succeeds", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeFetchResponse(false, {}, 503))
      .mockResolvedValueOnce(
        makeFetchResponse(true, {
          choices: [{ message: { content: "Retry worked" } }],
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const reply = await requestOpenRouterChat(BASE_ARGS);
    expect(reply).toBe("Retry worked");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("throws OpenRouterError after all retries fail", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeFetchResponse(false, {}, 503)),
    );
    await expect(requestOpenRouterChat(BASE_ARGS)).rejects.toBeInstanceOf(
      OpenRouterError,
    );
  });

  it("throws a 504 OpenRouterError on request timeout", async () => {
    const abortError = new DOMException("Timed out", "TimeoutError");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(abortError));

    const error = await requestOpenRouterChat(BASE_ARGS).catch((e) => e);
    expect(error).toBeInstanceOf(OpenRouterError);
    expect((error as OpenRouterError).status).toBe(504);
  });
});
