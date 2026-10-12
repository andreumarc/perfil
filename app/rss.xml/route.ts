import { getArticles, getCategories } from "@/lib/cms/articles";
import { getSettings } from "@/lib/cms/settings";
import { absoluteUrl, siteUrl } from "@/lib/seo";

export const revalidate = 300;

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c] ?? c);
}

export async function GET() {
  const [settings, articles, categories] = await Promise.all([getSettings(), getArticles(), getCategories()]);
  const items = articles
    .map((a) => {
      const date = a.publishedAt ?? a.reviewedAt;
      const category = categories.find((c) => c.slug === a.categorySlug)?.name;
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${absoluteUrl(`/blog/${a.slug}`)}</link>
      <guid isPermaLink="true">${absoluteUrl(`/blog/${a.slug}`)}</guid>
      <description>${escapeXml(a.excerpt)}</description>
      ${category ? `<category>${escapeXml(category)}</category>` : ""}
      ${date ? `<pubDate>${new Date(date).toUTCString()}</pubDate>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${settings.company.name} · Blog`)}</title>
    <link>${absoluteUrl("/blog")}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(settings.seo.defaultDescription)}</description>
    <language>es-ES</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=300, s-maxage=300" } });
}
