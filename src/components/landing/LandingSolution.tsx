import { FadeIn } from "@/components/ui/FadeIn";
import type { Landing } from "@/lib/schemas/landing";

type Props = { solution: Landing["solution"] };

export function LandingSolution({ solution }: Props) {
  return (
    <section
      aria-labelledby="landing-solution-heading"
      className="section bg-surface"
    >
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <h2
            id="landing-solution-heading"
            className="mb-4 text-3xl font-bold tracking-tight text-content sm:text-4xl"
          >
            {solution.title}
          </h2>
          {solution.body && (
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-content-muted">
              {solution.body}
            </p>
          )}
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2">
          {solution.bullets.map((bullet, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="flex items-start gap-4 rounded-2xl border border-line bg-surface-raised p-5">
                <p className="text-base leading-relaxed text-content">
                  {bullet}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
