import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

// Заглушка до реализации квиза (Sprint 2). Закрываем от индексации, чтобы тонкая
// страница не попадала в выдачу; из sitemap тоже убрана. Вернуть index при наполнении.
export const metadata: Metadata = { robots: { index: false } };

export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <main>Quiz</main>;
}
