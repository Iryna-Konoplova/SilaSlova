"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

type Props = {
  items: Testimonial[];
};

function Stars() {
  const t = useTranslations("a11y");
  return (
    <div role="img" aria-label={t("rating")} className="mb-4 flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden="true" className="text-xl text-accent-400">★</span>
      ))}
    </div>
  );
}

function Card({
  item,
  isSide = false,
}: {
  item: Testimonial;
  isSide?: boolean;
}) {
  return (
    <figure
      className={[
        "flex h-full flex-col rounded-2xl p-7 ring-1 transition-all duration-300",
        isSide
          ? "scale-95 bg-surface-raised/50 ring-line opacity-50"
          : "bg-surface-raised ring-brand-600/20 shadow-md dark:ring-brand-400/15",
      ].join(" ")}
    >
      <Stars />
      <blockquote className="flex-1">
        <p className="mb-6 text-base leading-relaxed text-content-muted">
          &ldquo;{item.quote}&rdquo;
        </p>
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white"
        >
          {item.author.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-content">{item.author}</p>
          <p className="text-xs text-content-subtle">{item.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

export function TestimonialsSlider({ items }: Props) {
  const t = useTranslations("a11y");
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const count = items.length;

  const go = (to: number) => {
    setDir(to > active ? 1 : -1);
    setActive(to);
  };

  const prev = () => go((active - 1 + count) % count);
  const next = () => go((active + 1) % count);

  const prevIdx = (active - 1 + count) % count;
  const nextIdx = (active + 1) % count;

  return (
    <div>
      {/* Desktop: 3 cards */}
      <div className="hidden lg:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-3 items-stretch gap-5"
          >
            <Card item={items[prevIdx]} isSide />
            <Card item={items[active]} />
            <Card item={items[nextIdx]} isSide />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile / tablet: 1 card */}
      <div className="overflow-hidden lg:hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={active}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <Card item={items[active]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={prev}
          aria-label={t("review_prev")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-raised text-content-muted transition-colors hover:border-brand-600/40 hover:text-brand-600 dark:hover:text-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          ←
        </button>

        <div className="flex gap-2" role="tablist" aria-label={t("reviews_nav")}>
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={t("review_n", { n: i + 1 })}
              onClick={() => go(i)}
              className={[
                "h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                i === active
                  ? "w-6 bg-brand-600 dark:bg-brand-400"
                  : "w-2 bg-line hover:bg-content-subtle",
              ].join(" ")}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label={t("review_next")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-raised text-content-muted transition-colors hover:border-brand-600/40 hover:text-brand-600 dark:hover:text-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          →
        </button>
      </div>
    </div>
  );
}
