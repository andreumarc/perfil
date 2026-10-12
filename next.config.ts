import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * Content Security Policy.
 * Solo se permiten los terceros que la web puede llegar a usar y siempre tras
 * consentimiento: Google Tag Manager / GA4, Meta Pixel, Cloudflare Turnstile
 * (CAPTCHA opcional) y Vercel Analytics. Todo lo demás queda bloqueado.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"} https://www.googletagmanager.com https://*.google-analytics.com https://connect.facebook.net https://challenges.cloudflare.com https://va.vercel-scripts.com https://vercel.live`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://stats.g.doubleclick.net https://www.facebook.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://vercel.live",
  "frame-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com",
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
  // argon2 es un binario nativo: no debe empaquetarse con el bundle del servidor.
  serverExternalPackages: ["@node-rs/argon2"],
  experimental: {
    serverActions: {
      // Adjuntos del formulario de presupuesto (límite real de Vercel: 4,5 MB por petición).
      bodySizeLimit: "4.5mb",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
