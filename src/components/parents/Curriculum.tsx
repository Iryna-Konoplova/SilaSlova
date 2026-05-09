import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";

type Props = { locale: string };

const sessions = [
  "01", "02", "03", "04", "05", "06", "07",
  "08", "09", "10", "11", "12", "13",
] as const;

export async function Curriculum({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "parents" });

  return (
    <section
      aria-labelledby="curriculum-heading"
      className="section bg-surface-raised"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-8 bg-line" aria-hidden="true" />
            <span className="section-label">
              {t("curriculum_label")}
            </span>
          </div>
          <h2
            id="curriculum-heading"
            className="mb-3 text-3xl font-extrabold tracking-tight text-content sm:text-4xl"
          >
            {t("curriculum_title")}
          </h2>
          <p className="mb-12 text-base text-content-muted">{t("curriculum_subtitle")}</p>
        </FadeIn>

        {/* Desktop table */}
        <FadeIn>
          <div className="hidden overflow-hidden rounded-2xl border border-line md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface">
                  <th className="w-12 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-content-muted">
                    {t("curriculum_col_num")}
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-content-muted">
                    {t("curriculum_col_topic")}
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-content-muted">
                    {t("curriculum_col_a")}
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-content-muted">
                    {t("curriculum_col_b")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((num, i) => (
                  <tr
                    key={num}
                    className={`border-b border-line transition-colors hover:bg-surface-subtle ${
                      i % 2 === 0 ? "bg-surface-raised" : "bg-surface-subtle/50 dark:bg-surface/40"
                    }`}
                  >
                    <td className="px-4 py-4">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-100 text-xs font-bold text-accent-600dark:bg-accent-500/15 dark:text-accent-400">
                        {num}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-content">
                      {t(`session_${num}_topic` as Parameters<typeof t>[0])}
                    </td>
                    <td className="px-4 py-4 text-content-muted">
                      {t(`session_${num}_a` as Parameters<typeof t>[0])}
                    </td>
                    <td className="px-4 py-4 text-content-muted">
                      {t(`session_${num}_b` as Parameters<typeof t>[0])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {sessions.map((num) => (
              <div
                key={num}
                className="rounded-xl border border-line bg-surface p-4"
              >
                <div className="mb-2 flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-100 text-xs font-bold text-accent-600shrink-0 dark:bg-accent-500/15 dark:text-accent-400">
                    {num}
                  </span>
                  <span className="font-semibold text-content">
                    {t(`session_${num}_topic` as Parameters<typeof t>[0])}
                  </span>
                </div>
                <div className="ml-10 space-y-1">
                  <p className="text-xs text-content-muted">
                    <span className="mr-1.5 font-medium text-content-subtle">A:</span>
                    {t(`session_${num}_a` as Parameters<typeof t>[0])}
                  </p>
                  <p className="text-xs text-content-muted">
                    <span className="mr-1.5 font-medium text-content-subtle">B:</span>
                    {t(`session_${num}_b` as Parameters<typeof t>[0])}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
