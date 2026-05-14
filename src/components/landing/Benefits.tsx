import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";
import { EnrollButton } from "@/components/forms/EnrollButton";

type Props = { locale: string };

const items = [
  { icon: "item_1_icon", title: "item_1_title", body: "item_1_body", accent: "violet" },
  { icon: "item_2_icon", title: "item_2_title", body: "item_2_body", accent: "orange" },
  { icon: "item_3_icon", title: "item_3_title", body: "item_3_body", accent: "violet" },
] as const;

const accentClasses = {
  violet: "from-brand-500 to-brand-600",
  orange: "from-accent-500 to-accent-600",
};

export async function Benefits({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "benefits" });
  const tForm = await getTranslations({ locale, namespace: "enroll_form" });

  return (
    <section
      aria-labelledby="benefits-heading"
      className="section bg-surface"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-line" aria-hidden="true" />
            <span className="section-label">{t("label")}</span>
            <div className="h-px w-8 bg-line" aria-hidden="true" />
          </div>
          <h2
            id="benefits-heading"
            className="mb-12 text-center text-3xl font-bold tracking-tight text-content sm:text-4xl"
          >
            {t("title")}
          </h2>
        </FadeIn>

        <div className="mb-10 grid gap-6 sm:grid-cols-3">
          {items.map(({ icon, title, body, accent }, i) => (
            <FadeIn key={title} delay={i * 0.12}>
              <article className="card card-interactive group relative overflow-hidden p-6">
                {/* Top gradient line */}
                <div className={`absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r ${accentClasses[accent]}`} />
                <div
                  aria-hidden="true"
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accentClasses[accent]} text-2xl shadow-sm`}
                >
                  {t(icon)}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-content">
                  {t(title)}
                </h3>
                <p className="text-sm leading-relaxed text-content-muted">
                  {t(body)}
                </p>
              </article>
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
