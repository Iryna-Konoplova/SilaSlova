import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";
import { EnrollButton } from "@/components/forms/EnrollButton";
import { DemoButton } from "@/components/ui/DemoButton";

type Props = { locale: string };

const benefits = ["benefit_1", "benefit_2", "benefit_3"] as const;
const screenshots = ["screenshot_1_alt", "screenshot_2_alt", "screenshot_3_alt"] as const;

export async function AppPromo({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "app_promo" });
  const tForm = await getTranslations({ locale, namespace: "enroll_form" });
  const tBar = await getTranslations({ locale, namespace: "sticky_bar" });

  return (
    <section
      aria-labelledby="app-promo-heading"
      className="section bg-surface-subtle"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.45fr] lg:gap-12">
          {/* Text column */}
          <FadeIn direction="left">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-8 bg-line" aria-hidden="true" />
              <span className="section-label">{t("label")}</span>
            </div>
            <h2
              id="app-promo-heading"
              className="mb-4 text-3xl font-bold tracking-tight text-content sm:text-4xl"
            >
              {t("title")}
            </h2>
            <p className="mb-6 text-lg text-content-muted">{t("subtitle")}</p>

            {/* Benefits */}
            <ul className="mb-8 space-y-2.5">
              {benefits.map((key) => (
                <li key={key} className="flex items-center gap-2.5 text-sm text-content-muted">
                  <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500/15 text-accent-500">✓</span>
                  {t(key)}
                </li>
              ))}
            </ul>

            {/* Store buttons — app not yet live, no navigation */}
            <div className="mb-8 flex flex-wrap gap-3">
              {/* App Store */}
              <button
                type="button"
                aria-label={t("badge_appstore_label")}
                className="gradient-border rounded-xl transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="flex h-11 items-center gap-2.5 rounded-[11px] bg-surface-raised px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="shrink-0 fill-content">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span className="text-sm font-semibold text-content">App Store</span>
                </div>
              </button>

              {/* Google Play */}
              <button
                type="button"
                aria-label={t("badge_google_label")}
                className="gradient-border rounded-xl transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="flex h-11 items-center gap-2.5 rounded-[11px] bg-surface-raised px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="shrink-0 fill-content">
                    <path d="M3.18 23.76c.33.18.7.22 1.06.1l.06-.04 11.9-6.87-2.59-2.59-10.43 9.4zM.49 1.57C.18 1.96 0 2.54 0 3.28v17.44c0 .74.18 1.32.49 1.71l.09.08 9.76-9.76v-.22L.58 1.49l-.09.08zM20.13 10.3l-2.55-1.47-2.9 2.9 2.9 2.9 2.57-1.48c.73-.42.73-1.11-.02-1.85zM4.24.14L16.14 7l-2.59 2.59L3.18.23C3.53.1 3.9.14 4.24.32V.14z"/>
                  </svg>
                  <span className="text-sm font-semibold text-content">Google Play</span>
                </div>
              </button>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <DemoButton locale={locale} label={tBar("cta")} />
              <EnrollButton label={tForm("enroll_cta")} size="md" />
            </div>
          </FadeIn>

          {/* Screenshots column */}
          <FadeIn direction="right">
            <div className="flex gap-3 lg:gap-4" aria-label="App screenshots">
              {screenshots.map((altKey, i) => (
                <div
                  key={altKey}
                  className={[
                    "relative flex-1 overflow-hidden rounded-2xl ring-1 ring-line shadow-sm",
                    "bg-gradient-to-b from-brand-100/60 to-accent-50",
                    "dark:from-brand-950/40 dark:to-surface",
                    i === 1 ? "translate-y-0" : "translate-y-4",
                  ].join(" ")}
                  style={{ aspectRatio: "9/16" }}
                >
                  <Image
                    src={`/images/screenshot-${i + 1}.jpg`}
                    alt={t(altKey)}
                    fill
                    sizes="(max-width: 1024px) 33vw, 220px"
                    quality={90}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
