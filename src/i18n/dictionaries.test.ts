import { describe, expect, it } from "vitest";

import { ar } from "./ar";
import { getDictionary } from "./dictionaries";
import { en } from "./en";

const ARABIC = /[؀-ۿ]/;
const LATIN_LETTER = /[A-Za-z]/;

/**
 * Keys that are legitimately Latin in the Arabic dictionary: the switcher
 * advertises the other language in that language, and "App Store" is a brand.
 */
const LATIN_BY_DESIGN = new Set([
  "nav.switchLabel",
  "nav.switchAria",
  "portfolio.linkLabels.store",
]);

function leaves(value: unknown, path: string[] = []): [string, string][] {
  if (typeof value === "string") return [[path.join("."), value]];
  if (Array.isArray(value))
    return value.flatMap((v, i) => leaves(v, [...path, String(i)]));
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([k, v]) => leaves(v, [...path, k]));
  return [];
}

describe("dictionaries", () => {
  it("returns the matching dictionary per locale", () => {
    expect(getDictionary("ar")).toBe(ar);
    expect(getDictionary("en")).toBe(en);
  });

  it("has no untranslated strings in Arabic", () => {
    // Only Latin *letters* signal untranslated copy; punctuation and numerals
    // (".", "404") carry no language.
    const untranslated = leaves(ar)
      .filter(([path]) => !isLatinByDesign(path))
      .filter(([, text]) => LATIN_LETTER.test(text) && !ARABIC.test(text))
      .map(([path, text]) => `${path}: ${text}`);

    expect(untranslated).toEqual([]);
  });

  it("has no empty strings in either dictionary", () => {
    for (const dict of [ar, en]) {
      const empty = leaves(dict)
        .filter(([, text]) => text.trim().length === 0)
        .map(([path]) => path);
      expect(empty).toEqual([]);
    }
  });
});

function isLatinByDesign(path: string) {
  // Array entries carry an index segment; match on the parent path too.
  return (
    LATIN_BY_DESIGN.has(path) ||
    LATIN_BY_DESIGN.has(path.replace(/\.\d+$/, ""))
  );
}
