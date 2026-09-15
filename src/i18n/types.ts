import type { en } from "./en";

/**
 * Widens the literal types produced by `as const` so a translation can hold
 * different strings, while keeping the key structure exact. Declaring
 * `const ar: Dictionary` therefore turns a missing or misspelt key into a
 * compile error.
 */
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { -readonly [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof en>;
