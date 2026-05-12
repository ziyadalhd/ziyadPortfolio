import { portfolioRoadmap } from "@/data/portfolio";

import { SectionHeading } from "../ui/SectionHeading";

export function Portfolio() {
  return (
    <section id="portfolio" className="section-card scroll-mt-6">
      <SectionHeading
        eyebrow="Portfolio"
        title="Selected work and case studies (expanding soon)"
      />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {portfolioRoadmap.map((item) => (
          <article
            key={item.title}
            className="card-surface portfolio-card rounded-2xl p-5 transition"
          >
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {item.description}
            </p>
            <span className="mt-4 inline-flex rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-100">
              Coming soon
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
