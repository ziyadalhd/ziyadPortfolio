import type { Locale } from "./config";
import { ar } from "./ar";
import { en } from "./en";
import type { Dictionary } from "./types";

/**
 * Synchronous on purpose: both dictionaries are small and server-only, so
 * there is nothing to code-split, and sections stay plain sync components.
 */
export function getDictionary(locale: Locale): Dictionary {
  return locale === "ar" ? ar : en;
}
