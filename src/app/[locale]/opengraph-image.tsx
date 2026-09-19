import { ImageResponse } from "next/og";

import { personalInfo } from "@/data/portfolio";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ziyad Jaber Alhdriti — Software Engineer";

/**
 * Latin-only for both locales on purpose: Satori does no system font
 * fallback, so Arabic glyphs would require shipping a font binary. The name
 * and the brand mark carry the value in a social card.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0e0e0d",
        padding: 72,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: 0,
            background: "rgba(255,95,69,0.14)",
            border: "1px solid rgba(255,95,69,0.4)",
            color: "#ff5f45",
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          Z
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#94a3b8" }}>
          {personalInfo.githubDisplay}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.05,
          }}
        >
          Ziyad Jaber Alhdriti
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 36,
            color: "#ff5f45",
          }}
        >
          Software Engineer · Full-Stack & Mobile
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 14,
            fontSize: 26,
            color: "#94a3b8",
          }}
        >
          Next.js · Supabase · Flutter · Swift
        </div>
      </div>

      <div
        style={{
          display: "flex",
          height: 6,
          width: 220,
          background: "#ff5f45",
          borderRadius: 0,
        }}
      />
    </div>,
    size,
  );
}
