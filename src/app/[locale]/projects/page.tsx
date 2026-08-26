import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProjectCard } from "@/components/project-card";
import { SectionTitle } from "@/components/section-title";
import { orderedProjects } from "@/content/projects";
import { routing, type Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("projectsTitle"),
    description: t("projectsDescription"),
    alternates: {
      canonical: `/${locale}/projects`,
      languages: { fr: "/fr/projects", en: "/en/projects" },
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sections");

  return (
    <div className="mx-auto max-w-[120rem] px-[9%] py-20 sm:py-24">
      <div className="enter">
        <SectionTitle lead={t("projectsLeadWord")} accent={t("projectsAccent")}>
          {t("projectsLead")}
        </SectionTitle>
      </div>

      {/* Une seule grille : la hiérarchie passe par l'ordre de `displayOrder`,
          plus par un intertitre. Le décalage d'apparition est calé sur la
          position dans la ligne, sinon la dernière carte d'une grille de neuf
          arriverait avec une seconde de retard. */}
      <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {orderedProjects.map((project, i) => (
          <div
            key={project.slug}
            className="reveal"
            style={{ "--i": (i % 3) + 1 } as CSSProperties}
          >
            <ProjectCard project={project} locale={locale} />
          </div>
        ))}
      </div>
    </div>
  );
}
