"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { personalInfo } from "@/data/portfolio";
import type { Dictionary } from "@/i18n/types";

const buttonBase = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  fontFamily: "var(--mono)",
  fontSize: "13px",
  fontWeight: 500,
  letterSpacing: ".05em",
  textTransform: "uppercase",
  padding: "13px 20px",
  cursor: "pointer",
  transition: "background .25s ease, color .25s ease, transform .25s ease",
} as const;

export function ResumeActions({
  content,
}: {
  content: Dictionary["spec"]["s5"];
}) {
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    // Captured now: by cleanup time the ref may already point elsewhere,
    // and focus has to land back on the button that opened the dialog.
    const opener = openerRef.current;

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [open]);

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        <button
          ref={openerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="resume-view"
          style={{
            ...buttonBase,
            background: "var(--accent)",
            color: "var(--bg)",
            border: "1px solid var(--accent)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>{content.annexView}</span>
        </button>

        <a
          href={personalInfo.resume}
          download
          className="resume-download"
          style={{
            ...buttonBase,
            background: "transparent",
            color: "var(--ink)",
            border: "1px solid var(--rule)",
            textDecoration: "none",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>{content.annexDownload}</span>
        </a>
      </div>

      {/* Portalled: the clause row carries a live transform from .reveal,
          which would otherwise become the containing block for this fixed
          overlay and trap its z-index. */}
      {open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={content.annexTitle}
              onClick={() => setOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 120,
                background: "color-mix(in srgb, var(--desk) 86%, transparent)",
                WebkitBackdropFilter: "blur(6px)",
                backdropFilter: "blur(6px)",
                display: "flex",
                flexDirection: "column",
                padding:
                  "calc(16px + env(safe-area-inset-top, 0px)) var(--gutter) calc(16px + env(safe-area-inset-bottom, 0px))",
                animation: "coverin .35s cubic-bezier(.2,.7,.2,1) both",
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "min(920px, 100%)",
                  margin: "0 auto",
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--bg)",
                  border: "1px solid var(--rule)",
                  boxShadow: "0 24px 60px rgba(0,0,0,.35)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--hair)",
                    fontFamily: "var(--mono)",
                    fontSize: "10.5px",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                  }}
                >
                  <span>{content.annexTitle}</span>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={content.annexClose}
                    style={{
                      minHeight: 0,
                      padding: "6px 10px",
                      background: "transparent",
                      border: "1px solid var(--rule)",
                      color: "var(--ink)",
                      fontFamily: "var(--mono)",
                      fontSize: "11px",
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    {content.annexClose}
                  </button>
                </div>

                <iframe
                  src={personalInfo.resume}
                  title={content.annexTitle}
                  style={{
                    flex: 1,
                    width: "100%",
                    border: 0,
                    background: "var(--surface)",
                  }}
                />

                {/* iOS Safari refuses to render a PDF inside an iframe, so the
                    frame above can come up blank on a phone. */}
                <a
                  href={personalInfo.resume}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "12px 16px",
                    borderTop: "1px solid var(--hair)",
                    fontFamily: "var(--mono)",
                    fontSize: "11.5px",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    textAlign: "center",
                  }}
                >
                  {content.annexOpenTab}
                </a>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
