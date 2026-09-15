import { skillCategories } from "@/data/portfolio";
import type { Dictionary } from "@/i18n/types";

import { SectionHeading } from "../ui/SectionHeading";

export function TechnicalFocus({ content }: { content: Dictionary["focus"] }) {
  return (
    <section
      className="grid gap-6 lg:grid-cols-2"
      aria-label={content.sectionLabel}
    >
      {/* Skills card */}
      <div className="section-card">
        <SectionHeading eyebrow={content.eyebrow} title={content.title} />
        <div className="mt-8 space-y-5">
          {skillCategories.map((group) => (
            <div key={group.key}>
              <p
                className="mb-2.5 text-[0.65rem] uppercase tracking-[0.24em]"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "rgba(245,158,11,0.7)",
                }}
              >
                {content.categories[group.key]}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.techs.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300"
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.04)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Objective card */}
      <div className="section-card flex flex-col">
        <SectionHeading
          eyebrow={content.objectiveEyebrow}
          title={content.objectiveTitle}
        />
        <p className="mt-8 leading-relaxed text-slate-400">
          {content.objectiveBody}
        </p>

        {/* The Hero snapshot card is the single home for these numbers. */}
        <div className="mt-auto pt-8 border-t border-white/[0.06]">
          <a href="#contact" className="button-primary">
            {content.ctaTalk}
          </a>
        </div>
      </div>
    </section>
  );
}
