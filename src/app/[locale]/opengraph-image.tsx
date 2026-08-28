import { ImageResponse } from "next/og";

import { profile } from "@/content/profile";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Image de partage (Open Graph / Twitter) générée à la volée, une par langue.
 * Next l'injecte automatiquement dans les balises `og:image` / `twitter:image`
 * de toutes les pages sous `[locale]`.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = profile.name;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Reprises de la charte du site (globals.css).
const BG = "#1f242d";
const SURFACE = "#323946";
const INK = "#f0f3f6";
const MUTED = "#a3b3c2";
const ACCENT = "#3693b8";
const ACCENT_TEXT = "#5cbde0";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const role = profile.role[locale];
  const looking =
    locale === "fr"
      ? "Recherche un stage international · 2027"
      : "Seeking an international internship · 2027";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Barre d'accent en haut */}
        <div style={{ display: "flex", height: "10px", width: "160px", background: ACCENT, borderRadius: "999px" }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: "34px", color: ACCENT_TEXT, fontWeight: 600 }}>
            {profile.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "18px",
              fontSize: "68px",
              color: INK,
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: "900px",
            }}
          >
            {role}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: SURFACE,
              color: MUTED,
              fontSize: "28px",
              padding: "14px 26px",
              borderRadius: "999px",
            }}
          >
            {looking}
          </div>
          <div style={{ display: "flex", fontSize: "26px", color: MUTED }}>
            Thales LAS · CESI Rouen
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
