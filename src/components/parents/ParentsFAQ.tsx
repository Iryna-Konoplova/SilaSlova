"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { EnrollButton } from "@/components/forms/EnrollButton";

const faqKeys = ["1", "2", "3", "4", "5", "6", "7"] as const;

export function ParentsFAQ() {
  const t = useTranslations("parents");
  const tForm = useTranslations("enroll_form");
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section
      aria-labelledby="faq-heading"
      className="section bg-surface"
    >
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-8 bg-line" aria-hidden="true" />
          <span className="section-label">
            {t("faq_label")}
          </span>
        </div>
        <h2
          id="faq-heading"
          className="mb-12 text-3xl font-extrabold tracking-tight text-content sm:text-4xl"
        >
          {t("faq_title")}
        </h2>

        {/* Items */}
        <div className="space-y-3">
          {faqKeys.map((num) => {
            const isOpen = open === num;
            return (
              <div
                key={num}
                className={`overflow-hidden rounded-xl border transition-colors ${
                  isOpen
                    ? "border-accent-400/60 bg-surface-raised dark:border-accent-500/40"
                    : "border-line bg-surface-raised hover:border-line-strong"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : num)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base font-semibold text-content sm:text-lg">
                    {t(`faq_${num}_q` as Parameters<typeof t>[0])}
                  </span>
                  <svg
                    aria-hidden="true"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`shrink-0 transition-all duration-200 ${
                      isOpen ? "rotate-180 text-accent-500" : "text-content-subtle"
                    }`}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="border-t border-line px-6 pb-5 pt-4">
                        <p className="text-base leading-relaxed text-content-muted">
                          {t(`faq_${num}_a` as Parameters<typeof t>[0])}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="mb-6 text-content-muted">{tForm("modal_subtitle")}</p>
          <EnrollButton label={tForm("enroll_cta")} size="lg" />
        </div>
      </div>
    </section>
  );
}
