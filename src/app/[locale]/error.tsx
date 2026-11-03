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
    <main className="route-state page-width">
      <div>
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.body}</p>
        <button type="button" className="contact-button" onClick={reset}>
          {content.cta}
        </button>
        {error.digest ? (
          <p className="eyebrow">
            {content.errorIdLabel}: {error.digest}
          </p>
        ) : null}
      </div>
    </main>
  );
}
