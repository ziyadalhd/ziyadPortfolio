import { personalInfo } from "@/data/portfolio";
import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";

/** JSON-LD Person, so search engines can attribute the profile correctly. */
export function personSchema(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personalInfo.name,
    url: `${SITE_URL}/${locale}`,
    jobTitle: personalInfo.role[locale],
    description,
    email: `mailto:${personalInfo.email}`,
    sameAs: [personalInfo.linkedin, personalInfo.github],
    knowsLanguage: ["ar", "en"],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Umm Al-Qura University",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Makkah",
      addressCountry: "SA",
    },
  };
}
