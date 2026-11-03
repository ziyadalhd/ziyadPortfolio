import { ImageResponse } from "next/og";
import { galleryProjects } from "@/data/portfolio";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ziyad Alhdriti — Selected work";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f8f8f5",
        color: "#242724",
        padding: "56px 64px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 20,
        }}
      >
        <span>ZIYAD / SELECTED WORK</span>
        <span style={{ color: "#74766f" }}>MAKKAH, SA · 2026</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div
          style={{
            display: "flex",
            fontSize: 98,
            fontWeight: 600,
            letterSpacing: "-.05em",
          }}
        >
          Ziyad Alhdriti.
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#74766f" }}>
          Ideas, made into experiences.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 36,
          paddingTop: 26,
          borderTop: "1px solid #dedfd8",
          fontSize: 20,
          color: "#74766f",
        }}
      >
        {galleryProjects.map((project) => (
          <span key={project.slug}>{project.name.en}</span>
        ))}
      </div>
    </div>,
    size,
  );
}
