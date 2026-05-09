import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";

type Props = { locale: string };

const cards = [
  { icon: "card_1_icon", title: "card_1_title", body: "card_1_body" },
  { icon: "card_2_icon", title: "card_2_title", body: "card_2_body" },
  { icon: "card_3_icon", title: "card_3_title", body: "card_3_body" },
  { icon: "card_4_icon", title: "card_4_title", body: "card_4_body" },
] as const;

export async function WhyNow({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "why_now" });

  return (
    <section
      aria-labelledby="why-now-heading"
      className="section bg-surface"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-8 bg-line" aria-hidden="true" />
            <span className="section-label">
              {t("label")}
            </span>
          </div>
          <h2
            id="why-now-heading"
            className="mb-3 max-w-3xl text-3xl font-extrabold tracking-tight text-content sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mb-4 max-w-2xl text-lg font-semibold text-content">
            {t("subtitle")}
          </p>
          <p className="mb-14 max-w-2xl text-base leading-relaxed text-content-muted">
            {t("body")}
          </p>
        </FadeIn>

        <div className="grid gap-5 sm:grid-cols-2 sm:[grid-auto-rows:minmax(8rem,auto)]">
          {cards.map(({ icon, title, body }, i) => (
            <FadeIn key={title} delay={i * 0.08} className="sm:h-full">
              <div className="group flex h-full flex-col rounded-2xl border border-line bg-surface-raised p-6 transition-colors hover:border-accent-300 dark:hover:border-accent-500/40">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-2xl dark:bg-accent-500/10">
                    <span aria-hidden="true">{t(icon)}</span>
                  </div>
                  <h3 className="text-base font-bold text-content">{t(title)}</h3>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-content-muted">{t(body)}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
