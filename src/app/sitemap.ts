import type { MetadataRoute } from "next";
import path from "path";
import fs from "fs/promises";
import { LandingSchema } from "@/lib/schemas/landing";
import { siteUrl } from "@/lib/site-url";

const locales = ["en", "ru", "uk", "ro"] as const;

type SitemapEntry = MetadataRoute.Sitemap[number];

// lastModified берём по mtime файла страницы, а не `new Date()`: иначе все статические
// записи «меняются» при каждом ребилде — ложный сигнал свежести (SEO-аудит S10).
// Лендинги уже используют mtime — приводим статику к тому же принципу.
async function pageLastModified(routePath: string): Promise<Date | undefined> {
  const file = path.join(process.cwd(), "src/app/[locale]", routePath, "page.tsx");
  try {
    return (await fs.stat(file)).mtime;
  } catch {
    return undefined; // лучше без даты, чем с ложной
  }
}

async function localizedEntries(
  routePath: string,
  priority: number,
  changeFrequency: SitemapEntry["changeFrequency"]
): Promise<SitemapEntry[]> {
  const lastModified = await pageLastModified(routePath);
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}${routePath}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${siteUrl}/${l}${routePath}`])
      ),
    },
  }));
}

// Лендинги /[locale]/lp/[slug] — основной рекламный/SEO-инвентарь (>130 страниц).
// Источник истины тот же, что у lp/[slug]/page.tsx: JSON-файлы в content/landings.
// Для каждого существующего (locale, slug) — одна запись с hreflang-альтернативами,
// указывающими ТОЛЬКО на локали, где этот slug реально есть. Невалидный/битый JSON
// пропускаем, чтобы карта не рекламировала страницу, которая отрендерится как 404
// (loadLanding в роуте возвращает null → notFound). lastModified — по mtime файла.
async function landingEntries(): Promise<SitemapEntry[]> {
  const bySlug = new Map<string, { locales: string[]; lastModified: Date }>();

  for (const locale of locales) {
    const dir = path.join(process.cwd(), "src/content/landings", locale);
    let files: string[];
    try {
      files = await fs.readdir(dir);
    } catch {
      continue; // у локали ещё нет папки лендингов
    }

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const full = path.join(dir, file);
      const raw = await fs.readFile(full, "utf-8");
      // Тот же контракт, что и в lp/[slug]/page.tsx: битый контент роняет сборку
      // (ТЗ §13.1), а не выпадает молча из карты. .parse() бросит при ошибке.
      LandingSchema.parse(JSON.parse(raw));
      const slug = file.replace(/\.json$/, "");
      const { mtime } = await fs.stat(full);
      const entry = bySlug.get(slug);
      if (entry) {
        entry.locales.push(locale);
        if (mtime > entry.lastModified) entry.lastModified = mtime;
      } else {
        bySlug.set(slug, { locales: [locale], lastModified: mtime });
      }
    }
  }

  const entries: SitemapEntry[] = [];
  for (const [slug, { locales: slugLocales, lastModified }] of bySlug) {
    const languages = Object.fromEntries(
      slugLocales.map((l) => [l, `${siteUrl}/${l}/lp/${slug}`])
    );
    for (const locale of slugLocales) {
      entries.push({
        url: `${siteUrl}/${locale}/lp/${slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages },
      });
    }
  }
  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // В sitemap включаем ТОЛЬКО индексируемые страницы с реальным контентом.
  // Исключены сознательно:
  //   /kids, /quiz, /app, /demo — заглушки/placeholder (noindex до Sprint 2);
  //   /privacy, /cookie-policy, /terms — noindex (интерим до Sprint 4).
  // Подача noindex/тонких URL в карту = конфликт сигналов и трата crawl-бюджета.
  const [home, parents, about, faq, landings] = await Promise.all([
    localizedEntries("", 1.0, "weekly"), // Главная
    localizedEntries("/parents", 0.9, "weekly"), // Лендинг для родителей
    localizedEntries("/about", 0.6, "monthly"), // Информационные
    localizedEntries("/faq", 0.6, "monthly"),
    landingEntries(), // основной рекламный/SEO-инвентарь
  ]);
  return [...home, ...parents, ...about, ...faq, ...landings];
}
