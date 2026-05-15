import { getTranslations } from "next-intl/server";
import { EnrollButton } from "@/components/forms/EnrollButton";
import { DemoButton } from "@/components/ui/DemoButton";

type Props = { locale: string };

export async function Hero({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "hero" });
  const tForm = await getTranslations({ locale, namespace: "enroll_form" });
  const tBar = await getTranslations({ locale, namespace: "sticky_bar" });

  return (
    <section
      aria-labelledby="hero-heading"
      className="section-hero relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-surface"
    >
      {/* Gradient blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-900/20" />
        <div className="absolute -right-32 top-1/3 h-64 w-64 rounded-full bg-accent-200/40 blur-3xl dark:bg-accent-900/15" />
        <div className="absolute -left-32 bottom-1/4 h-64 w-64 rounded-full bg-brand-200/30 blur-3xl dark:bg-brand-900/15" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        {/* H1 with gradient */}
        <h1
          id="hero-heading"
          className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-[4.5rem]"
        >
          <span className="bg-gradient-to-br from-brand-600 via-brand-700 to-accent-500 bg-clip-text text-transparent dark:from-brand-400 dark:via-brand-300 dark:to-accent-400">
            {t("title")}
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-content-muted sm:text-xl">
          {t("subtitle")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <EnrollButton label={tForm("enroll_cta")} size="lg" />
          <DemoButton locale={locale} label={tBar("cta")} size="lg" />
        </div>

        {/* Inline stats */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-content-subtle">
          <span className="flex items-center gap-1.5">
            <span className="font-bold text-accent-500">13</span> {t("stat_skills")}
          </span>
          <span className="h-1 w-1 rounded-full bg-line" aria-hidden="true" />
          <span className="flex items-center gap-1.5">
            <span className="font-bold text-brand-600 dark:text-brand-400">40</span> {t("stat_episodes")}
          </span>
          <span className="h-1 w-1 rounded-full bg-line" aria-hidden="true" />
          <span className="flex items-center gap-1.5">
            <span className="font-bold text-accent-500">3</span> {t("stat_months")}
          </span>
        </div>
      </div>

      {/* Hero visual */}
      <div className="relative z-10 mx-auto mt-16 w-full max-w-3xl">
        <figure className="overflow-hidden rounded-2xl ring-1 ring-line shadow-xl shadow-zinc-200/60 dark:shadow-none">
          <div
            aria-label={t("media_alt")}
            role="img"
            className="aspect-video bg-gradient-to-br from-brand-50 via-brand-100/30 to-accent-50 dark:from-zinc-900 dark:via-brand-950/30 dark:to-zinc-900"
          >
            <div className="relative h-full w-full overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 px-4 pb-0">
                {[40, 70, 55, 90, 60, 80, 45, 75, 50, 85, 65, 50, 72, 48].map((h, i) => (
                  <div
                    key={i}
                    aria-hidden="true"
                    className="w-full flex-1 rounded-t bg-brand-200/60 dark:bg-surface/80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-50 to-transparent dark:from-zinc-950" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-500/70 dark:text-brand-400/60">
                  City of Broken Words
                </p>
                <p className="mt-2 text-xs text-content-subtle">
                  Hero video · Coming in Sprint 2
                </p>
              </div>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
