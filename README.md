# Ziyad Portfolio

Professional portfolio website for Ziyad Jaber Alhdriti, built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- Responsive portfolio homepage with section navigation.
- Digital Twin chat backed by OpenRouter.
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

## Notes

- If an OpenRouter key has ever been shared in chat or logs, rotate it before deploying.
- `tutorial.md` contains the original project walkthrough.
