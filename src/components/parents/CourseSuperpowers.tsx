import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";
import { EnrollButton } from "@/components/forms/EnrollButton";

type Props = { locale: string };

const powers = [
  {
    iconKey: "power_1_icon" as const,
    labelKey: "power_1_label" as const,
    titleKey: "power_1_title" as const,
    bodyKey: "power_1_body" as const,
    skills: ["power_1_skill_1", "power_1_skill_2", "power_1_skill_3", "power_1_skill_4"] as const,
    accent: "violet",
  },
  {
    iconKey: "power_2_icon" as const,
    labelKey: "power_2_label" as const,
    titleKey: "power_2_title" as const,
    bodyKey: "power_2_body" as const,
    skills: ["power_2_skill_1", "power_2_skill_2", "power_2_skill_3", "power_2_skill_4"] as const,
    accent: "orange",
  },
];

export async function CourseSuperpowers({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "parents" });
  const tForm = await getTranslations({ locale, namespace: "enroll_form" });

  return (
    <section
      aria-labelledby="superpowers-heading"
      className="section bg-surface"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-8 bg-line" aria-hidden="true" />
            <span className="section-label">
              {t("course_label")}
            </span>
          </div>
          <h2
            id="superpowers-heading"
            className="mb-14 text-3xl font-extrabold tracking-tight text-content sm:text-4xl"
          >
            {t("course_title")}
          </h2>
        </FadeIn>

        <div className="mb-14 grid gap-8 lg:grid-cols-2 lg:[grid-auto-rows:minmax(10rem,auto)]">
          {powers.map(({ iconKey, labelKey, titleKey, bodyKey, skills, accent }, i) => {
            const isViolet = accent === "violet";
            return (
              <FadeIn key={labelKey} direction={i === 0 ? "left" : "right"} className="lg:h-full">
                <div
                  className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-8 ${
                    isViolet
                      ? "border-brand-200 bg-brand-50 dark:border-brand-500/30 dark:bg-brand-600/5"
                      : "border-accent-200 bg-accent-50 dark:border-accent-500/30 dark:bg-accent-500/5"
                  }`}
                >
                  {/* Glow (dark only) */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl ${
                      isViolet ? "bg-brand-400/10 dark:bg-brand-600/15" : "bg-accent-300/10 dark:bg-accent-500/15"
                    }`}
                  />

                  <div className="relative">
                    {/* Header */}
                    <div className="mb-6 flex items-start gap-4">
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                          isViolet ? "bg-brand-100 dark:bg-brand-600/20" : "bg-accent-100 dark:bg-accent-500/20"
                        }`}
                        aria-hidden="true"
                      >
                        {t(iconKey)}
                      </span>
                      <div>
                        <p
                          className={`mb-1 text-[10px] font-bold uppercase tracking-widest ${
                            isViolet ? "text-brand-600 dark:text-brand-400" : "text-accent-600 dark:text-accent-400"
                          }`}
                        >
                          {t(labelKey)}
                        </p>
                        <h3 className="text-xl font-extrabold text-content">{t(titleKey)}</h3>
                      </div>
                    </div>

                    <p className="mb-6 text-sm leading-relaxed text-content-muted">{t(bodyKey)}</p>

                    <ul className="space-y-2.5">
                      {skills.map((skill) => (
                        <li key={skill} className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                              isViolet ? "bg-brand-100 dark:bg-brand-600/20" : "bg-accent-100 dark:bg-accent-500/20"
                            }`}
                          >
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path
                                d="M1.5 5L3.5 7.5L8.5 2"
                                stroke={isViolet ? "#7c3aed" : "#f97316"}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span className="text-sm text-content">{t(skill)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn>
          <EnrollButton label={tForm("enroll_cta")} size="lg" />
        </FadeIn>
      </div>
    </section>
  );
}
