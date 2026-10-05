import { ImageResponse } from "next/og";

import { POST_SLUGS, getCategory, getPost } from "@/content/insights";
import { site } from "@/lib/site";
import { formatDate, truncate } from "@/lib/utils";

export const alt = `Insights · ${site.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return POST_SLUGS.map((slug) => ({ slug }));
}

function titleFontSize(title: string) {
  if (title.length <= 60) return 64;
  if (title.length <= 90) return 52;
  return 44;
}

/** Imagen OpenGraph por artículo: mismo lenguaje visual que la imagen global del sitio. */
export default async function InsightOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  const title = post?.title ?? "Insights sobre operaciones, P&L y EBITDA en empresas multicentro";
  const excerpt = truncate(
    post?.excerpt ??
      "Artículos para CEOs, COOs, CFOs e inversores de redes de centros: P&L por centro, ranking, EBITDA e integraciones.",
    140,
  );
  const categoryLabel = post ? (getCategory(post.category)?.label ?? post.category) : "Insights";
  const footer = post
    ? `Insights · ${post.readingMinutes} min de lectura · ${formatDate(post.publishedAt, { month: "long" })}`
    : "Insights · Artículos para dirigir redes de centros con datos";

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

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#5eead4",
            }}
          >
            {categoryLabel}
          </div>
          <div
            style={{
              fontSize: titleFontSize(title),
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 26, lineHeight: 1.35, opacity: 0.85, maxWidth: 980 }}>{excerpt}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, opacity: 0.8 }}>
          <div>{footer}</div>
          <div>{site.url.replace(/^https?:\/\//, "")}</div>
        </div>
      </div>
    ),
    size,
  );
}
