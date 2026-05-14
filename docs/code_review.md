# Code Review — Ziyad Portfolio

Reviewed: 2026-05-14  
**Status: All actionable items resolved. See fix summary below.**  
Scope: all source files under `src/`, `e2e/`, and config files at the repo root.  
Reviewer notes are organized from highest to lowest impact.

---

## 1. Critical

### 1.1 `.env` key is lowercase; code reads uppercase — API always returns 500

**File:** `.env` / `src/lib/openrouter.ts:39`

The local `.env` file stores `openrouter_api_key=` (lowercase), but the application reads `process.env.OPENROUTER_API_KEY` (uppercase). On case-sensitive systems (Linux / any cloud runtime), these are distinct keys. `apiKey` will always be `undefined`, causing every chat request to return HTTP 500 with the message "OpenRouter API key not found."

**Fix:** Rename the key in `.env` to uppercase, matching `.env.example`:
```
OPENROUTER_API_KEY=your_key_here
```

### 1.2 In-memory rate limiter resets on every cold start

**File:** `src/lib/rate-limit.ts`

The `buckets` Map lives in Node.js process memory. On any serverless platform (Vercel, Netlify Functions, etc.), each cold start creates a fresh process — the bucket history is gone. A user who has already sent 6 requests gets a clean slate on every new invocation, making the limit ineffective in production.

**Recommended fix:** Replace with an edge-compatible store. Redis (Upstash) or Vercel KV via `@vercel/kv` both work. If a hosted store is out of scope, at minimum document the limitation and rely on upstream provider-level rate limiting.

### 1.3 Stale buckets accumulate in the rate-limit Map

**File:** `src/lib/rate-limit.ts:9`

`buckets` is never purged. Expired entries (past their `resetAt`) stay in memory until the same IP makes a new request. On a long-running server this is a memory leak. Add a periodic cleanup or prune expired entries eagerly in `checkRateLimit`:

```ts
// At the start of checkRateLimit, sweep expired buckets
for (const [key, bucket] of buckets) {
  if (bucket.resetAt <= now) buckets.delete(key);
}
```

---

## 2. Security

### 2.1 Skip-to-content link does not actually skip the header

**File:** `src/app/page.tsx:16`, `src/components/SiteHeader.tsx`

`<a href="#main-content">` points to `<main id="main-content">`, but `SiteHeader` is rendered *inside* that `<main>`. Activating the skip link scrolls to the top of the page, not past the navigation. Keyboard-only users still tab through every nav item.

**Fix:** Add `id="skip-target"` (or similar) to the `<Hero>` section and change the skip link to `href="#skip-target"`, or move the `<SiteHeader>` outside `<main>` so the skip link destination falls after it.

### 2.2 Prompt injection guard covers only six exact phrases

**File:** `src/lib/request-validation.ts:19-26`

Current patterns do not cover common bypass variants:
- `"act as"`, `"pretend you are"`, `"roleplay as"`, `"forget your instructions"`
- Unicode substitutions (`ıgnore`, `rеveal` with Cyrillic characters)
- Multi-turn injection through earlier `assistant` turns

The patterns are a useful first layer but should be treated as a hint, not a guarantee. The system prompt in `src/lib/prompt.ts:48` already instructs the model to resist meta-instructions, which is the more reliable defense. Document that the regex layer is best-effort only.

### 2.3 No CSRF protection on the chat API

**File:** `src/app/api/digital-twin/route.ts`

`POST /api/digital-twin` accepts requests from any origin. A cross-origin page can POST to this endpoint using a visitor's browser (and their IP's rate-limit quota). For an unauthenticated public API this is typically acceptable, but any future endpoint that mutates state or is authenticated will need CSRF tokens or `SameSite` cookie controls.

### 2.4 Personal contact details in HTML source

**File:** `src/components/sections/Contact.tsx:11-14`

The phone number and email are in the rendered HTML. Search-engine crawlers and spam scrapers will index them. This is a conscious trade-off for a portfolio but worth noting. A common mitigation is to render them only after a user interaction (click-to-reveal), or to use a contact form.

