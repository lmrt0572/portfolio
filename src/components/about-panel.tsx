import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { aboutFacts, bio, languages, profile, softSkills } from "@/content/profile";
import type { Locale } from "@/i18n/routing";
import { GithubIcon, LinkedinIcon, MailIcon } from "./icons";

/** Échelle CECRL : A1 → C2. Six crans, remplis selon le niveau. */
const CEFR_STEPS = 6;

export async function AboutPanel({ locale }: { locale: Locale }) {
  const t = await getTranslations("sections");
  const c = await getTranslations("contact");

  return (
    <div className="grid gap-12">
      {/* Carte d'identité : portrait, rôle, liens directs. */}
      <div className="grid gap-8 rounded-2xl bg-surface-2 p-7 sm:p-9 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-10">
        <div className="justify-self-center">
          <div className="portrait size-44">
            <div className="portrait__inner">
              <div className="portrait__photo">
                <Image
                  src={profile.portrait}
                  alt=""
                  width={260}
                  height={260}
                  sizes="11rem"
                  className="size-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-3xl font-extrabold tracking-tight">
            {profile.name}
          </p>
          <p className="mt-1.5 font-semibold text-accent-text">
            {profile.role[locale]}
          </p>
          <p className="mt-1 text-muted">
            {profile.company} · {profile.location}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="btn-ghost !px-5 !py-2.5 text-sm"
            >
              <MailIcon className="size-4" />
              {c("email")}
            </a>
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

      {/* Le texte : c'est le cœur de la section. */}
      <div className="grid gap-5">
        {bio[locale].map((paragraph, i) => (
          <p
            key={paragraph.slice(0, 40)}
            className={
              i === 0
                ? "text-xl leading-relaxed text-ink"
                : "text-lg leading-relaxed text-muted"
            }
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Langues, avec le niveau représenté sur l'échelle CECRL. */}
        <div className="rounded-2xl bg-surface-2 p-7">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-accent-text">
            {t("languages")}
          </h3>
          <ul className="mt-6 grid gap-5">
            {languages.map((lang) => (
              <li key={lang.label.en}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-semibold">{lang.label[locale]}</span>
                  <span className="text-sm text-muted">
                    {lang.level[locale]}
                  </span>
                </div>
                <div
                  className="mt-2.5 flex gap-1.5"
                  role="img"
                  aria-label={`${lang.label[locale]} : ${lang.level[locale]}`}
                >
                  {Array.from({ length: CEFR_STEPS }, (_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        i < lang.score ? "bg-accent" : "bg-bg"
                      }`}
                    />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Manière de travailler. */}
        <div className="rounded-2xl bg-surface-2 p-7">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-accent-text">
            {t("softSkills")}
          </h3>
          <ul className="mt-6 grid gap-4">
            {softSkills[locale].map((skill) => (
              <li key={skill} className="flex gap-3.5 leading-relaxed">
                <span
                  aria-hidden
                  className="mt-2 size-2 shrink-0 rotate-45 bg-accent"
                />
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Informations pratiques. */}
      <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
        {aboutFacts.map((fact) => (
          <div
            key={fact.label.en}
            className="border-b border-line-soft pb-4"
          >
            <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted-dim">
              {fact.label[locale]}
            </dt>
            <dd className="mt-1.5 leading-relaxed">{fact.value[locale]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
