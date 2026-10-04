import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} · ${site.brand}`,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0a1a33",
    lang: "es",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
