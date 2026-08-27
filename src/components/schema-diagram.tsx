"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import type { Locale } from "@/i18n/routing";

/**
 * Modèle logique des données du projet, dans ses deux formes.
 *
 * La notation Merise est la vue par défaut : douze tables tiennent en douze
 * lignes, sans rien perdre. Le diagramme livré est disponible juste à côté pour
 * qui veut voir les liens, mais il occupe dix fois la place pour la même
 * information. D'où l'ordre.
 *
 * Les noms sont ceux du livrable, y compris les abréviations : `Nom_age`,
 * `Taux_pro`, `Capteur_dep`. Les corriger reviendrait à décrire un autre
 * modèle que celui qui a réellement été rendu.
 */

type Column = { name: string; key?: "pk" | "fk" };
type Table = { name: string; columns: Column[]; note?: "join" };

const TABLES: Table[] = [
  {
    name: "Region",
    columns: [{ name: "Id_reg", key: "pk" }, { name: "Region" }],
  },
  {
    name: "Ville",
    columns: [
      { name: "Id_vil", key: "pk" },
      { name: "Ville" },
      { name: "Code_pos" },
      { name: "Id_reg", key: "fk" },
    ],
  },
  {
    name: "Agence",
    columns: [
      { name: "Id_agence", key: "pk" },
      { name: "Nom_age" },
      { name: "Adr_age" },
      { name: "Id_vil", key: "fk" },
    ],
  },
  {
    name: "Personnel",
    columns: [
      { name: "Id_per", key: "pk" },
      { name: "Nom_per" },
      { name: "Prenom_per" },
      { name: "Date_nai_per" },
      { name: "Date_job" },
      { name: "Type_per" },
      { name: "Taux_pro" },
    ],
  },
  {
    name: "Secteur_d_activite",
    columns: [{ name: "Id_sect_act", key: "pk" }, { name: "Secteur_act" }],
  },
  {
    name: "Gaz",
    columns: [
      { name: "Id_gaz", key: "pk" },
      { name: "Type_gaz" },
      { name: "Nom_gaz" },
      { name: "Id_sect_act", key: "fk" },
    ],
  },
  {
    name: "Capteur",
    columns: [
      { name: "Id_cap", key: "pk" },
      { name: "Capteur_dep" },
      { name: "Id_gaz", key: "fk" },
      { name: "Id_agence", key: "fk" },
      { name: "Id_per", key: "fk" },
    ],
  },
  {
    name: "Releve",
    columns: [
      { name: "Id_rel", key: "pk" },
      { name: "Valeur_ppm" },
      { name: "Date_rel" },
      { name: "Id_gaz", key: "fk" },
      { name: "Id_cap", key: "fk" },
      { name: "Id_per", key: "fk" },
      { name: "Id_reg", key: "fk" },
    ],
  },
  {
    name: "Rapport",
    columns: [
      { name: "Id_rap", key: "pk" },
      { name: "Titre_rap" },
      { name: "Date_rap" },
      { name: "Id_per", key: "fk" },
    ],
  },
  {
    name: "Emettre",
    note: "join",
    columns: [
      { name: "Id_reg", key: "fk" },
      { name: "Id_gaz", key: "fk" },
    ],
  },
  {
    name: "Heberger",
    note: "join",
    columns: [
      { name: "Id_reg", key: "fk" },
      { name: "Id_sect_act", key: "fk" },
    ],
  },
  {
    name: "Alimenter",
    note: "join",
    columns: [
      { name: "Id_rel", key: "fk" },
      { name: "Id_rap", key: "fk" },
    ],
  },
];

export function SchemaDiagram({ locale }: { locale: Locale }) {
  const t = useTranslations("schema");
  const [view, setView] = useState<"notation" | "diagram">("notation");

  return (
    <div className="rounded-2xl border border-line-soft bg-surface p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap gap-2">
        {(["notation", "diagram"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            aria-pressed={view === v}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              view === v
                ? "bg-accent text-white"
                : "bg-surface-2 text-muted hover:text-ink"
            }`}
          >
            {t(v)}
          </button>
        ))}
      </div>

      {view === "notation" ? <Notation /> : <Diagram locale={locale} />}

      <p className="mt-5 text-sm leading-relaxed text-muted-dim">{t("note")}</p>
    </div>
  );
}

/** Notation Merise : le `#` marque une clé étrangère, le gras une clé primaire. */
function Notation() {
  const t = useTranslations("schema");

  return (
    <div>
      <ul className="hide-scrollbar overflow-x-auto rounded-xl bg-surface-2 p-4 font-mono text-[0.78rem] leading-loose sm:text-[0.85rem]">
        {TABLES.map((table) => (
          <li key={table.name} className="whitespace-nowrap">
            <span className="font-bold text-accent-text">{table.name}</span>
            <span className="text-muted"> (</span>
            {table.columns.map((column, i) => (
              <span key={column.name}>
                {i > 0 ? <span className="text-muted">, </span> : null}
                <span
                  className={
                    column.key === "pk"
                      ? "font-bold underline decoration-dotted underline-offset-4"
                      : column.key === "fk"
                        ? "text-accent-alt"
                        : "text-muted"
                  }
                >
                  {column.key === "fk" ? `#${column.name}` : column.name}
                </span>
              </span>
            ))}
            <span className="text-muted">)</span>
            {table.note === "join" ? (
              <span className="ml-2 text-xs italic text-muted-dim">
                {t("joinTable")}
              </span>
            ) : null}
          </li>
        ))}
      </ul>

      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-dim">
        <li>
          <span className="mr-1.5 font-bold underline decoration-dotted underline-offset-4">
            Id
          </span>
          {t("pk")}
        </li>
        <li>
          <span className="mr-1.5 font-bold text-accent-alt">#Id</span>
          {t("fk")}
        </li>
      </ul>
    </div>
  );
}

/** Le diagramme tel qu'il a été livré, sur son fond clair d'origine. */
function Diagram({ locale }: { locale: Locale }) {
  const t = useTranslations("schema");

  return (
    <figure>
      {/* Fond clair conservé : le diagramme a été produit ainsi, et le
          recolorer donnerait un document qui n'a jamais existé. */}
      <div className="overflow-hidden rounded-xl bg-white p-2">
        <Image
          src="/images/mld-qualite-air.png"
          alt={t("diagramLabel")}
          width={1327}
          height={871}
          sizes="(min-width: 1024px) 48rem, 92vw"
          className="h-auto w-full"
        />
      </div>
      <figcaption className="mt-3 text-sm text-muted-dim">
        {t("diagramCaption")}{" "}
        <a
          href="/images/mld-qualite-air.png"
          target="_blank"
          rel="noopener"
          className="font-semibold text-accent-text underline-offset-4 hover:underline"
          lang={locale}
        >
          {t("openFull")}
        </a>
      </figcaption>
    </figure>
  );
}
