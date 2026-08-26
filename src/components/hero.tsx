import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { profile, typerLead, typerPhrases } from "@/content/profile";
import { Typer } from "./typer";
import { Portrait } from "./portrait";
import { GithubIcon, LinkedinIcon } from "./icons";
import type { Locale } from "@/i18n/routing";

/**
 * Page d'accueil. Sous `lg`, tout est centré sous le portrait ; à partir de
 * `lg`, texte à gauche et portrait à droite.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations("hero");

  return (
    <section className="mx-auto flex max-w-[90rem] flex-col-reverse items-center justify-center min-h-[calc(100svh-5.5rem)] gap-6 px-[9%] py-4 text-center sm:gap-10 sm:py-10 lg:flex-row lg:justify-between lg:gap-10 lg:py-0 lg:text-left">
      <div className="flex w-full min-w-0 max-w-[34rem] flex-col items-center lg:max-w-[46rem] lg:items-start">
        <h1
          className="enter text-[clamp(2.4rem,5.5vw,4.3rem)] font-extrabold leading-[1.06] tracking-[-0.03em]"
          style={{ "--i": 0 } as CSSProperties}
        >
          {profile.name}
        </h1>

        <p
          className="enter mt-1 text-[clamp(1.25rem,2.6vw,2.05rem)] font-bold leading-[1.3]"
          style={{ "--i": 1 } as CSSProperties}
        >
          {typerLead[locale]} <Typer phrases={typerPhrases[locale]} />
        </p>

        <p
          className="enter mt-4 max-w-[32rem] text-[0.95rem] leading-relaxed text-muted text-pretty sm:mt-4 sm:text-base lg:max-w-[42rem] lg:text-[1.05rem]"
          style={{ "--i": 2 } as CSSProperties}
        >
          {profile.pitch[locale]}
        </p>

        <p
          className="enter mt-3 inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent-text sm:mt-4 sm:px-4 sm:py-2 sm:text-sm"
          style={{ "--i": 3 } as CSSProperties}
        >
          <span className="size-1.5 shrink-0 rounded-full bg-accent-text" />
          {profile.availability[locale]}
        </p>

        {/* Ordre du DOM : bouton puis icônes. `flex-col-reverse` remonte les
            icônes au-dessus du bouton sous `lg` ; ligne unique à partir de `lg`. */}
        <div
          className="enter mt-5 flex flex-col-reverse items-center gap-4 sm:mt-6 lg:flex-row lg:gap-6"
          style={{ "--i": 4 } as CSSProperties}
        >
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link href="/projects" className="btn">
              {t("cta")}
            </Link>
            <a
              href={profile.cv[locale]}
              target="_blank"
              rel="noopener"
              className="btn-ghost"
            >
              {t("cv")}
            </a>
          </div>

          <div className="flex items-center gap-3.5">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener"
              aria-label="GitHub"
              className="btn-round"
            >
              <GithubIcon />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener"
              aria-label="LinkedIn"
              className="btn-round"
            >
              <LinkedinIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="enter-right shrink-0">
        <Portrait alt={t("portraitAlt", { name: profile.name })} />
      </div>
    </section>
  );
}
