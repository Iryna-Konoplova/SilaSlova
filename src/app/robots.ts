import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sila-slova.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/en/sign-up", "/ru/sign-up", "/uk/sign-up"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
