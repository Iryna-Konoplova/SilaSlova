"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export function NotifyForm() {
  const t = useTranslations("app_promo");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
        ✓ {t("notify_submit")}!
      </p>
    );
  }

  return (
    <form
      aria-label={t("notify_cta")}
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <input
        type="email"
        required
        placeholder={t("notify_email_placeholder")}
        aria-label="Email address"
        className="h-11 flex-1 rounded-full bg-surface-subtle px-4 text-sm text-content placeholder-zinc-400 ring-1 ring-line focus:outline-none focus:ring-2 focus:ring-brand-500 dark:placeholder-zinc-600"
      />
      <button
        type="submit"
        className="h-11 shrink-0 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        {t("notify_submit")}
      </button>
    </form>
  );
}
