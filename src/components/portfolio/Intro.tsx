import { personalInfo } from "@/data/portfolio";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { HeroArt } from "./HeroArt";
import { Icon } from "./Icon";
import { TwinTrigger } from "./TwinTrigger";
import "./intro.css";

/** The approved opening, shared by both homepage languages. */
export function Intro({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const hero = dict.spec.hero;
  return (
    <section className="intro-study" aria-labelledby="study-title">
      <HeroArt content={hero} />
      <div className="intro-study-details page-width">
        <div className="intro-study-content">
          <h1 id="study-title" aria-label={hero.intro}>
            <span aria-hidden={locale === "ar" ? true : undefined}>
              {hero.introLead}
            </span>{" "}
            <strong aria-hidden={locale === "ar" ? true : undefined}>
              {hero.introStrong}
            </strong>
          </h1>
          <div className="intro-study-identity">
            <p className="intro-study-signature">{hero.name}</p>
            <div className="intro-study-meta">
              <span>{hero.location}</span>
              <span className="intro-study-availability">
                <i aria-hidden="true" />
                {hero.available}
              </span>
            </div>
          </div>
          <div className="intro-study-contact">
            <p>{hero.role}</p>
            <div className="intro-study-contact-line">
              <a
                className="contact-button intro-study-cta"
                href={personalInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                {dict.spec.s7.contact}
                <Icon name="arrow" />
              </a>
              <TwinTrigger label={dict.spec.s6.open} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
