import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

// Заглушка до реализации (Sprint 3, Clerk). Закрываем от индексации, чтобы тонкая
// страница не попала в индекс, если URL обнаружат по ссылке (SEO-аудит S9).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function WelcomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <main>Welcome</main>;
}
