import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { profile } from "@/content/profile";
import { routing, type Locale } from "@/i18n/routing";
import { ContactForm } from "@/components/contact-form";
import {
  DownloadIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
} from "@/components/icons";

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
    title: t("contactTitle"),
    description: t("contactDescription"),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { fr: "/fr/contact", en: "/en/contact" },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("sections");
  const c = await getTranslations("contact");

  const details = [
    {
      key: "phone",
      icon: <PhoneIcon className="size-6" />,
      label: c("phone"),
      value: profile.phone,
      href: profile.phoneHref,
    },
    {
      key: "email",
      icon: <MailIcon className="size-6" />,
      label: c("email"),
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    {
      key: "location",
      icon: <PinIcon className="size-6" />,
      label: c("location"),
      value: profile.location,
      href: null,
    },
  ];

  return (
    <div className="mx-auto max-w-[120rem] px-[9%] py-20 sm:py-24">
      {/* Deux colonnes : coordonnées à gauche, formulaire à droite — la
          disposition de l'ancien site, qui reste la plus lisible. */}
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div className="enter lg:pt-6">
          <h1 className="text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold leading-[1.08] tracking-tight text-balance">
            {t("contact")}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
            {t("contactLead")}
          </p>

          <ul className="mt-10 grid gap-6">
            {details.map((row, i) => {
              const body = (
                <>
                  <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-surface-2 text-accent-text">
                    {row.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-accent-text">
                      {row.label}
                    </span>
                    <span className="mt-0.5 block break-words font-semibold">
                      {row.value}
                    </span>
                  </span>
                </>
              );

              return (
                <li
                  key={row.key}
                  className="enter"
                  style={{ "--i": i + 1 } as CSSProperties}
                >
                  {row.href ? (
                    <a
                      href={row.href}
                      className="flex items-center gap-5 transition-colors hover:text-accent-text"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="flex items-center gap-5">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={profile.cv[locale]}
              target="_blank"
              rel="noopener"
              className="btn"
            >
              {c("downloadCv")}
              <DownloadIcon />
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

        <div className="enter" style={{ "--i": 2 } as CSSProperties}>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
