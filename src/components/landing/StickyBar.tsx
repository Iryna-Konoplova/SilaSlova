"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type Props = { locale: string };

export function StickyBar({ locale }: Props) {
  const t = useTranslations("sticky_bar");
  const ta = useTranslations("a11y");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      role="complementary"
      aria-label={ta("sticky_demo")}
      className={[
        "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3",
        "border-t border-line bg-surface/98 px-4 py-3 backdrop-blur-md",
        "transition-transform duration-300 md:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
    >
      <p className="truncate text-sm text-content-muted">{t("text")}</p>
      <Link
        href={`/${locale}/demo`}
        aria-label={t("cta_label")}
        className="shrink-0 inline-flex h-10 items-center rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
