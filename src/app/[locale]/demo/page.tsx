import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { EnrollButton } from "@/components/forms/EnrollButton";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "demoPage" });
  return { title: t("page_title") };
}

export default async function DemoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "demoPage" });

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-surface px-4 pb-16 pt-24">
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

      <div className="relative z-10 flex max-w-lg flex-col items-center gap-6 text-center">
        {/* Headline */}
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-content sm:text-4xl">
          {t("title")}
        </h1>

        {/* Play button */}
        <button
          type="button"
          aria-label={t("coming_soon")}
          title={t("coming_soon")}
          className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 text-white shadow-brand transition-all duration-300 hover:scale-105 hover:bg-brand-700 hover:shadow-[0_0_32px_rgba(124,58,237,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>

        {/* Episode label */}
        <p className="text-sm font-medium uppercase tracking-widest text-brand-700/60 dark:text-brand-400/60">
          {t("subtitle")}
        </p>

        {/* Divider */}
        <div className="h-px w-16 bg-line" aria-hidden="true" />

        {/* Body */}
        <p className="text-base leading-relaxed text-content-muted">{t("body")}</p>

        {/* CTA */}
        <div className="pt-2">
          <EnrollButton label={t("cta_enroll")} size="lg" />
        </div>
      </div>
    </main>
  );
}
