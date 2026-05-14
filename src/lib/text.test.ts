import { describe, expect, it } from "vitest";

import { normalizeWhitespace } from "./text";

describe("normalizeWhitespace", () => {
  it("normalizes Windows line endings to Unix", () => {
    expect(normalizeWhitespace("a\r\nb")).toBe("a\nb");
  });

  it("replaces null bytes with spaces", () => {
    expect(normalizeWhitespace("a\0b")).toBe("a b");
  });

  it("replaces non-breaking spaces with regular spaces", () => {
    expect(normalizeWhitespace("a b")).toBe("a b");
  });

  it("strips trailing spaces and tabs from lines", () => {
    expect(normalizeWhitespace("a   \nb")).toBe("a\nb");
  });

  it("collapses three or more consecutive newlines to two", () => {
    expect(normalizeWhitespace("a\n\n\n\nb")).toBe("a\n\nb");
    expect(normalizeWhitespace("a\n\n\n\n\nb")).toBe("a\n\nb");
  });

  it("trims leading and trailing whitespace", () => {
    expect(normalizeWhitespace("  hello  ")).toBe("hello");
    expect(normalizeWhitespace("\nhello\n")).toBe("hello");
  });

  it("leaves already-clean text unchanged", () => {
    const clean = "hello world\nline two";
    expect(normalizeWhitespace(clean)).toBe(clean);
  });
});
