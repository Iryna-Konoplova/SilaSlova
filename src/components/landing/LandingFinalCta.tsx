import { FadeIn } from "@/components/ui/FadeIn";
import { DemoButton } from "@/components/ui/DemoButton";
import type { Landing } from "@/lib/schemas/landing";

type Props = {
  finalCta: Landing["final_cta"];
  ctaTarget: string;
  locale: string;
};

export function LandingFinalCta({ finalCta, locale }: Props) {
  return (
    <section
      aria-labelledby="landing-final-cta-heading"
      className="relative overflow-hidden bg-brand-950 py-20 sm:py-24"
    >
      {/* центральный радиальный гоу */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.35), transparent)" }}
      />

      {/* оранжевая линия сверху */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-accent-500 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <FadeIn>
          <h2
            id="landing-final-cta-heading"
            className="mb-8 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            {finalCta.headline}
          </h2>
          {finalCta.subheadline && (() => {
            const [episode, story] = finalCta.subheadline!.split("\n");
            return (
              <div className="mb-10 space-y-5">
                {episode && (
                  <p className="text-sm font-medium uppercase tracking-widest text-brand-400/60 underline underline-offset-4 decoration-brand-300/50">
                    {episode}
                  </p>
                )}
                {story && (
                  <div className="relative mx-auto max-w-xl">
                    <span
                      aria-hidden="true"
                      className="absolute -left-2 -top-4 text-5xl font-black leading-none text-brand-300/50"
                    >
                      &ldquo;
                    </span>
                    <p className="pl-5 text-lg italic leading-relaxed text-white sm:text-xl">
                      {story}
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
          <DemoButton locale={locale} label={finalCta.cta_text} size="lg" variant="white" />
        </FadeIn>
      </div>
    </section>
  );
}