---

## 3. API Layer

### 3.1 Streaming path has no per-chunk timeout

**File:** `src/lib/openrouter.ts:142-177`

`fetchOpenRouter` applies `AbortSignal.timeout(REQUEST_TIMEOUT_MS)` for the initial connection, so a hung handshake will abort after 20 seconds. However, once the stream begins, there is no watchdog: if OpenRouter stops sending chunks mid-stream, the connection hangs indefinitely. Add a rolling inactivity deadline using a separate `setTimeout` that calls `controller.abort()` if no chunk arrives within, say, 10 seconds.

### 3.2 Streaming has no retry on transient 5xx

**File:** `src/lib/openrouter.ts:143-176`

The non-streaming `requestOpenRouterChat` retries once on a 5xx response (`MAX_RETRIES = 1`). `requestOpenRouterChatStream` has no retry: a transient upstream failure immediately surfaces as a user-visible error. At minimum, add a single retry attempt before failing, matching the non-streaming behaviour.

### 3.3 `getOpenRouterConfig` falls back to `req.headers.get("origin")`

**File:** `src/lib/openrouter.ts:41-43`

If `NEXT_PUBLIC_SITE_URL` is unset, `siteUrl` falls back to the request's `Origin` header, which an attacker can set to anything. The value is used only as an `HTTP-Referer` for OpenRouter attribution — no security boundary is crossed here — but it is worth documenting this fallback behaviour and preferring the env var in all deployments.

---

## 4. Frontend — `DigitalTwinChat`

### 4.1 Chat history grows unbounded in the UI

**File:** `src/components/digital-twin-chat.tsx:169`

The API correctly limits history to `MAX_HISTORY_MESSAGES = 12` before sending, but the rendered message list in the UI has no cap. After many exchanges the DOM and `localStorage` can grow arbitrarily. Trim both the rendered list and the stored value to a reasonable ceiling (e.g., 50 messages).

### 4.2 `canUseStreamingResponses` is evaluated at module load time

**File:** `src/components/digital-twin-chat.tsx:34`

```ts
const canUseStreamingResponses =
  typeof ReadableStream !== "undefined" && typeof TextDecoder !== "undefined";
```

This is evaluated once when the module is first imported — potentially during SSR — not when the component mounts in the browser. Under Next.js app-router, client components are pre-rendered on the server where `ReadableStream` and `TextDecoder` *are* available (Node.js 18+), so `canUseStreamingResponses` is always `true`. Move the check inside `sendMessage` or into a `useEffect`-initialized state to accurately reflect the browser environment.

### 4.3 Stored messages are not validated against the current schema

**File:** `src/components/digital-twin-chat.tsx:64-84`

`loadStoredMessages` only checks that `id`, `role`, and `content` fields exist. It does not validate that `role` is `"user" | "assistant"`, that `content` is non-empty after trimming, or that the array length is within bounds. A corrupt or manually-edited `localStorage` entry could cause unexpected behaviour. Run the stored data through the existing `chatMessageSchema` (from `request-validation.ts`) or a similar runtime validator.

### 4.4 `messagesRef` pattern adds cognitive overhead

**File:** `src/components/digital-twin-chat.tsx:112-114, 131-145`

The component keeps `messagesRef` in sync with `messages` state via a `useEffect` to avoid stale closures in `sendMessage`. An alternative that eliminates the dual-tracking is to use `useRef` to store the latest messages and update it synchronously before state updates:

```ts
const setMessagesWithRef = (next: UiMessage[]) => {
  messagesRef.current = next;
  setMessages(next);
};
```

Or refactor `sendMessage` to use a functional state update so the ref is not needed at all. The current pattern is correct but harder to reason about.

---

## 5. `renderMessageContent.tsx`

### 5.1 Markdown links are not stripped — URL leaks into rendered text

**File:** `src/components/DigitalTwinChat/renderMessageContent.tsx:8-14`

