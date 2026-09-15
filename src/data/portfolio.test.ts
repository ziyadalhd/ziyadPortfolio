import { describe, expect, it } from "vitest";

import { LOCALES } from "@/i18n/config";

import { journey, projects, valuePillars, type Localized } from "./portfolio";

function missingLocales(value: Localized<string | string[]>, path: string) {
  return LOCALES.filter((locale) => {
    const v = value[locale];
    return Array.isArray(v) ? v.length === 0 : !v?.trim();
  }).map((locale) => `${path}.${locale}`);
}

describe("portfolio data", () => {
  it("gives every project a unique slug", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("translates every project field into both locales", () => {
    const gaps = projects.flatMap((p) => [
      ...missingLocales(p.title, `${p.slug}.title`),
      ...missingLocales(p.kind, `${p.slug}.kind`),
      ...missingLocales(p.period, `${p.slug}.period`),
      ...missingLocales(p.summary, `${p.slug}.summary`),
      ...missingLocales(p.highlights, `${p.slug}.highlights`),
    ]);
    expect(gaps).toEqual([]);
  });

  it("gives every project a non-empty stack", () => {
    expect(projects.filter((p) => p.stack.length === 0)).toEqual([]);
  });

  it("translates journey entries and value pillars", () => {
    const gaps = [
      ...journey.flatMap((item, i) => [
        ...missingLocales(item.period, `journey[${i}].period`),
        ...missingLocales(item.title, `journey[${i}].title`),
        ...missingLocales(item.detail, `journey[${i}].detail`),
      ]),
      ...valuePillars.flatMap((p, i) => missingLocales(p, `pillar[${i}]`)),
    ];
    expect(gaps).toEqual([]);
  });
});
