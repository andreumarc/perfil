import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen OpenGraph por defecto (LinkedIn, Twitter, WhatsApp). */
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
          padding: 72,
          background: "linear-gradient(135deg, #0a1a33 0%, #10264a 60%, #163463 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              color: "#0a1a33",
              fontSize: 28,
              fontWeight: 700,
              borderRadius: 6,
            }}
          >
            MA
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 600 }}>{site.name}</div>
            <div style={{ fontSize: 18, letterSpacing: 4, textTransform: "uppercase", opacity: 0.75 }}>
              {site.brand}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.02em", maxWidth: 1000 }}>
            {site.tagline}
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.35, opacity: 0.85, maxWidth: 980 }}>
            Rentabilidad, estandarización e integración de redes de centros. Healthcare · Retail ·
            Servicios · Private Equity.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, opacity: 0.8 }}>
          <div>Diagnóstico Multisite gratuito · 3 minutos</div>
          <div>{site.url.replace(/^https?:\/\//, "")}</div>
        </div>
      </div>
    ),
    size,
  );
}
