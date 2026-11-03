import { Archivo, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";

import { arabic, arabicDisplay, arabicText } from "@/app/fonts/arabic";
import { DEFAULT_LOCALE, LOCALE_DIR } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import Script from "next/script";

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
      suppressHydrationWarning
      className={`${archivo.variable} ${sourceSerif.variable} ${plexMono.variable} ${arabic.variable} ${arabicDisplay.variable} ${arabicText.variable}`}
    >
      <body>
        <Script id="boot" strategy="beforeInteractive">
          {THEME_BOOT_SCRIPT}
        </Script>
        <main className="route-state page-width">
          <div>
            <p className="eyebrow">{content.eyebrow}</p>
            <h1>{content.title}</h1>
            <p>{content.body}</p>
            <a href={`/${DEFAULT_LOCALE}`} className="contact-button">
              {content.cta}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
