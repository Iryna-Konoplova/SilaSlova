import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildMetadata } from "../metadata";
import { ParentsHero } from "@/components/parents/ParentsHero";
import { WhyNow } from "@/components/parents/WhyNow";
import { CourseSuperpowers } from "@/components/parents/CourseSuperpowers";
import { Curriculum } from "@/components/parents/Curriculum";
import { Results } from "@/components/landing/Results";
import { Pricing } from "@/components/landing/Pricing";
import { FinalCta } from "@/components/landing/FinalCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "parents" });
  return buildMetadata({
    locale,
    path: "/parents",
    title: t("page_title"),
    description: t("page_description"),
  });
}

export default async function ParentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main-content">
      <ParentsHero locale={locale} />
      <WhyNow locale={locale} />
      <CourseSuperpowers locale={locale} />
      <Curriculum locale={locale} />
      <Results locale={locale} />
      <Pricing locale={locale} />
      <FinalCta locale={locale} />
    </main>
  );
}
