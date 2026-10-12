import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo";

export const revalidate = 300;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/admin/", "/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
