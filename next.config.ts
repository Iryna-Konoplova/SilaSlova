import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n.ts");

const nextConfig: NextConfig = {
  images: {
    // AVIF в приоритете, WebP как фолбэк (spec §17). next/image отдаёт самый
    // лёгкий формат, который поддерживает браузер.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
};

export default withNextIntl(nextConfig);
