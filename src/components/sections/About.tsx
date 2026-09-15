import { personalInfo } from "@/data/portfolio";
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

        {/* GPA lives once, in the Hero snapshot card. */}
        <a
          href={personalInfo.resume}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col justify-center rounded-2xl px-8 py-5 lg:min-w-[200px]"
          style={{
            border: "1px solid rgba(245,158,11,0.2)",
            background: "rgba(245,158,11,0.05)",
            textDecoration: "none",
          }}
        >
          <span
            className="text-lg font-extrabold text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {content.resumeTitle}
          </span>
          <span className="mt-1 text-sm text-slate-400">
            {content.resumeNote}
          </span>
          <span
            className="mt-3 text-sm font-semibold"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--clr-amber)",
            }}
          >
            {content.resumeCta}
          </span>
        </a>
      </div>
    </section>
  );
}
