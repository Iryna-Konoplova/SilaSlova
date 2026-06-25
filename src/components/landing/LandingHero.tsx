import Image from "next/image";
import { EnrollButton } from "@/components/forms/EnrollButton";
import { DemoButton } from "@/components/ui/DemoButton";
import type { Landing } from "@/lib/schemas/landing";

type Props = { hero: Landing["hero"]; locale: string; slug: string };

function HeroMedia({ media, headlineFallback }: { media: Landing["hero"]["media"]; headlineFallback: string }) {
  if (media.type === "video") {
    return (
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={media.poster}
        aria-label={media.alt ?? headlineFallback}
      >
        <source src={media.src} type="video/webm" />
      </video>
    );
  }

  if (media.type === "image") {
    return (
      <Image
        src={media.src}
        alt={media.alt ?? headlineFallback}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );
  }

  // lottie — placeholder until lottie library is added
  return (
    <div
      role="img"
      aria-label={media.alt ?? headlineFallback}
      className="flex h-full w-full items-center justify-center text-brand-400 text-sm"
    >
      [lottie: {media.src}]
    </div>
  );
}

export function LandingHero({ hero, locale, slug }: Props) {
  return (
    <section
      aria-labelledby="landing-hero-heading"
      className="relative flex min-h-[80vh] flex-col overflow-hidden bg-brand-950 md:flex-row"
    >
      {/* LEFT — text */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-8 pb-16 pt-24 md:px-12 md:py-20 lg:px-16">
        {/* subtle gradient blob behind text */}
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-700/30 blur-3xl" />

        <div className="animate-hero-in">
          <h1
            id="landing-hero-heading"
            className="relative mb-6 mt-8 text-4xl font-extrabold leading-tight tracking-tight text-white text-center sm:text-5xl lg:text-6xl"
          >
            {hero.headline}
          </h1>
          <p className="relative mb-10 max-w-lg text-lg leading-relaxed text-white/75 sm:text-xl">
            {hero.subheadline}
          </p>
        </div>

        <div className="animate-hero-in" style={{ animationDelay: "0.12s" }}>
          <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <EnrollButton
              label={hero.cta_primary.text}
              size="lg"
              source={`sila-slova/${slug}`}
            />
            {hero.cta_secondary && (
              <DemoButton locale={locale} label={hero.cta_secondary.text} size="lg" />
            )}
          </div>
        </div>
      </div>

      {/* RIGHT — media */}
      <div className="relative min-h-[300px] flex-1 bg-brand-900 md:min-h-0">
        <HeroMedia media={hero.media} headlineFallback={hero.headline} />
        {/* mobile: gradient top fade */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-brand-950 to-transparent md:hidden" />
        {/* desktop: gradient left fade */}
        <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-brand-950 to-transparent md:block" />
      </div>
    </section>
  );
}
