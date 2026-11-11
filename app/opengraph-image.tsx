import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { getSettings } from "@/lib/cms/settings";
import { siteUrl } from "@/lib/seo";

export const revalidate = 300;
export const alt = "Reformas integrales e instalaciones";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Logo con el wordmark en blanco (fondo oscuro de la imagen). Si no se puede leer, se omite. */
async function loadLogo(): Promise<ArrayBuffer | null> {
  try {
    const file = await readFile(join(process.cwd(), "public/images/logo/mardari-blanco.png"));
    return Uint8Array.from(file).buffer;
  } catch {
    return null;
  }
}

/** Imagen OpenGraph por defecto (WhatsApp, LinkedIn, X). */
export default async function OpenGraphImage() {
  const [s, logo] = await Promise.all([getSettings(), loadLogo()]);
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
          {logo ? (
            <img src={logo as unknown as string} alt="" height={92} style={{ height: 92 }} />
          ) : (
            <div style={{ fontSize: 30, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.company.name}</div>
          )}
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
