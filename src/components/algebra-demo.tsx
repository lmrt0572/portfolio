"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Démonstration : deux arbres algébriques pour la même requête.
 *
 * Le résultat est identique ; ce qui change est le volume traversé. On fait
 * remonter les lignes de bas en haut, nœud par nœud, pour que l'écart se voie
 * au lieu d'être asséné.
 *
 * Les volumes sont ceux d'un jeu de test déclaré ici même : c'est une
 * illustration du raisonnement, pas une mesure sur la base réelle.
 */

/** Cardinalités du jeu de test. */
const ROWS = {
  releve: 480_000,
  region: 18,
  heberger: 2_400,
  secteur: 12,
  /** Part des relevés situés dans la région filtrée. */
  regionShare: 1 / 18,
};

type Node = {
  /** Symbole de l'opération, ou nom de table pour une feuille. */
  op: string;
  label: string;
  /** Lignes en sortie de ce nœud. */
  rows: number;
};

const filtered = Math.round(ROWS.releve * ROWS.regionShare);

/** Jointure d'abord, filtre ensuite : le résultat intermédiaire est complet. */
const NAIVE: Node[] = [
  { op: "⋈", label: "Releve ⋈ Region", rows: ROWS.releve },
  { op: "⋈", label: "⋈ Heberger", rows: ROWS.releve * 4 },
  { op: "⋈", label: "⋈ Secteur", rows: ROWS.releve * 4 },
  { op: "σ", label: "σ région = Île-de-France", rows: filtered * 4 },
  { op: "γ", label: "γ max(ppm) par secteur", rows: ROWS.secteur },
];

/** Filtre au plus près de la feuille : tout ce qui suit travaille moins. */
const PUSHED: Node[] = [
  { op: "σ", label: "σ région = Île-de-France", rows: 1 },
  { op: "⋈", label: "Releve ⋈ Region", rows: filtered },
  { op: "⋈", label: "⋈ Heberger", rows: filtered * 4 },
  { op: "⋈", label: "⋈ Secteur", rows: filtered * 4 },
  { op: "γ", label: "γ max(ppm) par secteur", rows: ROWS.secteur },
];

const total = (nodes: Node[]) => nodes.reduce((sum, n) => sum + n.rows, 0);

const STEP_MS = 620;

/* Groupage par milliers avec une espace insécable ordinaire. 	oLocaleString
   emploie une espace fine insécable, que la police du site rend presque
   invisible : « 4426680 » au lieu de « 4 426 680 ». */
