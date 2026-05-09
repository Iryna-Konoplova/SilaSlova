import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import type { Landing } from "@/lib/schemas/landing";

type Props = {
  finalCta: Landing["final_cta"];
  ctaTarget: string;
  locale: string;
};

export function LandingFinalCta({ finalCta, ctaTarget, locale }: Props) {
  const href = `/${locale}${ctaTarget}`;

  return (
    <section
      aria-labelledby="landing-final-cta-heading"
      className="section bg-brand-600 dark:bg-brand-700"
    >
      <div className="mx-auto max-w-3xl text-center">
        <FadeIn>
          <h2
            id="landing-final-cta-heading"
            className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            {finalCta.headline}
          </h2>
          {finalCta.subheadline && (
            <p className="mb-8 text-lg leading-relaxed text-brand-100">
              {finalCta.subheadline}
            </p>
          )}
          <Link
            href={href}
            className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-base font-bold text-brand-700 shadow-lg shadow-violet-900/30 transition-all hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-600"
          >
            {finalCta.cta_text}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
