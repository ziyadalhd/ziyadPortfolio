import { personalInfo, valuePillars } from "@/data/portfolio";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

import { Metric } from "../ui/Metric";

export function Hero({
  content,
  locale,
}: {
  content: Dictionary["hero"];
  locale: Locale;
}) {
  return (
    <section id="hero" className="grid gap-8 lg:gap-10 lg:grid-cols-[1fr_320px] lg:items-start">

      {/* Left column */}
      <div className="space-y-5 sm:space-y-7">

        {/* Eyebrow pill — compact on mobile */}
        <div>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] sm:px-4 sm:text-xs sm:tracking-[0.26em]"
            style={{
              fontFamily: "var(--font-heading)",
              borderColor: "rgba(245,158,11,0.35)",
              background: "rgba(245,158,11,0.07)",
              color: "rgba(245,158,11,0.9)",
            }}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: "var(--clr-amber)" }}
              aria-hidden="true"
            />
            {content.eyebrow}
          </span>
        </div>

        {/* Main headline — fluid type scale safe for iPhone SE */}
        <h1
          className="text-3xl font-extrabold leading-[1.1] tracking-tight rtl:tracking-normal text-white sm:text-5xl lg:text-7xl"
          style={{ fontFamily: "var(--font-heading)", overflowWrap: "break-word" }}
        >
          {content.titleLead}{" "}
          <span className="hero-gradient">{content.titleAccent}</span>
          {content.titleTail}
        </h1>

        {/* Value description */}
        <p className="max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
          {content.lede}
        </p>

        {/* Value pillars — stack vertically on mobile so long text never overflows */}
        <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {valuePillars.map((pillar) => (
            <li
              key={pillar.en}
              className="rounded-full border px-4 py-1.5 text-sm text-slate-300"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                fontFamily: "var(--font-heading)",
                fontWeight: 500,
              }}
            >
              {pillar[locale]}
            </li>
          ))}
        </ul>

        {/* CTAs. LinkedIn and GitHub already have tiles in Contact. */}
        <div className="flex flex-wrap gap-3 pt-1">
          <a href="#contact" className="button-primary gap-2.5">
            {content.ctaContact}
          </a>
          <a
            href={personalInfo.resume}
            target="_blank"
            rel="noreferrer"
            className="button-secondary gap-2.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
            </svg>
            {content.ctaResume}
          </a>
        </div>
      </div>


      {/* Snapshot card — full width on mobile, fixed 320px sidebar on desktop */}
      <aside
        className="rounded-2xl p-5 sm:p-6 lg:mt-2"
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        }}
      >
        <p className="eyebrow">{content.snapshot}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-1 lg:grid-cols-1">
          <Metric
            label={content.metrics.graduation}
            value={personalInfo.expectedGraduation}
          />
          <Metric label={content.metrics.gpa} value={personalInfo.gpa} />
          <Metric
            label={content.metrics.volunteer}
            value={personalInfo.volunteerHours}
          />
          <Metric
            label={content.metrics.location}
            value={personalInfo.location[locale]}
          />
        </div>
        <div
          className="mt-4 rounded-xl px-4 py-3 text-sm leading-relaxed"
          style={{
            border: "1px solid rgba(52,211,153,0.2)",
            background: "rgba(52,211,153,0.06)",
            color: "rgba(110,231,183,0.9)",
            fontFamily: "var(--font-heading)",
            fontWeight: 500,
          }}
        >
          {content.availability}
        </div>
      </aside>
    </section>
  );
}
