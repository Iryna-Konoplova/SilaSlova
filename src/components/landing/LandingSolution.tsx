import { FadeIn } from "@/components/ui/FadeIn";
import type { Landing } from "@/lib/schemas/landing";

type Props = { solution: Landing["solution"] };

const accentClasses = [
  "from-accent-500 to-accent-600",
  "from-brand-500 to-brand-600",
  "from-accent-400 to-brand-500",
  "from-brand-400 to-accent-500",
];

function splitBullet(bullet: string): { icon: string; text: string } {
  const match = bullet.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})\s*/u);
  if (match) {
    return { icon: match[0].trim(), text: bullet.slice(match[0].length) };
  }
  return { icon: "", text: bullet };
}

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
            className="mb-4 text-3xl font-extrabold tracking-tight text-content sm:text-4xl"
          >
            {solution.title}
          </h2>
          {solution.body && (
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-content-muted">
              {solution.body}
            </p>
          )}
        </FadeIn>

        <ul className="grid list-none gap-4 sm:grid-cols-2">
          {solution.bullets.map((bullet, i) => {
            const { icon, text } = splitBullet(bullet);
            const gradient = accentClasses[i % accentClasses.length];
            return (
              <FadeIn key={i} delay={i * 0.08} as="li">
                <div className="card card-interactive group relative h-full overflow-hidden p-5">
                  {/* top gradient line */}
                  <div className={`absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r ${gradient}`} />

                  {icon && (
                    <div
                      aria-hidden="true"
                      className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-2xl shadow-sm ${gradient}`}
                    >
                      {icon}
                    </div>
                  )}

                  <p className="text-base leading-relaxed text-content transition-colors duration-300 group-hover:text-content">
                    {text}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
