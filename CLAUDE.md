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

This is a single-page portfolio with a Next.js App Router. All routing is the root `/` page; there are no additional pages.

### Data flow for the Digital Twin chat

```
DigitalTwinChat (client)
  → POST /api/digital-twin  (Next.js Route Handler, nodejs runtime)
      ↓ checkRateLimit (in-memory, 6 req/60 s per IP)
      ↓ validateRequestBodyText (Zod + prompt-injection patterns)
      ↓ buildSystemPrompt (CAREER_KNOWLEDGE + linkedin.json summary)
      ↓ requestOpenRouterChat / requestOpenRouterChatStream
          → OpenRouter API (20 s timeout, 1 retry on 5xx)
          → returns raw SSE stream forwarded as text/plain
```

The client detects streaming support via `ReadableStream` / `TextDecoder` availability and requests `stream: true` when available. The server transforms OpenRouter's SSE into a raw token stream (`text/plain`).

### Key modules

| Path | Purpose |
|---|---|
| `src/app/api/digital-twin/route.ts` | API handler: rate limiting, validation, OpenRouter dispatch |
| `src/lib/openrouter.ts` | OpenRouter fetch wrapper with retry/timeout/streaming |
| `src/lib/prompt.ts` | System prompt builder — edit `CAREER_KNOWLEDGE` here to update Ziyad's bio |
| `src/lib/request-validation.ts` | Zod request schema + prompt-injection regex patterns |
| `src/lib/rate-limit.ts` | In-memory IP bucket; `resetRateLimitForTests()` available for tests |
| `src/data/linkedin.json` | LinkedIn profile summary injected into the system prompt |
| `src/data/portfolio.ts` | Typed portfolio project data rendered in the Portfolio section |
| `src/components/digital-twin-chat.tsx` | Client component: chat state, streaming reader, localStorage persistence |

### Content Security Policy

`next.config.ts` sets a strict CSP for all routes. The `connect-src` directive only allows `'self'` and localhost origins. If any new client-side external fetch is added (e.g., analytics, fonts CDN), it must be added to the CSP there.

### Chat history persistence

Chat history is stored in `localStorage` under key `ziyad-digital-twin-chat:v1`. Seed messages (the initial greeting) are filtered out before sending to the API via the `isSeed` flag.
