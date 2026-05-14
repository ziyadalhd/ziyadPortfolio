import { SectionHeading } from "../ui/SectionHeading";

export function About() {
  return (
    <section id="about" className="section-card scroll-mt-6">
      <SectionHeading
        eyebrow="About Me"
        title="Structured engineer. Product mindset. Execution-focused."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto]">
        <p className="max-w-3xl text-lg leading-relaxed text-slate-400">
          I am a Software Engineering student with strong interest in mobile
          development and full-stack systems. I enjoy operating at the
          intersection of architecture and user impact — defining requirements,
          shaping system design, implementing production-ready features, and
          validating quality with a disciplined workflow.
        </p>

        {/* Pull stat */}
        <div
          className="flex flex-col items-center justify-center rounded-2xl px-8 py-5 text-center lg:min-w-[140px]"
          style={{
            border: "1px solid rgba(245,158,11,0.2)",
            background: "rgba(245,158,11,0.05)",
          }}
        >
          <span
            className="text-4xl font-extrabold"
            style={{
              fontFamily: "var(--font-syne)",
              color: "var(--clr-amber)",
            }}
          >
            3.73
          </span>
          <span
            className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            GPA
          </span>
        </div>
      </div>
    </section>
  );
}
