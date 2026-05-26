"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname, Link } from "@/lib/navigation";

type NavItem = { href: string; label: string; isAccent?: boolean };
type Props = { locale: string; items: NavItem[] };

export function MobileMenu({ items }: Props) {
  const t = useTranslations("a11y");
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
        aria-label={open ? t("menu_close") : t("menu_open")}
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

      {open && (
          <div
            className="animate-fade-slide-down absolute left-0 right-0 top-full border-b border-line bg-surface/98 backdrop-blur-md"
          >
            <ul className="mx-auto max-w-6xl divide-y divide-zinc-100 px-4 dark:divide-zinc-800/70 sm:px-6">
              {items.map(({ href, label, isAccent }) => {
                const isActive = href !== "/" && pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={
                        isAccent
                          ? `flex items-center gap-2 py-4 text-base font-semibold text-accent-500 transition-colors hover:text-accent-600${isActive ? " underline decoration-accent-500 underline-offset-4" : ""}`
                          : isActive
                            ? "flex items-center py-4 text-base font-semibold text-accent-500 underline decoration-accent-500 underline-offset-4"
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
                );
              })}
            </ul>
          </div>
        )}
    </>
  );
}
