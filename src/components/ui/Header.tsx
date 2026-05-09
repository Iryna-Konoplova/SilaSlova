import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { NavLink } from "./NavLink";
import { MobileMenu } from "./MobileMenu";

type Props = { locale: string };

const navLinkBase =
  "relative rounded-md px-4 py-2 text-[15px] font-medium transition-colors text-content-muted hover:text-content";

const navLinkActive =
  "text-content after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:rounded-full after:bg-accent-500";

export async function Header({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "nav" });

  const navItems = [
    { href: "/parents", label: t("parents") },
    { href: "/faq",     label: t("faq") },
    { href: "/about",   label: t("about") },
  ];

  const demoLabel = t("demo");

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-line/50 bg-surface/80 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10 lg:px-16"
      >
        {/* Logo */}
        <Link
          href={`/${locale}`}
          aria-label={t("logo_alt")}
          className="logo"
        >
          Syla<span className="logo-accent"> Slova</span>
        </Link>

        {/* Desktop nav — md and up */}
        <div className="hidden items-center gap-1 md:flex lg:gap-2">
          {navItems.map(({ href, label }) => (
            <NavLink
              key={href}
              href={href}
              className={navLinkBase}
              activeClassName={navLinkActive}
            >
              {label}
            </NavLink>
          ))}

          {/* Demo CTA */}
          <Link
            href={`/${locale}/demo`}
            className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-4 py-1.5 text-sm font-semibold text-white shadow-accent transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
              <path d="M0 0l10 6-10 6V0z" />
            </svg>
            {demoLabel}
          </Link>

          <div className="mx-3 h-5 w-px bg-line" aria-hidden="true" />
          <LanguageSwitcher currentLocale={locale} />
          <ThemeSwitcher />
        </div>

        {/* Mobile controls — below md */}
        <div className="flex items-center gap-1 md:hidden">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeSwitcher />
          <MobileMenu
            locale={locale}
            items={[{ href: "/demo", label: demoLabel, isAccent: true }, ...navItems]}
          />
        </div>
      </nav>
    </header>
  );
}
