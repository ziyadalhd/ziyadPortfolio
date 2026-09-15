import { ImageResponse } from "next/og";

import { personalInfo } from "@/data/portfolio";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ziyad Alhdriti — Software Engineer";

/**
 * Latin-only for both locales on purpose: Satori does no system font
 * fallback, so Arabic glyphs would require shipping a font binary. The name
 * and the brand mark carry the value in a social card.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#06080f",
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
              borderRadius: 14,
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.35)",
              color: "#f59e0b",
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
            Ziyad Alhdriti
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 36,
              color: "#f59e0b",
            }}
          >
            Software Engineer · Mobile
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontSize: 26,
              color: "#94a3b8",
            }}
          >
            Flutter · Swift · Spring Boot
          </div>
        </div>

        <div
          style={{
            display: "flex",
            height: 6,
            width: 220,
            background: "#f59e0b",
            borderRadius: 999,
          }}
        />
      </div>
    ),
    size,
  );
}
