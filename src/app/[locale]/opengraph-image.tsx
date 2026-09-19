import { ImageResponse } from "next/og";

import { personalInfo } from "@/data/portfolio";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ziyad Jaber Alhdriti — Software Engineer";

const ACCENT = "#ff5f45";
const INK = "#f7f6f4";
const MUTED = "#bcb9b5";
const RULE = "rgba(247,246,244,.66)";
const HAIR = "rgba(247,246,244,.24)";

const label = {
  display: "flex",
  fontSize: 17,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: MUTED,
} as const;

/**
 * The card is the document's masthead: same clause framing, rules and
 * status strip as clause §0, so a shared link looks like the page it opens.
 *
 * Latin-only for both locales on purpose: Satori does no system font
 * fallback, so Arabic glyphs would require shipping a font binary, and the
 * name carries the value in a social card either way.
 */
export default function OpenGraphImage() {
  const mast = [
    { k: "Status", v: "Open to work", accent: true },
    { k: "GPA", v: personalInfo.gpa },
    { k: "Graduation", v: personalInfo.expectedGraduation },
    { k: "Based in", v: "Makkah, SA" },
  ];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#0e0e0d",
        padding: "56px 64px",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
        <div style={{ ...label, color: ACCENT }}>SPEC-2026 / REV 4.0</div>
        <div style={label}>Personal specification</div>
      </div>

      <div
        style={{ display: "flex", height: 2, background: RULE, marginTop: 22 }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: "-0.035em",
            color: INK,
            lineHeight: 1,
          }}
        >
          Ziyad Jaber Alhdriti
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontSize: 34,
            color: MUTED,
            letterSpacing: "-0.01em",
          }}
        >
          Software Engineering student, full-stack &amp; mobile engineer
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            gap: 14,
            fontSize: 24,
            color: ACCENT,
          }}
        >
          <div style={{ display: "flex" }}>Next.js</div>
          <div style={{ display: "flex", color: HAIR }}>/</div>
          <div style={{ display: "flex" }}>Supabase</div>
          <div style={{ display: "flex", color: HAIR }}>/</div>
          <div style={{ display: "flex" }}>Flutter</div>
          <div style={{ display: "flex", color: HAIR }}>/</div>
          <div style={{ display: "flex" }}>Swift</div>
        </div>
      </div>

      <div style={{ display: "flex", height: 2, background: RULE }} />
      <div style={{ display: "flex" }}>
        {mast.map((cell, i) => (
          <div
            key={cell.k}
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "20px 24px",
              paddingLeft: i === 0 ? 0 : 24,
              borderLeft: i === 0 ? "none" : `1px solid ${HAIR}`,
            }}
          >
            <div style={{ ...label, fontSize: 15 }}>{cell.k}</div>
            <div
              style={{
                display: "flex",
                marginTop: 10,
                fontSize: 24,
                color: cell.accent ? ACCENT : INK,
              }}
            >
              {cell.v}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", height: 2, background: RULE }} />

      <div style={{ ...label, marginTop: 20, gap: 20 }}>
        <div style={{ display: "flex" }}>{personalInfo.githubDisplay}</div>
        <div style={{ display: "flex", color: HAIR }}>|</div>
        <div style={{ display: "flex" }}>{personalInfo.linkedinDisplay}</div>
      </div>
    </div>,
    size,
  );
}
