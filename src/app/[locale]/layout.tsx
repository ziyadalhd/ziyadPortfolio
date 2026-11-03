import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import { arabic, arabicDisplay, arabicText } from "@/app/fonts/arabic";
import { SiteChrome } from "@/components/portfolio/SiteChrome";
import {
  LOCALE_DIR,
  LOCALE_OG,
  LOCALES,
  isLocale,
  type Locale,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE_URL } from "@/lib/site";
import { THEME_BOOT_SCRIPT, THEME_COLORS } from "@/lib/theme";

import "../globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
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
      siteName: "Ziyad Jaber Alhdriti",
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
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
  ],
  colorScheme: "light dark",
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
      data-scroll-behavior="smooth"
      // data-theme is set by the beforeInteractive script below, before
      // React hydrates, so the server markup never has it — expected.
      suppressHydrationWarning
      className={`${archivo.variable} ${plexMono.variable} ${arabic.variable} ${arabicDisplay.variable} ${arabicText.variable}`}
    >
      <head>
        <script
          id="boot"
          dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }}
        />
      </head>
      <body>
        <SiteChrome locale={typed} dict={getDictionary(typed)}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
