import type { Metadata, Viewport } from "next";
import {
  Archivo,
  Cairo,
  EB_Garamond,
  IBM_Plex_Mono,
  Source_Serif_4,
  Tajawal,
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

// Arabic companions: Cairo carries the headings and the uppercase mono
// labels (there is no Arabic monospace in this stack), Tajawal the body.
// The "latin" subset matters because Arabic copy still renders Next.js,
// Supabase and similar inline.
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

// Runs before paint. Two jobs, one script: apply the stored theme so there
// is no flash, and mark the title page as already seen for the rest of the
// session. The locale switch is a full document load, so without the second
// half every language toggle and back-navigation replays the intro.
const BOOT_SCRIPT = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("ziyad-spec-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}d.setAttribute("data-theme",t);}catch(e){}try{if(sessionStorage.getItem("ziyad-spec-cover")){d.setAttribute("data-cover-seen","");}sessionStorage.setItem("ziyad-spec-cover","1");}catch(e){}})();`;

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
      className={`${archivo.variable} ${sourceSerif.variable} ${plexMono.variable} ${garamond.variable} ${cairo.variable} ${tajawal.variable}`}
    >
      <body>
        <Script id="boot" strategy="beforeInteractive">
          {BOOT_SCRIPT}
        </Script>
        <ScrollResetOnLoad />
        {children}
      </body>
    </html>
  );
}
