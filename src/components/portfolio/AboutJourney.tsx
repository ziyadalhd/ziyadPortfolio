import Image from "next/image";
import { journey, skillCategories } from "@/data/portfolio";
import { technologyLogos } from "@/data/technology-logos";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { LogoRail } from "./LogoRail";

export function AboutJourney({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const s = dict.spec;
  const tools = [
    ...new Set(skillCategories.flatMap((category) => category.techs)),
  ].filter((tool) => technologyLogos[tool]);
  const organizations = [
    {
      entry: journey[0],
      logo: "makkah-municipality.svg",
      name:
        locale === "ar" ? "أمانة العاصمة المقدسة" : "Holy Makkah Municipality",
      style: "municipality",
    },
    {
      entry: journey[3],
      logo: "uqu.svg",
      name: locale === "ar" ? "جامعة أم القرى" : "Umm Al-Qura University",
      style: "university",
    },
  ];
  return (
    <section
      id="about"
      className="journey-section"
      aria-labelledby="journey-title"
    >
      <header className="journey-intro page-width">
        <h2 id="journey-title">{s.s1.intro}</h2>
        <p>{s.s1.body}</p>
      </header>
      <div className="journey-credentials">
        <h3 className="page-width">{s.s2.heading}</h3>
        <LogoRail label={s.s2.heading} kind="organizations">
          {[0, 1, 2].flatMap((repeat) =>
            organizations.map((org) => (
              <div
                className={`logo-tile organization ${org.style}`}
                key={`${org.style}-${repeat}`}
                aria-hidden={repeat > 0 ? true : undefined}
                title={`${org.name}: ${org.entry.title[locale]}`}
              >
                <div className={`organization-logo ${org.style}`}>
                  <Image
                    src={`/brands/${org.logo}`}
                    alt={org.name}
                    width={180}
                    height={64}
                  />
                </div>
                <div className="sr-only">
                  <bdi>{org.entry.period[locale]}</bdi>
                  <p>{org.entry.title[locale]}</p>
                </div>
              </div>
            )),
          )}
        </LogoRail>
      </div>
      <div className="journey-tools">
        <h3 className="page-width">{s.s3.heading}</h3>
        <LogoRail label={s.s3.heading} kind="tools">
          {tools.map((tool) => (
            <div className="logo-tile tool-logo" key={tool} title={tool}>
              <Image
                src={`/tech/${technologyLogos[tool]}`}
                alt={tool}
                width={64}
                height={64}
              />
            </div>
          ))}
        </LogoRail>
      </div>
    </section>
  );
}
