import Image from "next/image";
import { galleryProjects } from "@/data/portfolio";
import { getProjectPreviews } from "@/data/project-previews";
import { technologyLogos } from "@/data/technology-logos";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { Icon } from "./Icon";
import { ProjectCard } from "./ProjectCard";
import { StackFlow } from "./StackFlow";
import { TechnologyStrip } from "./TechnologyStrip";
import "./project-stack.css";

export function ProjectStack({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const content = dict.spec.s4;
  return (
    <section
      id="s4"
      className="stack-study"
      aria-labelledby="stack-study-title"
    >
      <header className="stack-study-heading page-width">
        <h2 id="stack-study-title" aria-label={content.displayHeading}>
          {content.displayHeading.split(" ").map((word, index, words) => (
            <span
              key={index}
              className="stack-title-word"
              aria-hidden="true"
              style={{
                animationRange: `entry ${(index * 70) / (words.length - 1)}% entry ${(index * 70) / (words.length - 1) + 30}%`,
              }}
            >
              {word}
              {index < words.length - 1 ? " " : ""}
            </span>
          ))}
        </h2>
        <span>
          <bdi>01 — {String(galleryProjects.length).padStart(2, "0")}</bdi>
        </span>
      </header>
      <StackFlow>
        {galleryProjects.map((project, index) => {
          const screens = getProjectPreviews(project.slug, locale);
          return (
            <ProjectCard
              key={project.slug}
              slug={project.slug}
              animated
              className="stack-study-card"
            >
              <a
                className="stack-study-surface"
                data-stack-project={project.slug}
                data-project={project.slug}
                href={`/${locale}/projects/${project.slug}`}
                aria-label={`${content.details}: ${project.name[locale]}`}
              >
                <div className="stack-study-summary">
                  <div className="stack-study-description">
                    <div className="stack-study-identity">
                      {project.slug === "wedding-greetings" ? (
                        <span className="stack-study-mark">
                          <Icon name="chat" />
                        </span>
                      ) : (
                        <Image
                          src={
                            project.slug === "h2o-calm"
                              ? "/projects/irtiwa/icon.png"
                              : project.slug === "bayn"
                                ? "/projects/bayn-logo.svg"
                                : "/projects/wasl/icon.png"
                          }
                          alt=""
                          width={44}
                          height={44}
                          className={
                            project.slug === "bayn"
                              ? "stack-study-bayn-logo"
                              : undefined
                          }
                        />
                      )}
                      <h3>{project.name[locale]}</h3>
                      <bdi>{String(index + 1).padStart(2, "0")}</bdi>
                    </div>
                    <p>{project.caseStudy.problem[locale]}</p>
                  </div>
                  <div className="stack-study-role">
                    <span>{content.role}</span>
                    <p>{project.caseStudy.role[locale]}</p>
                  </div>
                </div>
                <div className="stack-study-art" aria-hidden="true">
                  <div className="stack-study-track">
                    {[0, 1].map((copy) => (
                      <div className="stack-study-image-group" key={copy}>
                        {[0, 1].flatMap((repeat) =>
                          screens.map((screen) => (
                            <Image
                              key={`${repeat}-${screen.src}`}
                              src={screen.src}
                              width={screen.width}
                              height={screen.height}
                              alt=""
                              sizes="(max-width: 640px) 280px, 620px"
                            />
                          )),
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="stack-study-bottom">
                  <TechnologyStrip
                    tools={project.stack.filter(
                      (tool) => technologyLogos[tool],
                    )}
                    locale={locale}
                    label={content.dependencies}
                  />
                  <span className="stack-study-open" aria-hidden="true">
                    {content.details}
                    <Icon name="arrow" />
                  </span>
                </div>
              </a>
            </ProjectCard>
          );
        })}
      </StackFlow>
    </section>
  );
}
