import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ProjectCover } from "@/components/portfolio/ProjectCover";
import { Icon } from "@/components/portfolio/Icon";
import { IrtiwaShowcase } from "@/components/spec/IrtiwaShowcase";
import { weddingScreens } from "@/data/wedding-artwork";
import { waslScreens } from "@/data/wasl-artwork";
import { galleryProjects, personalInfo, projects } from "@/data/portfolio";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!isLocale(locale) || !project) notFound();
  const path = `/projects/${slug}`;
  const title = `${project.name[locale]} | ${personalInfo.name}`;
  const description = project.caseStudy.problem[locale];
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        ar: `/ar${path}`,
        en: `/en${path}`,
        "x-default": `/ar${path}`,
      },
    },
    openGraph: { title, description, url: `/${locale}${path}` },
    twitter: { card: "summary", title, description },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!isLocale(locale) || !project) notFound();
  const content = getDictionary(locale).spec.s4;
  const study = project.caseStudy;
  const next =
    galleryProjects[
      (galleryProjects.indexOf(project) + 1) % galleryProjects.length
    ];
  const irtiwa = slug === "h2o-calm";
  const icon = irtiwa
    ? "/projects/irtiwa/icon.png"
    : slug === "wasl"
      ? "/projects/wasl/icon.png"
      : null;
  return (
    <main id="main-content" className="case-study page-width">
      <nav className="case-nav" aria-label={content.navigation}>
        <a className="case-back" href={`/${locale}#s4`}>
          <Icon name="back" className="back-arrow" />
          {content.back}
        </a>
        <span>{content.statusLabels[project.status]}</span>
      </nav>
      <header className="case-header">
        <div>
          <span className="case-kind">
            {icon ? (
              <Image
                className="case-icon"
                src={icon}
                alt=""
                width={32}
                height={32}
                priority
              />
            ) : null}
            {project.kind[locale]}
            <bdi>{project.period[locale]}</bdi>
          </span>
          <h1>{project.name[locale]}</h1>
          <p className="case-lead">{project.tagline[locale]}</p>
        </div>
      </header>
      <div className="case-hero-cover">
        <ProjectCover project={project} locale={locale} priority />
      </div>
      <dl className="case-facts">
        {(["problem", "role", "outcome"] as const).map((key) => (
          <div key={key}>
            <dt>{content[key]}</dt>
            <dd>{study[key][locale]}</dd>
          </div>
        ))}
      </dl>
      {irtiwa ? (
        <>
          <IrtiwaShowcase locale={locale} content={content.irtiwa} />
          <section className="case-screens" aria-labelledby="screens-title">
            <div className="case-section-heading">
              <div>
                <span className="eyebrow">{content.screens}</span>
                <h2 id="screens-title">{content.screenIntro}</h2>
              </div>
              <span className="eyebrow">
                <bdi>iOS · SwiftUI</bdi>
              </span>
            </div>
            <div className="screen-gallery">
              {["01-today", "02-bottle", "03-history", "04-reminders"].map(
                (screen, index) => (
                  <figure key={screen}>
                    <Image
                      src={`/projects/irtiwa/${screen}-${locale}.png`}
                      width={1320}
                      height={2868}
                      alt={`${project.name[locale]}: ${content.screenLabels[index]}`}
                      sizes="(max-width:640px) 42vw, 22vw"
                    />
                    <figcaption>{content.screenLabels[index]}</figcaption>
                  </figure>
                ),
              )}
            </div>
          </section>
        </>
      ) : null}
      {slug === "wasl" && (
        <section className="case-screens" aria-labelledby="wasl-screens-title">
          <div className="case-section-heading">
            <div>
              <span className="eyebrow">{content.screens}</span>
              <h2 id="wasl-screens-title">{content.waslScreensIntro}</h2>
            </div>
          </div>
          <div className="screen-gallery wasl-screen-gallery">
            {waslScreens.map((screen) => (
              <figure key={screen.src}>
                <Image
                  src={screen.src}
                  width={screen.width}
                  height={screen.height}
                  alt={screen.label[locale]}
                  sizes="(max-width: 640px) 42vw, 28vw"
                />
                <figcaption>{screen.label[locale]}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      {slug === "wedding-greetings" && (
        <section
          className="case-screens"
          aria-labelledby="wedding-screens-title"
        >
          <div className="case-section-heading">
            <div>
              <span className="eyebrow">{content.screens}</span>
              <h2 id="wedding-screens-title">{content.weddingScreensIntro}</h2>
            </div>
          </div>
          <div className="screen-gallery wedding-screen-gallery">
            {weddingScreens.map((screen) => (
              <figure key={screen.src}>
                <Image
                  src={screen.src}
                  width={screen.width}
                  height={screen.height}
                  alt={screen.label[locale]}
                  sizes="(max-width: 640px) 42vw, 28vw"
                />
                <figcaption>{screen.label[locale]}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      <details className="case-engineering">
        <summary>
          <span>{content.engineering}</span>
          <span>
            <Icon name="plus" />
          </span>
        </summary>
        <div className="engineering-grid">
          <div>
            <h2 id="process">{content.process}</h2>
            <ol>
              {study.process[locale].map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div>
            <h3>{content.challenge}</h3>
            <p>{study.challenge[locale]}</p>
            <h3 style={{ marginTop: 24 }}>{content.decision}</h3>
            <p>{study.decision[locale]}</p>
          </div>
        </div>
        <ul className="case-stack" dir="ltr" aria-label={content.dependencies}>
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </details>
      <a className="next-project" href={`/${locale}/projects/${next.slug}`}>
        <span className="eyebrow">{content.next}</span>
        <span className="next-project-label">
          {next.name[locale]}
          <Icon name="arrow" />
        </span>
        <ProjectCover project={next} locale={locale} />
      </a>
    </main>
  );
}
