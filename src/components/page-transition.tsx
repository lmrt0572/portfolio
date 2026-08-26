"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";

const BAR_COUNT = 6;

/**
 * Transition à barres entre les pages, reprise de l'ancien site.
 *
 * Six bandes verticales balaient l'écran à chaque changement de route. Le `key`
 * dérive de la route : à son changement, React remonte l'élément et rejoue
 * l'animation CSS. `pointer-events: none` évite d'intercepter les clics.
 */
export function PageTransition() {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <div key={`${locale}${pathname}`} className="bars" aria-hidden="true">
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <span
          key={i}
          className="bars__bar"
          style={{ "--i": BAR_COUNT - 1 - i } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
