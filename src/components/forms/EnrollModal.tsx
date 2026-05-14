"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEnrollStore } from "@/lib/enroll-store";
import { EnrollForm } from "./EnrollForm";

export function EnrollModal() {
  const { isOpen, close } = useEnrollStore();
  const t = useTranslations("enroll_form");

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="enroll-modal-title"
        >
          {/* Backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/60"
            onClick={close}
          />

          {/* Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-surface-raised shadow-2xl"
          >
            {/* Orange top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-brand-600 to-accent-500" />

            <div className="p-4 sm:p-6">
              {/* Close */}
              <button
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-5 flex h-8 w-8 items-center justify-center rounded-full text-content-subtle transition-colors hover:bg-surface-subtle hover:text-content"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              <h2
                id="enroll-modal-title"
                className="mb-5 pr-8 text-xl font-bold text-content"
              >
                {t("modal_title")}
              </h2>

              <EnrollForm onSuccess={close} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
