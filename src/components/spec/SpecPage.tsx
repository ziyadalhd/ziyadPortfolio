import { ProjectStack } from "@/components/portfolio/ProjectStack";
import { Intro } from "@/components/portfolio/Intro";
import { AboutJourney } from "@/components/portfolio/AboutJourney";
import { ResumeCard } from "@/components/portfolio/ResumeCard";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

export function SpecPage({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <main id="main-content" className="home-page">
      <Intro locale={locale} dict={dict} />
      <ProjectStack locale={locale} dict={dict} />
      <AboutJourney locale={locale} dict={dict} />
      <ResumeCard content={dict.spec.s5} />
    </main>
  );
}