The cleaner removes bold, inline code, and code blocks but has no rule for Markdown links (`[label](url)`). If the model outputs a link (e.g., `[my GitHub](https://github.com/ziyadalhd)`), the user sees the raw Markdown syntax including the URL. Add:

```ts
.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
```

### 5.2 Single-asterisk and single-underscore italic are not stripped

**File:** `src/components/DigitalTwinChat/renderMessageContent.tsx`

`**bold**` and `__bold__` are stripped but `*italic*` and `_italic_` are not. These would appear verbatim in the rendered output.

### 5.3 Array indices as React keys

**File:** `src/components/DigitalTwinChat/renderMessageContent.tsx:26-57`

Keys like `ul-${index}` are index-based. For static parsed output that never reorders this is functionally fine, but if `content` changes mid-stream (token-by-token update) React may unnecessarily destroy and recreate list elements. A hash or stable content-based key would be more resilient for streaming updates.

---

## 6. Data / Content

### 6.1 `CAREER_KNOWLEDGE` and `portfolio.ts` duplicate source-of-truth data

**Files:** `src/lib/prompt.ts:3-40`, `src/data/portfolio.ts`

Skills, projects, and education appear in both `portfolio.ts` (for rendering) and `CAREER_KNOWLEDGE` (for the system prompt). They can drift. Consider generating the system prompt programmatically from the `portfolio.ts` data structures so there is one source of truth:

```ts
import { journey, skillGroups } from "@/data/portfolio";

export const CAREER_KNOWLEDGE = `
Skills:
${skillGroups.join("\n")}

Journey:
${journey.map((j) => `- ${j.period}: ${j.title}`).join("\n")}
...
`;
```

### 6.2 Magic background color appears in four places

**Files:** `page.tsx`, `error.tsx`, `loading.tsx`, `layout.tsx` (themeColor), `globals.css`

The value `#070b14` is repeated as an inline Tailwind arbitrary value in `page.tsx`, `error.tsx`, and `loading.tsx`, and also in `globals.css` on `html, body`. Define it once in a Tailwind theme extension in `tailwind.config.ts` (or CSS variable) and reference `bg-base` or similar everywhere.

---

## 7. Accessibility

### 7.1 `aria-current="page"` is semantically wrong for SPA section navigation

**File:** `src/components/SiteHeader.tsx:75`

`aria-current="page"` is defined by ARIA to indicate the current *page* in a multi-page site. On a single-page site with section-based scroll navigation, the correct value is `aria-current="true"` or `aria-current="location"`. Screen reader announcements differ: `"page"` is announced as "current page" which is misleading when all sections are on the same URL.

### 7.2 Mobile menu does not manage focus

**File:** `src/components/SiteHeader.tsx:52-81`

When the menu opens (`setMenuOpen(true)`), focus remains on the toggle button and is not moved into the nav. When the menu closes, focus is not returned. Users navigating by keyboard or screen reader have no reliable way to enter the opened menu or know it opened.

**Recommended fix:** On open, move focus to the first `<a>` in the nav. On close (either by clicking a link or pressing Escape), return focus to the toggle button.

### 7.3 Loading skeleton has no accessible announcement

**File:** `src/app/loading.tsx`

The loading skeleton renders silent `animate-pulse` rectangles. Screen reader users receive no information that the page is loading. Add `role="status"` and visible (or SR-only) text:

```tsx
<main role="status" aria-label="Loading portfolio content" ...>
```

### 7.4 Journey timeline has no accessible group label

**File:** `src/components/sections/Journey.tsx:12`

The `<div className="timeline ...">` wraps a list of `<article>` elements with no group label. Adding `role="list"` (for `<ul>`) or `aria-label="Career timeline"` helps assistive technologies convey the group's purpose.

---

## 8. Testing

### 8.1 No tests for `rate-limit.ts` despite a test-reset export

**File:** `src/lib/rate-limit.ts:51`

`resetRateLimitForTests()` is exported, signalling that unit tests were planned but never written. The rate limiter has non-trivial branching (window expiry, count increment, retry-after calculation) and should have at least three test cases: under limit, at limit, and after window reset.

