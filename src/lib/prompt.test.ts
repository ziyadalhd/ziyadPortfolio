import { describe, expect, it } from "vitest";

import { CAREER_KNOWLEDGE, buildSystemPrompt } from "./prompt";

describe("buildSystemPrompt", () => {
  it("returns a different prompt per locale", () => {
    expect(buildSystemPrompt("ar")).not.toBe(buildSystemPrompt("en"));
  });

  it("is stable across repeated calls", () => {
    expect(buildSystemPrompt("ar")).toBe(buildSystemPrompt("ar"));
    expect(buildSystemPrompt("en")).toBe(buildSystemPrompt("en"));
  });

  it("instructs Arabic replies only for the Arabic locale", () => {
    expect(buildSystemPrompt("ar")).toContain("Modern Standard Arabic");
    expect(buildSystemPrompt("en")).not.toContain("Modern Standard Arabic");
  });

  it("tells the Arabic prompt to keep tech names in Latin script", () => {
    expect(buildSystemPrompt("ar")).toContain("Latin script");
    expect(buildSystemPrompt("ar")).toContain("Spring Boot");
  });

  it("grounds both locales in the same career profile", () => {
    for (const locale of ["ar", "en"] as const) {
      expect(buildSystemPrompt(locale)).toContain(CAREER_KNOWLEDGE);
    }
  });

  it("interpolates localised personal fields, not objects", () => {
    // personalInfo.role and .location are Localized records; interpolating the
    // record itself would put "[object Object]" into the model's grounding.
    expect(CAREER_KNOWLEDGE).not.toContain("[object Object]");
    expect(CAREER_KNOWLEDGE).toContain("Makkah, Saudi Arabia");
  });
});
