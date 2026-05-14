import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";
import { EnrollButton } from "@/components/forms/EnrollButton";

type Props = { locale: string };

const steps = [
  { num: "step_1_num", icon: "step_1_icon", title: "step_1_title", body: "step_1_body" },
  { num: "step_2_num", icon: "step_2_icon", title: "step_2_title", body: "step_2_body" },
  { num: "step_3_num", icon: "step_3_icon", title: "step_3_title", body: "step_3_body" },
  { num: "step_4_num", icon: "step_4_icon", title: "step_4_title", body: "step_4_body" },
] as const;

export async function HowItWorks({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "how_it_works" });
  const tForm = await getTranslations({ locale, namespace: "enroll_form" });

  return (
    <section
      aria-labelledby="how-heading"
      className="section bg-surface-raised"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-line" aria-hidden="true" />
            <span className="section-label">{t("label")}</span>
            <div className="h-px w-8 bg-line" aria-hidden="true" />
          </div>
          <h2
            id="how-heading"
            className="mb-3 text-center text-3xl font-bold tracking-tight text-content sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mb-14 text-center text-base text-content-muted">
            {t("subtitle")}
          </p>
        </FadeIn>

        <div className="mb-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map(({ num, icon, title, body }, i) => (
            <FadeIn key={num} delay={i * 0.1}>
              <div className="card-interactive group flex flex-col items-center rounded-2xl p-5 text-center">
                {/* Circle with icon */}
                <div className="relative mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-50 text-4xl ring-2 ring-accent-100 transition-transform duration-300 group-hover:scale-110 dark:bg-accent-950/30 dark:ring-accent-800/30">
                    {t(icon)}
                  </div>
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white shadow-sm shadow-orange-500/40">
                    {t(num)}
                  </span>
                </div>

                <h3 className="mb-3 text-lg font-semibold text-content">
                  {t(title)}
                </h3>
                <p className="text-sm leading-relaxed text-content-muted">
                  {t(body)}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="flex justify-center">
            <EnrollButton label={tForm("enroll_cta")} size="md" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
