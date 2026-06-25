import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import privacyContent from "@/content/legal/privacy.json";

type PrivacyDoc = {
  title: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  updated: string;
};

const content = privacyContent as Record<string, PrivacyDoc>;

function getDoc(locale: string): PrivacyDoc {
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

export default async function PrivacyPage({
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

        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-2 text-base font-semibold text-content">
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph, i) => (
              <p key={i} className={i > 0 ? "mt-2" : undefined}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <p className="pt-4 text-xs text-content-subtle">{doc.updated}</p>
      </div>
    </main>
  );
}
