import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";
import { EnrollButton } from "@/components/forms/EnrollButton";

type Props = { locale: string };

export async function ParentsHero({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "parents" });
  const tForm = await getTranslations({ locale, namespace: "enroll_form" });

  return (
    <section className="section-hero relative overflow-hidden bg-surface">
      {/* Blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-brand-300/15 blur-[120px] dark:bg-brand-600/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-0 h-[400px] w-[400px] rounded-full bg-accent-200/20 blur-[100px] dark:bg-accent-500/8"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <FadeIn>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-br from-brand-600 via-brand-700 to-accent-500 bg-clip-text text-transparent dark:from-brand-400 dark:via-brand-300 dark:to-accent-400">
              {t("hero_title")}
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-content-muted sm:text-xl">
            {t("hero_subtitle")}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <EnrollButton
              label={tForm("enroll_cta")}
              size="lg"
              className="w-full sm:w-auto"
            />
            <div className="flex items-center gap-6 text-sm text-content-subtle">
              <span className="flex items-center gap-1.5">
                <span className="text-accent-500">✓</span> {tForm("modal_subtitle").split(".")[0]}
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
