import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/i18n/config";

/**
 * Picks a locale from Accept-Language.
 *
 * Returns "en" only when the visitor's first recognised language is English;
 * everything else, including a missing header (crawlers), falls back to the
 * default locale.
 */
function pickLocale(header: string | null) {
  if (!header) return DEFAULT_LOCALE;

  for (const part of header.split(",")) {
    const tag = part.split(";")[0].trim().split("-")[0].toLowerCase();
    if (isLocale(tag)) return tag;
  }

  return DEFAULT_LOCALE;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const locale = pickLocale(req.headers.get("accept-language"));
  const url = new URL(
    `/${locale}${pathname === "/" ? "" : pathname}`,
    req.nextUrl,
  );
  url.search = req.nextUrl.search;

  // 307, not 308: the target varies per visitor, so it must not be cached.
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Skip the API, Next internals, and anything with a file extension
  // (/robots.txt, /sitemap.xml, /icon.svg, the resume PDF).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
