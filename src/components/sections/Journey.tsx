import { journey } from "@/data/portfolio";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

import { SectionHeading } from "../ui/SectionHeading";

export function Journey({
  content,
  locale,
}: {
  content: Dictionary["journey"];
  locale: Locale;
}) {
  return (
    <section id="journey" className="section-card scroll-mt-6">
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
      />

      <div className="mt-10 space-y-0" aria-label={content.timelineLabel}>
        {journey.map((item, index) => (
          <article
            key={item.title.en}
            className="group relative flex gap-6 pb-8 last:pb-0"
          >
            {/* Vertical timeline track */}
            <div className="flex flex-col items-center">
              {/* Number badge */}
              <div
                className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                style={{
                  fontFamily: "var(--font-heading)",
                  border: "1px solid rgba(245,158,11,0.4)",
                  background:
                    "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))",
                  color: "var(--clr-amber)",
                }}
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Connecting line */}
              {index < journey.length - 1 && (
                <div
                  className="mt-2 w-px flex-1"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(245,158,11,0.35) 0%, rgba(245,158,11,0.05) 100%)",
                    minHeight: "2rem",
                  }}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Content */}
            <div
              className="min-w-0 flex-1 rounded-xl px-5 py-4 transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.025)",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-[0.22em]"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "rgba(245,158,11,0.75)",
                }}
              >
                {item.period[locale]}
              </p>
              <h3
                className="mt-2 text-lg font-bold leading-snug text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {item.title[locale]}
              </h3>
              <p className="mt-2 leading-relaxed text-slate-400">
                {item.detail[locale]}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
