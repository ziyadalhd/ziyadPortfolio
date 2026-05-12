import { DigitalTwinChat } from "@/components/digital-twin-chat";

import { SectionHeading } from "../ui/SectionHeading";

export function DigitalTwinSection() {
  return (
    <section id="digital-twin" className="section-card scroll-mt-6">
      <SectionHeading eyebrow="AI Experience" title="Ask my Digital Twin" />
      <p className="mt-4 max-w-3xl text-slate-300">
        This assistant is trained on my career background and project history.
        It can answer questions about my skills, journey, and professional
        direction in real time.
      </p>
      <div className="mt-8">
        <DigitalTwinChat />
      </div>
    </section>
  );
}
