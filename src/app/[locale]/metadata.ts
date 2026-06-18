import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteUrl } from "@/lib/site-url";

export type PageMetaOptions = {
  locale: string;
  /** Path after /[locale], e.g. "" for home, "/l/fear-tiktok" for a landing */
  path?: string;
  /** Override the default title from meta.home.title */
  title?: string;
  /** Override the default description */
  description?: string;
  /** Override the default OG image URL */
  imageUrl?: string;
  /** Override the OG/Twitter title (defaults to the page title) */
  ogTitle?: string;
  /** Override the OG/Twitter description (defaults to the page description) */
  ogDescription?: string;
  /** Override the OG image alt text (defaults to the page title) */
  ogImageAlt?: string;
};

/**
 * Builds Next.js Metadata for any page.
 * Reads base title/description from the `meta.home` namespace in strings JSON,
 * but accepts overrides for per-page customisation (e.g. landing pages).
 *
 * Usage in a page:
 *   export async function generateMetadata({ params }) {
 *     const { locale } = await params;
 *     return buildMetadata({ locale });
 *   }
 */
export async function buildMetadata({
  locale,
  path = "",
  title,
  description,
  imageUrl,
  ogTitle,
  ogDescription,
  ogImageAlt,
}: PageMetaOptions): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta.home" });

  const resolvedTitle = title ?? t("title");
  const resolvedDescription = description ?? t("description");
  const image = imageUrl ?? `${siteUrl}/og/og-default.jpg`;
  const canonical = `${siteUrl}/${locale}${path}`;

  // OG/Twitter по умолчанию повторяют постраничные title/description, а не
  // захардкоженные значения главной — иначе все лендинги/страницы шарят превью
  // главной (бьёт по CTR в рекламе/шеринге). Главная передаёт свои curated OG
  // через override-поля ниже.
  const resolvedOgTitle = ogTitle ?? resolvedTitle;
  const resolvedOgDescription = ogDescription ?? resolvedDescription;
  const resolvedOgImageAlt = ogImageAlt ?? resolvedTitle;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/en${path}`,
        ru: `${siteUrl}/ru${path}`,
        uk: `${siteUrl}/uk${path}`,
        ro: `${siteUrl}/ro${path}`,
        "x-default": `${siteUrl}/en${path}`,
      },
    },
    openGraph: {
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      url: canonical,
      siteName: "Syla Slova",
      type: "website",
      locale,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: resolvedOgImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1 },
    },
  };
}

export { siteUrl };
