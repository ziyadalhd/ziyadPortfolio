import { journey } from "@/data/portfolio";

import { SectionHeading } from "../ui/SectionHeading";

export function Journey() {
  return (
    <section id="journey" className="section-card scroll-mt-6">
      <SectionHeading
        eyebrow="Career Journey"
        title="Milestones that shaped my engineering approach"
      />
      <div className="timeline mt-8 space-y-6" aria-label="Career timeline">
        {journey.map((item) => (
          <article
            key={item.title}
            className="card-surface relative rounded-2xl p-5 transition"
          >
            <p className="eyebrow text-cyan-200">{item.period}</p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              {item.title}
            </h3>
            <p className="mt-3 leading-relaxed text-slate-300">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
