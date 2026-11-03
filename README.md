# Ziyad Portfolio

Arabic-first, bilingual portfolio built with Next.js and React. A neutral project gallery leads to individual project pages, with a shared theme, WhatsApp contact and an on-demand Digital Twin.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Use Node.js `^20.19.0`, `^22.13.0`, or `>=24.0.0`.

- `OPENROUTER_API_KEY`: required for Digital Twin replies.
- `OPENROUTER_MODEL`: optional model override; defaults are in `src/lib/openrouter.ts`.
- `NEXT_PUBLIC_SITE_URL`: production origin for canonical URLs, sitemap and metadata.

## Checks

`npm run build`, `npm run lint`, `npm run test`, `npm run test:e2e`, `npm run format:check`.

## Source

- `src/data/portfolio.ts`: project and career facts shared with the twin.
- `src/components/spec/SpecPage.tsx`: homepage gallery and short profile.
- `src/components/portfolio`: shared navigation, contact, chat dialog and project artwork.
- `src/app/[locale]/projects/[slug]/page.tsx`: project pages.
- `src/components/spec/IrtiwaShowcase.tsx`: reversible scroll animation using original app contours.
- `src/i18n`: Arabic and English copy.

Project graphics use original local assets; see `public/projects/README.md`. The custom pixel portrait is deferred until a reference is provided.

The public résumé at `public/ziyad-jaber-alhdriti-cv.pdf` is the phone-free version. Preserve that when replacing it.
