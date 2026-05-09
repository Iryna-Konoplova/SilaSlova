import { FadeIn } from "@/components/ui/FadeIn";
import type { Landing } from "@/lib/schemas/landing";

type Props = { proof: NonNullable<Landing["social_proof"]> };

export function LandingSocialProof({ proof }: Props) {
  const hasStats = proof.stats && proof.stats.length > 0;

  return (
    <section className="section bg-surface-raised">
      <div className="mx-auto max-w-4xl">
        {hasStats && (
          <FadeIn>
            <dl className="mb-12 grid grid-cols-3 gap-4 text-center sm:gap-8">
              {proof.stats!.map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl bg-surface p-6 ring-1 ring-line"
                >
                  <dd className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 sm:text-3xl">
                    {value}
                  </dd>
                  <dt className="mt-1 text-sm text-content-muted">{label}</dt>
                </div>
              ))}
            </dl>
          </FadeIn>
        )}

        {proof.quote && (
          <FadeIn delay={hasStats ? 0.1 : 0}>
            <blockquote className="relative rounded-2xl border border-brand-200/60 bg-surface px-8 py-8 dark:border-brand-900/40">
              <div
                aria-hidden="true"
                className="absolute left-6 top-4 text-6xl leading-none text-brand-200 dark:text-brand-900"
              >
                &ldquo;
              </div>
              <p className="relative z-10 text-lg leading-relaxed text-content">
                {proof.quote}
              </p>
              {proof.author && (
                <footer className="mt-4">
                  <cite className="not-italic text-sm font-semibold text-content-muted">
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
