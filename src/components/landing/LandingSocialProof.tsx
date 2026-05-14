import { FadeIn } from "@/components/ui/FadeIn";
import type { Landing } from "@/lib/schemas/landing";

type Props = {
  proof: NonNullable<Landing["social_proof"]>;
  title?: string;
};

export function LandingSocialProof({ proof, title }: Props) {
  const hasStats = proof.stats && proof.stats.length > 0;

  return (
    <section aria-labelledby="landing-proof-heading" className="section bg-surface-raised">
      <div className="mx-auto max-w-4xl">

        {title && (
          <FadeIn>
            <div className="mb-8 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-line" aria-hidden="true" />
              <span className="section-label">{title}</span>
              <div className="h-px w-8 bg-line" aria-hidden="true" />
            </div>
          </FadeIn>
        )}

        <h2 id="landing-proof-heading" className="sr-only">
          {title ?? "Social proof"}
        </h2>

        {hasStats && (
          <FadeIn>
            <dl className="mb-12 grid grid-cols-1 gap-4 text-center sm:grid-cols-3 sm:gap-8">
              {proof.stats!.map(({ label, value }, i) => (
                <FadeIn key={label} delay={i * 0.08} as="div">
                  <div className="card flex flex-col-reverse p-6 transition-colors duration-300 hover:border-accent-500">
                    <dt className="text-sm text-content-muted">{label}</dt>
                    <dd className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 sm:text-3xl">
                      {value}
                    </dd>
                  </div>
                </FadeIn>
              ))}
            </dl>
          </FadeIn>
        )}

        {proof.quote && (
          <FadeIn delay={hasStats ? 0.1 : 0}>
            <blockquote className="card relative overflow-hidden py-8 pl-10 pr-8">
              {/* orange left accent bar */}
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-accent-500 to-accent-600" aria-hidden="true" />

              {/* large decorative quote mark */}
              <div
                aria-hidden="true"
                className="absolute left-5 top-3 text-5xl font-black leading-none text-accent-500/40"
              >
                &ldquo;
              </div>

              <p className="relative z-10 text-lg font-medium leading-relaxed text-content sm:text-xl">
                {proof.quote}
              </p>

              {proof.author && (
                <footer className="mt-5">
                  <cite className="not-italic text-sm font-semibold text-accent-500">
                    — {proof.author}
                  </cite>
                </footer>
              )}
            </blockquote>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
