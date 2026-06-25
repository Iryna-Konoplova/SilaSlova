"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { buildDemoUrl, DEMO_URL, isDemoEnabled } from "@/lib/demo-link";

const playIcon = (
  <svg
    width="26"
    height="30"
    viewBox="0 0 26 30"
    fill="none"
    aria-hidden="true"
    style={{ marginLeft: "4px" }}
  >
    <path
      d="M1.5 1.5l23 13-23 13V1.5z"
      fill="white"
      stroke="white"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

// Play-кнопка на странице /demo. Пока игра не включена флагом (isDemoEnabled, см.
// demo-link.ts) — показываем неактивную кнопку без перехода. Когда включена —
// ссылка на внешнюю игру с anonymous_id + UTM (href считается после монтирования:
// метки доступны только на клиенте).
export function DemoPlayButton() {
  const t = useTranslations("sticky_bar");
  const [href, setHref] = useState(DEMO_URL);
  useEffect(() => {
    setHref(buildDemoUrl());
  }, []);

  if (!isDemoEnabled) {
    return (
      <button
        type="button"
        aria-disabled="true"
        aria-label={t("cta_label")}
        title={t("cta")}
        className="play-btn h-[86px] w-[86px]"
      >
        {playIcon}
      </button>
    );
  }

  return (
    <a
      href={href}
      aria-label={t("cta_label")}
      title={t("cta")}
      className="play-btn h-[86px] w-[86px]"
    >
      {playIcon}
    </a>
  );
}
