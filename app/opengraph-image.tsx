import { ImageResponse } from "next/og";

import { getSettings } from "@/lib/cms/settings";
import { siteUrl } from "@/lib/seo";

export const revalidate = 300;
export const alt = "Reformas integrales e instalaciones";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen OpenGraph por defecto (WhatsApp, LinkedIn, X). */
export default async function OpenGraphImage() {
  const s = await getSettings();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0e0f12 0%, #17191d 60%, #2b2a28 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg viewBox="0 0 40 40" width="64" height="64" fill="none">
            <path d="M6 22 20 8l14 14" stroke="#d3620f" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 20v12h8v-8h4v8h8V20" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.company.name}</div>
            <div style={{ fontSize: 18, letterSpacing: 4, textTransform: "uppercase", opacity: 0.75 }}>{s.company.tagline}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, color: "#e8781e", fontSize: 20, letterSpacing: 4, textTransform: "uppercase" }}>
            <div style={{ width: 40, height: 3, background: "#e8781e" }} />
            {s.hero.eyebrow}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, fontSize: 66, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em", maxWidth: 1000 }}>
            <span>{s.hero.titleBefore}</span>
            <span style={{ color: "#e8781e" }}>{s.hero.titleHighlight}</span>
            <span>{s.hero.titleAfter}</span>
          </div>
          <div style={{ fontSize: 26, lineHeight: 1.35, opacity: 0.85, maxWidth: 980 }}>{s.hero.subtitle}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, opacity: 0.8 }}>
          <div>Presupuesto sin compromiso</div>
          <div>{siteUrl.replace(/^https?:\/\//, "")}</div>
        </div>
      </div>
    ),
    size,
  );
}
