import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * Content Security Policy.
 * Permite únicamente los proveedores de analítica/marketing que la web utiliza
 * (GA4, Meta Pixel, LinkedIn Insight, Vercel Analytics) y la herramienta de
 * reserva de reuniones (Calendly). Todo lo demás queda bloqueado.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"} https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://snap.licdn.com https://va.vercel-scripts.com https://vercel.live https://assets.calendly.com`,
  "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://stats.g.doubleclick.net https://www.facebook.com https://px.ads.linkedin.com https://www.linkedin.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://vercel.live https://calendly.com https://api.calendly.com",
  "frame-src 'self' https://calendly.com https://www.googletagmanager.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/servicios/audit", destination: "/servicios/multisite-performance-audit", permanent: true },
      { source: "/servicios/ebitda", destination: "/servicios/ebitda-improvement", permanent: true },
      { source: "/servicios/integracion", destination: "/servicios/integration-100", permanent: true },
      { source: "/servicios/coo", destination: "/servicios/fractional-coo", permanent: true },
      { source: "/diagnostico-multisite", destination: "/diagnostico", permanent: true },
      { source: "/blog", destination: "/insights", permanent: true },
      { source: "/blog/:slug", destination: "/insights/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
