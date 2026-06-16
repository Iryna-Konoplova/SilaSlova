import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";
import { EnrollButton } from "@/components/forms/EnrollButton";

type Props = { locale: string };

const featureKeys = [
  "feature_1", "feature_2", "feature_3",
  "feature_4", "feature_5", "feature_6",
] as const;

const statKeys = [
  { value: "stat_1_value", label: "stat_1_label" },
  { value: "stat_2_value", label: "stat_2_label" },
  { value: "stat_3_value", label: "stat_3_label" },
  { value: "stat_4_value", label: "stat_4_label" },
] as const;

export async function Pricing({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "pricing" });
  const tForm = await getTranslations({ locale, namespace: "enroll_form" });
  const a = await getTranslations({ locale, namespace: "a11y" });

  return (
    <section
      aria-labelledby="pricing-heading"
      className="section bg-surface-subtle"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section label */}
        <FadeIn>
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-8 bg-line" aria-hidden="true" />
            <span className="section-label">
              {t("label")}
            </span>
          </div>
          <h2
            id="pricing-heading"
            className="mb-12 text-3xl font-extrabold tracking-tight text-content sm:text-4xl"
          >
            {t("title")}
          </h2>
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* ── Pricing card ── */}
          <FadeIn direction="left">
            <div className="relative overflow-hidden rounded-2xl bg-surface-raised p-8 shadow-sm ring-1 ring-line dark:ring-0">
              {/* Corner ribbon */}
              <div
                aria-label={t("first_badge")}
                className="absolute right-0 top-0 h-24 w-24 overflow-hidden rounded-tr-2xl"
              >
                <div className="absolute right-[-28px] top-[20px] w-[110px] rotate-45 bg-accent-500 py-1 text-center text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
                  {t("first_badge")}
                </div>
              </div>

              {/* Free-trial hook (no price shown) */}
              <div className="mb-3">
                <p className="text-3xl font-extrabold leading-tight tracking-tight text-content sm:text-4xl">
                  {t("plan_headline")}
                </p>
                <p className="mt-2 text-base font-semibold text-content-muted">
                  {t("plan_subheadline")}
                </p>
              </div>
              <p className="mb-7 text-xs text-content-subtle">{t("details")}</p>

              {/* Features */}
              <ul className="mb-8 space-y-3" aria-label={a("pricing_included")}>
                {featureKeys.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500/20"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M1.5 5L3.5 7.5L8.5 2"
                          stroke="#f97316"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-sm leading-relaxed text-content">{t(key)}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <EnrollButton
                label={tForm("enroll_cta")}
                size="lg"
                className="w-full justify-center"
              />
            </div>
          </FadeIn>

          {/* ── Right column ── */}
          <FadeIn direction="right">
            <div className="flex h-full flex-col justify-center">
              <h3 className="mb-5 text-2xl font-extrabold leading-snug text-content sm:text-3xl">
                {t("why_title")}
              </h3>
              <p className="mb-10 text-base leading-relaxed text-content-muted">{t("why_body")}</p>

              {/* Stats 2×2 */}
              <div className="grid grid-cols-2 gap-3">
                {statKeys.map(({ value, label }) => (
                  <div
                    key={label}
                    className="rounded-xl bg-surface-raised px-5 py-4 ring-1 ring-line dark:ring-0"
                  >
                    <p className="mb-0.5 text-3xl font-extrabold tabular-nums text-content">
                      {t(value)}
                    </p>
                    <p className="text-xs font-medium uppercase tracking-wider text-content-muted">
                      {t(label)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
