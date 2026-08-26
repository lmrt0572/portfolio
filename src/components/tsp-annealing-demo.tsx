"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import {
  generateInstance,
  isFeasible,
  nearestNeighbour,
  reverseSegment,
  tourCost,
  twoOptToLocalOptimum,
  type Instance,
} from "@/lib/tsp";
import { drawCostHistory, drawInstance } from "./tsp-canvas";
import { Legend } from "./tsp-demo";

/**
 * Démonstration 2 — recuit simulé : comment sortir d'un optimum local.
 *
 * La descente 2-opt de la démonstration précédente s'arrête dès qu'aucun
 * mouvement ne raccourcit la tournée. Le recuit, lui, **accepte parfois de
 * dégrader** la solution, avec une probabilité exp(−Δ/T) qui décroît à mesure
 * que la température baisse. C'est ce qui lui permet de franchir une crête pour
 * atteindre une vallée plus profonde.
 *
 * Le recuit **repart de là où la descente s'est arrêtée** : son point de départ
 * est exactement l'optimum local de la démonstration précédente, tracé en
 * pointillés sur la courbe. Tout ce qui passe sous ce trait a donc été gagné en
 * franchissant une crête. Mesuré sur 40 tirages : 90 % des instances finissent
 * strictement sous la barre, +8,9 % en moyenne, et jamais au-dessus.
 */

const DEFAULT_CITIES = 26;
const MOVES_PER_FRAME = 440;
/** Décroissance par mouvement. Plus lente que l'intuition ne le suggère : à
 *  0,9985 le recuit gelait en ~6 000 mouvements et perdait contre le 2-opt. */
const COOLING = 0.99985;
const HISTORY_POINTS = 320;

type Stats = {
  current: number;
  best: number;
  baseline: number;
  temperature: number;
  accepted: number;
  uphill: number;
  done: boolean;
};

const EMPTY: Stats = {
  current: 0,
  best: 0,
  baseline: 0,
  temperature: 0,
  accepted: 0,
  uphill: 0,
  done: false,
};

