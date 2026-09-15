import Image from "next/image";

import { projects, type Project } from "@/data/portfolio";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

import { SectionHeading } from "../ui/SectionHeading";

const icons: Record<NonNullable<Project["icon"]>, React.ReactElement> = {
  architecture: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
    </svg>
  ),
  mobile: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15.75h3" />
    </svg>
  ),
  code: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
};

export function Portfolio({
  content,
  locale,
}: {
  content: Dictionary["portfolio"];
  locale: Locale;
}) {
  return (
    <section id="portfolio" className="section-card scroll-mt-6">
      <SectionHeading eyebrow={content.eyebrow} title={content.title} />

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="gradient-border-card portfolio-card transition-transform duration-200"
          >
            <div className="gradient-border-inner flex flex-col gap-4">
              {/* Image when there is one, the icon tile otherwise. */}
              {project.image ? (
                <Image
                  src={project.image.src}
                  width={project.image.width}
                  height={project.image.height}
                  alt={project.image.alt[locale]}
                  className="h-40 w-full rounded-xl object-cover"
                />
              ) : (
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    border: "1px solid rgba(245,158,11,0.25)",
                    background: "rgba(245,158,11,0.08)",
                    color: "var(--clr-amber)",
                  }}
                >
                  {icons[project.icon ?? "code"]}
                </div>
              )}

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span
                    className="text-[0.62rem] font-bold uppercase tracking-[0.18em]"
                    style={{
                      fontFamily: "var(--font-syne)",
                      color: "rgba(245,158,11,0.75)",
                    }}
                  >
                    {project.kind[locale]}
                  </span>
                  <span className="text-[0.62rem] text-slate-600">·</span>
                  <span className="text-[0.62rem] text-slate-500">
                    {project.period[locale]}
                  </span>
                </div>

                <h3
                  className="mt-2 text-base font-bold leading-snug text-white"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {project.title[locale]}
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                  {project.summary[locale]}
                </p>

                <ul className="mt-4 space-y-1.5">
                  {project.highlights[locale].map((highlight) => (
                    <li
                      key={highlight}
                      className="flex gap-2 text-sm leading-relaxed text-slate-400"
                    >
                      <span
                        className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full"
                        style={{ background: "rgba(245,158,11,0.6)" }}
                        aria-hidden="true"
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md px-2 py-1 text-[0.7rem] font-medium text-slate-300"
                      style={{
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.04)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]"
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
                  {content.statusLabels[project.status]}
                </span>

                {/* Renders nothing when a project has no links yet. */}
                {project.links?.map((link) => (
                  <a
                    key={link.kind}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full px-3 py-1 text-xs font-semibold text-slate-300"
                    style={{
                      fontFamily: "var(--font-syne)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.04)",
                      textDecoration: "none",
                    }}
                  >
                    {content.linkLabels[link.kind]}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
