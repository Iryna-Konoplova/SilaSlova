import { setRequestLocale } from "next-intl/server";

export default async function AppPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <main>App</main>;
}
