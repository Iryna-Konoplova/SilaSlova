import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { EnrollButton } from "@/components/forms/EnrollButton";
import { DemoPlayButton } from "@/components/demo/DemoPlayButton";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "demoPage" });
  // /demo — тонкий «шлюз» к внешней демо-игре (Play ведёт на другой домен), а не
  // самостоятельный контент. Органической SEO-ценности почти нет, поэтому держим
  // вне индекса и sitemap намеренно (решение 2026-07, не легаси «coming soon»).
  return { title: t("page_title"), robots: { index: false } };
}

export default async function DemoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "demoPage" });

  return (
    <main className="flex min-h-screen flex-col">
      {/* ── HERO: фото на весь экран + Play + подпись эпизода ── */}
      {/* Полный экран под меню (mt = высота шапки). Только фон + Play + подпись. */}
      <section className="relative mt-[4.5rem] flex min-h-[45vh] flex-col items-center justify-center overflow-hidden bg-brand-950 px-4 md:min-h-[60vh]">
        {/* Фон cover; object-position center 30% — кадр смещён к верху, «HELP!» не режется сверху */}
        <Image
          src="/images/demo-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_30%]"
        />

        {/* Лёгкое затемнение ~25% — чтобы картинка не терялась, но Play/подпись читались */}
        <div aria-hidden="true" className="absolute inset-0 bg-brand-950/25" />

        <div className="absolute inset-x-0 top-[calc(67%_-_65px)] z-10 flex flex-col items-center gap-8 [text-shadow:0_2px_10px_rgba(0,0,0,0.6)] md:gap-[50px]">
          {/* Play button → external demo game (with anonymous_id + UTM) */}
          <DemoPlayButton />

          {/* Episode label */}
          <p className="whitespace-nowrap rounded bg-brand-950/55 px-4 py-1 text-base font-medium uppercase tracking-wide text-white backdrop-blur-sm sm:tracking-widest">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* ── Тёмная секция: заголовок + описание + CTA (фон как у сайта) ── */}
      <section className="relative flex flex-col items-center overflow-hidden bg-surface px-5 py-[60px] text-center">
        {/* Subtle grid pattern — uses ds-line token so it adapts to both themes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-50"
          style={{
            backgroundImage: `linear-gradient(var(--ds-line) 1px,transparent 1px),linear-gradient(90deg,var(--ds-line) 1px,transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial gradient — subtle in light, stronger in dark */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(109,40,217,0.06),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(109,40,217,0.18),transparent)]"
        />

        <div className="relative z-10 flex max-w-lg flex-col items-center gap-6">
          {/* Headline */}
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-content sm:text-4xl">
            {t("title")}
          </h1>

          {/* Body */}
          <p className="text-base leading-relaxed text-content-muted">{t("body")}</p>

          {/* CTA */}
          <div className="pt-2">
            <EnrollButton label={t("cta_enroll")} size="lg" />
          </div>
        </div>
      </section>
    </main>
  );
}
