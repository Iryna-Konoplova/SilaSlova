import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sylaslova.com";

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
}: PageMetaOptions): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta.home" });

  const resolvedTitle = title ?? t("title");
  const resolvedDescription = description ?? t("description");
  const image = imageUrl ?? `${siteUrl}/og-default.jpg`;
  const canonical = `${siteUrl}/${locale}${path}`;

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
        "x-default": `${siteUrl}/en${path}`,
      },
    },
    openGraph: {
      title: t("og_title"),
      description: t("og_description"),
      url: canonical,
      siteName: "Syla Slova",
      type: "website",
      locale,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: t("og_image_alt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
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
