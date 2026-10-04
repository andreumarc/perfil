import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Favicon / icono de app generado: monograma sobre navy. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a1a33",
          color: "#ffffff",
          fontSize: 230,
          fontWeight: 600,
          letterSpacing: "-0.04em",
          fontFamily: "sans-serif",
        }}
      >
        MA
      </div>
    ),
    size,
  );
}
