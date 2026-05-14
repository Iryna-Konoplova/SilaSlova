import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "../metadata";
import { ParentsFAQ } from "@/components/parents/ParentsFAQ";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return buildMetadata({ locale, path: "/faq", title: t("faq") });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main-content" className="pt-16">
      <ParentsFAQ />
    </main>
  );
}
