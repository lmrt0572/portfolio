import { defineRouting } from "next-intl/routing";

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "fr",
  /**
   * Préfixe toujours présent (/fr, /en). Aucune négociation de langue côté
   * serveur n'est nécessaire : pas de middleware, et l'export statique reste
   * possible si le site migre un jour vers GitHub Pages.
   */
  localePrefix: "always",
});
