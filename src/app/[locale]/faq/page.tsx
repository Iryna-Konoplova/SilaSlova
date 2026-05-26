import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getTranslations, getMessages } from "next-intl/server";
import { buildMetadata } from "../metadata";
import { ParentsFAQ } from "@/components/parents/ParentsFAQ";
import { pickMessages } from "@/lib/client-messages";

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
  const messages = await getMessages();

  return (
    <main id="main-content" className="pt-16">
      {/* ParentsFAQ — единственный клиентский потребитель тяжёлого раздела `parents`.
          Подаём `parents` (+ `enroll_form`, который компонент тоже использует) локально,
          чтобы 9 КБ словаря не попадали в клиентский payload остальных страниц.
          Вложенный провайдер ЗАМЕНЯЕТ родительский словарь — поэтому включаем оба раздела. */}
      <NextIntlClientProvider messages={pickMessages(messages, ["parents", "enroll_form"])}>
        <ParentsFAQ />
      </NextIntlClientProvider>
    </main>
  );
}
