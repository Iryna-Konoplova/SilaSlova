"use client";

import { useState } from "react";
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
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px w-8 bg-line" aria-hidden="true" />
              <span className="section-label">{label}</span>
            </div>
          )}
          {title && (
            <h2
              id="landing-faq-heading"
              className="mb-10 text-3xl font-extrabold tracking-tight text-content sm:text-4xl"
            >
              {title}
            </h2>
          )}
        </FadeIn>

        <dl className="space-y-3">
          {faq.map(({ q, a }, i) => {
            const isOpen = openIndex === i;
            return (
              <FadeIn
                key={i}
                delay={i * 0.06}
                className={`block overflow-hidden rounded-xl border transition-colors duration-200 ${
                  isOpen
                    ? "border-accent-400/60 bg-surface-raised dark:border-accent-500/40"
                    : "border-line bg-surface-raised hover:border-line-strong"
                }`}
              >
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                    >
                      <span className="text-base font-semibold text-content sm:text-lg">
                        {q}
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
                  </dt>

                  {/* CSS-аккордеон: grid-template-rows 0fr→1fr плавно меняет высоту без framer */}
                  <dd
                    className="grid"
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      opacity: isOpen ? 1 : 0,
                      transition:
                        "grid-template-rows 0.25s cubic-bezier(0.22,1,0.36,1), opacity 0.25s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-line px-6 pb-5 pt-4">
                        <p className="text-base leading-relaxed text-content-muted">
                          {a}
                        </p>
                      </div>
                    </div>
                  </dd>
              </FadeIn>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
