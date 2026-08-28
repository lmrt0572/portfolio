"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { useTransition } from "react";

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations("locale");
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <div
      role="group"
      aria-label={t("switch")}
      className="flex items-center overflow-hidden rounded-full border border-line text-xs font-bold"
      data-pending={pending}
    >
      {routing.locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-current={active ? "true" : undefined}
            disabled={active || pending}
            onClick={() =>
              startTransition(() => {
                router.replace(pathname, { locale: code });
              })
            }
            className={
              active
                ? "bg-accent px-3 py-1.5 text-white"
                : "px-3 py-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-ink"
            }
          >
            {t(code === "fr" ? "frShort" : "enShort")}
            <span className="sr-only">, {t(code)}</span>
          </button>
        );
      })}
    </div>
  );
}
