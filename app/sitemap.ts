import type { MetadataRoute } from "next";

import { buildSitemap } from "@/lib/sitemap";

export const revalidate = 300;

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap();
}
