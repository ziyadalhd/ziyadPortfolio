import { SectionHeading } from "../ui/SectionHeading";

const skillDetails: { category: string; techs: string[] }[] = [
  {
    category: "Mobile",
    techs: ["Flutter", "Dart", "Swift", "Java"],
  },
  {
    category: "Backend",
    techs: ["Spring Boot", "REST APIs", "Firebase"],
  },
  {
    category: "Data",
    techs: ["PostgreSQL", "SQL", "Git", "GitHub"],
  },
  {
    category: "Process",
    techs: ["OOP", "SDLC", "Agile (Scrum)", "System Design"],
  },
];

export function TechnicalFocus() {
  return (
    <section className="grid gap-6 lg:grid-cols-2" aria-label="Technical focus">
      {/* Skills card */}
      <div className="section-card">
        <SectionHeading
          eyebrow="Technical Focus"
          title="Core engineering stack"
        />
        <div className="mt-8 space-y-5">
          {skillDetails.map((group) => (
            <div key={group.category}>
              <p
                className="mb-2.5 text-[0.65rem] uppercase tracking-[0.24em]"
                style={{
                  fontFamily: "var(--font-syne)",
                  color: "rgba(245,158,11,0.7)",
                }}
              >
                {group.category}
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
          eyebrow="Current Objective"
          title="Building high-value mobile products"
        />
        <p className="mt-8 leading-relaxed text-slate-400">
          I am open to roles where I can contribute to mobile product
          engineering, collaborate across backend and design, and continue
          delivering scalable features with speed and quality. I am particularly
          interested in teams that value ownership, mentorship, and measurable
          product outcomes.
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
