import { skillGroups } from "@/data/portfolio";

import { SectionHeading } from "../ui/SectionHeading";

export function TechnicalFocus() {
  return (
    <section className="grid gap-8 lg:grid-cols-2" aria-label="Technical focus">
      <div className="section-card">
        <SectionHeading
          eyebrow="Technical Focus"
          title="Core engineering stack"
        />
        <ul className="mt-8 space-y-4">
          {skillGroups.map((group) => (
            <li key={group} className="card-surface rounded-xl px-4 py-3">
              {group}
            </li>
          ))}
        </ul>
      </div>

      <div className="section-card">
        <SectionHeading
          eyebrow="Current Objective"
          title="Building high-value mobile products"
        />
        <p className="mt-8 leading-relaxed text-slate-300">
          I am open to roles where I can contribute to mobile product
          engineering, collaborate across backend and design, and continue
          delivering scalable features with speed and quality. I am particularly
          interested in teams that value ownership, mentorship, and measurable
          product outcomes.
        </p>
      </div>
    </section>
  );
}
