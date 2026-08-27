"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Démonstration : les deux facteurs du coffre.
 *
 * On présente une carte, on règle les quatre interrupteurs, et le verrou ne
 * cède que si les deux concordent. Le message d'état ne dit jamais lequel des
 * deux est faux. C'est le comportement du prototype, et la raison en est
 * expliquée dans la page : le préciser aiderait à chercher séparément.
 */

/** Combinaison attendue, dans l'ordre des interrupteurs. */
const COMBINATION = [true, false, true, true];

type Card = "none" | "agent" | "chief" | "unknown";

/** Chaque carte reconnue ouvre son propre niveau de droits. */
const LEVELS: Record<Card, { level: number; keyName: string }> = {
  none: { level: 0, keyName: "cardNone" },
  agent: { level: 1, keyName: "cardAgent" },
  chief: { level: 2, keyName: "cardChief" },
  unknown: { level: 0, keyName: "cardUnknown" },
};

export function StrongboxDemo() {
  const t = useTranslations("strongbox");
  const [card, setCard] = useState<Card>("none");
  const [switches, setSwitches] = useState([false, false, false, false]);
  const [attempted, setAttempted] = useState(false);

  const cardOk = card === "agent" || card === "chief";
  const comboOk = switches.every((s, i) => s === COMBINATION[i]);
  const open = cardOk && comboOk;
  const level = LEVELS[card].level;

  const toggle = (i: number) => {
    setAttempted(false);
    setSwitches((prev) => prev.map((s, j) => (j === i ? !s : s)));
  };

  return (
    <div className="rounded-2xl border border-line-soft bg-surface p-5 sm:p-7">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          {/* Facteur 1 : ce que l'on possède */}
          <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-muted-dim">
            {t("factorOne")}
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["agent", "chief", "unknown", "none"] as Card[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCard(c);
                  setAttempted(false);
                }}
                aria-pressed={card === c}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  card === c
                    ? "bg-accent text-white"
                    : "bg-surface-2 text-muted hover:text-ink"
                }`}
              >
                {t(LEVELS[c].keyName)}
              </button>
            ))}
          </div>

          {/* Facteur 2 : ce que l'on sait */}
          <h4 className="mt-7 text-sm font-bold uppercase tracking-[0.12em] text-muted-dim">
            {t("factorTwo")}
          </h4>
          <div className="mt-3 flex gap-3">
            {switches.map((on, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={on}
                aria-label={t("switch", { n: i + 1 })}
                className="group cursor-pointer"
              >
                <span
                  className={`flex h-14 w-9 items-start justify-center rounded-full border-2 p-1 transition-colors ${
                    on ? "border-accent bg-accent-soft" : "border-line bg-surface-2"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`size-6 rounded-full transition-transform duration-200 ${
                      on ? "translate-y-0 bg-accent" : "translate-y-6 bg-line"
                    }`}
                  />
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setAttempted(true)}
            className="btn mt-7 cursor-pointer"
          >
            {t("try")}
          </button>
        </div>

        {/* Le verrou */}
        <div className="flex flex-col items-center gap-3">
          <svg
            viewBox="0 0 64 76"
            className={`w-28 transition-colors duration-300 ${
              attempted && open ? "text-accent-text" : "text-muted-dim"
            }`}
            aria-hidden
          >
            {/* L'anse pivote pour s'ouvrir : c'est le seul retour visuel du succès. */}
            <path
              d="M18 30V20a14 14 0 0 1 28 0v10"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              style={{
                transformOrigin: "46px 30px",
                transform: attempted && open ? "rotate(38deg)" : "none",
                transition: "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
            <rect
              x="8"
              y="30"
              width="48"
              height="42"
              rx="8"
              fill="currentColor"
              opacity="0.22"
            />
            <circle cx="32" cy="47" r="5" fill="currentColor" />
            <rect x="30" y="50" width="4" height="12" rx="2" fill="currentColor" />
          </svg>

          <p
            aria-live="polite"
            className={`min-h-12 max-w-56 text-center text-sm font-semibold ${
              attempted && open ? "text-accent-text" : "text-muted"
            }`}
          >
            {!attempted
              ? t("idle")
              : open
                ? t("granted", { level })
                : t("denied")}
          </p>
        </div>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-muted-dim">{t("note")}</p>
    </div>
  );
}
