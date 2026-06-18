import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

// Заглушка (Sprint 2). Закрываем от индексации + убрана из sitemap. Вернуть index при наполнении.
export const metadata: Metadata = { robots: { index: false } };

export default async function AppPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <main>App</main>;
}
