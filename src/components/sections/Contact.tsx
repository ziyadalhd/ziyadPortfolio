import { personalInfo } from "@/data/portfolio";

import { SectionHeading } from "../ui/SectionHeading";

export function Contact() {
  return (
    <section id="contact" className="section-card scroll-mt-6">
      <SectionHeading
        eyebrow="Contact"
        title="Let us build something meaningful"
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a href={`mailto:${personalInfo.email}`} className="contact-tile">
          {personalInfo.email}
        </a>
        <a href={`tel:${personalInfo.phoneHref}`} className="contact-tile">
          {personalInfo.phone}
        </a>
      </div>
    </section>
  );
}
