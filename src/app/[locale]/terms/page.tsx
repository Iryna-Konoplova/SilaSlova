import { setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "Умови користування — Сила Слова",
  robots: { index: false },
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-32">
      <h1 className="mb-8 text-3xl font-bold text-content">Умови користування</h1>

      <div className="space-y-6 text-sm leading-relaxed text-content-muted">
        <p>
          Повний текст умов користування зараз готується й буде опублікований на
          цій сторінці найближчим часом.
        </p>
        <p>
          Поки що звертаємо увагу: сайт є маркетинговою сторінкою курсу «Сила
          Слова» та формою запису. Залишаючи заявку, Ви погоджуєтесь на обробку
          наданих контактних даних відповідно до{" "}
          <a
            href={`/${locale}/privacy`}
            className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Політики конфіденційності
          </a>
          .
        </p>
      </div>
    </main>
  );
}
