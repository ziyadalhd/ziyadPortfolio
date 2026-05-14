import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { checkRateLimit, resetRateLimitForTests } from "./rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimitForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows the first request from an IP", () => {
    const result = checkRateLimit("192.168.1.1");
    expect(result.allowed).toBe(true);
  });

  it("allows requests up to the limit", () => {
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit("10.0.0.1").allowed).toBe(true);
    }
    // 6th request is the last allowed
    expect(checkRateLimit("10.0.0.1").allowed).toBe(true);
  });

  it("blocks the 7th request within the window", () => {
    for (let i = 0; i < 6; i++) {
      checkRateLimit("10.0.0.2");
    }
    const result = checkRateLimit("10.0.0.2");
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.retryAfterSeconds).toBeGreaterThan(0);
    }
  });

  it("treats different IPs independently", () => {
    for (let i = 0; i < 6; i++) {
      checkRateLimit("10.0.0.3");
    }
    // A different IP should still be allowed
    const result = checkRateLimit("10.0.0.4");
    expect(result.allowed).toBe(true);
  });

  it("resets the bucket after the window expires", () => {
    vi.useFakeTimers();

    for (let i = 0; i < 6; i++) {
      checkRateLimit("10.0.0.5");
    }
    expect(checkRateLimit("10.0.0.5").allowed).toBe(false);

    vi.advanceTimersByTime(61_000);
    expect(checkRateLimit("10.0.0.5").allowed).toBe(true);
  });

  it("includes a positive retryAfterSeconds when blocked", () => {
    vi.useFakeTimers();

    for (let i = 0; i < 6; i++) {
      checkRateLimit("10.0.0.6");
    }
    const result = checkRateLimit("10.0.0.6");
    if (!result.allowed) {
      expect(result.retryAfterSeconds).toBeGreaterThanOrEqual(1);
      expect(result.retryAfterSeconds).toBeLessThanOrEqual(60);
    }
  });
});
