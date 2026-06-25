import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import cookieContent from "@/content/legal/cookie.json";

type CookieDoc = {
  title: string;
  intro: string;
  cookiesHeading: string;
  necessary: { label: string; desc: string; items: { code: string; desc: string }[] };
  analytics: { label: string; desc: string };
  marketing: { label: string; desc: string };
  manageHeading: string;
  manage: string[];
  changesHeading: string;
  changes: string;
  updated: string;
};

const content = cookieContent as Record<string, CookieDoc>;

function getDoc(locale: string): CookieDoc {
  return content[locale] ?? content.uk;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const brand = locale === "en" || locale === "ro" ? "Sila Slova" : "Сила Слова";
  return {
    title: `${getDoc(locale).title} — ${brand}`,
    robots: { index: false },
  };
}

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = getDoc(locale);

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-32">
      <h1 className="mb-8 text-3xl font-bold text-content">{doc.title}</h1>

      <div className="space-y-6 text-sm leading-relaxed text-content-muted">
        <p>{doc.intro}</p>

        <section>
          <h2 className="mb-2 text-base font-semibold text-content">
            {doc.cookiesHeading}
          </h2>
          <p className="font-medium text-content">{doc.necessary.label}</p>
          <p className="mt-1">{doc.necessary.desc}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {doc.necessary.items.map((item) => (
              <li key={item.code}>
                <code>{item.code}</code> — {item.desc};
              </li>
            ))}
          </ul>

          <p className="mt-4 font-medium text-content">{doc.analytics.label}</p>
          <p className="mt-1">{doc.analytics.desc}</p>

          <p className="mt-4 font-medium text-content">{doc.marketing.label}</p>
          <p className="mt-1">{doc.marketing.desc}</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-content">
            {doc.manageHeading}
          </h2>
          {doc.manage.map((paragraph, i) => (
            <p key={i} className={i > 0 ? "mt-2" : undefined}>
              {paragraph}
            </p>
          ))}
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-content">
            {doc.changesHeading}
          </h2>
          <p>{doc.changes}</p>
        </section>

        <p className="pt-4 text-xs text-content-subtle">{doc.updated}</p>
      </div>
    </main>
  );
}
