import { SectionHeading } from "../ui/SectionHeading";

export function Contact() {
  return (
    <section id="contact" className="section-card scroll-mt-6">
      <SectionHeading
        eyebrow="Contact"
        title="Let us build something meaningful"
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a href="mailto:ziyadalhdriti@gmail.com" className="contact-tile">
          ziyadalhdriti@gmail.com
        </a>
        <a href="tel:+966569264771" className="contact-tile">
          +966 56 926 4771
        </a>
      </div>
    </section>
  );
}
