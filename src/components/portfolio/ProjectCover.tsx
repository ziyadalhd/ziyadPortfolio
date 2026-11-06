import Image from "next/image";
import type { CSSProperties } from "react";

import { weddingScreens } from "@/data/wedding-artwork";
import { waslScreens } from "@/data/wasl-artwork";
import type { Project } from "@/data/portfolio";
import type { Locale } from "@/i18n/config";

/** The same original assets anchor the gallery-to-project view transition. */
export function ProjectCover({
  project,
  locale,
  priority = false,
}: {
  project: Project;
  locale: Locale;
  priority?: boolean;
}) {
  return (
    <div
      className={`project-cover cover-${project.slug}`}
      style={{ viewTransitionName: `cover-${project.slug}` } as CSSProperties}
    >
      {project.slug === "h2o-calm" ? (
        <>
          <span className="cover-word" aria-hidden="true">
            IRTIWA
          </span>
          <Image
            className="cover-phone cover-phone-back"
            src={`/projects/irtiwa/03-history-${locale}.png`}
            alt=""
            width={1320}
            height={2868}
            sizes="(max-width: 640px) 140px, 230px"
          />
          <Image
            className="cover-phone cover-phone-front"
            src={`/projects/irtiwa/01-today-${locale}.png`}
            alt={project.name[locale]}
            width={1320}
            height={2868}
            sizes="(max-width: 640px) 170px, 260px"
            priority={priority}
          />
          <Image
            className="cover-phone cover-phone-third"
            src={`/projects/irtiwa/02-bottle-${locale}.png`}
            alt=""
            width={1320}
            height={2868}
            sizes="(max-width: 640px) 110px, 220px"
          />
          <Image
            className="cover-app-icon"
            src="/projects/irtiwa/icon.png"
            width={1024}
            height={1024}
            alt=""
            sizes="64px"
          />
        </>
      ) : project.slug === "bayn" ? (
        <>
          <div className="bayn-browser">
            <div className="browser-bar" aria-hidden="true">
              <i />
              <i />
              <i />
              <span>bayn-cultural-club</span>
            </div>
            <Image
              src="/projects/bayn-desktop.png"
              alt={project.name[locale]}
              width={1440}
              height={1000}
              sizes="(max-width: 640px) 360px, 850px"
              priority={priority}
            />
          </div>
          <Image
            className="bayn-mobile"
            src="/projects/bayn-mobile.png"
            alt=""
            width={390}
            height={844}
            sizes="(max-width: 640px) 100px, 200px"
          />
          <Image
            className="bayn-cover-logo"
            src="/projects/bayn-logo.svg"
            alt=""
            width={300}
            height={185}
            sizes="100px"
          />
        </>
      ) : project.slug === "wasl" ? (
        <div className="wasl-cover-screens">
          {[waslScreens[2], waslScreens[0], waslScreens[1]].map((screen) => (
            <Image
              key={screen.src}
              src={screen.src}
              width={screen.width}
              height={screen.height}
              alt={screen.label[locale]}
              sizes="(max-width: 640px) 27vw, 24vw"
              priority={priority}
            />
          ))}
        </div>
      ) : project.slug === "wedding-greetings" ? (
        <div className="greeting-cover-screens">
          {[weddingScreens[1], weddingScreens[4], weddingScreens[2]].map(
            (screen) => (
              <Image
                key={screen.src}
                src={screen.src}
                width={screen.width}
                height={screen.height}
                alt={screen.label[locale]}
                sizes="(max-width: 640px) 27vw, 24vw"
                priority={priority}
              />
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