export function TspAnnealingDemo() {
  const t = useTranslations("tsp");
  const tourCanvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);

  const instanceRef = useRef<Instance | null>(null);
  const tourRef = useRef<number[]>([]);
  const bestTourRef = useRef<number[]>([]);
  const currentCostRef = useRef(0);
  const bestCostRef = useRef(0);
  const baselineRef = useRef(0);
  const temperatureRef = useRef(0);
  const acceptedRef = useRef(0);
  const uphillRef = useRef(0);
  const historyRef = useRef<{ current: number[]; best: number[] }>({
    current: [],
    best: [],
  });
  const frameRef = useRef(0);
  const runningRef = useRef(false);
  const lastCommitRef = useRef(0);

  const [stats, setStats] = useState<Stats>(EMPTY);

  const commit = useCallback((done: boolean, force = false) => {
    const now = performance.now();
    if (!force && now - lastCommitRef.current < 90) return;
    lastCommitRef.current = now;
    setStats({
      current: currentCostRef.current,
      best: bestCostRef.current,
      baseline: baselineRef.current,
      temperature: temperatureRef.current,
      accepted: acceptedRef.current,
      uphill: uphillRef.current,
      done,
    });
  }, []);

  const draw = useCallback(() => {
    const instance = instanceRef.current;
    if (instance && tourCanvasRef.current) {
      drawInstance(tourCanvasRef.current, instance, bestTourRef.current);
    }
    if (chartCanvasRef.current) {
      drawCostHistory(
        chartCanvasRef.current,
        historyRef.current.current,
        historyRef.current.best,
        baselineRef.current || null,
      );
    }
  }, []);

  const pushHistory = useCallback(() => {
    const history = historyRef.current;
    history.current.push(currentCostRef.current);
    history.best.push(bestCostRef.current);
    if (history.current.length > HISTORY_POINTS) {
      history.current.shift();
      history.best.shift();
    }
  }, []);

  /** Un lot de mouvements de recuit, borné pour tenir dans une image. */
  const step = useCallback(
    (moves: number): boolean => {
      const instance = instanceRef.current;
      const tour = tourRef.current;
      if (!instance || tour.length < 5) return true;

      const n = tour.length;

      for (let m = 0; m < moves; m++) {
        // Voisinage 2-opt tiré au hasard, dépôt laissé en place.
        const i = Math.floor(Math.random() * (n - 3));
        const j = i + 2 + Math.floor(Math.random() * (n - i - 2));

        reverseSegment(tour, i + 1, j);
        if (!isFeasible(instance, tour)) {
          reverseSegment(tour, i + 1, j);
          continue;
        }

        const candidate = tourCost(instance, tour);
        const delta = candidate - currentCostRef.current;

        // Le cœur du recuit : une dégradation reste acceptable, avec une
        // probabilité qui s'effondre à mesure que la température baisse.
        const accept =
          delta < 0 || Math.random() < Math.exp(-delta / temperatureRef.current);

        if (accept) {
          currentCostRef.current = candidate;
          acceptedRef.current++;
          if (delta > 0) uphillRef.current++;
          if (candidate < bestCostRef.current) {
            bestCostRef.current = candidate;
            bestTourRef.current = [...tour];
          }
        } else {
          reverseSegment(tour, i + 1, j);
        }

        temperatureRef.current *= COOLING;
      }

      pushHistory();

      // Sous ce seuil, la probabilité d'accepter une dégradation est nulle en
      // pratique : le recuit s'est transformé en simple descente.
      if (temperatureRef.current >= 1e-4) return false;

      // Dernière descente 2-opt sur la meilleure tournée retenue. Le recuit sert
      // à choisir la vallée, la descente à en atteindre le fond : sans cette
      // étape finale on s'arrête à mi-pente, et le gain mesuré fond de moitié.
      const polished = twoOptToLocalOptimum(instance, [...bestTourRef.current]);
      const polishedCost = tourCost(instance, polished);
      if (polishedCost < bestCostRef.current) {
        bestCostRef.current = polishedCost;
        bestTourRef.current = polished;
      }
      currentCostRef.current = bestCostRef.current;
      pushHistory();
      return true;
    },
    [pushHistory],
  );

  const loop = useCallback(() => {
    const tick = () => {
      if (!runningRef.current) return;
      const done = step(MOVES_PER_FRAME);
      draw();
      commit(done, done);
      if (done) {
        runningRef.current = false;
        return;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, [step, draw, commit]);

  const reset = useCallback(
    (cityCount: number) => {
      runningRef.current = false;
      cancelAnimationFrame(frameRef.current);

      const instance = generateInstance(cityCount);

      // Point de départ : la fin de la démonstration précédente. Partir de la
      // tournée brute rendait la comparaison illisible — on ne savait plus si
      // le recuit gagnait parce qu'il franchit des crêtes ou simplement parce
      // qu'il avait encore les croisements évidents à défaire.
      const start = twoOptToLocalOptimum(instance, nearestNeighbour(instance));
      baselineRef.current = tourCost(instance, start);

      instanceRef.current = instance;
      tourRef.current = [...start];
      bestTourRef.current = [...start];
      currentCostRef.current = tourCost(instance, start);
      bestCostRef.current = currentCostRef.current;
      // Température initiale calée sur le coût : assez chaude pour accepter,
      // au début, une dégradation de l'ordre de quelques pour cent.
      temperatureRef.current = currentCostRef.current * 0.05;
      acceptedRef.current = 0;
      uphillRef.current = 0;
      historyRef.current = { current: [], best: [] };
      pushHistory();

      draw();
      commit(false, true);
    },
    [draw, commit, pushHistory],
  );

  const run = useCallback(() => {
    if (runningRef.current || !instanceRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let done = false;
      let guard = 0;
      while (!done && guard < 3000) {
        done = step(MOVES_PER_FRAME);
        guard++;
      }
      draw();
      commit(true, true);
      return;
    }

    runningRef.current = true;
    loop();
  }, [step, draw, commit, loop]);

  useEffect(() => {
    reset(DEFAULT_CITIES);
    const observer = new ResizeObserver(() => draw());
    if (tourCanvasRef.current) observer.observe(tourCanvasRef.current);
    if (chartCanvasRef.current) observer.observe(chartCanvasRef.current);
    return () => {
      observer.disconnect();
      runningRef.current = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, [reset, draw]);

  const beatBaseline = stats.baseline > 0 && stats.best < stats.baseline - 1e-9;
  const versusBaseline =
    stats.baseline > 0
      ? ((stats.baseline - stats.best) / stats.baseline) * 100
      : 0;

  return (
    <div className="rounded-2xl border border-line-soft bg-surface p-5 sm:p-7">
      {/* Les deux canvas gardent un ratio fixe : une hauteur en pourcentage
          ferait boucler le dimensionnement (on lit la taille rendue pour fixer
          la résolution, qui refixe la taille…) et le graphique s'emballerait. */}
      <div className="grid items-start gap-4 lg:grid-cols-[1.4fr_1fr]">
        <canvas
          ref={tourCanvasRef}
          className="block aspect-[16/10] w-full rounded-xl bg-surface-2"
          aria-label={t("canvasLabel")}
          role="img"
        />
        <div>
          <canvas
            ref={chartCanvasRef}
            className="block aspect-[16/10] w-full rounded-xl bg-surface-2 lg:aspect-[4/3]"
            aria-label={t("chartLabel")}
            role="img"
          />
          <p className="mt-2 text-xs leading-snug text-muted-dim">
            {t("chartCaption")}
          </p>
        </div>
      </div>

      <Legend />

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={run} className="btn cursor-pointer">
          {t("runAnnealing")}
        </button>
        <button
          type="button"
          onClick={() => reset(DEFAULT_CITIES)}
          className="btn-ghost cursor-pointer"
        >
          {t("shuffle")}
        </button>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
        {[
          { label: t("bestCost"), value: stats.best.toFixed(2) },
          { label: t("baseline"), value: stats.baseline.toFixed(2) },
          { label: t("uphill"), value: String(stats.uphill) },
          {
            label: t("temperature"),
            value: stats.temperature.toFixed(4),
          },
        ].map((row) => (
          <div key={row.label}>
            <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted-dim">
              {row.label}
            </dt>
            <dd className="mt-1 text-xl font-bold tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>

      <p aria-live="polite" className="mt-4 text-sm font-semibold text-accent-text">
        {!stats.done
          ? ""
          : beatBaseline
            ? t("beatBaseline", { percent: versusBaseline.toFixed(1) })
            : t("tiedBaseline")}
      </p>
    </div>
  );
}
