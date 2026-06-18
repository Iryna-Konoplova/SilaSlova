import { setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "Політика файлів cookie — Сила Слова",
  robots: { index: false },
};

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-32">
      <h1 className="mb-8 text-3xl font-bold text-content">
        Політика використання файлів cookie
      </h1>

      <div className="space-y-6 text-sm leading-relaxed text-content-muted">
        <p>
          Файли cookie — це невеликі текстові файли, які сайт зберігає у Вашому
          браузері. Ми використовуємо лише мінімум необхідних cookie для роботи
          сайту, а аналітичні та маркетингові інструменти підключаємо тільки
          після Вашої явної згоди.
        </p>

        <section>
          <h2 className="mb-2 text-base font-semibold text-content">
            Які файли cookie ми використовуємо
          </h2>
          <p className="font-medium text-content">Необхідні (працюють завжди)</p>
          <p className="mt-1">
            Потрібні для коректної роботи сайту та форми запису й не містять
            персональних даних:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <code>sila_consent</code> — зберігає Ваш вибір щодо cookie (до 12
              місяців);
            </li>
            <li>
              <code>ss_anon_id</code> — знеособлений технічний ідентифікатор
              відвідувача;
            </li>
            <li>
              <code>ss_utm</code> — джерело переходу на сайт (UTM-мітки),
              зберігається до 30 днів.
            </li>
          </ul>

          <p className="mt-4 font-medium text-content">
            Аналітичні (лише після згоди «Статистика»)
          </p>
          <p className="mt-1">
            PostHog та Google Analytics 4 — знеособлена статистика відвідувань і
            поведінки на сайті, щоб покращувати його зручність і контент.
          </p>

          <p className="mt-4 font-medium text-content">
            Маркетингові (лише після згоди «Маркетинг»)
          </p>
          <p className="mt-1">
            Meta Pixel і TikTok Pixel — вимірювання ефективності рекламних
            кампаній. Email і телефон перед передачею до рекламних платформ
            хешуються (SHA-256).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-content">
            Згода та керування cookie
          </h2>
          <p>
            Під час першого відвідування сайту з&apos;являється банер, де Ви
            можете обрати «Прийняти всі» або «Лише необхідні». До моменту Вашої
            згоди аналітичні та маркетингові скрипти не завантажуються взагалі.
          </p>
          <p className="mt-2">
            Відкликати або змінити згоду можна будь-коли, очистивши файли cookie
            в налаштуваннях браузера, — після цього банер з&apos;явиться знову.
            Ви також можете заблокувати cookie засобами самого браузера.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-content">
            Зміни до цієї політики
          </h2>
          <p>
            У разі внесення змін оновлена версія буде опублікована на цій
            сторінці.
          </p>
        </section>

        <p className="pt-4 text-xs text-content-subtle">
          Остання редакція: червень 2026 р. © Сила Слова
        </p>
      </div>
    </main>
  );
}
