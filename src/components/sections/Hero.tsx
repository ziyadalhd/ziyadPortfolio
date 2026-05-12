import { valuePillars } from "@/data/portfolio";

import { Metric } from "../ui/Metric";

export function Hero() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-200">
          Enterprise meets edgy
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
          Building resilient software with{" "}
          <span className="hero-gradient">startup-level speed</span>.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
          I design and build cross-platform mobile products with structured
          engineering discipline, clean architecture, and polished user
          experience. My focus is turning complex requirements into systems
          people can trust and teams can scale.
        </p>
        <ul className="flex flex-wrap gap-3 text-sm text-slate-200">
          {valuePillars.map((pillar) => (
            <li
              key={pillar}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2"
            >
              {pillar}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://www.linkedin.com/in/ziyad-alhdriti"
            target="_blank"
            rel="noreferrer"
            className="button-primary"
          >
            View LinkedIn
          </a>
          <a
            href="https://github.com/ziyadalhd"
            target="_blank"
            rel="noreferrer"
            className="button-secondary"
          >
            Explore GitHub
          </a>
        </div>
      </div>

      <aside className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-2xl shadow-cyan-700/10">
        <p className="eyebrow text-slate-300">Snapshot</p>
        <div className="mt-6 space-y-5">
          <Metric label="Expected Graduation" value="2027" />
          <Metric label="GPA" value="3.73 / 4.00" />
          <Metric label="Verified Volunteer Hours" value="262+" />
          <Metric label="Location" value="Makkah, Saudi Arabia" />
        </div>
        <p className="mt-6 rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          Open to mobile engineering opportunities and high-growth teams.
        </p>
      </aside>
    </section>
  );
}
