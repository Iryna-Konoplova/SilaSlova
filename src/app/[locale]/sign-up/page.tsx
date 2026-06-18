import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

// Заглушка до реализации (Sprint 3, Clerk). noindex вместо robots.txt-disallow:
// краулер ДОЛЖЕН мочь зайти и увидеть noindex, иначе остаётся «URL-only» в выдаче
// (disallow ≠ noindex). Поэтому /sign-up убран из disallow в robots.ts (SEO-аудит S9).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <main>Sign Up</main>;
}
