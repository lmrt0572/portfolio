import type { CSSProperties } from "react";

/** Durée pendant laquelle chaque phrase occupe la ligne, en secondes. */
const SLOT_SECONDS = 4.2;

/**
 * Phrase qui se réécrit sous le nom, reprise de l'ancien site mais lissée.
 *
 * Les segments sont superposés en absolu et n'animent que la largeur de leur
 * masque : chaque phrase se tape, se tient, puis s'efface avant que la suivante
 * ne commence. Aucun basculement de `display`, donc aucun à-coup.
 *
 * Les repères des images-clés sont calculés à partir du nombre de phrases, si
 * bien qu'on peut en ajouter ou en retirer sans retoucher le CSS.
 */
export function Typer({ phrases }: { phrases: string[] }) {
  const count = phrases.length;
  const longest = phrases.reduce(
    (best, phrase) => (phrase.length > best.length ? phrase : best),
    "",
  );

  // Un créneau vaut 100/count % du cycle complet. Les fractions ci-dessous
  // découpent ce créneau : frappe, maintien, effacement, puis repos.
  const slot = 100 / count;
  const at = (fraction: number) => +(slot * fraction).toFixed(3);
  const fillName = `typer-fill-${count}`;
  const showName = `typer-show-${count}`;

  const keyframes = `
/* Remplissage : le masque plein découvre le texte, le tient, puis se retire. */
@keyframes ${fillName} {
  0%             { width: 0;    border-right-color: var(--color-accent-text); }
  ${at(0.32)}%   { width: 100%; border-right-color: var(--color-accent-text); }
  ${at(0.76)}%   { width: 100%; border-right-color: var(--color-accent-text); }
  ${at(0.96)}%   { width: 0;    border-right-color: var(--color-accent-text); }
  ${at(0.98)}%   { width: 0;    border-right-color: transparent; }
  100%           { width: 0;    border-right-color: transparent; }
}

/* Présence : les lettres creuses n'apparaissent que pendant leur créneau. */
@keyframes ${showName} {
  0%             { opacity: 0; }
  ${at(0.06)}%   { opacity: 1; }
  ${at(0.94)}%   { opacity: 1; }
  ${at(1)}%      { opacity: 0; }
  100%           { opacity: 0; }
}`;

  return (
    <span
      className="typer"
      style={
        {
          "--cycle": `${(SLOT_SECONDS * count).toFixed(2)}s`,
          "--slot": `${SLOT_SECONDS}s`,
        } as CSSProperties
      }
    >
      <style>{keyframes}</style>

      {/* Réserve la largeur de la phrase la plus longue : la ligne ne bouge pas. */}
      <span className="typer__sizer" aria-hidden="true">
        {longest}
      </span>

      {phrases.map((phrase, i) => (
        <span
          key={phrase}
          className="typer__item"
          style={{ "--i": i, animationName: showName } as CSSProperties}
        >
          {/* Boîte à la largeur de cette phrase-ci, et non de la plus longue :
              c'est elle que le masque remplit, et c'est elle que l'alignement
              du paragraphe centre ou colle à gauche. */}
          <span className="typer__slot">
            <span className="typer__ghost" aria-hidden="true">
              {phrase}
            </span>
            <span className="typer__mask" style={{ animationName: fillName }}>
              {phrase}
            </span>
          </span>
        </span>
      ))}
    </span>
  );
}
