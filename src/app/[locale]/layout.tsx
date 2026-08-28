import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";

import { routing, type Locale } from "@/i18n/routing";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";
import { SiteHeader } from "@/components/site-header";
import { themeInitScript } from "@/components/theme-toggle";
import { SiteFooter } from "@/components/site-footer";
import { StructuredData } from "@/components/structured-data";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

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
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title"),
      template: `%s · ${profile.name}`,
    },
    description: t("description"),
    authors: [{ name: profile.name, url: profile.github }],
    creator: profile.name,
    alternates: {
      canonical: `/${locale}`,
      // `x-default` désigne la version servie à un visiteur dont la langue ne
      // correspond à aucune des deux. Sans elle, Google choisit lui-même.
      languages: { fr: "/fr", en: "/en", "x-default": "/fr" },
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      title: t("title"),
      description: t("description"),
      siteName: profile.name,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations("nav");

  return (
    <html
      lang={locale}
      className={jakarta.variable}
      suppressHydrationWarning
    >
      <head>
        {/* Pose le thème enregistré avant le premier pixel peint : sans ça, la
            page s'afficherait en sombre puis basculerait, ce qui clignote.
            `next/script` en `beforeInteractive` injecte le script inline dans le
            `<head>` du HTML serveur ; un `<script>` brut en JSX serait, lui,
            rejeté par React 19 (jamais ré-exécuté côté client). */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <StructuredData locale={locale as Locale} />
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:font-semibold focus:text-white"
          >
            {t("skipToContent")}
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
