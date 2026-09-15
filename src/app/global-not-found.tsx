import { Plus_Jakarta_Sans, Syne } from "next/font/google";

import { DEFAULT_LOCALE, LOCALE_DIR } from "@/i18n/config";

import "./globals.css";

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

/**
 * Rendered for any unmatched route. The app has no root layout (it lives in
 * [locale]), so this must emit the whole document itself.
 */
export default function GlobalNotFound() {
  return (
    <html
      lang={DEFAULT_LOCALE}
      dir={LOCALE_DIR[DEFAULT_LOCALE]}
      className={`${syne.variable} ${jakarta.variable}`}
    >
      <body>
        <main className="flex min-h-screen items-center justify-center bg-base px-6 text-slate-100">
          <div className="max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="eyebrow text-amber-300">404</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              الصفحة غير موجودة
            </h1>
            <p className="mt-4 text-slate-300">
              الرابط قد يكون قديماً أو تم نقل الصفحة.
            </p>
            <a href={`/${DEFAULT_LOCALE}`} className="button-primary mt-6 inline-flex">
              العودة إلى الملف الشخصي
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
