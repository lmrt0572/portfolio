"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";

const BAR_COUNT = 6;

/**
 * Transition à barres entre les pages, reprise de l'ancien site.
 *
 * Six bandes verticales balaient l'écran à chaque changement de route, avec un
 * décalage entre elles. Le `key` dérive de la route : quand elle change, React
 * remonte l'élément et l'animation CSS se rejoue — aucun état ni minuteur à
 * synchroniser. En fin d'animation les barres restent hors écran (`both`), et
 * `pointer-events: none` les empêche d'intercepter le moindre clic.
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
