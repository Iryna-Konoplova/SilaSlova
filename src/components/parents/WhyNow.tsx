import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";
import { EnrollButton } from "@/components/forms/EnrollButton";

type Props = { locale: string };

const problemKeys = [
  { num: "1", icon: "problem_1_icon", title: "problem_1_title", body: "problem_1_body" },
  { num: "2", icon: "problem_2_icon", title: "problem_2_title", body: "problem_2_body" },
  { num: "3", icon: "problem_3_icon", title: "problem_3_title", body: "problem_3_body" },
  { num: "4", icon: "problem_4_icon", title: "problem_4_title", body: "problem_4_body" },
] as const;

export async function WhyNow({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "parents" });
  const tForm = await getTranslations({ locale, namespace: "enroll_form" });

  return (
    <section
      aria-labelledby="why-now-heading"
      className="section bg-surface-raised"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-8 bg-line" aria-hidden="true" />
            <span className="section-label">
              {t("why_label")}
            </span>
          </div>
          <h2
            id="why-now-heading"
            className="mb-6 max-w-3xl text-3xl font-extrabold tracking-tight text-content sm:text-4xl"
          >
            {t("why_title")}
          </h2>
          <p className="mb-14 max-w-2xl text-base leading-relaxed text-content-muted">
            {t("why_stat")}
          </p>
        </FadeIn>

        <div className="mb-14 grid gap-5 sm:grid-cols-2 sm:[grid-auto-rows:minmax(8rem,auto)]">
          {problemKeys.map(({ num, icon, title, body }, i) => (
            <FadeIn key={num} delay={i * 0.08} className="sm:h-full">
              <div className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent-300 dark:hover:border-accent-500/40">
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-3xl" aria-hidden="true">
                    {t(icon)}
                  </span>
                  <h3 className="text-lg font-bold text-content">{t(title)}</h3>
                </div>
                <p className="text-sm leading-relaxed text-content-muted">{t(body)}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <EnrollButton label={tForm("enroll_cta")} size="lg" />
        </FadeIn>
      </div>
    </section>
  );
}
