import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";
import { EnrollButton } from "@/components/forms/EnrollButton";

type Props = { locale: string };

const skillKeys = [
  "item_1", "item_2", "item_3", "item_4", "item_5", "item_6", "item_7",
  "item_8", "item_9", "item_10", "item_11", "item_12", "item_13",
] as const;

export async function Results({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "results" });
  const tForm = await getTranslations({ locale, namespace: "enroll_form" });

  return (
    <section
      aria-labelledby="results-heading"
      className="section bg-surface"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mb-12 text-center">
            <div className="mb-3 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-line" aria-hidden="true" />
              <span className="section-label">{t("title")}</span>
              <div className="h-px w-8 bg-line" aria-hidden="true" />
            </div>
            <h2
              id="results-heading"
              className="mb-3 text-3xl font-bold tracking-tight text-content sm:text-4xl"
            >
              {t("subtitle")}
            </h2>
          </div>
        </FadeIn>

        {/* Skills grid — 13 items, last one centered on desktop */}
        <div className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 [&>*:last-child:nth-child(3n+1)]:lg:col-start-2">
          {skillKeys.map((key, i) => (
            <FadeIn key={key} delay={Math.floor(i / 3) * 0.08 + (i % 3) * 0.04}>
              <div className="flex items-center gap-3 rounded-xl bg-surface-raised px-4 py-3.5 ring-1 ring-line transition-colors hover:ring-accent-300 dark:hover:ring-accent-800/60">
                <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-100 dark:bg-accent-950/60">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L4.5 8.5L10 3" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-content">
                  {t(key)}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Motivational quote */}
        <FadeIn>
          <blockquote className="mx-auto mb-10 max-w-2xl overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 p-px">
            <div className="rounded-2xl bg-surface-raised px-8 py-6 text-center">
              <p className="text-base font-medium leading-relaxed text-content sm:text-lg">
                &ldquo;{t("motivational")}&rdquo;
              </p>
            </div>
          </blockquote>
        </FadeIn>

        <FadeIn>
          <div className="flex justify-center">
            <EnrollButton label={tForm("enroll_cta")} size="md" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
