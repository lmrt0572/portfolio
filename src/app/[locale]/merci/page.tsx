import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
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
  const t = await getTranslations({ locale, namespace: "thanks" });

  return {
    title: t("title"),
    // Page de confirmation atteinte uniquement après envoi : rien à indexer.
    robots: { index: false, follow: true },
  };
}

export default async function ThanksPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("thanks");

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-[9%] py-20 text-center sm:py-24">
      <div>
        <span
          className="enter mx-auto grid size-16 place-items-center rounded-full bg-surface-2 text-accent-text"
          aria-hidden
        >
          <svg
            viewBox="0 0 24 24"
            className="size-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>

        <h1
          className="enter mt-8 text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold leading-[1.08] tracking-tight text-balance"
          style={{ "--i": 1 } as CSSProperties}
        >
          {t("heading")} <span className="text-accent-text">{t("headingAccent")}</span>
        </h1>

        <p
          className="enter mx-auto mt-5 max-w-md text-lg leading-relaxed text-muted"
          style={{ "--i": 2 } as CSSProperties}
        >
          {t("lead")}
        </p>

        <div
          className="enter mt-10 flex flex-wrap justify-center gap-4"
          style={{ "--i": 3 } as CSSProperties}
        >
          <Link href="/" className="btn">
            {t("backHome")}
          </Link>
          <Link href="/projects" className="btn-ghost">
            {t("viewProjects")}
          </Link>
        </div>
      </div>
    </div>
  );
}
