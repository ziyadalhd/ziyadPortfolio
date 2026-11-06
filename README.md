# Ziyad Portfolio

Arabic-first, bilingual portfolio presenting my mobile and web projects, with project case studies and a Digital Twin chat.

[View portfolio](https://ziyad-portfolio-six.vercel.app) · [LinkedIn](https://www.linkedin.com/in/ziyad-alhdriti/)

## Highlights

- Arabic and English experiences at `/ar` and `/en`, with RTL/LTR layouts.
- Case studies for Irtiwa, Wasl, نادي بَيْن الثقافي, and Wedding Greetings.
- Digital Twin chat through OpenRouter, with request validation, timeouts, and rate limiting.
- Responsive interfaces and light/dark themes.

## Stack

Next.js App Router, React, TypeScript, Tailwind CSS, OpenRouter, Vitest, and Playwright. Installed versions are recorded in `package.json` and `package-lock.json`.

## Run locally

Use a Node.js version supported by `package.json`: `^20.19.0`, `^22.13.0`, or `>=24.0.0`.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Set `OPENROUTER_API_KEY` for chat and `NEXT_PUBLIC_SITE_URL` to the public origin for deployment metadata. `OPENROUTER_MODEL` optionally overrides the model; the default is defined in `src/lib/openrouter.ts`.

## Checks

```bash
npm run lint
npm test
npm run build
npm run format:check
```

`npm run test:e2e` builds the application and runs Playwright. These are verification commands, not a claim that the current checkout has passed them.

## Deployment and content

Deploy on Vercel with the environment variables from `.env.example`. Verify `/robots.txt` and `/sitemap.xml` after deployment. Project and profile content lives under `src/data`.

The downloadable resume is `public/ziyad-jaber-alhdriti-cv.pdf`. Preserve its phone-free public version when replacing it. Review its content separately when education, projects, or experience change.
