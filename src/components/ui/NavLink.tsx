"use client";

import { usePathname } from "@/lib/navigation";
import { Link } from "@/lib/navigation";
import { useEffect, useState, type ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & {
  activeClassName?: string;
  exactMatch?: boolean;
};

export function NavLink({
  href,
  className,
  activeClassName,
  exactMatch = false,
  children,
  ...rest
}: Props) {
  const pathname = usePathname();
  // Активное состояние считаем только после монтирования: usePathname от next-intl
  // (localePrefix:"always") может расходиться между SSR и клиентом, из-за чего
  // aria-current/className не совпадали и ломалась гидратация. На сервере и при
  // первом клиентском рендере ссылка неактивна — подсветка появляется после
  // гидратации (косметика, без влияния на навигацию и SEO).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const hrefStr = typeof href === "string" ? href : href.pathname ?? "";

  const isActive =
    mounted &&
    (exactMatch
      ? pathname === hrefStr
      : pathname.startsWith(hrefStr) && hrefStr !== "/");

  return (
    <Link
      href={href}
      className={[className, isActive ? (activeClassName ?? "active") : ""].join(" ").trim()}
      aria-current={isActive ? "page" : undefined}
      {...rest}
    >
      {children}
    </Link>
  );
}
