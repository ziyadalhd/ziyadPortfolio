import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import { notFound } from "next/navigation";

import { ScrollResetOnLoad } from "@/components/ScrollResetOnLoad";
import {
  LOCALE_DIR,
  LOCALE_OG,
  LOCALES,
  isLocale,
  type Locale,
} from "@/i18n/config";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const title = "Ziyad Alhdriti | Software Engineer";
  const description =
    "Professional portfolio website for Ziyad Alhdriti, Software Engineering student and mobile application engineer.";
  const ogDescription =
    "Mobile-focused software engineering portfolio with a digital twin chat experience.";

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
      className={`${syne.variable} ${jakarta.variable}`}
    >
      <body>
        <ScrollResetOnLoad />
        {children}
      </body>
    </html>
  );
}
