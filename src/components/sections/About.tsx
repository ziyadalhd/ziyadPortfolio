import type { Dictionary } from "@/i18n/types";

import { SectionHeading } from "../ui/SectionHeading";

export function About({ content }: { content: Dictionary["about"] }) {
  return (
    <section id="about" className="section-card scroll-mt-6">
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto]">
        <p className="max-w-3xl text-lg leading-relaxed text-slate-400">
          {content.body}
        </p>

        {/* Pull stat */}
        <div
          className="flex flex-col items-center justify-center rounded-2xl px-8 py-5 text-center lg:min-w-[140px]"
          style={{
            border: "1px solid rgba(245,158,11,0.2)",
            background: "rgba(245,158,11,0.05)",
          }}
        >
          <span
            className="text-4xl font-extrabold"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--clr-amber)",
            }}
          >
            3.73
          </span>
          <span
            className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {content.gpaLabel}
          </span>
        </div>
      </div>
    </section>
  );
}
