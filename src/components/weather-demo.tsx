"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Démonstration : la boucle de la station.
 *
 * Elle ne rejoue pas de vraies mesures : le prototype n'a pas laissé de jeu de
 * données publiable. Ce qu'elle montre est le rythme : les capteurs sont lus à
 * chaque tour, l'écriture sur carte SD est bien plus lente et n'a donc lieu
 * qu'un tour sur dix, et un capteur muet ne fige pas la boucle.
 */

const TICK_MS = 700;
/** Un enregistrement tous les dix relevés : l'écriture coûte cher. */
const LOG_EVERY = 10;
const HISTORY = 40;

type Quantity = {
  id: string;
  unit: string;
  min: number;
  max: number;
  decimals: number;
};

const QUANTITIES: Quantity[] = [
  { id: "pressure", unit: "hPa", min: 998, max: 1024, decimals: 0 },
  { id: "humidity", unit: "%", min: 58, max: 92, decimals: 0 },
  { id: "light", unit: "lx", min: 40, max: 900, decimals: 0 },
  { id: "temperature", unit: "°C", min: 6, max: 19, decimals: 1 },
];

/** Marche aléatoire bornée : plus crédible qu'un bruit blanc, moins qu'un modèle. */
function drift(value: number, q: Quantity): number {
  const span = q.max - q.min;
  const next = value + (Math.random() - 0.5) * span * 0.06;
  return Math.min(q.max, Math.max(q.min, next));
}

export function WeatherDemo() {
  const t = useTranslations("weather");
  const [running, setRunning] = useState(false);
  /** Capteur volontairement muet, pour montrer que la boucle continue. */
  const [muted, setMuted] = useState<number | null>(null);
  const timer = useRef<number | undefined>(undefined);

  /* Valeurs, historique et compteurs vivent dans un seul état : les faire
     coexister dans des états séparés obligerait à les resynchroniser par un
     effet, c'est-à-dire à réintroduire la désynchronisation qu'on veut éviter. */
  const [data, setData] = useState(() => ({
    tick: 0,
    logs: 0,
    values: QUANTITIES.map((q) => (q.min + q.max) / 2),
    history: QUANTITIES.map(() => [] as number[]),
  }));

  const step = useCallback(() => {
    setData((prev) => {
      const values = prev.values.map((v, i) =>
        i === muted ? v : drift(v, QUANTITIES[i]),
      );
      const tick = prev.tick + 1;
      return {
        tick,
        logs: tick % LOG_EVERY === 0 ? prev.logs + 1 : prev.logs,
        values,
        history: prev.history.map((serie, i) =>
          [...serie, values[i]].slice(-HISTORY),
        ),
      };
    });
  }, [muted]);

  const { values, history, tick, logs } = data;

  useEffect(() => {
    if (!running) {
      window.clearInterval(timer.current);
      return;
    }
    timer.current = window.setInterval(step, TICK_MS);
    return () => window.clearInterval(timer.current);
  }, [running, step]);

  return (
    <div className="rounded-2xl border border-line-soft bg-surface p-5 sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUANTITIES.map((q, i) => {
          const serie = history[i];
          const isMuted = muted === i;
          return (
            <article
              key={q.id}
              className={`rounded-xl bg-surface-2 p-4 transition-opacity ${
                isMuted ? "opacity-50" : ""
              }`}
            >
              <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-muted-dim">
                {t(q.id)}
              </h4>
              <p className="mt-1 text-2xl font-extrabold tabular-nums">
                {isMuted ? "-" : values[i].toFixed(q.decimals)}
                <span className="ml-1 text-sm font-semibold text-muted">
                  {q.unit}
                </span>
              </p>
              <Sparkline values={serie} min={q.min} max={q.max} />
              <button
                type="button"
                onClick={() => setMuted(isMuted ? null : i)}
                className="mt-2 cursor-pointer text-xs font-semibold text-accent-text underline-offset-4 hover:underline"
              >
                {isMuted ? t("reconnect") : t("unplug")}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="btn cursor-pointer"
        >
          {running ? t("pause") : t("start")}
        </button>
        <p className="text-sm text-muted">
          {t("reads")} <span className="font-bold tabular-nums text-ink">{tick}</span>
          {" · "}
          {t("writes")} <span className="font-bold tabular-nums text-ink">{logs}</span>
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-dim">{t("note")}</p>
    </div>
  );
}

/** Courbe minimale : pas d'axes, seulement la forme des dernières mesures. */
function Sparkline({
  values,
  min,
  max,
}: {
  values: number[];
  min: number;
  max: number;
}) {
  if (values.length < 2) {
    return <div className="mt-3 h-10" aria-hidden />;
  }

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 100 - ((v - min) / (max - min)) * 100;
      return `${x.toFixed(1)},${Math.max(0, Math.min(100, y)).toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="mt-3 h-10 w-full text-accent"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}
