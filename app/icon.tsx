import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Favicon / icono de app: trazo de casa en cobre sobre carbón. */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#17191d" }}>
        <svg viewBox="0 0 40 40" width="360" height="360" fill="none">
          <path d="M6 22 20 8l14 14" stroke="#d3620f" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 20v12h8v-8h4v8h8V20" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  );
}
