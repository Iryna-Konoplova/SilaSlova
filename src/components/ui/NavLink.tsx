"use client";

import { usePathname } from "@/lib/navigation";
import { Link } from "@/lib/navigation";
import type { ComponentProps } from "react";

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
  const hrefStr = typeof href === "string" ? href : href.pathname ?? "";

  const isActive = exactMatch
    ? pathname === hrefStr
    : pathname.startsWith(hrefStr) && hrefStr !== "/";

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
