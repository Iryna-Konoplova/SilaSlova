// Единый источник базового URL сайта для всех SEO-сигналов:
// canonical, hreflang, sitemap, robots, OG, JSON-LD (см. SEO-аудит S1).
//
// Почему хелпер, а не `process.env.NEXT_PUBLIC_SITE_URL ?? "..."` по месту:
// раньше фолбэк был размазан по 4 файлам. Если в проде переменную забыть/задать
// с опечаткой, КАЖДЫЙ canonical/hreflang/sitemap-URL молча уходил на фолбэк —
// тихое отравление SEO без единой ошибки сборки. Теперь:
//   • в проде пустая переменная роняет сборку (fail-fast), а не травит SEO молча;
//   • хвостовой слеш нормализуется (иначе получались бы `https://site.com//en`);
//   • dev/тест используют localhost-фолбэк, чтобы локальная отладка не падала.
//     Прод-домен в исходник СПЕЦИАЛЬНО не зашиваем (см. SEO-аудит S1, правило
//     «никаких тихих прод-дефолтов»): боевой URL задаётся только через окружение.

const FALLBACK = "http://localhost:3000";

function resolve(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!raw) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL не задан в продакшене. Задайте боевой домен " +
          "(https, без хвостового слеша) в Vercel → Settings → Environment Variables. " +
          "Без него canonical/hreflang/sitemap/OG уйдут на технический домен — см. SEO-аудит S1.",
      );
    }
    return FALLBACK;
  }

  // Срезаем хвостовые слеши, чтобы `${siteUrl}/${locale}` не давал двойной слеш.
  return raw.replace(/\/+$/, "");
}

export const siteUrl = resolve();
