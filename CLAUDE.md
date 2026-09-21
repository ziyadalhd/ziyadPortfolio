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
- `OPENROUTER_MODEL` — optional; defaults to
  `nvidia/nemotron-3-super-120b-a12b:free`, with qwen and cohere behind it in
  `FALLBACK_MODELS` (OpenRouter caps that list at three entries in total).
  The request sets `reasoning: { enabled: false }`: current free models
  otherwise spend the whole `max_tokens` budget on hidden reasoning and
  return empty content.
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
- The dictionary is keyed to the document's own structure (`spec.s1`…`spec.s7`,
  `spec.cover`, `spec.rail`). Keep it that way: every key should be reachable
  from a clause, so dead copy is visible instead of accumulating.
- `page.tsx` resolves the dictionary once and hands the whole thing to
  `SpecPage`, which is a client component (scroll-spy, theme, cover intro).
- Content entities (projects, journey) carry their own `Localized`
  translations in `src/data/portfolio.ts`, so adding a project is one edit in
  one file. UI chrome lives in `src/i18n`.
- Clause numbers are positional: project _n_ is clause `4.{n+1}`. A journey
  entry links to one via `refClause`, and `portfolio.test.ts` fails if that
  number points at nothing — do not hard-code the index in the component.
- `src/app/global-not-found.tsx` handles unmatched routes. With the root layout
  inside `[locale]`, they have no document to render into, and a
  `[locale]/[...rest]` catch-all returned a soft 404 (HTTP 200).
- Arabic swaps Cairo (headings, mono labels) and Tajawal (body) in through an
  `html[lang="ar"]` override of `--display`/`--serif`/`--mono`/`--latex`.
  Components must reference those variables, never `--font-archivo` directly,
  or the swap silently does nothing.
- Arabic copy goes through the `ux-araby` skill in `.claude/skills/` (invoke it
  with the Skill tool). It is vendored, not an npm dependency: the package ships
  only Markdown, with no `main` or `exports`, so under `node_modules` nothing
  would ever load it. Its non-obvious rules for this document: no em dash in
  Arabic (use `،` or `:`), no `...`, and tanween before the alif (`مرحبًا`,
  not `مرحباً`) — the English strings keep their own conventions.
- A Latin-script value in an Arabic column uses the `Ltr` helper, which wraps it
  in an inline `<bdi>`. It must stay inline: `dir="ltr"` on the block also resets
  `text-align` to left, which left the phone number flush against the far edge
  while its label stayed right-aligned.

### Title page and clause index

- `BOOT_SCRIPT` in `[locale]/layout.tsx` runs `beforeInteractive` and does two
  things before first paint: applies the stored theme, and stamps
  `data-cover-seen` when the title page already ran this session. CSS hides
  `[data-cover]` on that attribute and `useCoverIntro` reads the same attribute
  to skip its timers, so the intro costs nothing on a repeat load. Reading
  `sessionStorage` in React instead would mean either a hydration mismatch or a
  `set-state-in-effect` lint error.
- The cover must never lock scrolling behind something the visitor cannot see:
  `useCoverIntro` bails out for `data-cover-seen` **and** for
  `prefers-reduced-motion`, which hides the cover in CSS but would otherwise
  leave `body { overflow: hidden }` in place for two seconds.
- The page turns on its binding edge: `--spine`/`--spine-far`/`--turn` flip in
  `html[dir="rtl"]` because Arabic books bind on the right. During the turn the
  desk fades **first** and the sheet **last**; reversing that leaves a beat of
  empty screen between the two.
- The rail's own rule is the read-progress track — vertical beside the index on
  desktop, along the bottom of the glass bar on mobile — driven by a
  `--progress` custom property set inline on `[data-rail]`. There is no separate
  progress bar; do not add one back.
- **Anything whose colour changes on hover or on a state keeps that colour in
  `globals.css`, never in an inline style.** An inline colour outranks every
  selector without `!important`, so the state rule silently loses. This has
  bitten twice: rail links went inert under the cursor, and the masthead CTA
  repainted its background to the accent while the inline rule held the label at
  the same accent, rendering a solid unreadable block at 1.00:1. Both now key
  off an attribute (`data-active`, `data-ask-twin`), and
  `e2e/mobile-chat.spec.ts` asserts the hovered CTA's label and dot differ from
  its background — after waiting out the 160ms fill, or the assertion passes
  against a background that has not arrived yet.
- `[data-rail-links]` is the horizontal scroller on mobile, **not** `[data-rail]`.
  When the whole bar scrolled, the language switch and theme toggle sat ~550px
  off-screen; `e2e/mobile-chat.spec.ts` asserts they stay in the viewport.

### Theme contrast

The dark palette is tuned to measured ratios, not picked by eye. It previously
ran near-white on near-black at **17.88:1** — close to the 21:1 ceiling and 2.5x
past AAA — which halates on the 104px 800-weight display face, and its 2px rules
composited to **8.03:1**, brighter than AAA body text and repeated on every
clause. Current targets, with light mode as the reference:

|           | light                | dark                 |
| --------- | -------------------- | -------------------- |
| body text | 14.86:1              | 12.51:1              |
| secondary | 5.83:1               | 7.08:1               |
| 2px rules | 4.49:1 (30% of text) | 3.52:1 (28% of text) |

