import { defineRouting } from "next-intl/routing";
import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "ru", "uk"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
});

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !(locales as readonly string[]).includes(locale)) {
    locale = defaultLocale;
  }
  const messages = (
    await import(`../content/strings/${locale}.json`)
  ).default;
  return { locale, messages };
});
