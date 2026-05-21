import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Logo } from "./Logo";
import { NavLink } from "./NavLink";

type Props = { locale: string };

const socials = [
  {
    name: "Facebook",
    color: "#1877F2",
    href: "https://www.facebook.com/soroban.ua",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    color: "#E1306C",
    href: "https://www.instagram.com/soroban.ukraine",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    name: "YouTube",
    color: "#FF0000",
    href: "https://www.youtube.com/channel/UC4mGhc2kX-M4GnJOwJN-4Nw",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
      </svg>
    ),
  },
  {
    name: "Telegram",
    color: "#26A5E4",
    href: "https://t.me/Syla_slova_bot",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.461c.537-.194 1.006.131.834.932z"/>
      </svg>
    ),
  },
] as const;

export async function Footer({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "footer" });

  return (
    <footer className="relative bg-surface-raised px-4 pb-8 pt-10 sm:px-6">
      {/* Gradient top border */}
      <div aria-hidden="true" className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-3">

          {/* Logo + tagline + copyright */}
          <div className="flex flex-col justify-between gap-6">
            <div>
              <Link href={`/${locale}`} className="logo inline-flex items-center gap-2">
                <Logo size={32} className="shrink-0" />
                <span>Syla<span className="logo-accent"> Slova</span></span>
              </Link>
              <p className="mt-3 max-w-xs border-l-2 border-accent-500 pl-3 text-sm leading-relaxed text-content-muted">
                {t("tagline")}
              </p>
            </div>
            <div className="text-xs leading-relaxed text-content-subtle">
              <p>{t("copyright")}</p>
              <p className="mt-0.5">{t("copyright_notice")}</p>
            </div>
          </div>

          {/* Site navigation */}
          <nav aria-label="Footer navigation" className="sm:pl-8 lg:pl-16">
            <ul className="flex flex-col gap-3">
              {(
                [
                  { href: "/parents", label: t("nav_parents") },
                  { href: "/faq",     label: t("nav_faq") },
                  { href: "/about",   label: t("nav_about") },
                  { href: "/demo",    label: t("nav_demo") },
                ] as const
              ).map(({ href, label }) => (
                <li key={href}>
                  <NavLink
                    href={href}
                    className="relative text-sm font-medium text-content-muted transition-colors hover:text-content"
                    activeClassName="text-content after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-accent-500"
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social icons + Privacy */}
          <div className="flex flex-col justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-2">
              {socials.map(({ name, href, icon, color }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  style={{ color }}
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition-opacity hover:opacity-70"
                >
                  {icon}
                </a>
              ))}
            </div>
            <div className="border-t border-line pt-3">
              <Link
                href={`/${locale}/privacy`}
                className="text-sm font-medium text-content-muted transition-colors hover:text-content"
              >
                {t("nav_privacy")}
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
