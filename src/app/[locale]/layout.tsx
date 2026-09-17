import type { Metadata, Viewport } from "next";
import {
  Archivo,
  EB_Garamond,
  IBM_Plex_Mono,
  IBM_Plex_Sans_Arabic,
  Noto_Naskh_Arabic,
  Source_Serif_4,
} from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";

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

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-source-serif",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Fallback in the --latex chain, used only on the cover sheet's LaTeX-report
// pastiche; Source Serif 4 already covers everything else in that stack.
const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-garamond",
  display: "swap",
});

// Arabic companions. The "latin" subset matters because Arabic copy still
// renders Flutter, Spring Boot and similar inline.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-ar",
  display: "swap",
});

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-naskh",
  display: "swap",
});

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("ziyad-spec-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f2f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e0d" },
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
      // data-theme is set by the beforeInteractive script below, before
      // React hydrates, so the server markup never has it — expected.
      suppressHydrationWarning
      className={`${archivo.variable} ${sourceSerif.variable} ${plexMono.variable} ${garamond.variable} ${plexArabic.variable} ${notoNaskh.variable}`}
    >
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <ScrollResetOnLoad />
        {children}
      </body>
    </html>
  );
}
