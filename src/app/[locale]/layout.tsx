import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/i18n";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { EnrollModalMount } from "@/components/forms/EnrollModalMount";
import { CookieBanner } from "@/components/analytics/CookieBanner";
import { TrackingBootstrap } from "@/components/analytics/TrackingBootstrap";
import { ScrollRestoration } from "@/components/ui/ScrollRestoration";
import { pickMessages } from "@/lib/client-messages";
import { siteUrl } from "@/lib/site-url";
import "../globals.css";

// Разделы словаря, нужные КЛИЕНТСКИМ компонентам, которые рендерит этот layout
// (EnrollModal→enroll_form, CookieBanner→cookieBanner) и общая главная
// (StickyBar→sticky_bar, маленький). `a11y` — общие screen-reader-метки
// (MobileMenu, LanguageSwitcher, ThemeSwitcher, TestimonialsSlider и пр.), ~18
// коротких строк. Всё остальное — серверный рендер.
// Тяжёлый `parents` подаётся локально на /faq (ParentsFAQ). См. docs/PERF_PLAN.md (Этап 2).
const CLIENT_NAMESPACES = ["enroll_form", "cookieBanner", "sticky_bar", "a11y"] as const;

// Подмножества под всю аудиторию: latin (en), latin-ext (ro-диакритика),
// cyrillic (ru/uk). Браузер тянет только нужный файл per-page по unicode-range.
// Geist_Mono удалён — нигде не использовался. display: swap по умолчанию (§17).
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Сила Слова / Syla Slova",
  description:
    "Interactive educational thriller for children 10–12. 13 lessons on critical thinking, media literacy and manipulation recognition.",
  metadataBase: new URL(siteUrl),
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const clientMessages = pickMessages(messages, CLIENT_NAMESPACES);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Скрол всегда сверху — императивно, без тега <script> (см. компонент) */}
        <ScrollRestoration />
        <ThemeProvider>
          <NextIntlClientProvider messages={clientMessages}>
            <Header locale={locale} />
            <div className="flex-1">{children}</div>
            <Footer locale={locale} />
            <EnrollModalMount />
            <CookieBanner />
            <TrackingBootstrap />
          </NextIntlClientProvider>
        </ThemeProvider>
        <AnalyticsProvider />
      </body>
    </html>
  );
}
