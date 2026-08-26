import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ResumeTabs, type ResumeTab } from "@/components/resume-tabs";
import { SectionTitle } from "@/components/section-title";
import { SkillsGrid } from "@/components/skills-grid";
import { AboutPanel } from "@/components/about-panel";
import { education, experience } from "@/content/profile";
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
    title: t("pathTitle"),
    description: t("pathDescription"),
    alternates: {
      canonical: `/${locale}/path`,
      languages: { fr: "/fr/path", en: "/en/path" },
    },
  };
}

/** Bloc daté réutilisé par les onglets Formation et Expérience. */
function TimelineItem({
  period,
  title,
  org,
  detail,
  bullets,
  currentLabel,
}: {
  period: string;
  title: string;
  org: string;
  detail?: string;
  bullets?: string[];
  /** Renseigné uniquement pour le poste en cours. */
  currentLabel?: string;
}) {
  return (
    <li className="card">
      <div className="flex flex-wrap items-center gap-3">
        <span className="card-accent text-base font-bold">{period}</span>
        {currentLabel ? (
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-dim">
            {currentLabel}
          </span>
        ) : null}
      </div>

      <h3 className="mt-3 text-2xl font-bold leading-snug">{title}</h3>
      <p className="card-alt mt-1.5 font-semibold">{org}</p>

      {detail ? (
        <p className="mt-3 leading-relaxed text-muted">{detail}</p>
      ) : null}

      {bullets ? (
        <ul className="mt-4 space-y-2.5">
          {bullets.map((b) => (
            <li key={b} className="flex gap-3 leading-relaxed text-muted">
              <span
                aria-hidden
                className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent"
              />
              {b}
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default async function PathPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sections");

  const tabs: ResumeTab[] = [
    {
      id: "education",
      label: t("education"),
      heading: t("education"),
      intro: t("educationLead"),
      content: (
        <ul className="grid gap-5">
          {education.map((item) => (
            <TimelineItem
              key={item.org + item.period[locale]}
              period={item.period[locale]}
              title={item.degree[locale]}
              org={item.org}
              detail={item.detail[locale]}
            />
          ))}
        </ul>
      ),
    },
    {
      id: "experience",
      label: t("experience"),
      heading: t("experience"),
      intro: t("experienceLead"),
      content: (
        <ul className="grid gap-5">
          {experience.map((item) => (
            <TimelineItem
              key={item.org + item.period[locale]}
              period={item.period[locale]}
              title={item.role[locale]}
              org={`${item.org} · ${item.location}`}
              bullets={item.bullets[locale]}
              currentLabel={item.current ? t("current") : undefined}
            />
          ))}
        </ul>
      ),
    },
    {
      id: "skills",
      label: t("skills"),
      heading: t("skills"),
      intro: t("skillsLead"),
      content: <SkillsGrid locale={locale} />,
    },
    {
      id: "about",
      label: t("about"),
      heading: t("about"),
      intro: t("aboutLead"),
      content: <AboutPanel locale={locale} />,
    },
  ];

  return (
    <div className="mx-auto max-w-[120rem] px-[9%] py-20 sm:py-24">
      <div className="enter">
        <SectionTitle lead={t("pathLeadWord")} accent={t("pathAccent")} />
      </div>
      <ResumeTabs tabs={tabs} />
    </div>
  );
}
