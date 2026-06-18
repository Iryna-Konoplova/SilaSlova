/**
 * Build-time content gate — ТЗ §13.1 / CLAUDE.md: "build must fail on invalid content".
 *
 * Валидирует ВСЕ JSON-лендинги в src/content/landings/{locale}/*.json по той же
 * Zod-схеме, что использует рантайм (LandingSchema). При любой ошибке (битый JSON,
 * не проходит схему, slug/locale в файле не совпадают с путём) печатает список
 * проблем и выходит с кодом 1 — чтобы `npm run build` (через prebuild) упал ДО
 * деплоя, а не отдавал молчаливый 404 на замороженный рекламный URL.
 *
 * Запуск: `npm run validate:content` (а также автоматически перед `npm run build`).
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { LandingSchema } from "../src/lib/schemas/landing";

const LOCALES = ["en", "ru", "uk", "ro"] as const;
const LANDINGS_DIR = path.join(process.cwd(), "src", "content", "landings");

type Problem = { file: string; message: string };

async function validateLandings(): Promise<{ checked: number; problems: Problem[] }> {
  const problems: Problem[] = [];
  let checked = 0;

  for (const locale of LOCALES) {
    const dir = path.join(LANDINGS_DIR, locale);
    let files: string[];
    try {
      files = await fs.readdir(dir);
    } catch {
      // Папки локали ещё нет — это не ошибка контента, просто пропускаем.
      continue;
    }

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      checked++;
      const rel = path.join("src/content/landings", locale, file);
      const full = path.join(dir, file);
      const slug = file.replace(/\.json$/, "");

      let parsed: unknown;
      try {
        parsed = JSON.parse(await fs.readFile(full, "utf-8"));
      } catch (err) {
        problems.push({ file: rel, message: `битый JSON: ${(err as Error).message}` });
        continue;
      }

      const result = LandingSchema.safeParse(parsed);
      if (!result.success) {
        for (const issue of result.error.issues) {
          const at = issue.path.length ? issue.path.join(".") : "(root)";
          problems.push({ file: rel, message: `${at} — ${issue.message}` });
        }
        continue;
      }

      // Контент валиден по схеме — дополнительно сверяем, что slug/locale внутри
      // файла совпадают с путём (рассинхрон ломает canonical/hreflang и аналитику).
      if (result.data.slug !== slug) {
        problems.push({
          file: rel,
          message: `slug "${result.data.slug}" не совпадает с именем файла "${slug}"`,
        });
      }
      if (result.data.locale !== locale) {
        problems.push({
          file: rel,
          message: `locale "${result.data.locale}" не совпадает с папкой "${locale}"`,
        });
      }
    }
  }

  return { checked, problems };
}

async function main() {
  const { checked, problems } = await validateLandings();

  if (problems.length > 0) {
    console.error(`\n✗ Невалидный контент лендингов (${problems.length} проблем):\n`);
    for (const p of problems) {
      console.error(`  ${p.file}\n    └─ ${p.message}`);
    }
    console.error(
      `\nСборка остановлена. Исправьте контент — рекламные URL не должны отдавать 404.\n`
    );
    process.exit(1);
  }

  console.log(`✓ Контент лендингов валиден: проверено ${checked} файлов.`);
}

main().catch((err) => {
  console.error("validate-content: непредвиденная ошибка", err);
  process.exit(1);
});
