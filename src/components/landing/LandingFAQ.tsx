"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import type { Landing } from "@/lib/schemas/landing";

type Props = {
  faq: Landing["faq"];
  label?: string;
  title?: string;
};

export function LandingFAQ({ faq, label, title }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      aria-labelledby="landing-faq-heading"
      className="section bg-surface"
    >
      <div className="mx-auto max-w-3xl">
        <FadeIn>
          {label && (
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-8 bg-line" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-widest text-accent-500 dark:text-accent-400">
                {label}
              </span>
            </div>
          )}
          <h2
            id="landing-faq-heading"
            className="mb-10 text-3xl font-bold tracking-tight text-content sm:text-4xl"
          >
            {title ?? "FAQ"}
          </h2>
        </FadeIn>

        <dl className="space-y-3">
          {faq.map(({ q, a }, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <div className="overflow-hidden rounded-2xl border border-line bg-surface-raised">
                <dt>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    aria-expanded={openIndex === i}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold text-content transition-colors hover:bg-surface-subtle"
                  >
                    <span>{q}</span>
                    <motion.span
                      animate={{ rotate: openIndex === i ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-2xl leading-none text-content-subtle"
                      aria-hidden="true"
                    >
                      +
                    </motion.span>
                  </button>
                </dt>
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.dd
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-content-muted">
                        {a}
                      </p>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </dl>
      </div>
    </section>
  );
}
