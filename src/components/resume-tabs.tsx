"use client";

import { useId, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

export type ResumeTab = {
  id: string;
  label: string;
  heading: string;
  intro: string;
  content: ReactNode;
};

/**
 * Onglets Formation / Expérience / Compétences / À propos, repris de l'ancien
 * site. Implémentés en pattern ARIA « tabs » : navigation au clavier par les
 * flèches, panneau annoncé correctement.
 */
export function ResumeTabs({ tabs }: { tabs: ResumeTab[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const t = useTranslations("sections");

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const last = tabs.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    if (event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;

    if (next !== null) {
      event.preventDefault();
      setActive(next);
      document.getElementById(`${baseId}-tab-${next}`)?.focus();
    }
  }

  const current = tabs[active];

  return (
    <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
      <div
        role="tablist"
        aria-label={t("path")}
        aria-orientation="vertical"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:flex-col lg:self-start"
      >
        {tabs.map((tab, i) => {
          const selected = i === active;
          return (
            <button
              key={tab.id}
              id={`${baseId}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
              /* Boutons pleins et empilés, comme sur l'ancien site : l'onglet
                 actif se signale par un contour et un texte d'accent, pas par
                 un aplat — c'est plus lisible dans une colonne. */
              className={`cursor-pointer rounded-lg border-2 px-4 py-3.5 text-center font-semibold transition-colors sm:px-6 lg:w-full ${
                selected
                  ? "border-accent bg-surface-2 text-accent-text"
                  : "border-surface-2 bg-surface-2 text-ink hover:border-accent hover:bg-accent hover:text-bg"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        key={current.id}
        id={`${baseId}-panel-${active}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        tabIndex={0}
        className="panel-in"
      >
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {current.heading}
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          {current.intro}
        </p>
        <div className="mt-10">{current.content}</div>
      </div>
    </div>
  );
}
