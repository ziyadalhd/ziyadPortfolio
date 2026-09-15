import type { Dictionary } from "@/i18n/types";

import { SectionHeading } from "../ui/SectionHeading";

type CategoryKey = keyof Dictionary["focus"]["categories"];

const skillDetails: { key: CategoryKey; techs: string[] }[] = [
  { key: "mobile", techs: ["Flutter", "Dart", "Swift", "Java"] },
  { key: "backend", techs: ["Spring Boot", "REST APIs", "Firebase"] },
  { key: "data", techs: ["PostgreSQL", "SQL", "Git", "GitHub"] },
  { key: "process", techs: ["OOP", "SDLC", "Agile (Scrum)", "System Design"] },
];

export function TechnicalFocus({ content }: { content: Dictionary["focus"] }) {
  return (
    <section className="grid gap-6 lg:grid-cols-2" aria-label={content.sectionLabel}>
      {/* Skills card */}
      <div className="section-card">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
        />
        <div className="mt-8 space-y-5">
          {skillDetails.map((group) => (
            <div key={group.key}>
              <p
                className="mb-2.5 text-[0.65rem] uppercase tracking-[0.24em]"
                style={{
                  fontFamily: "var(--font-syne)",
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
                      fontFamily: "var(--font-syne)",
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

        {/* Decorative stat row */}
        <div className="mt-auto pt-8 grid grid-cols-3 gap-4 border-t border-white/[0.06]">
          {[
            { value: "262+", label: "Volunteer hrs" },
            { value: "3.73", label: "GPA" },
            { value: "2027", label: "Graduation" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="text-2xl font-extrabold"
                style={{
                  fontFamily: "var(--font-syne)",
                  color: "var(--clr-amber)",
                }}
              >
                {stat.value}
              </p>
              <p
                className="mt-0.5 text-[0.62rem] uppercase tracking-[0.18em] text-slate-600"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
