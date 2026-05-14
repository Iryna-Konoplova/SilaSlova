import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/i18n";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { EnrollModal } from "@/components/forms/EnrollModal";
import { CookieBanner } from "@/components/analytics/CookieBanner";

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

  return (
    <NextIntlClientProvider messages={messages}>
      <Header locale={locale} />
      <div className="flex-1">{children}</div>
      <Footer locale={locale} />
      <EnrollModal />
      <CookieBanner />
    </NextIntlClientProvider>
  );
}
