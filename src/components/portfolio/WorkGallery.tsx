import Image from "next/image";

import { galleryProjects } from "@/data/portfolio";
import { getProjectPreviews } from "@/data/project-previews";
import { technologyLogos } from "@/data/technology-logos";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

import { Icon } from "./Icon";
import { ProjectCard } from "./ProjectCard";
import "./work-gallery.css";

export function WorkGallery({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const s = dict.spec.s4;
  return (
    <section
      id="s4"
      className="work-exhibition page-width"
      aria-labelledby="work-title"
    >
      <header className="work-index">
        <div>
          <h2 id="work-title">{s.displayHeading}</h2>
        </div>
        <span className="work-count">
          <bdi>01 — {String(galleryProjects.length).padStart(2, "0")}</bdi>
          <Icon name="down" />
        </span>
      </header>
      <div className="project-gallery">
        {galleryProjects.map((project, index) => {
          const screens = getProjectPreviews(project.slug, locale);
          return (
            <ProjectCard
              slug={project.slug}
              key={project.slug}
              animated={screens.length > 0}
            >
              <a
                className="project-card identity-card"
                data-project={project.slug}
                href={`/${locale}/projects/${project.slug}`}
                aria-label={`${s.details}: ${project.name[locale]}`}
              >
                <div className="identity-meta">
                  <span className="identity-brand">
                    {project.slug === "h2o-calm" ? (
                      <Image
                        src="/projects/irtiwa/icon.png"
                        width={48}
                        height={48}
                        alt=""
                        sizes="48px"
                      />
                    ) : project.slug === "bayn" ? (
                      <span className="identity-logo">
                        <Image
                          src="/projects/bayn-logo.svg"
                          width={48}
                          height={30}
                          alt=""
                        />
                      </span>
                    ) : project.slug === "wasl" ? (
                      <Image
                        src="/projects/wasl/icon.png"
                        width={48}
                        height={48}
                        alt=""
                        sizes="48px"
                      />
                    ) : (
                      <span className="identity-mark">
                        <Icon
                          name={project.slug === "wasl" ? "code" : "chat"}
                        />
                      </span>
                    )}
                    <span>{project.kind[locale]}</span>
                  </span>
                  <bdi className="identity-index">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(galleryProjects.length).padStart(2, "0")}
                  </bdi>
                </div>
                <div className="identity-body">
                  <h3>{project.name[locale]}</h3>
                  <p>{project.tagline[locale]}</p>
                  <div className="identity-tools">
                    <ul aria-label={s.dependencies}>
                      {project.stack
                        .filter((tool) => technologyLogos[tool])
                        .map((tool) => (
                          <li key={tool} title={tool} data-brand={tool}>
                            <Image
                              src={`/tech/${technologyLogos[tool]}`}
                              alt={tool}
                              width={40}
                              height={40}
                              sizes="52px"
                            />
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                <div className="identity-footer">
                  <bdi>{project.period[locale]}</bdi>
                  <span className="identity-link">
                    {s.details}
                    <span>
                      <Icon name="arrow" />
                    </span>
                  </span>
                </div>
                {screens.length > 0 && (
                  <div
                    className="identity-preview project-cover"
                    style={{ viewTransitionName: `cover-${project.slug}` }}
                  >
                    <div className="preview-window">
                      <div className="preview-track" aria-hidden="true">
                        {[0, 1].map((copy) => (
                          <div className="preview-group" key={copy}>
                            {screens.map((screen) => (
                              <Image
                                key={screen.src}
                                src={screen.src}
                                width={screen.width}
                                height={screen.height}
                                alt=""
                                sizes="(max-width: 640px) 280px, 410px"
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </a>
            </ProjectCard>
          );
        })}
      </div>
    </section>
  );
}
