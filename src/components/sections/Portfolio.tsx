import { portfolioRoadmap } from "@/data/portfolio";

import { SectionHeading } from "../ui/SectionHeading";

const cardIcons = [
  /* Architecture / system */
  <svg key="arch" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
  </svg>,
  /* Mobile / device */
  <svg key="mobile" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15.75h3" />
  </svg>,
  /* Code / engineering */
  <svg key="code" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>,
];

export function Portfolio() {
  return (
    <section id="portfolio" className="section-card scroll-mt-6">
      <SectionHeading
        eyebrow="Portfolio"
        title="Selected work and case studies"
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {portfolioRoadmap.map((item, index) => (
          <article
            key={item.title}
            className="gradient-border-card portfolio-card transition-transform duration-200"
          >
            <div className="gradient-border-inner flex flex-col gap-4">
              {/* Icon */}
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{
                  border: "1px solid rgba(245,158,11,0.25)",
                  background: "rgba(245,158,11,0.08)",
                  color: "var(--clr-amber)",
                }}
              >
                {cardIcons[index % cardIcons.length]}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3
                  className="text-base font-bold leading-snug text-white"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                  {item.description}
                </p>
              </div>

              {/* Badge */}
              <span
                className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]"
                style={{
                  fontFamily: "var(--font-syne)",
                  border: "1px solid rgba(245,158,11,0.3)",
                  background: "rgba(245,158,11,0.08)",
                  color: "rgba(245,158,11,0.85)",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--clr-amber)" }}
                  aria-hidden="true"
                />
                Expanding soon
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
