import Image from "next/image";
import { personalInfo } from "@/data/portfolio";
import type { Dictionary } from "@/i18n/types";
import { Icon } from "./Icon";
import "./resume.css";

/** The preview is rendered from the same PDF offered for download. */
export function ResumeCard({ content }: { content: Dictionary["spec"]["s5"] }) {
  return (
    <section
      id="resume"
      className="resume-section page-width"
      aria-labelledby="resume-title"
    >
      <div className="resume-card">
        <div className="resume-copy">
          <span className="resume-format">
            <bdi>PDF</bdi> · {content.pageCount}
          </span>
          <h2 id="resume-title">{content.annexTitle}</h2>
          <p>{content.annexBody}</p>
          <div className="resume-actions">
            <a
              className="contact-button resume-download"
              href={personalInfo.resume}
              download="Ziyad-Alhdriti-CV.pdf"
            >
              {content.annexDownload}
              <Icon name="download" />
            </a>
            <a
              className="resume-view"
              href={personalInfo.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.annexView}
              <Icon name="arrow" />
            </a>
          </div>
        </div>
        <a
          className="resume-paper"
          href={personalInfo.resume}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={content.annexView}
        >
          <Image
            src="/resume/ziyad-cv-preview.jpg"
            alt={content.previewAlt}
            width={1237}
            height={1600}
            sizes="(max-width: 640px) 80vw, 400px"
          />
          <span className="resume-preview-label">
            {content.annexView}
            <Icon name="arrow" />
          </span>
        </a>
      </div>
    </section>
  );
}
