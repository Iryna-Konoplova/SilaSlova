import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import type { Landing } from "@/lib/schemas/landing";

type Props = { hero: Landing["hero"]; locale: string };

export function LandingHero({ hero, locale }: Props) {
  const primaryHref = `/${locale}${hero.cta_primary.target}`;

  return (
    <section
      aria-labelledby="landing-hero-heading"
      className="section-hero relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-surface"
    >
      {/* Gradient blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-900/20" />
        <div className="absolute -right-32 top-1/3 h-64 w-64 rounded-full bg-accent-200/40 blur-3xl dark:bg-accent-900/15" />
        <div className="absolute -left-32 bottom-1/4 h-64 w-64 rounded-full bg-brand-200/30 blur-3xl dark:bg-brand-900/15" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <FadeIn>
          <h1
            id="landing-hero-heading"
            className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-content sm:text-5xl md:text-6xl"
          >
            {hero.headline}
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-content-muted sm:text-xl">
            {hero.subheadline}
          </p>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={primaryHref}
              className="inline-flex h-14 w-full items-center justify-center rounded-full bg-brand-600 px-8 text-lg font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:bg-brand-500 hover:shadow-violet-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:w-auto"
            >
              ▶ {hero.cta_primary.text}
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
