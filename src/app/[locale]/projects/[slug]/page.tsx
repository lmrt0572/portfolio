import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getProject, projects } from "@/content/projects";
import { pickTitle } from "@/content/types";
import { ProjectPipeline } from "@/components/project-pipeline";
import { TspDemo } from "@/components/tsp-demo";
import { TspAnnealingDemo } from "@/components/tsp-annealing-demo";
import { ProjectVideoPlayer } from "@/components/project-video";
import { ProjectGallery } from "@/components/project-gallery";
import { AlgebraDemo } from "@/components/algebra-demo";
import { SchemaDiagram } from "@/components/schema-diagram";
import { StrongboxDemo } from "@/components/strongbox-demo";
import { WeatherDemo } from "@/components/weather-demo";
import { SignalDemo } from "@/components/signal-demo";
import { ArrowLeftIcon, DownloadIcon, GithubIcon } from "@/components/icons";

type Params = { locale: Locale; slug: string };

/**
 * Une vidéo peut être déclarée dans le contenu avant d'être tournée. Plutôt que
 * d'afficher un bouton de lecture qui renverrait une erreur, on vérifie au
 * build que le fichier est bien dans public/ : la section apparaît le jour où
 * le fichier est déposé, et pas avant. Contrôle gratuit à l'exécution, la page
 * étant générée une fois pour toutes.
 */
