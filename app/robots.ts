import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo";

export const revalidate = 3600;

const DISALLOW = ["/admin", "/admin/", "/api/"];

/**
 * Rastreadores de buscadores y asistentes con IA a los que se permite leer la web
 * (ChatGPT, Claude, Perplexity, Google AI, Bing/Copilot, Apple, Common Crawl).
 * Se listan de forma explícita para que ningún bloqueo por defecto los deje fuera.
 */
const AI_AGENTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "anthropic-ai", "PerplexityBot", "Perplexity-User", "Google-Extended", "Googlebot", "Bingbot", "Applebot", "Applebot-Extended", "CCBot", "DuckAssistBot", "Amazonbot", "meta-externalagent", "YouBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: DISALLOW }, ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOW }))],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
