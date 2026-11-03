import Link from "next/link";

import type { Project } from "@/data/portfolio";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

export function ProjectSummary({
  project,
  locale,
  content,
}: {
  project: Project;
  locale: Locale;
  content: Dictionary["spec"]["s4"];
}) {
  return (
    <div data-project-summary>
      <dl className="project-facts">
        {(["problem", "role", "outcome"] as const).map((key) => (
          <div key={key}>
            <dt>{content[key]}</dt>
            <dd>{project.caseStudy[key][locale]}</dd>
          </div>
        ))}
      </dl>
      <Link
        className="project-link"
        href={`/${locale}/projects/${project.slug}`}
      >
        {content.details}
        <span aria-hidden="true">{locale === "ar" ? "←" : "→"}</span>
      </Link>
    </div>
  );
}
