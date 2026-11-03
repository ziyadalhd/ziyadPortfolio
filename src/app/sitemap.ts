import type { MetadataRoute } from "next";

import { projects } from "@/data/portfolio";

import { DEFAULT_LOCALE, LOCALES } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}`]),
  );

  const homePages = LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === DEFAULT_LOCALE ? 1 : 0.9,
    alternates: {
      languages: {
        ...languages,
        "x-default": `${SITE_URL}/${DEFAULT_LOCALE}`,
      },
    },
  }));
  const projectPages = projects.flatMap(({ slug }) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}/projects/${slug}`,
      alternates: {
        languages: Object.fromEntries([
          ...LOCALES.map((language) => [
            language,
            `${SITE_URL}/${language}/projects/${slug}`,
          ]),
          ["x-default", `${SITE_URL}/${DEFAULT_LOCALE}/projects/${slug}`],
        ]),
      },
    })),
  );
  return [...homePages, ...projectPages];
}
