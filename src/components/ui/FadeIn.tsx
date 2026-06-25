"use client";

import { createElement, useEffect, useRef, useState } from "react";

type Tag = "div" | "li" | "article" | "section" | "span";

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
  as?: Tag;
};

// Scroll-reveal без framer-motion: IntersectionObserver + CSS-переход.
// API совпадает с прежним компонентом, поэтому вызовы менять не нужно.
export function FadeIn({ children, delay = 0, className, direction = "up", as = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // prefers-reduced-motion → показываем сразу, без анимации (§19)
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const offset = 28;
  const hiddenTransform =
    direction === "up"
      ? `translateY(${offset}px)`
      : direction === "left"
        ? `translateX(-${offset}px)`
        : direction === "right"
          ? `translateX(${offset}px)`
          : "none";

  return createElement(
    as,
    {
      ref,
      className,
      style: {
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : hiddenTransform,
        transition: reduced
          ? "none"
          : "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        transitionDelay: `${delay}s`,
        willChange: "opacity, transform",
      },
    },
    children
  );
}