### 8.2 No tests for `openrouter.ts`

`requestOpenRouterChat` has retry logic, jitter, timeout abort handling, and empty-response detection. `transformOpenRouterStream` has SSE parsing. These are entirely untested. A mock `fetch` + `ReadableStream` can exercise all branches.

### 8.3 No tests for `renderMessageContent.tsx`

The markdown-stripping and block-parsing logic is untested. A Vitest + Testing Library test suite should cover: plain text, bold/italic stripping, code block removal, list detection, ordered list detection, and multi-paragraph splitting.

### 8.4 `stream: true` assertion relies on test-environment capability

**File:** `src/components/digital-twin-chat.test.tsx:29-36`

The test asserts that `stream: true` is sent. This is correct *only* if `canUseStreamingResponses` resolves to `true` in happy-dom. If the test environment doesn't expose `ReadableStream`, the assertion fails. The test should either explicitly control the streaming flag or assert `stream: expect.any(Boolean)` to remain environment-agnostic.

### 8.5 E2E tests cover only mobile WebKit

**File:** `playwright.config.ts`

Only iPhone 14 / WebKit is tested. Desktop Chrome (the dominant portfolio visitor browser) and Android Chrome are not covered. Add at minimum a `desktop-chrome` project to the Playwright config.

---

## 9. Minor Code Quality

| Location | Observation |
|---|---|
| `digital-twin-chat.tsx:56-62` | `createId` fallback (`Date.now() + random`) is dead code — `crypto.randomUUID()` is available in every environment this app targets (Node 18+, modern browsers). |
| `SiteHeader.tsx:19-27` | `IntersectionObserver` callback picks the highest `intersectionRatio` among currently-firing entries, but entries from *previous* frames are not considered. The active section can flicker during fast scrolling when two sections fire in separate callbacks. Storing the highest-ever ratio seen provides more stable behaviour. |
| `request-validation.ts:61` | `messages.slice(-MAX_HISTORY_MESSAGES)` silently truncates without telling the caller. Add a comment noting this is intentional (prevents oversized history from client). |
| `globals.css:498-502` | The `@supports (-webkit-touch-callout: none)` block adds `-webkit-backdrop-filter` only for `.section-card`. Tailwind's `backdrop-blur` already emits both prefixed and unprefixed versions, making this rule redundant. |
| `prompt.ts:57-64` | `buildSystemPrompt()` is called on every request. The result is static — it never changes between calls. Compute it once at module load: `export const systemPrompt = buildSystemPrompt();`. |
| `openrouter.ts:9` | `MAX_TOKENS = 450` caps responses at roughly 350–400 words. This is fine for a chat widget but may truncate detailed project or skill descriptions. Consider raising to 600–700 for richer answers. |

---

## 10. Positive Highlights

These deserve to be called out explicitly as patterns worth preserving:

- **Streaming architecture** (`openrouter.ts`) is clean: SSE is parsed server-side and forwarded as a raw token stream. The client only deals with plain text. No leaky SSE protocol crosses the browser boundary.
- **Prompt injection defense is layered**: regex block at the validation layer + system-prompt instruction to resist meta-commands. Neither alone is sufficient; together they raise the bar meaningfully.
- **Content Security Policy** in `next.config.ts` is strict and production-ready. `connect-src` is correctly locked to `'self'` — the chat widget needs no client-side calls to OpenRouter.
- **`reduced-motion` media query** in `globals.css` disables all transitions and animations. A common oversight in portfolio sites; this one handles it correctly.
- **Hydration safety**: `loadStoredMessages` is called in `useEffect`, not during render, preventing SSR/client mismatches.
- **`isSeed` flag** on the greeting message correctly prevents it from being included in API history, saving tokens and avoiding confusion.
- **`scroll-mt-6`** on each section card ensures anchor links land correctly when the SiteHeader is present — a small but important UX detail.
- **Accessibility foundations** (skip link, `aria-live`, `aria-busy`, `role="log"` on messages, `role="alert"` on errors, focus-visible outlines) show deliberate attention to a11y.
