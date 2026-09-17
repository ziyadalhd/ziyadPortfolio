"use client";

import { useParams } from "next/navigation";

import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ locale: string }>();
  const raw = params?.locale ?? "";
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const content = getDictionary(locale).error;

  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-6 text-slate-100">
      <div className="max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          {content.title}
        </h1>
        <p className="mt-4 text-slate-300">{content.body}</p>
        <button type="button" className="button-primary mt-6" onClick={reset}>
          {content.cta}
        </button>
        {error.digest ? (
          <p className="mt-4 text-xs text-slate-400">
            {content.errorIdLabel}: {error.digest}
          </p>
        ) : null}
      </div>
    </main>
  );
}
