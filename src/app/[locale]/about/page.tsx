import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildMetadata } from "../metadata";
import { FadeIn } from "@/components/ui/FadeIn";
import { EnrollButton } from "@/components/forms/EnrollButton";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return buildMetadata({
    locale,
    path: "/about",
    title: t("page_title"),
    description: t("page_description"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "about" });
  const tForm = await getTranslations({ locale, namespace: "enroll_form" });

  const badges = [
    { value: t("badge_1_value"), label: t("badge_1_label") },
    { value: t("badge_2_value"), label: t("badge_2_label") },
    { value: t("badge_3_value"), label: t("badge_3_label") },
    { value: t("badge_4_value"), label: t("badge_4_label") },
  ];

  const methods = [
    { title: t("method_1_title"), body: t("method_1_body") },
    { title: t("method_2_title"), body: t("method_2_body") },
    { title: t("method_3_title"), body: t("method_3_body") },
  ];

  return (
    <main id="main-content">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-surface px-4 pb-20 pt-28 sm:px-6 sm:pb-28 sm:pt-36">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-brand-300/15 blur-[120px] dark:bg-brand-600/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 right-0 h-[400px] w-[400px] rounded-full bg-accent-200/20 blur-[100px] dark:bg-accent-500/8" />

        <div className="relative mx-auto max-w-5xl">
          <FadeIn>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-8 bg-line" aria-hidden="true" />
              <span className="section-label">
                {t("hero_label")}
              </span>
            </div>
            <h1 className="mb-16 text-4xl font-extrabold tracking-tight text-content sm:text-5xl md:text-6xl">
              {t("hero_title")}
            </h1>
          </FadeIn>

          {/* Founder card */}
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left — avatar + badges */}
            <FadeIn direction="left">
              <div className="flex flex-col gap-8">
                {/* Avatar */}
                <div className="relative">
                  <div className="relative h-64 w-64 overflow-hidden rounded-2xl ring-1 ring-line dark:ring-white/10 sm:h-72 sm:w-72">
                    <Image
                      src="/images/Novosolov.webp"
                      alt={t("founder_name")}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 256px, 288px"
                      priority
                    />
                  </div>
                  {/* Name tag */}
                  <div className="absolute -bottom-4 -right-4 rounded-xl bg-surface-raised px-5 py-3 shadow-card ring-1 ring-line dark:ring-0">
                    <p className="text-sm font-bold text-content">{t("founder_name")}</p>
                    <p className="text-xs text-content-muted">{t("founder_role")}</p>
                  </div>
                </div>

                {/* Badges grid */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  {badges.map(({ value, label }) => (
                    <div key={label} className="rounded-xl bg-surface-raised px-4 py-3 ring-1 ring-line dark:ring-0">
                      <p className="text-2xl font-extrabold tabular-nums text-content">{value}</p>
                      <p className="text-xs font-medium uppercase tracking-wider text-content-muted">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Right — bio + quote */}
            <FadeIn direction="right">
              <div className="flex flex-col gap-6">
                <p className="text-base leading-relaxed text-content">{t("founder_bio_1")}</p>
                <p className="text-base leading-relaxed text-content-muted">{t("founder_bio_2")}</p>
                <p className="text-base leading-relaxed text-content-muted">{t("founder_bio_3")}</p>

                {/* Quote */}
                <blockquote className="relative mt-2 rounded-2xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-500/30 dark:bg-brand-600/5">
                  <p className="text-lg font-semibold italic leading-relaxed text-content">
                    {t("hero_quote")}
                  </p>
                  <footer className="mt-3 text-sm text-content-muted">— {t("hero_quote_author")}</footer>
                </blockquote>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section
        aria-labelledby="mission-heading"
        className="section bg-surface-raised"
      >
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <div className="mb-6 inline-flex items-center gap-3">
              <div className="h-px w-8 bg-line" aria-hidden="true" />
              <span className="section-label">
                {t("mission_label")}
              </span>
              <div className="h-px w-8 bg-line" aria-hidden="true" />
            </div>
            <h2
              id="mission-heading"
              className="mb-8 text-3xl font-extrabold tracking-tight text-content sm:text-4xl"
            >
              {t("mission_title")}
            </h2>
            <p className="text-lg leading-relaxed text-content-muted">{t("mission_body")}</p>
          </FadeIn>
        </div>
      </section>

      {/* ── Methodology ── */}
      <section
        aria-labelledby="method-heading"
        className="section bg-surface"
      >
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-8 bg-line" aria-hidden="true" />
              <span className="section-label">
                {t("method_label")}
              </span>
            </div>
            <h2
              id="method-heading"
              className="mb-14 text-3xl font-extrabold tracking-tight text-content sm:text-4xl"
            >
              {t("method_title")}
            </h2>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-3">
            {methods.map(({ title, body }, i) => (
              <FadeIn key={title} delay={i * 0.1}>
                <div className="card-interactive rounded-2xl border border-line bg-surface-raised p-7">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100 dark:bg-accent-500/15">
                    <span className="text-lg font-extrabold text-accent-500 dark:text-accent-400">0{i + 1}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-content">{title}</h3>
                  <p className="text-sm leading-relaxed text-content-muted">{body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Soroban background ── */}
      <section
        aria-labelledby="soroban-heading"
        className="section bg-surface-raised"
      >
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-8 bg-line" aria-hidden="true" />
              <span className="section-label">
                {t("soroban_label")}
              </span>
            </div>
            <h2
              id="soroban-heading"
              className="mb-8 text-3xl font-extrabold tracking-tight text-content sm:text-4xl"
            >
              {t("soroban_title")}
            </h2>
            <p className="mb-10 text-lg leading-relaxed text-content-muted">{t("soroban_body")}</p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6">
              {[
                { value: "10+", label: t("badge_1_label") },
                { value: "10 000+", label: t("badge_2_label") },
                { value: t("badge_3_value"), label: t("badge_3_label") },
              ].map(({ value, label }) => (
                <div key={label} className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-content">{value}</span>
                  <span className="text-sm text-content-muted">{label}</span>
                </div>
              ))}
            </div>

            {/* Link to Soroban */}
            <div className="mt-8">
              <a
                href="https://soroban.ua"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent text-base"
              >
                {t("soroban_link")}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 12L12 2M12 2H6M12 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section relative overflow-hidden bg-surface">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-brand-200/30 blur-3xl dark:bg-brand-600/15" />
          <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-accent-200/20 blur-3xl dark:bg-accent-500/10" />
        </div>
        <div className="relative mx-auto max-w-2xl text-center">
          <FadeIn>
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-content sm:text-4xl">
              {t("cta_title")}
            </h2>
            <p className="mb-8 text-lg text-content-muted">{t("cta_body")}</p>
            <EnrollButton label={tForm("enroll_cta")} size="lg" />
          </FadeIn>
        </div>
      </section>

    </main>
  );
}
