# Производительность: диагноз (CONCEPT)

Документ фиксирует *что не так и почему*. План действий — в `PERF_PLAN.md`.
Целевые метрики — `docs/SPECIFICATION.md` §17:

| Метрика | Цель |
|---|---|
| LCP (mobile, 4G) | ≤ 1.5s |
| INP | ≤ 200ms |
| CLS | ≤ 0.05 |
| JS bundle лендинга | ≤ 80 KB gz |
| JS bundle демо | ≤ 200 KB gz |
| Меры | SSG лендингов/квиза · ISR главной · dynamic-import демо · hero-video ≤1MB · шрифты self-host max 2 файла + swap · next/image AVIF/WebP |

---

## 1. 🔴 Нет статической генерации (корневая проблема)

`npx next build` помечает **все** маршруты приложения как `ƒ (Dynamic) — server-rendered on demand`. Ни одной `○ (Static)`.

```
ƒ /[locale]            ← по §17 должна быть ISR
ƒ /[locale]/lp/[slug]  ← по §17 должна быть SSG
ƒ /[locale]/quiz       ← по §17 должна быть SSG
```

**Причина (подтверждена в исходниках):** `src/app/layout.tsx` (корневой layout, вне сегмента `[locale]`) вызывает `await getLocale()`. Реализация next-intl `getLocaleFromHeaderImpl` читает `headers()`; при отсутствии установленного `setRequestLocale` это динамический источник, и next-intl сам документирует: *«Usage of next-intl APIs in Server Components currently opts into dynamic rendering… use the `setRequestLocale` API to enable static rendering»*. Корневой layout оборачивает всё дерево → весь App уходит в dynamic. `revalidate = 3600` на главной и `generateStaticParams` на лендингах при этом обесцениваются.

**Санкционированный паттерн** (гайд Next 16 `internationalization.md`): `<html lang={(await params).lang}>` рендерится в `app/[locale]/layout.tsx` с `generateStaticParams`, корневой `getLocale()` не используется.

**Последствие на каждый запрос лендинга:** middleware → Node-SSR → загрузка словаря → `fs.readFile` + `JSON.parse` + Zod-парсинг контента (`loadLanding`). Бьёт по TTFB/LCP. Это узел №1 — он разблокирует остальное.

## 2. 🟠 framer-motion в бандле лендинга (бюджет ≤ 80 KB gz)

В клиентский бандл лендинга `framer-motion` (~40–50 KB gz) тянется тремя путями: `FadeIn` (в `LandingHero`), `LandingFAQ`, `EnrollModal`. Плюс через форму — `react-hook-form` + `zod` + `@hookform/resolvers` + `@react-input/mask` + `zustand`. Бюджет 80 KB почти наверняка превышен (точные цифры Turbopack-сборка Next 16 в таблице не печатает — нужно отдельное измерение).

## 3. 🟠 EnrollModal монтируется дважды на лендингах

`<EnrollModal />` рендерится и в `src/app/[locale]/layout.tsx`, и в `src/app/[locale]/lp/[slug]/page.tsx`. На лендинге — два экземпляра: двойной mount framer+формы, дублирующиеся слушатели `keydown`/scroll-lock.

## 4. 🟡 Весь словарь сообщений уходит в клиент на каждой странице

`[locale]/layout` отдаёт в `NextIntlClientProvider` **все** сообщения локали (ru = 36 KB, uk = 32 KB JSON). Они сериализуются в пейлоад каждой страницы и парсятся при гидратации. Клиентским компонентам нужны лишь пара неймспейсов (`enroll_form`, UI FAQ, switcher).

## 5. 🟡 Meta Pixel грузится до согласия

В `AnalyticsProvider` IIFE-лоадер Meta инжектит `fbevents.js` сразу (`afterInteractive`), **до** consent — нарушает правило CLAUDE.md «пиксели не грузятся до согласия» + лишний сторонний JS на каждой странице. GA4 идёт через consent-mode `denied` (приемлемо); TikTok-лоадер грузит скрипт только после согласия (ок).

## 6. 🟡 next/image без AVIF

`next.config.ts` задаёт только `qualities`, без `formats` → по умолчанию только WebP. §17 требует «AVIF/WebP».

## 7. 🟢 Локальное

- **Geist_Mono** объявлен в layout, но не используется ни в одном классе/CSS — мёртвый шрифт.
- **Geist `subsets: ['latin']`** — аудитория ru/uk (кириллица) + ro (latin-ext). Кириллицы в загруженном шрифте нет → для ru/uk webfont фактически не работает (fallback), при этом грузится.
- **Тяжёлые исходники картинок** — `no-friend.jpg` 364 KB, ряд лендинговых 80–130 KB.
- **demo/quiz не реализованы** (`/quiz` → `<main>Quiz</main>`, `/demo` — заглушка). Правило §17 «демо-движок через `dynamic()`, ≤ 200 KB» пока неприменимо, но должно быть заложено при реализации.
