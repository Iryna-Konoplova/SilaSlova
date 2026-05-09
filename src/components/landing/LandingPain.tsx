import { FadeIn } from "@/components/ui/FadeIn";
import type { Landing } from "@/lib/schemas/landing";

type Props = { pain: Landing["pain"] };

export function LandingPain({ pain }: Props) {
  const paragraphs = pain.body.split("\n\n").filter(Boolean);

  return (
    <section
      aria-labelledby="landing-pain-heading"
      className="section bg-surface-raised"
    >
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <h2
            id="landing-pain-heading"
            className="mb-10 max-w-3xl text-3xl font-extrabold tracking-tight text-content sm:text-4xl"
          >
            {pain.title}
          </h2>
        </FadeIn>

        <div className="space-y-4">
          {paragraphs.map((text, i) => (
            <FadeIn key={i} delay={i * 0.09}>
              <div className="rounded-2xl border border-line bg-surface p-6">
                <p className="text-base leading-relaxed text-content-muted">
                  {text}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
