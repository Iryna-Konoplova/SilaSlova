import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";
import { EnrollForm } from "@/components/forms/EnrollForm";

type Props = { locale: string };

export async function FinalCta({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "final_cta" });

  return (
    <section
      aria-labelledby="final-cta-heading"
      className="section relative overflow-hidden bg-surface"
    >
      {/* Background glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-300/20 blur-3xl dark:bg-brand-600/15" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent-200/20 blur-3xl dark:bg-accent-500/10" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left — text */}
          <FadeIn direction="left">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-8 bg-line" aria-hidden="true" />
                <span className="section-label">{t("label")}</span>
              </div>
              <h2
                id="final-cta-heading"
                className="mb-8 text-3xl font-extrabold tracking-tight text-content sm:text-4xl md:text-5xl"
              >
                {t("cta")}
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-content-muted">{t("body")}</p>

              {/* Trust signals */}
              <ul className="mb-8 space-y-2.5">
                {(["trust_1", "trust_2", "trust_3"] as const).map((key) => (
                  <li key={key} className="flex items-center gap-2.5 text-sm text-content-muted">
                    <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-50 dark:bg-accent-500/10">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L3.5 7L8.5 2.5" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {t(key)}
                  </li>
                ))}
              </ul>

              {/* Demo CTA */}
              <Link
                href={`/${locale}/demo`}
                className="mb-6 inline-flex h-12 items-center gap-2 rounded-full bg-brand-600 px-7 text-sm font-semibold text-white shadow-brand transition-all hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                ▶ {t("cta")}
              </Link>

              {/* Store buttons */}
              <div className="flex flex-wrap gap-3">
                <div className="overflow-hidden rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 p-px">
                  <div className="flex h-11 items-center gap-2.5 rounded-[11px] bg-surface-raised px-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="shrink-0 fill-content">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <span className="text-sm font-semibold text-content">App Store</span>
                  </div>
                </div>
                <div className="overflow-hidden rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 p-px">
                  <div className="flex h-11 items-center gap-2.5 rounded-[11px] bg-surface-raised px-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="shrink-0 fill-content">
                      <path d="M3.18 23.76c.33.18.7.22 1.06.1l.06-.04 11.9-6.87-2.59-2.59-10.43 9.4zM.49 1.57C.18 1.96 0 2.54 0 3.28v17.44c0 .74.18 1.32.49 1.71l.09.08 9.76-9.76v-.22L.58 1.49l-.09.08zM20.13 10.3l-2.55-1.47-2.9 2.9 2.9 2.9 2.57-1.48c.73-.42.73-1.11-.02-1.85zM4.24.14L16.14 7l-2.59 2.59L3.18.23C3.53.1 3.9.14 4.24.32V.14z"/>
                    </svg>
                    <span className="text-sm font-semibold text-content">Google Play</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right — inline form */}
          <FadeIn direction="right">
            <div className="rounded-2xl bg-surface-raised p-6 shadow-modal ring-1 ring-line">
              <div className="mb-5">
                <div className="h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-accent-500" />
              </div>
              <EnrollForm />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
