import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  // /sign-up НЕ закрываем здесь disallow'ом: краулер должен мочь зайти и увидеть
  // <meta robots noindex> на самой странице, иначе остаётся «URL-only» результат
  // (disallow ≠ noindex — SEO-аудит S9). noindex задан в sign-up/page.tsx.
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
