import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sila-slova.vercel.app";
const locales = ["en", "ru", "uk", "ro"] as const;

type SitemapEntry = MetadataRoute.Sitemap[number];

function localizedEntries(
  path: string,
  priority: number,
  changeFrequency: SitemapEntry["changeFrequency"]
): SitemapEntry[] {
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${siteUrl}/${l}${path}`])
      ),
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Главная
    ...localizedEntries("", 1.0, "weekly"),

    // Лендинги для родителей и детей
    ...localizedEntries("/parents", 0.9, "weekly"),
    ...localizedEntries("/kids", 0.9, "weekly"),

    // Конверсионные страницы
    ...localizedEntries("/demo", 0.9, "weekly"),
    ...localizedEntries("/quiz", 0.8, "weekly"),
    ...localizedEntries("/app", 0.8, "monthly"),

    // Информационные
    ...localizedEntries("/about", 0.6, "monthly"),
    ...localizedEntries("/faq", 0.6, "monthly"),

    // Юридические (низкий приоритет)
    ...localizedEntries("/privacy", 0.3, "yearly"),
    ...localizedEntries("/terms", 0.3, "yearly"),
    ...localizedEntries("/cookie-policy", 0.3, "yearly"),
  ];
}
