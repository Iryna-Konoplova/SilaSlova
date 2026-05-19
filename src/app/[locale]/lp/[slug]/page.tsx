import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import path from "path";
import fs from "fs/promises";
import { LandingSchema, type Landing } from "@/lib/schemas/landing";
import { buildMetadata, siteUrl } from "../../metadata";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingPain } from "@/components/landing/LandingPain";
import { LandingSolution } from "@/components/landing/LandingSolution";
import { LandingSocialProof } from "@/components/landing/LandingSocialProof";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { LandingFinalCta } from "@/components/landing/LandingFinalCta";
import { EnrollModal } from "@/components/forms/EnrollModal";

async function loadLanding(locale: string, slug: string): Promise<Landing | null> {
  const filePath = path.join(
    process.cwd(),
    "src/content/landings",
    locale,
    `${slug}.json`
  );
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return LandingSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const localeList = ["en", "ru", "uk", "ro"];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of localeList) {
    const dir = path.join(process.cwd(), "src/content/landings", locale);
    try {
      const files = await fs.readdir(dir);
      for (const file of files) {
        if (file.endsWith(".json")) {
          params.push({ locale, slug: file.replace(/\.json$/, "") });
        }
      }
    } catch {
      // directory doesn't exist yet
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const landing = await loadLanding(locale, slug);
  if (!landing) return {};

  const imageUrl = landing.meta.og_image.startsWith("http")
    ? landing.meta.og_image
    : `${siteUrl}${landing.meta.og_image}`;

  const canonical = `${siteUrl}/${locale}/lp/${slug}`;

  return {
    ...buildMetadata({
      locale,
      path: `/lp/${slug}`,
      title: landing.meta.title,
      description: landing.meta.description,
      imageUrl,
    }),
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/en/lp/${slug}`,
        ru: `${siteUrl}/ru/lp/${slug}`,
        uk: `${siteUrl}/uk/lp/${slug}`,
      },
    },
  };
}

function buildJsonLd(landing: Landing, locale: string, slug: string) {
  const pageUrl = `${siteUrl}/${locale}/lp/${slug}`;

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: landing.meta.title,
    description: landing.meta.description,
    url: pageUrl,
    inLanguage: locale,
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: landing.faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return [webPage, faqPage];
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const landing = await loadLanding(locale, slug);
  if (!landing) notFound();

  const jsonLd = buildJsonLd(landing, locale, slug);

  return (
    <main id="main-content">
      <EnrollModal />
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <LandingHero hero={landing.hero} locale={locale} slug={landing.slug} />
      <LandingPain pain={landing.pain} />
      <LandingSolution solution={landing.solution} />
      <LandingFinalCta
        finalCta={landing.final_cta}
        ctaTarget={landing.hero.cta_primary.target}
        locale={locale}
      />
      {landing.social_proof && (
        <LandingSocialProof proof={landing.social_proof} />
      )}
      <LandingFAQ
        faq={landing.faq}
        title={landing.faq_title}
      />
    </main>
  );
}
