"use client";

import { usePathname, getPathname } from "@/lib/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

/** Add an entry here whenever a new locale is added to src/lib/i18n.ts */
const localeMeta: Record<string, { label: string; native: string }> = {
  en: { label: "EN", native: "English" },
  ru: { label: "RU", native: "Русский" },
  uk: { label: "UK", native: "Українська" },
  ro: { label: "RO", native: "Română" },
};

type Props = { currentLocale: string };

export function LanguageSwitcher({ currentLocale }: Props) {
  const pathname = usePathname();
  const t = useTranslations("a11y");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(locale: Locale) {
    setOpen(false);
    // Полная перезагрузка при смене языка: страница (и тема/<html lang>) рендерятся
    // заново на сервере для новой локали. Так избегаем клиентского пересоздания
    // корневого [locale]/layout, на котором React 19 ругается из-за <script>
    // от next-themes. URL не меняется. См. docs/PERF_PLAN.md (хвост Этапа 1).
    const target = getPathname({ href: pathname, locale });
    window.location.href = `${target}${window.location.search}${window.location.hash}`;
  }

  const current = localeMeta[currentLocale] ?? { label: currentLocale.toUpperCase(), native: currentLocale };

  return (
    <div ref={ref} className="relative">
      {/* Accessible name кнопки ведём видимым кодом локали (current.label, напр. "RU"),
          чтобы он содержал видимый текст — WCAG 2.5.3 Label in Name. */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${current.label}, ${t("lang_current", { lang: current.native })}`}
        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-content-muted transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        {current.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("lang_select")}
          className="absolute right-0 top-full z-50 mt-1 min-w-[130px] overflow-hidden rounded-lg border border-line bg-surface-raised py-1 shadow-xl"
        >
          {locales.map((locale) => {
            const meta = localeMeta[locale] ?? { label: locale.toUpperCase(), native: locale };
            const isActive = locale === currentLocale;
            return (
              <li key={locale} role="option" aria-selected={isActive}>
                <button
                  onClick={() => switchLocale(locale)}
                  className={[
                    "flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-brand-100 text-brand-700 dark:bg-brand-600/20 dark:text-brand-300"
                      : "text-content-muted hover:bg-surface-subtle hover:text-content",
                  ].join(" ")}
                >
                  <span className="w-6 text-xs font-bold text-content-subtle">{meta.label}</span>
                  <span>{meta.native}</span>
                  {isActive && (
                    <svg className="ml-auto h-3.5 w-3.5 text-brand-600 dark:text-brand-400" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7L5.5 10.5L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
