import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata, siteUrl } from "./metadata";
import { Hero } from "@/components/landing/Hero";
import { Benefits } from "@/components/landing/Benefits";
import { WhyNow } from "@/components/landing/WhyNow";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Results } from "@/components/landing/Results";
import { Pricing } from "@/components/landing/Pricing";
import { AppPromo } from "@/components/landing/AppPromo";
import { SocialProof } from "@/components/landing/SocialProof";
import { StickyBar } from "@/components/landing/StickyBar";

// ISR — revalidate every hour (spec section 17)
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // Главная сохраняет свои curated OG-заголовок/описание (короче основного title);
  // остальные страницы теперь получают OG из собственных title/description.
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return buildMetadata({
    locale,
    ogTitle: t("og_title"),
    ogDescription: t("og_description"),
    ogImageAlt: t("og_image_alt"),
  });
}

// JSON-LD Course schema (spec section 18)
function CourseJsonLd({ locale }: { locale: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Syla Slova / Сила Слова",
    description:
      "Interactive educational thriller for children 10-16. 13 lessons on critical thinking, media literacy and manipulation recognition.",
    url: `${siteUrl}/${locale}`,
    provider: {
      "@type": "Organization",
      name: "Syla Slova",
      url: siteUrl,
    },
    // 10–16 охватывает и начальную, и среднюю школу — "Primary Education"
    // противоречило бы audienceType ниже (см. правку возраста 2026-08-17).
    educationalLevel: "Primary and Secondary Education",
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: "children 10-16 years old",
    },
    teaches: [
      "Critical thinking",
      "Media literacy",
      "Manipulation recognition",
      "Independent decision making",
    ],
    "@id": `${siteUrl}/#course`,
    image: `${siteUrl}/og/og-default.jpg`,
    inLanguage: ["en", "ru", "uk", "ro"],
    isAccessibleForFree: true,
    availableLanguage: [
      { "@type": "Language", name: "English", alternateName: "en" },
      { "@type": "Language", name: "Russian", alternateName: "ru" },
      { "@type": "Language", name: "Ukrainian", alternateName: "uk" },
      { "@type": "Language", name: "Romanian", alternateName: "ro" },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <CourseJsonLd locale={locale} />

      <main id="main-content">
        <Hero locale={locale} />
        <Benefits locale={locale} />
        <WhyNow locale={locale} />
        <HowItWorks locale={locale} />
        <Results locale={locale} />
        <AppPromo locale={locale} />
        <Pricing locale={locale} />
        <SocialProof locale={locale} />
      </main>

      <StickyBar locale={locale} />
    </>
  );
}
