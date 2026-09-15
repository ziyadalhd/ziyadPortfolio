import { DigitalTwinChat } from "@/components/digital-twin-chat";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

import { SectionHeading } from "../ui/SectionHeading";

export function DigitalTwinSection({
  content,
  locale,
}: {
  content: Dictionary["twin"];
  locale: Locale;
}) {
  return (
    <section id="digital-twin" className="section-card scroll-mt-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
        <SectionHeading eyebrow={content.eyebrow} title={content.title} />

        {/* Live badge */}
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]"
          style={{
            fontFamily: "var(--font-heading)",
            border: "1px solid rgba(52,211,153,0.25)",
            background: "rgba(52,211,153,0.07)",
            color: "rgba(110,231,183,0.9)",
          }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          {content.liveBadge}
        </div>
      </div>

      <p className="mt-4 max-w-2xl leading-relaxed text-slate-400">
        {content.intro}
      </p>

      <div className="mt-8">
        <DigitalTwinChat content={content} locale={locale} />
      </div>
    </section>
  );
}
