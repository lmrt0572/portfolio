import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pickTitle, type Project } from "@/content/types";
import type { Locale } from "@/i18n/routing";
import { ArrowRightIcon } from "./icons";

/**
 * Repli sans visuel : fond graphique sans texte (le calque de survol est
 * semi-transparent et laisserait transparaître tout texte placé ici).
 */
function CoverFallback() {
  return (
    <div
      aria-hidden
      className="size-full bg-[radial-gradient(120%_110%_at_25%_0%,#31596e_0%,#243040_45%,#1b202a_100%)]"
    />
  );
}

export async function ProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const t = await getTranslations("project");
  const title = pickTitle(project.title, locale);
  const domain = t(`domain.${project.domain}`);

  return (
    <Link href={`/projects/${project.slug}`} className="pcard">
      <div className="pcard__media">
        {project.cover ? (
          <Image
            src={project.cover.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 92vw"
            className="object-cover"
          />
        ) : (
          <CoverFallback />
        )}

        {/* Calque de description, révélé au survol (retiré sur tactile). */}
        <div className="pcard__layer">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/80">
            {domain}
            {project.status === "ongoing" ? ` · ${t("status.ongoing")}` : ""}
          </span>
          <h3 className="text-2xl font-extrabold leading-tight text-white">
            {title}
          </h3>
          <p className="text-[0.95rem] leading-relaxed text-white/90">
            {project.tagline[locale]}
          </p>
          <span className="pcard__cta mt-2 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink-on-white">
            {t("viewProject")}
            <ArrowRightIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}
