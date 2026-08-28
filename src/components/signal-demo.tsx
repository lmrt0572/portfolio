"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { readPalette, setupCanvas } from "./tsp-canvas";

/**
 * Démonstration : la chaîne FSK, du bit reçu au bit décidé.
 *
 * Quatre bandes, dans l'ordre de la chaîne : les bits à transmettre, le signal
 * modulé, le même signal une fois le bruit ajouté, puis la décision prise sur
 * chaque intervalle. Deux curseurs, le niveau de bruit et le filtre, et un
 * compteur d'erreurs qui dit à partir de quand la transmission décroche.
 *
 * La décision se fait par comptage des passages à zéro, le détecteur le plus
 * simple qui soit. Ce choix est délibéré : avec une détection par corrélation,
 * le filtrage n'apporterait presque rien : mesuré hors navigateur, l'écart
 * était nul, parce que corréler avec les deux tons rejette déjà le hors-bande.
 * C'est donc le détecteur naïf qui rend le rôle du filtre visible.
 */

/** Message transmis, en clair pour que le lien bits/décision se voie. */
const BITS = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1];
/** Échantillons par bit. Assez pour distinguer les deux tons à l'œil. */
const PER_BIT = 48;
/** Fréquences des deux tons, en cycles par bit. */
const F0 = 2;
const F1 = 5;

type Chain = {
  clean: number[];
  noisy: number[];
  filtered: number[];
  decided: number[];
  errors: number;
};

/** Bruit reproductible : un même réglage donne toujours la même trace. */
function makeNoise(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return (s / 2147483648) * 2 - 1;
  };
}

function buildChain(noise: number, window: number): Chain {
  const rand = makeNoise(42);
  const clean: number[] = [];
  const noisy: number[] = [];

  for (const bit of BITS) {
    const f = bit ? F1 : F0;
    for (let i = 0; i < PER_BIT; i++) {
      const value = Math.sin((2 * Math.PI * f * i) / PER_BIT);
      clean.push(value);
      noisy.push(value + rand() * noise);
    }
  }

  const average = (xs: number[], w: number) =>
    xs.map((_, i) => {
      let sum = 0;
      let count = 0;
      for (let k = -w; k <= w; k++) {
        const j = i + k;
        if (j >= 0 && j < xs.length) {
          sum += xs[j];
          count++;
        }
      }
      return sum / count;
    });

  /* Passe-bande minimal : une moyenne courte enlève ce qui varie plus vite que
     nos tons, une moyenne longue donne la dérive lente qu'on retranche. Ce qui
     reste est la bande où vivent les deux fréquences. Une simple moyenne
     glissante, elle, effacerait le ton aigu en même temps que le bruit. */
  const filtered = window
    ? average(noisy, 1).map((v, i) => v - average(noisy, 16)[i])
    : noisy;

  /* Décision par passages à zéro : on compte les changements de signe sur
     l'intervalle, ce qui estime la fréquence. C'est le détecteur le plus simple
     qui soit, et c'est justement pour ça qu'il rend le filtrage visible. */
  const decided: number[] = [];
  let errors = 0;
  const threshold = F0 + F1;
  BITS.forEach((bit, b) => {
    const slice = filtered.slice(b * PER_BIT, (b + 1) * PER_BIT);
    let crossings = 0;
    for (let i = 1; i < slice.length; i++) {
      if (slice[i - 1] < 0 !== slice[i] < 0) crossings++;
    }
    const guess = crossings > threshold ? 1 : 0;
    decided.push(guess);
    if (guess !== bit) errors++;
  });

  return { clean, noisy, filtered, decided, errors };
}

export function SignalDemo() {
  const t = useTranslations("signal");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [noise, setNoise] = useState(1);
  const [filterOn, setFilterOn] = useState(true);

  const chain = buildChain(noise, filterOn ? 1 : 0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const setup = setupCanvas(canvas);
    if (!setup) return;
    const { ctx, width, height } = setup;
    const palette = readPalette();

    const rows = 4;
    const rowH = height / rows;
    const n = chain.clean.length;
    const x = (i: number) => (i / (n - 1)) * width;

    const trace = (values: number[], row: number, color: string, alpha = 1) => {
      const mid = rowH * row + rowH / 2;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      values.forEach((v, i) => {
        const y = mid - v * (rowH * 0.36);
        if (i === 0) ctx.moveTo(x(i), y);
        else ctx.lineTo(x(i), y);
      });
      ctx.stroke();
      ctx.restore();
    };

    // Bande 1 : les bits, en créneaux.
    const midBits = rowH * 0.5;
    ctx.strokeStyle = palette.city;
    ctx.lineWidth = 2;
    ctx.beginPath();
    BITS.forEach((bit, b) => {
      const y = midBits - (bit ? 1 : -1) * (rowH * 0.22);
      ctx.lineTo(x(b * PER_BIT), y);
      ctx.lineTo(x((b + 1) * PER_BIT - 1), y);
    });
    ctx.stroke();

    trace(chain.clean, 1, palette.edge);
    trace(chain.noisy, 2, palette.forbidden, 0.8);
    trace(chain.filtered, 2, palette.precedence);

    // Bande 4 : la décision, verte si juste, ambrée sinon.
    const midDec = rowH * 3.5;
    chain.decided.forEach((guess, b) => {
      const ok = guess === BITS[b];
      ctx.fillStyle = ok ? palette.edge : "#d08a3a";
      const left = x(b * PER_BIT);
      const right = x((b + 1) * PER_BIT - 1);
      const y = midDec - (guess ? 1 : -1) * (rowH * 0.22);
      ctx.fillRect(left, y - 3, right - left, 6);
    });

    // Séparateurs de bandes.
    ctx.strokeStyle = palette.forbidden;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1;
    for (let r = 1; r < rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, rowH * r);
      ctx.lineTo(width, rowH * r);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }, [chain]);

  useEffect(() => {
    draw();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => draw());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw]);

  return (
    <div className="rounded-2xl border border-line-soft bg-surface p-5 sm:p-7">
      <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <ul className="flex gap-4 text-xs text-muted-dim sm:flex-col sm:gap-3">
          <li>{t("rowBits")}</li>
          <li>{t("rowModulated")}</li>
          <li>{t("rowChannel")}</li>
          <li>{t("rowDecided")}</li>
        </ul>
        <canvas
          ref={canvasRef}
          className="block aspect-[16/9] w-full rounded-xl bg-surface-2"
          aria-label={t("canvasLabel")}
          role="img"
        />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">
            {t("noise")} <span className="tabular-nums">{noise.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={0}
            max={2.5}
            step={0.05}
            value={noise}
            onChange={(e) => setNoise(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--color-accent)]"
          />
        </label>

        <label className="flex items-center gap-3 self-end">
          <input
            type="checkbox"
            checked={filterOn}
            onChange={(e) => setFilterOn(e.target.checked)}
            className="size-4 accent-[var(--color-accent)]"
          />
          <span className="text-sm font-semibold">{t("filter")}</span>
        </label>
      </div>

      <p aria-live="polite" className="mt-5 text-sm font-semibold">
        {chain.errors === 0 ? (
          <span className="text-accent-text">{t("clean")}</span>
        ) : (
          <span className="text-[#d08a3a]">
            {t("errors", { count: chain.errors, total: BITS.length })}
          </span>
        )}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-muted-dim">{t("note")}</p>
    </div>
  );
}
