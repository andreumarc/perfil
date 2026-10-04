import localFont from "next/font/local";

/**
 * Fuentes servidas localmente (sin peticiones a terceros, compatible con RGPD
 * y con builds sin red). Inter para UI/cuerpo, Source Serif 4 para titulares.
 */
export const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
  preload: true,
});

export const sourceSerif = localFont({
  src: [
    {
      path: "./fonts/source-serif-4-latin-wght-normal.woff2",
      weight: "200 900",
      style: "normal",
    },
    {
      path: "./fonts/source-serif-4-latin-wght-italic.woff2",
      weight: "200 900",
      style: "italic",
    },
  ],
  variable: "--font-serif",
  display: "swap",
  preload: true,
});
