"use client";

import { useRef, useState } from "react";

/**
 * Hover/focus preview for a §clause cross-reference. Positioning is
 * self-contained (no global listeners): each tag measures itself on
 * open and clamps the tooltip to the viewport.
 */
export function RefTag({
  id,
  title,
  body,
}: {
  id: string;
  title: string;
  body: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ left: "0px", top: "0px" });
  const anchorRef = useRef<HTMLSpanElement>(null);

  function show() {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = 320;
    const left = Math.max(
      16,
      Math.min(window.innerWidth - width - 16, r.left - 24),
    );
    const below = r.bottom + 12;
    const top =
      below + 160 > window.innerHeight ? Math.max(16, r.top - 160) : below;
    setPos({ left: `${left}px`, top: `${top}px` });
    setOpen(true);
  }

  return (
    <span style={{ position: "relative" }}>
      <span
        ref={anchorRef}
        dir="ltr"
        tabIndex={0}
        onMouseEnter={show}
        onMouseLeave={() => setOpen(false)}
        onFocus={show}
        onBlur={() => setOpen(false)}
        style={{
          fontFamily: "var(--mono)",
          fontSize: ".94em",
          color: "var(--accent)",
          fontWeight: 500,
          borderBottom: "1px dotted var(--accent)",
          cursor: "help",
        }}
      >
        §{id}
      </span>
      {open ? (
        <span
          role="tooltip"
          style={{
            position: "fixed",
            left: pos.left,
            top: pos.top,
            width: "320px",
            maxWidth: "calc(100vw - 32px)",
            zIndex: 80,
            background: "var(--bg)",
            border: "1px solid var(--accent)",
            boxShadow: "0 12px 32px rgba(0,0,0,.18)",
            padding: "16px",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "10.5px",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              fontFamily: "var(--mono)",
              color: "var(--accent)",
              fontWeight: 600,
            }}
          >
            §{id}
          </span>
          <span
            style={{
              display: "block",
              fontSize: "16px",
              fontWeight: 800,
              letterSpacing: "-.01em",
              marginTop: "8px",
              lineHeight: 1.25,
            }}
          >
            {title}
          </span>
          <span
            style={{
              display: "block",
              fontSize: "14px",
              lineHeight: 1.55,
              marginTop: "8px",
              color: "var(--muted)",
            }}
          >
            {body}
          </span>
        </span>
      ) : null}
    </span>
  );
}
