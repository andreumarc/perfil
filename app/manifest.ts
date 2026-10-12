import type { MetadataRoute } from "next";

import { getSettings } from "@/lib/cms/settings";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSettings();
  return {
    name: `${s.company.name} · ${s.company.tagline}`,
    short_name: s.company.name,
    description: s.seo.defaultDescription,
    start_url: "/",
    display: "browser",
    background_color: "#faf8f5",
    theme_color: "#17191d",
    lang: "es",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
