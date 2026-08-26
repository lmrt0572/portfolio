"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/", key: "home" },
  { href: "/path", key: "path" },
  { href: "/projects", key: "projects" },
  { href: "/contact", key: "contact" },
] as const;

/**
 * En-tête recalé sur l'ancien site : gouttières à 9 %, logo à ~33px, liens à
 * ~20px largement espacés, fond plein sans bordure ni flou. L'état actif est
 * porté par la couleur d'accent et un trait sous le lien.
 *
 * Le menu complet n'apparaît qu'à partir de `lg`, pas de `md` : les requêtes
 * média raisonnent en rem d'origine (16px) alors que la page compose sur une
 * base de 17,5px. À 768px exactement, les liens s'affichaient donc dans une
 * largeur trop courte de 27px, et toutes les pages débordaient.
 */
export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-bg">
      <div className="mx-auto flex h-[var(--header-h)] max-w-[120rem] items-center justify-between gap-8 px-[9%]">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="shrink-0 text-[1.9rem] font-extrabold leading-none tracking-tight"
        >
          Léo<span className="text-accent-text">.</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-9 lg:flex">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 text-[1.2rem] font-medium transition-colors ${
                  active ? "text-accent-text" : "text-ink hover:text-accent-text"
                }`}
              >
                {t(link.key)}
                <span
                  aria-hidden
                  className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <ThemeToggle />
          <LocaleSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t("close") : t("menu")}
            className="grid size-11 cursor-pointer place-items-center rounded-full border-2 border-accent text-accent-text transition-colors hover:bg-accent hover:text-white lg:hidden"
          >
            <svg
              viewBox="0 0 20 20"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden
            >
              {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
            </svg>
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line-soft bg-bg lg:hidden"
      >
        <ul className="mx-auto max-w-[120rem] px-[9%] py-2">
          {links.map((link) => (
            <li key={link.href} className="border-b border-line-soft last:border-0">
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`block py-4 text-xl font-semibold ${
                  isActive(link.href) ? "text-accent-text" : "text-ink"
                }`}
              >
                {t(link.key)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
