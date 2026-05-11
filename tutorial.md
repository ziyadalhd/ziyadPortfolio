# Ziyad Portfolio + Digital Twin Chat: Beginner-Friendly Tutorial

This tutorial explains the website that was built in this project, from the visual portfolio page to the AI chat system ("Ask my Digital Twin") powered by OpenRouter.

The goal is to help you understand:

- what technologies are used
- how files are organized
- how frontend and backend parts connect
- how state and API calls work
- how to run and safely modify the project

---

## 1) What We Built

You now have a **Next.js portfolio site** with:

- a polished single-page personal website
- sections like About, Journey, Portfolio, Contact
- a live AI chat section ("Ask my Digital Twin")
- a backend API route that calls OpenRouter
- PDF context extraction from `Linkedin.pdf` to improve answer quality

---

## 2) Technology Overview (Simple)

### Core stack

- **Next.js (App Router)**: full-stack React framework (UI + server routes)
- **React**: component-based UI
- **TypeScript**: safer JavaScript with types
- **Tailwind CSS + custom CSS**: styling system
- **OpenRouter API**: LLM provider for AI responses
- **pdf-parse**: server-side extraction of text from `Linkedin.pdf`

### Why this stack?

- Next.js lets us keep frontend and backend in one project.
- TypeScript helps catch mistakes early.
- OpenRouter gives model choice without changing architecture.
- PDF parsing gives richer context than hardcoded text alone.

---

## 3) Project Structure (High-Level)

Ignore build output folders like `.next/`. Focus on source files:

```text
ziyadPortfolio/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                    # Global layout + scroll reset script
│  │  ├─ globals.css                   # Global styles + chat styles
│  │  ├─ page.tsx                      # Main portfolio page UI
│  │  └─ api/
│  │     └─ digital-twin/
│  │        └─ route.ts                # Backend endpoint for AI chat
│  └─ components/
│     └─ digital-twin-chat.tsx         # Chat UI + state + API calls
├─ Linkedin.pdf                         # Source context used by AI backend
├─ .env                                 # OpenRouter API key
├─ package.json                         # Scripts + dependencies
└─ tutorial.md                          # This guide
```

---

## 4) Main Frontend Walkthrough

## A) `src/app/page.tsx` (the portfolio page)

This is the homepage. It:

- defines content arrays (`journey`, `portfolioRoadmap`, etc.)
- renders section cards in order
- includes the Digital Twin section
- imports the chat component

Example:

```tsx
import { DigitalTwinChat } from "@/components/digital-twin-chat";

export default function Home() {
  return (
    <main>
      {/* ...other sections... */}

      <section id="digital-twin" className="section-card">
        <SectionHeading eyebrow="AI Experience" title="Ask my Digital Twin" />
        <div className="mt-8">
          <DigitalTwinChat />
        </div>
      </section>
    </main>
  );
}
```

What this means:

- `DigitalTwinChat` is a child component.
- The portfolio UI and the chat are connected at the page level.

---

## B) `src/components/digital-twin-chat.tsx` (interactive chat)

This is a **Client Component** (`"use client"`), because it needs browser-only features:

- local state (`useState`)
- input handling
- network calls from browser to your API route
- container scrolling behavior

Key state:

```tsx
const [messages, setMessages] = useState<Message[]>([ ... ]);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

Key behaviors:

1. user sends a message
2. message appears immediately in UI
3. POST request goes to `/api/digital-twin`
4. assistant reply is appended to message list
5. chat container scrolls internally to latest message

Important API call:

```tsx
const response = await fetch("/api/digital-twin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: history }),
});
```

---

## C) `src/app/globals.css` (look and feel)

This file holds both global visual system and chat-specific styles:

- premium background gradients and glass cards
- nav/button/contact styles
- timeline effect for journey section
- chat bubble and prompt styles
- `overscroll-behavior: contain` on chat message list to prevent page jump

Example:

```css
.twin-messages {
  max-height: 420px;
  overflow-y: auto;
  overscroll-behavior: contain;
}
```

This prevents scroll chaining from chat panel to whole page.

---

## D) `src/app/layout.tsx` (global wrapper + startup scroll behavior)

This file defines metadata and wraps every page.  
It also injects an early script to force startup at top and clear hash anchors:

```tsx
<Script id="scroll-start-top" strategy="beforeInteractive">
  {`
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    window.scrollTo(0, 0);
  `}
