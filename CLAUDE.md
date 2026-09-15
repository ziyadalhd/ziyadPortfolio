# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest unit/component tests (no build needed)
npm run test:e2e     # Playwright e2e tests (builds first, runs on port 3100)
npm run format       # Prettier write
npm run format:check # Prettier check
```

Run a single Vitest test file:

```bash
npx vitest run src/lib/request-validation.test.ts
```

E2E tests require a production build; they target `http://127.0.0.1:3100` and run only against mobile WebKit (iPhone 14).

## Environment variables

Copy `.env.example` to `.env` before running locally.

- `OPENROUTER_API_KEY` — required; the chat API will 500 without it.
- `OPENROUTER_MODEL` — optional; defaults to `openai/gpt-oss-120b:free`.
- `NEXT_PUBLIC_SITE_URL` — optional; used as `HTTP-Referer` for OpenRouter attribution and in metadata.

## Architecture

Bilingual single-page portfolio on the Next.js App Router. The page lives at
`/{locale}` for `ar` and `en`; Arabic is the default.

### Localisation

- `src/proxy.ts` — **Next 16 renamed Middleware to Proxy**, so the file must be
  `proxy.ts` exporting a function named `proxy`. It redirects any non-locale
  path to `/{locale}` with a 307 (not 308: the target varies per visitor).
  Its matcher excludes anything with a file extension, which is what keeps
  `/robots.txt`, `/sitemap.xml` and `/icon.svg` reachable.
- `src/i18n/en.ts` is the shape source; `ar.ts` is declared `const ar:
Dictionary`, so a missing or misspelt key is a **compile error**.
- `page.tsx` resolves the dictionary once and passes a section slice to each
  component. Client components (`SiteHeader`, `digital-twin-chat`) must
  receive copy as props.
- `SiteHeader` keeps nav `href`/`id` in the component: the ids feed
  `getElementById` in the scroll-spy observer. Only labels are translated.
- Content entities (projects, journey, pillars) carry their own `Localized`
  translations in `src/data/portfolio.ts`, so adding a project is one edit in
  one file. UI chrome lives in `src/i18n`.
- `src/app/global-not-found.tsx` handles unmatched routes. With the root layout
  inside `[locale]`, they have no document to render into, and a
  `[locale]/[...rest]` catch-all returned a soft 404 (HTTP 200).
- Arabic uses IBM Plex Sans Arabic via an `html[lang="ar"]` override of
  `--font-heading`/`--font-body`. Components must reference those variables,
  never `--font-syne` directly, or the swap silently does nothing.

### Data flow for the Digital Twin chat

```
DigitalTwinChat (client)
  → POST /api/digital-twin  (Next.js Route Handler, nodejs runtime)
      ↓ checkRateLimit (in-memory, 6 req/60 s per IP)
      ↓ validateRequestBodyText (Zod + prompt-injection patterns)
      ↓ buildSystemPrompt(locale) — cached per locale in a Map
      ↓ requestOpenRouterChat / requestOpenRouterChatStream
          → OpenRouter API (20 s timeout, 1 retry on 5xx)
          → returns raw SSE stream forwarded as text/plain
```

The client detects streaming support via `ReadableStream` / `TextDecoder` availability and requests `stream: true` when available. The server transforms OpenRouter's SSE into a raw token stream (`text/plain`).

### Key modules

| Path                                   | Purpose                                                                                                                                                                                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/api/digital-twin/route.ts`    | API handler: rate limiting, validation, OpenRouter dispatch                                                                                                                                                                     |
| `src/lib/openrouter.ts`                | OpenRouter fetch wrapper with retry/timeout/streaming                                                                                                                                                                           |
| `src/lib/prompt.ts`                    | System prompt builder — edit `CAREER_KNOWLEDGE` here to update Ziyad's bio. Cache is keyed by locale; a single cached string would pin a warm instance to one language. `CAREER_KNOWLEDGE` stays English (grounding, not prose) |
| `src/i18n/`                            | Dictionaries, locale config, `getDictionary`                                                                                                                                                                                    |
| `src/proxy.ts`                         | Locale negotiation and redirect                                                                                                                                                                                                 |
| `src/lib/request-validation.ts`        | Zod request schema + prompt-injection regex patterns                                                                                                                                                                            |
| `src/lib/rate-limit.ts`                | In-memory IP bucket; `resetRateLimitForTests()` available for tests                                                                                                                                                             |
| `src/data/linkedin.json`               | LinkedIn profile summary injected into the system prompt                                                                                                                                                                        |
| `src/data/portfolio.ts`                | Typed portfolio project data rendered in the Portfolio section                                                                                                                                                                  |
| `src/components/digital-twin-chat.tsx` | Client component: chat state, streaming reader, localStorage persistence                                                                                                                                                        |

### Content Security Policy

`next.config.ts` sets a strict CSP for all routes. The `connect-src` directive only allows `'self'` and localhost origins. If any new client-side external fetch is added (e.g., analytics, fonts CDN), it must be added to the CSP there.

### Chat history persistence

Chat history is stored in `localStorage` under `ziyad-digital-twin-chat:v2:{locale}`.
The key **must** stay locale-scoped: seed messages are persisted, so a shared
key restores an English greeting and English history on the Arabic page. Seed
messages are filtered out before sending to the API via the `isSeed` flag.

### Known gaps

- Prompt-injection patterns in `request-validation.ts` are English-only. An
  Arabic list would be trivially bypassed and would false-positive on ordinary
  Arabic, so the system prompt remains the primary defence.
- The 429 and malformed-JSON 400 responses stay English: rate limiting runs
  before validation, so the locale is not yet known.
