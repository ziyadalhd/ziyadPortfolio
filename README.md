# Ziyad Portfolio

Professional portfolio website for Ziyad Jaber Alhdriti, built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- Bilingual Arabic/English portfolio at `/ar` and `/en`, Arabic by default.
- Digital Twin chat backed by OpenRouter, answering in the page's language.
- API validation, request size limits, timeout/retry handling, and basic IP rate limiting.
- Curated LinkedIn/resume context stored as source data under `src/data`.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Required environment variables:

- `OPENROUTER_API_KEY`: OpenRouter API key.
- `OPENROUTER_MODEL`: Optional model override. Defaults to `openai/gpt-oss-120b:free`.
- `NEXT_PUBLIC_SITE_URL`: Public site origin for metadata and OpenRouter attribution.

Use Node.js `^20.19.0`, `^22.13.0`, or `>=24.0.0`.

## Scripts

- `npm run dev`: Start the local development server.
- `npm run build`: Build for production.
- `npm run start`: Start the production build.
- `npm run lint`: Run ESLint.
- `npm run test`: Run Vitest tests.
- `npm run format`: Format files with Prettier.
- `npm run format:check`: Check formatting.

## Resume

The download button points at `public/ziyad-alhdriti-resume.pdf`, which is
**not committed**. Add it before deploying, and remove the phone number from it
first: the file is served at a crawlable URL and is indexed by search engines.
The site itself intentionally publishes email, LinkedIn and GitHub only.

## Deploying

1. Import the repo on Vercel.
2. Set `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` and `NEXT_PUBLIC_SITE_URL`
   (the real origin) for Production. Without `NEXT_PUBLIC_SITE_URL`, metadata,
   sitemap and JSON-LD emit `localhost` URLs.
3. Deploy, then confirm `/robots.txt` and `/sitemap.xml` return 200 — that
   proves the locale proxy's matcher is not swallowing them.
4. Submit the sitemap in Google Search Console.

## Notes

- If an OpenRouter key has ever been shared in chat or logs, rotate it before deploying.
- Requires a native arm64 Node on Apple Silicon; an x86_64 build fails with
  `bad CPU type in executable`.
- `tutorial.md` contains the original project walkthrough.
