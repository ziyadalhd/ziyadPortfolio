import { SectionHeading } from "../ui/SectionHeading";

export function About() {
  return (
    <section id="about" className="section-card scroll-mt-6">
      <SectionHeading
        eyebrow="About Me"
        title="Structured engineer. Product mindset. Execution-focused."
      />
      <p className="max-w-4xl text-lg leading-relaxed text-slate-300">
        I am a Software Engineering student with strong interest in mobile
        development and full-stack systems. I enjoy operating at the
        intersection of architecture and user impact: defining requirements,
        shaping system design, implementing production-ready features, and
        validating quality with a disciplined workflow.
      </p>
    </section>
  );
}