</Script>
```

---

## 5) How the Chat System Works (End-to-End)

Flow:

1. User types in the chat UI (`digital-twin-chat.tsx`)
2. Browser sends `POST /api/digital-twin` with recent conversation
3. API route (`route.ts`) validates payload and API key
4. API route loads/caches PDF context from `Linkedin.pdf`
5. API route calls OpenRouter model `openai/gpt-oss-120b:free`
6. AI response is normalized and returned as JSON
7. Frontend renders response nicely (paragraph/list cleanup logic)

---

## 6) Backend API Route Deep Dive

File: `src/app/api/digital-twin/route.ts`

Main responsibilities:

- receive messages from frontend
- sanitize/limit chat history (`slice(-12)`)
- load LinkedIn PDF context via `pdf-parse`
- combine:
  - system prompt rules
  - structured hardcoded career facts
  - extracted PDF context
- call OpenRouter endpoint
- return `{ reply }` or a useful error

OpenRouter request core:

```ts
await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Ziyad Portfolio Digital Twin",
  },
  body: JSON.stringify({
    model: "openai/gpt-oss-120b:free",
    messages: [systemMessage, ...messages],
    temperature: 0.5,
    max_tokens: 450,
  }),
});
```

PDF loading is cached in-memory using:

- `let linkedInPdfContextPromise: Promise<string> | null = null;`

So parsing does not run on every request.

---

## 7) How UI Components Connect

The connection graph is simple:

- `layout.tsx` (global shell and startup behavior)
  - renders `page.tsx`
    - renders section components and inline helpers (`Metric`, `SectionHeading`)
    - renders `DigitalTwinChat`
      - talks to backend route `/api/digital-twin`
        - talks to OpenRouter
        - uses `Linkedin.pdf` context

The frontend never calls OpenRouter directly.  
That is important for key security.

---

## 8) State Management + API Calls (Beginner View)

No external state library is used (no Redux/Zustand).  
State is local to components with `useState`.

Why this is okay:

- only one interactive widget (chat)
- state scope is limited to that widget
- easier for beginners to understand

Message send lifecycle:

1. set `loading = true`
2. add user message to local `messages`
3. `fetch` server route
4. on success -> append assistant message
5. on error -> set `error`
6. finally -> `loading = false`

This pattern is clean and beginner-friendly.

---

## 9) Common Mistakes to Avoid

1. **Exposing API key in frontend code**
   - Never call OpenRouter directly from browser with your secret key.
   - Keep key usage only in server route.

2. **Breaking chat format with raw markdown output**
   - The chat has reply normalization/rendering logic.
   - If you remove it, UI can become messy.

3. **Causing scroll jumps**
   - Avoid `scrollIntoView` on page-level nodes for chat updates.
   - Use container-only scrolling for chat messages.

4. **Trying to use `window` in server components**
   - Browser APIs belong in client code or scripts.
   - Server components run on server and do not have `window`.

5. **Forgetting `.env` key name**
   - Recommended key: `OPENROUTER_API_KEY`
   - Current backend also supports fallback `openrouter_api_key`

6. **Sending huge histories**
   - Keep message window bounded (`slice(-12)` already does this).
   - Large payloads increase latency/cost.

---

## 10) How to Run the Project

From project root:

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000`

Production checks:

```bash
npm run lint
npm run build
npm run start
```

Environment setup in `.env`:

```env
OPENROUTER_API_KEY=your_key_here
```

Fallback currently supported:

```env
openrouter_api_key=your_key_here
```

---

## 11) How to Modify the Project Safely

### Update portfolio content

- Edit arrays in `src/app/page.tsx` (`journey`, `skillGroups`, etc.).

### Change visual style

- Edit classes in `page.tsx` and CSS in `src/app/globals.css`.

### Add a new chat suggestion button

- Update `starterPrompts` in `src/components/digital-twin-chat.tsx`.

### Make AI responses stricter or friendlier

- Edit `SYSTEM_PROMPT` in `src/app/api/digital-twin/route.ts`.

### Change AI model

- Update `model` field in API body:
  - currently `openai/gpt-oss-120b:free`

Always run:

```bash
npm run lint && npm run build
```

after changes.

---

## 12) Self-Review: 5 Possible Improvements

1. **Add streaming responses for chat**
   - Current replies wait for full completion.
   - Streaming would feel faster and more natural.

2. **Introduce stronger PDF context curation**
   - Current extraction is text-based heuristics.
   - Could improve with chunking + relevance filtering per question.

3. **Persist chat history**
   - Right now chat resets on refresh.
   - Could store in localStorage or database/session.

4. **Add rate limiting and abuse protection**
   - API route currently has no request throttling.
   - Add basic IP/session limits for reliability and cost control.

5. **Refactor page into smaller reusable components**
   - `page.tsx` is growing large.
   - Breaking sections into dedicated files improves maintainability and testing.

---

If you want, the next step can be a **Part 2 tutorial** that teaches how to add:

- markdown rendering with syntax safety
- streaming chat tokens
- unit/integration tests for the API route
- deployment to Vercel with environment setup.
