import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { projects } from "@/content/projects";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/path",
    "/projects",
    "/contact",
    ...projects.map((p) => `/projects/${p.slug}`),
  ];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: {
          ...Object.fromEntries(
            routing.locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
          ),
          // Version de repli quand la langue du visiteur ne correspond à aucune.
          "x-default": `${siteUrl}/${routing.defaultLocale}${path}`,
        },
      },
    })),
  );
}
