/**
 * Canonical public origin, used for metadataBase, sitemap, robots and JSON-LD.
 *
 * Note: openrouter.ts deliberately keeps its own Origin-header fallback for
 * OpenRouter attribution, which is a different concern from canonical URLs.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