Keep rules near 30% of the text contrast in both themes; that ratio, more than
the absolute numbers, is what made dark mode feel loud. Raising `--ink` back
toward white re-introduces the glare.

### Clause rows

- `ClauseRow` and `SectionHead` **must** render `data-clauserow`. Their grid is
  an inline style, but `globals.css` narrows it to `44px`/`14px` under 900px and
  fixes RTL alignment inside it — both keyed off that attribute. It was missing
  for a while, so phones kept the 72px + 24px desktop gutter and the chat was
  squeezed into a 243px shell with a 151px compose box.
- `[data-demo]` cancels that indent on phones with a negative
  `margin-inline-start` built from `--clause-gutter`/`--clause-gap`, so the live
  chat gets the whole row. `e2e/mobile-chat.spec.ts` asserts both halves.

### Reaching the twin

Clause 6 is ~13 screens down on a phone, and the twin exists for readers who
will not scroll that far. Rather than renumber the document (a conformance demo
before the requirements it demonstrates is nonsense in a spec), two entry points
lead to it and clause 6 stays put:

- `[data-abstract]` in the masthead — a real SRS opens with an Abstract for
  readers who skip the body, so this fits the conceit rather than fighting it.
- `[data-rail-live]` on the index entry for `#s6`, which is on screen at every
  scroll position.

`AskTwinLink` stays an `<a href="#s6">` so it works without JS. Two things about
its click handler are load-bearing and were each verified by breaking them:

- The focus is deferred with `setTimeout(…, 0)`. Fragment navigation runs after
  the handler and moves the focus target itself, so a synchronous `focus()` is
  undone — `e2e/mobile-chat.spec.ts` fails on desktop without the deferral.
- It is skipped unless `(hover: hover) and (pointer: fine)`. On a phone the
  focus opens the keyboard over the panel the link just jumped to.

### Twin answer quality

The model and the token budget were both set by measurement, not taste.
Re-measure before changing either; `buildSystemPrompt("ar")` can be dumped from
a throwaway vitest file and replayed against candidates.

A **code model was writing the Arabic prose** and it showed. Five questions
against the real prompt scored `cohere/north-mini-code` at 3/5 clean, 367-585
characters, with one answer carrying Chinese characters mid-sentence (前端) and
another using feminine forms for Ziyad. Nemotron scores 4-5/5 at 179-330. Qwen
writes the best Arabic of the three but answered only 2 of 5 calls before
rate-limiting, which is why it sits in the fallback list rather than first.

The Arabic style rules in `LOCALE_RULES.ar` mirror the `ux-araby` skill, and
each one exists because the model produced that fault: قم بـ in **both** tenses
(a past-tense-only rule was ignored in the present), تم + مصدر, بشكل +
adjective, tanween on the alif, and translating "shipped" as شحن (freight),
which also produced the hybrid مُShipped. That phrase was removed from
`CAREER_KNOWLEDGE` for the same reason: do not put untranslatable idioms in the
grounding.

`MAX_TOKENS` is the real length limit. The word cap in the prompt is obeyed
maybe two times in three; on the third the model pads with generic filler until
the budget runs out, which at 450 produced a 1636-character answer. At 170 a
good answer (275-330 characters, about 75 tokens) still has 2x headroom.

**Known and accepted.** On a free model, roughly one answer in three still
translates Agile (أجايل, رشيقة) despite the glossary, and it occasionally fuses
an Arabic word to an English one (وحمايةconsole). A deterministic fix is not
safe: وTypeScript is correct Arabic typography, so a space-insertion rule would
break more than it repairs. A paid model is the real answer if this matters.

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

| Path                                   | Purpose                                                                                                                                                                                                                                                                                                                     |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/api/digital-twin/route.ts`    | API handler: rate limiting, validation, OpenRouter dispatch                                                                                                                                                                                                                                                                 |
| `src/lib/openrouter.ts`                | OpenRouter fetch wrapper with retry/timeout/streaming                                                                                                                                                                                                                                                                       |
| `src/lib/prompt.ts`                    | System prompt builder. The projects/journey/skills blocks are **derived from `portfolio.ts`**, so the twin cannot contradict the clause on screen — update the data, not the prompt. Cache is keyed by locale; a single cached string would pin a warm instance to one language. Grounding stays English (facts, not prose) |
| `src/i18n/`                            | Dictionaries, locale config, `getDictionary`                                                                                                                                                                                                                                                                                |
| `src/proxy.ts`                         | Locale negotiation and redirect                                                                                                                                                                                                                                                                                             |
| `src/lib/request-validation.ts`        | Zod request schema + prompt-injection regex patterns                                                                                                                                                                                                                                                                        |
| `src/lib/rate-limit.ts`                | In-memory IP bucket; `resetRateLimitForTests()` available for tests                                                                                                                                                                                                                                                         |
| `src/data/linkedin.json`               | LinkedIn profile summary injected into the system prompt                                                                                                                                                                                                                                                                    |
| `src/data/portfolio.ts`                | Projects, journey, skills and personal facts. Single source for §2, §3, §4, §5 and the twin's grounding                                                                                                                                                                                                                     |
| `src/components/spec/SpecPage.tsx`     | The whole document: rail, clauses, cover intro, theme toggle                                                                                                                                                                                                                                                                |
| `src/components/digital-twin-chat.tsx` | Client component: chat state, streaming reader, localStorage persistence                                                                                                                                                                                                                                                    |

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
