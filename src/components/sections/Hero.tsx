import { personalInfo, valuePillars } from "@/data/portfolio";

import { Metric } from "../ui/Metric";

export function Hero() {
  return (
    <section id="hero" className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">

      {/* Left column */}
      <div className="space-y-7">

        {/* Eyebrow pill */}
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.28em]"
            style={{
              fontFamily: "var(--font-syne)",
              borderColor: "rgba(245,158,11,0.35)",
              background: "rgba(245,158,11,0.07)",
              color: "rgba(245,158,11,0.9)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--clr-amber)" }}
              aria-hidden="true"
            />
            Enterprise meets edgy
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="text-[2.6rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Building{" "}
          <br className="hidden sm:block" />
          resilient software{" "}
          <br className="hidden lg:block" />
          with{" "}
          <span className="hero-gradient">startup&#8209;level speed</span>.
        </h1>

        {/* Value description */}
        <p className="max-w-xl text-lg leading-relaxed text-slate-400">
          I design and build cross-platform mobile products with structured
          engineering discipline, clean architecture, and polished user
          experience — turning complex requirements into systems people trust
          and teams can scale.
        </p>

        {/* Value pillars */}
        <ul className="flex flex-wrap gap-2.5">
          {valuePillars.map((pillar) => (
            <li
              key={pillar}
              className="rounded-full border px-4 py-1.5 text-sm text-slate-300"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                fontFamily: "var(--font-syne)",
                fontWeight: 500,
              }}
            >
              {pillar}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 pt-1">
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noreferrer"
            className="button-primary gap-2.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noreferrer"
            className="button-secondary gap-2.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>

      {/* Right column — Snapshot card */}
      <aside
        className="rounded-2xl p-6 lg:mt-2"
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        }}
      >
        <p className="eyebrow">Snapshot</p>
        <div className="mt-5 space-y-3">
          <Metric label="Expected Graduation" value={personalInfo.expectedGraduation} />
          <Metric label="GPA" value={personalInfo.gpa} />
          <Metric label="Verified Volunteer Hours" value={personalInfo.volunteerHours} />
          <Metric label="Location" value={personalInfo.location} />
        </div>
        <div
          className="mt-5 rounded-xl px-4 py-3 text-sm leading-relaxed"
          style={{
            border: "1px solid rgba(52,211,153,0.2)",
            background: "rgba(52,211,153,0.06)",
            color: "rgba(110,231,183,0.9)",
            fontFamily: "var(--font-syne)",
            fontWeight: 500,
          }}
        >
          Open to mobile engineering opportunities and high-growth teams.
        </div>
      </aside>
    </section>
  );
}
