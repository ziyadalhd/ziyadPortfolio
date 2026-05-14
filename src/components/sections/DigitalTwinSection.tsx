import { DigitalTwinChat } from "@/components/digital-twin-chat";

import { SectionHeading } from "../ui/SectionHeading";

export function DigitalTwinSection() {
  return (
    <section id="digital-twin" className="section-card scroll-mt-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
        <SectionHeading eyebrow="AI Experience" title="Ask my Digital Twin" />

        {/* Live badge */}
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]"
          style={{
            fontFamily: "var(--font-syne)",
            border: "1px solid rgba(52,211,153,0.25)",
            background: "rgba(52,211,153,0.07)",
            color: "rgba(110,231,183,0.9)",
          }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Live
        </div>
      </div>

      <p className="mt-4 max-w-2xl leading-relaxed text-slate-400">
        This assistant is trained on my career background and project history.
        Ask about my skills, journey, and professional direction in real time.
      </p>

      <div className="mt-8">
        <DigitalTwinChat />
      </div>
    </section>
  );
}