function isPresent(publicPath: string): boolean {
  return existsSync(join(process.cwd(), "public", publicPath.replace(/^\//, "")));
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const title = pickTitle(project.title, locale);

  return {
    title,
    description: project.tagline[locale],
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: {
        fr: `/fr/projects/${slug}`,
        en: `/en/projects/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      title,
      description: project.tagline[locale],
      images: project.cover ? [{ url: project.cover.src }] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProject(slug);
  if (!project) notFound();

  const t = await getTranslations("project");
  const title = pickTitle(project.title, locale);

  /** Jusqu'à deux pièces, les documents deviennent des boutons dans l'en-tête ;
   *  au-delà, ils restent listés dans la colonne technique. */
  const documents = project.documents ?? [];
  const headerDocuments = documents.length <= 2 ? documents : [];

  return (
    <article>
      {/* Progression de lecture : ces pages sont longues et denses. */}
      <div className="read-progress" aria-hidden />
      {/* ---- En-tête ---------------------------------------------------
          Le titre reste sur fond plein plutôt qu'en surimpression : sur les
          illustrations de couverture, l'élément le plus parlant occupe
          justement la zone où viendrait le texte.
          À partir de `lg`, la couverture passe à droite du titre au lieu de
          s'empiler dessous : elle reste visible sans coûter un écran entier de
          défilement avant le premier paragraphe. */}
      <header>
        <div className="mx-auto grid max-w-[1920px] items-center gap-10 px-[9%] pb-12 pt-12 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
          <div className="min-w-0">
          <Link
            href="/projects"
            className="enter inline-flex items-center gap-2 font-semibold text-muted transition-colors hover:text-accent-text"
          >
            <ArrowLeftIcon />
            {t("backToProjects")}
          </Link>

          <div
            className="enter mt-10 flex flex-wrap items-center gap-3"
            style={{ "--i": 1 } as CSSProperties}
          >
            <span className="rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-white">
              {t(`domain.${project.domain}`)}
            </span>
            <span
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                project.status === "ongoing"
                  ? "bg-accent-soft text-accent-text"
                  : "bg-surface-2 text-muted"
              }`}
            >
              {t(`status.${project.status}`)}
            </span>
            <span className="text-sm font-semibold text-muted">
              {project.period[locale]}
            </span>
          </div>

          <h1
            className="enter mt-6 max-w-4xl text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-balance"
            style={{ "--i": 2 } as CSSProperties}
          >
            {title}
          </h1>

          <p
            className="enter mt-5 max-w-2xl text-xl leading-relaxed text-muted"
            style={{ "--i": 3 } as CSSProperties}
          >
            {project.tagline[locale]}
          </p>

          <p
            className="enter mt-4 font-semibold text-accent-text"
            style={{ "--i": 4 } as CSSProperties}
          >
            {project.context[locale]}
          </p>

          {/* Actions du projet (dépôt et documents), en haut sous le titre. */}
          {project.repo || headerDocuments.length ? (
            <div
              className="enter mt-8 flex flex-wrap gap-3"
              style={{ "--i": 5 } as CSSProperties}
            >
              {project.repo ? (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener"
                  className="btn-ghost"
                >
                  <GithubIcon />
                  {t("viewCode")}
                </a>
              ) : null}

              {headerDocuments.map((doc) => (
                <a
                  key={doc.href}
                  href={doc.href}
                  target="_blank"
                  rel="noopener"
                  className="btn-ghost"
                >
                  <DownloadIcon />
                  {doc.label[locale]}
                </a>
              ))}
            </div>
          ) : null}
          </div>

          {/* Couverture d'illustration : hauteur plafonnée, largeur au rapport
              réel du fichier, sans agrandissement au-delà de sa définition. */}
          {project.cover ? (
            <figure
              className="enter w-fit lg:max-w-[34rem]"
              style={{ "--i": 5 } as CSSProperties}
            >
              <Image
                src={project.cover.src}
                alt={project.cover.alt[locale]}
                width={project.cover.width ?? 1600}
                height={project.cover.height ?? 900}
                priority
                sizes="(min-width: 1024px) 34rem, 92vw"
                className="h-auto max-h-[22rem] w-auto max-w-full rounded-2xl border border-line-soft object-contain"
              />
              <figcaption className="mt-3 max-w-md text-sm text-muted-dim">
                {project.cover.alt[locale]}
              </figcaption>
            </figure>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-[1920px] px-[9%] pb-24">

        {/* ---- Bandeau de métadonnées --------------------------------- */}
        {project.facts?.length ? (
          <dl className="reveal mb-16 grid gap-x-10 gap-y-6 border-y border-line-soft py-8 sm:grid-cols-2 lg:grid-cols-4">
            {project.facts.map((fact) => (
              <div key={fact.label.en}>
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-accent-text">
                  {fact.label[locale]}
                </dt>
                <dd className="mt-2 leading-relaxed">{fact.value[locale]}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {/* ---- Confidentialité ---------------------------------------- */}
        {project.confidential ? (
          <div className="mb-14 border-t border-line-soft pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-text">
              {t("confidentialLabel")}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {t("confidentialNotice")}
            </p>
          </div>
        ) : null}

        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-20">
          <div className="min-w-0">
            {/* ---- Points clés ---------------------------------------- */}
            <section className="reveal">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-accent-text">
                {t("highlights")}
              </h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {project.highlights[locale].map((h) => (
                  <li key={h} className="card !p-5 text-[0.98rem] leading-relaxed">
                    {h}
                  </li>
                ))}
              </ul>
            </section>

            {/* ---- Vidéo de démonstration ------------------------------- */}
            {project.video && isPresent(project.video.mp4) ? (
              <section className="reveal mt-16">
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {t("videoTitle")}
                </h2>
                <div className="mt-7">
                  <ProjectVideoPlayer video={project.video} locale={locale} />
                </div>
              </section>
            ) : null}

            {/* ---- Démonstration interactive ---------------------------- */}
            {project.demo === "tsp" ? (
              <section className="reveal mt-16">
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {t("demoTitle")}
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                  {t("demoLead")}
                </p>
                <div className="mt-7">
                  <TspDemo />
                </div>

                <h3 className="mt-14 text-xl font-bold tracking-tight sm:text-2xl">
                  {t("demoEscapeTitle")}
                </h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                  {t("demoEscapeLead")}
                </p>
                <div className="mt-7">
                  <TspAnnealingDemo />
                </div>

                <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-dim">
                  {t("demoNote")}
                </p>
              </section>
            ) : null}

            {/* ---- Chaîne de traitement -------------------------------- */}
            {project.pipeline?.length ? (
              <section className="reveal mt-16">
                <h2 className="mb-8 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {t("pipeline")}
                </h2>
                <ProjectPipeline steps={project.pipeline} locale={locale} />
              </section>
            ) : null}

            {/* ---- Démonstration : la chaîne FSK ------------------------- */}
            {project.demo === "signal" ? (
              <section className="reveal mt-16">
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {t("demoTitle")}
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                  {t("signalLead")}
                </p>
                <div className="mt-7">
                  <SignalDemo />
                </div>
              </section>
            ) : null}

            {/* ---- Démonstration : la boucle de la station --------------- */}
            {project.demo === "weather" ? (
              <section className="reveal mt-16">
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {t("demoTitle")}
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                  {t("weatherLead")}
                </p>
                <div className="mt-7">
                  <WeatherDemo />
                </div>
              </section>
            ) : null}

            {/* ---- Démonstration : les deux facteurs du coffre ----------- */}
            {project.demo === "strongbox" ? (
              <section className="reveal mt-16">
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {t("demoTitle")}
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                  {t("strongboxLead")}
                </p>
                <div className="mt-7">
                  <StrongboxDemo />
                </div>
              </section>
            ) : null}

            {/* ---- Schéma de données ------------------------------------
                Placé entre la chaîne Merise, qui explique comment on y arrive,
                et la démonstration sur les requêtes, qui s'en sert. */}
            {project.demo === "algebra" ? (
              <section className="reveal mt-16">
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {t("schemaTitle")}
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                  {t("schemaLead")}
                </p>
                <div className="mt-7">
                  <SchemaDiagram locale={locale} />
                </div>
              </section>
            ) : null}

            {/* ---- Démonstration : arbres algébriques --------------------
                Placée après la chaîne Merise, dont la dernière étape y
                renvoie : la démonstration porte sur les requêtes, donc sur
                ce qui vient une fois le schéma en place. */}
            {project.demo === "algebra" ? (
              <section className="reveal mt-16">
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {t("demoTitle")}
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                  {t("algebraLead")}
                </p>
                <div className="mt-7">
                  <AlgebraDemo />
                </div>
              </section>
            ) : null}

            {/* ---- Sections rédigées ----------------------------------- */}
            <div className="mt-16 grid gap-14">
              {project.sections.map((section) => (
                <section key={section.id} className="reveal">
                  <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                    {section.title[locale]}
                  </h2>
                  {section.body ? (
                    <p className="mt-4 text-lg leading-relaxed text-muted">
                      {section.body[locale]}
                    </p>
                  ) : null}
                  {section.bullets ? (
                    <ul className="mt-5 grid gap-3">
                      {section.bullets[locale].map((b) => (
                        <li
                          key={b}
                          className="flex gap-3.5 leading-relaxed text-muted"
                        >
                          <span
                            aria-hidden
                            className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent"
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
          </div>

          {/* ---- Colonne technique ------------------------------------- */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-accent-text">
              {t("stack")}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full bg-surface-2 px-3.5 py-1.5 text-sm"
                >
                  {tech}
                </li>
              ))}
            </ul>

            {/* Les documents sont désormais en boutons dans l'en-tête ; ce
                rappel ne subsiste qu'à partir de trois pièces, où l'en-tête
                deviendrait une rangée de boutons plus longue que le titre. */}
            {project.documents && project.documents.length > 2 ? (
              <>
                <h2 className="mt-10 text-sm font-bold uppercase tracking-[0.14em] text-accent-text">
                  {t("documents")}
                </h2>
                <ul className="mt-4 grid gap-2.5">
                  {project.documents.map((doc) => (
                    <li key={doc.href}>
                      <a
                        href={doc.href}
                        target="_blank"
                        rel="noopener"
                        className="flex items-start gap-2.5 text-sm leading-snug text-muted transition-colors hover:text-accent-text"
                      >
                        <DownloadIcon className="mt-0.5 size-4 shrink-0" />
                        {doc.label[locale]}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </aside>
        </div>

        {/* ---- Galerie -------------------------------------------------- */}
        {project.gallery?.length ? (
          <section className="reveal mt-20">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-accent-text">
              {t("gallery")}
            </h2>
            <div className="mt-5">
              <ProjectGallery images={project.gallery} locale={locale} />
            </div>
          </section>
        ) : null}

        <Link href="/projects" className="btn-ghost mt-20">
          <ArrowLeftIcon />
          {t("backToProjects")}
        </Link>
      </div>
    </article>
  );
}
