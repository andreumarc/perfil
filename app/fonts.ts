import localFont from "next/font/local";

/**
 * Fuentes servidas localmente (sin peticiones a terceros, compatible con RGPD
 * y con builds sin red). Inter para cuerpo/UI, Manrope para titulares.
 */
export const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
  preload: true,
});

export const manrope = localFont({
  src: "./fonts/manrope-latin-wght-normal.woff2",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
  preload: true,
});
