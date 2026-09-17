import { Archivo, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import { IBM_Plex_Sans_Arabic } from "next/font/google";

import { DEFAULT_LOCALE, LOCALE_DIR } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-source-serif",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-plex-ar",
  display: "swap",
});

/**
 * Rendered for any unmatched route. The app has no root layout (it lives in
 * [locale]), so this must emit the whole document itself.
 */
export default function GlobalNotFound() {
  const content = getDictionary(DEFAULT_LOCALE).notFound;

  return (
    <html
      lang={DEFAULT_LOCALE}
      dir={LOCALE_DIR[DEFAULT_LOCALE]}
      className={`${archivo.variable} ${sourceSerif.variable} ${plexMono.variable} ${plexArabic.variable}`}
    >
      <body>
        <main className="flex min-h-screen items-center justify-center bg-base px-6 text-slate-100">
          <div className="max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="eyebrow">{content.eyebrow}</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              {content.title}
            </h1>
            <p className="mt-4 text-slate-300">{content.body}</p>
            <a
              href={`/${DEFAULT_LOCALE}`}
              className="button-primary mt-6 inline-flex"
            >
              {content.cta}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
