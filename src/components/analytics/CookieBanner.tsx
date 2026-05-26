"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { hasConsented, acceptAll, acceptNecessaryOnly } from "@/lib/cookie-consent";

export function CookieBanner() {
  const t = useTranslations("cookieBanner");
  const ta = useTranslations("a11y");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasConsented()) setVisible(true);
  }, []);

  function handleAccept() {
    acceptAll();
    setVisible(false);
  }

  function handleReject() {
    acceptNecessaryOnly();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="animate-slide-up-in fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 sm:px-6"
      role="dialog"
      aria-label={ta("cookie_dialog")}
      aria-modal="false"
    >
          <div className="gradient-border mx-auto max-w-3xl rounded-[var(--radius-card)] shadow-modal">
            <div className="flex flex-col gap-4 rounded-[calc(var(--radius-card)-1px)] bg-surface-raised px-5 py-4 sm:flex-row sm:items-center sm:gap-6">
            {/* Icon + text */}
            <div className="flex items-start gap-3 sm:flex-1">
              <span className="mt-0.5 shrink-0 text-xl" aria-hidden>🍪</span>
              <div className="text-sm leading-snug">
                <p className="text-content-muted">{t("line1")}</p>
                <p className="mt-0.5 text-content-muted">
                  {t.rich("line2", {
                    link: (chunks) => (
                      <Link
                        href="/cookie-policy"
                        className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex shrink-0 gap-2">
              <button onClick={handleAccept} className="btn-accent flex-1 py-2 px-5 text-sm sm:flex-none">
                {t("acceptAll")}
              </button>
              <button onClick={handleReject} className="btn-outline flex-1 py-2 px-5 text-sm sm:flex-none">
                {t("reject")}
              </button>
            </div>
            </div>
          </div>
        </div>
  );
}
