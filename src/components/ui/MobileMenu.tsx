"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, Link } from "@/lib/navigation";

type NavItem = { href: string; label: string; isAccent?: boolean };
type Props = { locale: string; items: NavItem[] };

export function MobileMenu({ locale, items }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Закрити меню" : "Відкрити меню"}
        className="flex h-9 w-9 items-center justify-center rounded-md text-content-muted transition-colors hover:bg-surface-subtle hover:text-content"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full border-b border-line bg-surface/98 backdrop-blur-md"
          >
            <ul className="mx-auto max-w-6xl divide-y divide-zinc-100 px-4 dark:divide-zinc-800/70 sm:px-6">
              {items.map(({ href, label, isAccent }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={
                      isAccent
                        ? "flex items-center gap-2 py-4 text-base font-semibold text-accent-500 transition-colors hover:text-accent-600"
                        : "flex items-center py-4 text-base font-medium text-content transition-colors hover:text-content"
                    }
                  >
                    {isAccent && (
                      <svg width="9" height="11" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
                        <path d="M0 0l10 6-10 6V0z" />
                      </svg>
                    )}
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
