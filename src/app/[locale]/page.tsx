import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
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
  return buildMetadata({ locale });
}

// JSON-LD Course schema (spec section 18)
function CourseJsonLd({ locale }: { locale: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Syla Slova / Сила Слова",
    description:
      "Interactive educational thriller for children 10-12. 13 lessons on critical thinking, media literacy and manipulation recognition.",
    url: `${siteUrl}/${locale}`,
    provider: {
      "@type": "Organization",
      name: "Syla Slova",
      url: siteUrl,
    },
    educationalLevel: "Primary Education",
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: "children 10-12 years old",
    },
    teaches: [
      "Critical thinking",
      "Media literacy",
      "Manipulation recognition",
      "Independent decision making",
    ],
    inLanguage: ["en", "ru", "uk"],
    isAccessibleForFree: true,
    availableLanguage: ["English", "Russian", "Ukrainian"],
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
