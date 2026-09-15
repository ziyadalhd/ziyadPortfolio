import type { Metadata, Viewport } from "next";
import {
  IBM_Plex_Sans_Arabic,
  Plus_Jakarta_Sans,
  Syne,
} from "next/font/google";
import { notFound } from "next/navigation";

import { ScrollResetOnLoad } from "@/components/ScrollResetOnLoad";
import {
  LOCALE_DIR,
  LOCALE_OG,
  LOCALES,
  isLocale,
  type Locale,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE_URL } from "@/lib/site";

import "../globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jakarta",
  display: "swap",
});

// Arabic companion. Syne and Plus Jakarta have no Arabic glyphs, so without
// this the Arabic page falls back to a system font. The "latin" subset matters
// because Arabic copy still renders Flutter, Spring Boot and similar inline.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-ar",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { title, description, ogDescription } = getDictionary(locale).meta;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: "/ar",
        en: "/en",
        "x-default": "/ar",
      },
    },
    openGraph: {
      title,
      description: ogDescription,
      url: `/${locale}`,
      siteName: "Ziyad Alhdriti Portfolio",
      type: "website",
      locale: LOCALE_OG[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map(
        (l) => LOCALE_OG[l],
      ),
    },
    twitter: {
      card: "summary",
      title,
      description: ogDescription,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#06080f",
  colorScheme: "dark",
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typed: Locale = locale;

  return (
    <html
      lang={typed}
      dir={LOCALE_DIR[typed]}
      className={`${syne.variable} ${jakarta.variable} ${plexArabic.variable}`}
    >
      <body>
        <ScrollResetOnLoad />
        {children}
      </body>
    </html>
  );
}