const grouped = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export function AlgebraDemo() {
  const t = useTranslations("algebra");
  const [step, setStep] = useState(-1);
  const timer = useRef<number | undefined>(undefined);

  const run = useCallback(() => {
    window.clearInterval(timer.current);
    setStep(0);
    timer.current = window.setInterval(() => {
      setStep((s) => {
        if (s >= NAIVE.length - 1) {
          window.clearInterval(timer.current);
          return s;
        }
        return s + 1;
      });
    }, STEP_MS);
  }, []);

  useEffect(() => () => window.clearInterval(timer.current), []);

  const done = step >= NAIVE.length - 1;
  const naiveTotal = total(NAIVE);
  const pushedTotal = total(PUSHED);
  const ratio = naiveTotal / pushedTotal;

  return (
    <div className="rounded-2xl border border-line-soft bg-surface p-5 sm:p-7">
      <pre className="hide-scrollbar overflow-x-auto rounded-xl bg-surface-2 p-4 text-[0.8rem] leading-relaxed">
        <code>{`SELECT   s.secteur_act, MAX(r.valeur_ppm)
FROM     Releve r
JOIN     Region g       ON r.Id_reg = g.Id_reg
JOIN     Heberger h     ON g.Id_reg = h.Id_reg
JOIN     Secteur s      ON h.Id_sect_act = s.Id_sect_act
WHERE    g.region = 'Île-de-France'
GROUP BY s.secteur_act;`}</code>
      </pre>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Tree title={t("naive")} nodes={NAIVE} step={step} tone="warn" pushed={false} />
        <Tree title={t("pushed")} nodes={PUSHED} step={step} tone="good" pushed />
      </div>

      {/* Sans cette clé de lecture, l'arbre n'est qu'un joli graphe : rien
          n'indique qu'il se parcourt du bas vers le haut, ni ce que valent
          les trois symboles. */}
      <div className="mt-6 rounded-xl bg-surface-2 p-4">
        <p className="text-sm leading-relaxed text-muted">{t("reading")}</p>
        <dl className="mt-3 flex flex-wrap gap-x-7 gap-y-2 text-sm">
          {(["join", "select", "group"] as const).map((op) => (
            <div key={op} className="flex items-baseline gap-2">
              <dt className="font-bold text-accent-text">{t(`sym.${op}`)}</dt>
              <dd className="text-muted-dim">{t(`def.${op}`)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={run} className="btn cursor-pointer">
          {t("run")}
        </button>
        <p aria-live="polite" className="text-sm font-semibold text-accent-text">
          {done ? t("verdict", { ratio: ratio.toFixed(1) }) : ""}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-dim">{t("note")}</p>
    </div>
  );
}

/**
 * L'arbre de jointure, dessiné.
 *
 * Les deux cas ont exactement la même forme : quatre tables jointes en
 * cascade. Seule la sélection change de place : tout en haut, une fois tout
 * assemblé, ou collée à la table qu'elle filtre. C'est ce déplacement d'un
 * seul nœud que le schéma doit rendre évident.
 */
function JoinTree({ pushed }: { pushed: boolean }) {
  const t = useTranslations("algebra");

  /* Disposition en échelle : le résultat accumulé descend à gauche, chaque
     nouvelle table se raccroche à droite. C'est la forme réelle d'un arbre de
     jointure gauche, pas une mise en page décorative. */
  const y = pushed
    ? { leaf: 178, sigma: 152, j1: 124, j2: 92, j3: 60, top: 24 }
    : { leaf: 178, sigma: 40, j1: 140, j2: 106, j3: 72, top: 12 };

  const spine = [
    { x: 66, y: y.j1 },
    { x: 108, y: y.j2 },
    { x: 152, y: y.j3 },
  ];

  const edge = (x1: number, y1: number, x2: number, y2: number, key: string) => (
    <line
      key={key}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="var(--color-line)"
      strokeWidth="1.2"
    />
  );

  return (
    <svg
      viewBox="0 0 236 196"
      className="mb-4 w-full max-w-[15rem]"
      role="img"
      aria-label={pushed ? t("treePushedLabel") : t("treeNaiveLabel")}
    >
      {/* Arêtes, sous les nœuds. */}
      {edge(32, y.leaf, spine[0].x, spine[0].y, "a")}
      {pushed
        ? [
            edge(104, y.leaf, 104, y.sigma + 8, "b1"),
            edge(104, y.sigma - 8, spine[0].x, spine[0].y, "b2"),
          ]
        : edge(104, y.leaf, spine[0].x, spine[0].y, "b")}
      {edge(spine[0].x, spine[0].y, spine[1].x, spine[1].y, "c")}
      {edge(156, y.j1, spine[1].x, spine[1].y, "d")}
      {edge(spine[1].x, spine[1].y, spine[2].x, spine[2].y, "e")}
      {edge(208, y.j2, spine[2].x, spine[2].y, "f")}
      {pushed
        ? edge(spine[2].x, spine[2].y, spine[2].x, y.top, "g")
        : [
            edge(spine[2].x, spine[2].y, spine[2].x, y.sigma, "g1"),
            edge(spine[2].x, y.sigma, spine[2].x, y.top, "g2"),
          ]}

      {/* Tables, aux feuilles. */}
      <Leaf x={32} y={y.leaf} label="Releve" />
      <Leaf x={104} y={y.leaf} label="Region" />
      <Leaf x={156} y={y.j1} label="Heberger" />
      <Leaf x={208} y={y.j2} label="Secteur" />

      {/* Jointures. */}
      {spine.map((p, i) => (
        <Op key={i} x={p.x} y={p.y} symbol="⋈" />
      ))}

      {/* La sélection, en accent : c'est elle qui bouge. */}
      <Op
        x={pushed ? 104 : spine[2].x}
        y={y.sigma}
        symbol="σ"
        highlight
      />
      <Op x={spine[2].x} y={y.top} symbol="γ" />
    </svg>
  );
}

function Leaf({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <text
      x={x}
      y={y + 4}
      textAnchor="middle"
      fontSize="9"
      fill="var(--color-muted)"
    >
      {label}
    </text>
  );
}

function Op({
  x,
  y,
  symbol,
  highlight,
}: {
  x: number;
  y: number;
  symbol: string;
  highlight?: boolean;
}) {
  return (
    <>
      <circle
        cx={x}
        cy={y}
        r="9"
        fill={highlight ? "var(--color-accent)" : "var(--color-surface-2)"}
        stroke={highlight ? "var(--color-accent)" : "var(--color-line)"}
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill={highlight ? "#fff" : "var(--color-ink)"}
      >
        {symbol}
      </text>
    </>
  );
}

function Tree({
  title,
  nodes,
  step,
  tone,
  pushed,
}: {
  title: string;
  nodes: Node[];
  step: number;
  tone: "warn" | "good";
  pushed: boolean;
}) {
  const t = useTranslations("algebra");
  const max = Math.max(...nodes.map((n) => n.rows));
  const visible = nodes.slice(0, step + 1);
  const running = visible.reduce((sum, n) => sum + n.rows, 0);

  return (
    <section>
      <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-muted-dim">
        {title}
      </h4>

      <JoinTree pushed={pushed} />

      {/* De bas en haut, comme un arbre : les feuilles d'abord. */}
      <ol className="flex flex-col-reverse gap-2">
        {nodes.map((node, i) => {
          const shown = i <= step;
          return (
            <li
              key={node.label}
              className="rounded-lg bg-surface-2 px-3 py-2 transition-opacity duration-300"
              style={{ opacity: shown ? 1 : 0.25 }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm">
                  <span className="mr-2 font-bold text-accent-text">{node.op}</span>
                  {node.label}
                </span>
                <span className="shrink-0 text-sm font-bold tabular-nums">
                  {shown ? grouped(node.rows) : "-"}
                </span>
              </div>
              {/* Échelle logarithmique : en linéaire, les petits nœuds
                  disparaîtraient complètement face aux gros. */}
              <div
                aria-hidden
                className={`mt-1.5 h-1 rounded-full transition-[width] duration-500 ${
                  tone === "warn" ? "bg-accent-alt" : "bg-accent"
                }`}
                style={{
                  width: shown
                    ? `${(Math.log10(node.rows + 1) / Math.log10(max + 1)) * 100}%`
                    : "0%",
                }}
              />
            </li>
          );
        })}
      </ol>

      <p className="mt-3 text-sm text-muted">
        {t("processed")}{" "}
        <span className="font-bold tabular-nums text-ink">
          {grouped(running)}
        </span>
      </p>
    </section>
  );
}
