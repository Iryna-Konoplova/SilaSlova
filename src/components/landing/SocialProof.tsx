import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";
import { EnrollButton } from "@/components/forms/EnrollButton";
import { TestimonialsSlider } from "@/components/ui/TestimonialsSlider";

type Props = { locale: string };

const reviewKeys = [1, 2, 3, 4, 5] as const;

export async function SocialProof({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "social_proof" });
  const tForm = await getTranslations({ locale, namespace: "enroll_form" });

  const items = reviewKeys.map((n) => ({
    quote: t(`review_${n}_quote`),
    author: t(`review_${n}_author`),
    role: t(`review_${n}_role`),
  }));

  return (
    <section
      aria-labelledby="social-proof-heading"
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
            id="social-proof-heading"
            className="mb-12 text-center text-3xl font-bold tracking-tight text-content sm:text-4xl"
          >
            {t("title")}
          </h2>
        </FadeIn>

        <FadeIn>
          <TestimonialsSlider items={items} />
        </FadeIn>

        <FadeIn>
          <div className="mt-10 flex justify-center">
            <EnrollButton label={tForm("enroll_cta")} size="md" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
