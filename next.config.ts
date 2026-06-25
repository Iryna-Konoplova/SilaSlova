import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n.ts");

// Security-заголовки (spec §19) — БЕЗ CSP. Эти директивы не управляют загрузкой
// скриптов, поэтому пиксели/аналитику (Meta/TikTok/GA/PostHog) не затрагивают.
// CSP вынесен отдельно (риск сломать пиксели) — добавлять позже / report-only.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // HSTS только в prod (форсирует HTTPS). Локально по http не мешает.
  ...(process.env.NODE_ENV === "production"
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  images: {
    // AVIF в приоритете, WebP как фолбэк (spec §17). next/image отдаёт самый
    // лёгкий формат, который поддерживает браузер.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
