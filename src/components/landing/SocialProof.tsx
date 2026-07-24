import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";
import { EnrollButton } from "@/components/forms/EnrollButton";
import { TestimonialsSlider, type Rating } from "@/components/ui/TestimonialsSlider";

type Props = { locale: string };

type ReviewId = 1 | 2 | 3 | 4 | 5;
const reviewKeys = [1, 2, 3, 4, 5] as const satisfies readonly ReviewId[];
const REVIEW_RATINGS = { 1: 5, 2: 4, 3: 5, 4: 5, 5: 4 } satisfies Record<ReviewId, Rating>;

export async function SocialProof({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "social_proof" });
  const tForm = await getTranslations({ locale, namespace: "enroll_form" });

  const items = reviewKeys.map((n) => ({
    quote: t(`review_${n}_quote`),
    author: t(`review_${n}_author`),
    rating: REVIEW_RATINGS[n],
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
