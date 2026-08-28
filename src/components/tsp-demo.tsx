"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import {
  generateInstance,
  nearestNeighbour,
  tourCost,
  tryTwoOpt,
  type Instance,
} from "@/lib/tsp";
import { drawInstance } from "./tsp-canvas";

/**
 * Démonstration 1 (descente 2-opt) sur une instance TSP-PC-ER.
 *
 * On construit une tournée au plus proche voisin, puis on défait les
 * croisements un à un. L'intérêt n'est pas seulement de montrer la méthode :
 * c'est de finir sur un **optimum local**, ce qui prépare la seconde
 * démonstration.
 *
 * Chaque inversion est vérifiée avant application : elle peut créer une arête
 * interdite ou casser une précédence.
 */

const DEFAULT_CITIES = 26;

function pairsPerFrame(cityCount: number): number {
  return Math.max(60, cityCount * 2);
}

type Stats = {
  cost: number;
  initialCost: number;
  improvements: number;
  rejected: number;
  done: boolean;
};

export function TspDemo() {
  const t = useTranslations("tsp");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const instanceRef = useRef<Instance | null>(null);
  const tourRef = useRef<number[]>([]);
  const cursorRef = useRef({ i: 0, j: 2 });
  const improvedInPassRef = useRef(false);
  const improvementsRef = useRef(0);
  const rejectedRef = useRef(0);
  const initialCostRef = useRef(0);
  const frameRef = useRef(0);
  const runningRef = useRef(false);
  const lastCommitRef = useRef(0);

  const [stats, setStats] = useState<Stats>({
    cost: 0,
    initialCost: 0,
    improvements: 0,
    rejected: 0,
    done: false,
  });

  const commit = useCallback((done: boolean, force = false) => {
    const now = performance.now();
    if (!force && now - lastCommitRef.current < 90) return;
    lastCommitRef.current = now;
    const instance = instanceRef.current;
    setStats({
      cost: instance ? tourCost(instance, tourRef.current) : 0,
      initialCost: initialCostRef.current,
      improvements: improvementsRef.current,
      rejected: rejectedRef.current,
      done,
    });
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const instance = instanceRef.current;
    if (canvas && instance) drawInstance(canvas, instance, tourRef.current);
  }, []);

  /** Une tranche de balayage 2-opt, bornée pour tenir dans une image. */
  const slice = useCallback((budget: number): boolean => {
    const instance = instanceRef.current;
    const tour = tourRef.current;
    if (!instance || tour.length < 4) return true;

    const n = tour.length;
    let checks = 0;
    let { i, j } = cursorRef.current;

    while (checks < budget) {
      if (i >= n - 2) {
        cursorRef.current = { i: 0, j: 2 };
        if (improvedInPassRef.current) {
          improvedInPassRef.current = false;
          return false;
        }
        return true;
      }

      const move = tryTwoOpt(instance, tour, i, j);
      if (move.gain > 0) {
        improvementsRef.current++;
        improvedInPassRef.current = true;
      } else if (move.blocked) {
        // Le mouvement aurait raccourci la tournée mais viole une arête
        // interdite ou une précédence : c'est la contrainte qui se voit.
        rejectedRef.current++;
      }

      checks++;
      j++;
      if (j >= n) {
        i++;
        j = i + 2;
      }
    }

    cursorRef.current = { i, j };
    return false;
  }, []);

  const loop = useCallback(() => {
    const tick = () => {
      if (!runningRef.current) return;
      const instance = instanceRef.current;
      if (!instance) return;

      const done = slice(pairsPerFrame(instance.cities.length));
      draw();
      commit(done, done);

      if (done) {
        runningRef.current = false;
        return;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, [slice, draw, commit]);

  const reset = useCallback(
    (cityCount: number) => {
      runningRef.current = false;
      cancelAnimationFrame(frameRef.current);

      const instance = generateInstance(cityCount);
      instanceRef.current = instance;
      tourRef.current = nearestNeighbour(instance);
      cursorRef.current = { i: 0, j: 2 };
      improvedInPassRef.current = false;
      improvementsRef.current = 0;
      rejectedRef.current = 0;
      initialCostRef.current = tourCost(instance, tourRef.current);

      draw();
      commit(false, true);
    },
    [draw, commit],
  );

  const run = useCallback(() => {
    if (runningRef.current || !instanceRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let done = false;
      let guard = 0;
      while (!done && guard < 5000) {
        done = slice(200_000);
        guard++;
      }
      draw();
      commit(true, true);
      return;
    }

    runningRef.current = true;
    loop();
  }, [slice, draw, commit, loop]);

  useEffect(() => {
    reset(DEFAULT_CITIES);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => draw());
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      runningRef.current = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, [reset, draw]);

  const gain =
    stats.initialCost > 0
      ? ((stats.initialCost - stats.cost) / stats.initialCost) * 100
      : 0;

  return (
    <div className="rounded-2xl border border-line-soft bg-surface p-5 sm:p-7">
      <canvas
        ref={canvasRef}
        className="block aspect-[16/10] w-full rounded-xl bg-surface-2"
        aria-label={t("canvasLabel")}
        role="img"
      />

      <Legend />

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={run} className="btn cursor-pointer">
          {t("run")}
        </button>
        <button
          type="button"
          onClick={() => reset(DEFAULT_CITIES)}
          className="btn-ghost cursor-pointer"
        >
          {t("shuffle")}
        </button>
        <button
          type="button"
          onClick={() => reset(60)}
          className="btn-ghost cursor-pointer"
        >
          {t("more")}
        </button>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
        {[
          { label: t("cost"), value: stats.cost.toFixed(2) },
          { label: t("gain"), value: `${gain.toFixed(1)} %` },
          { label: t("improvements"), value: String(stats.improvements) },
          { label: t("blocked"), value: String(stats.rejected) },
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
        {stats.done ? t("localOptimum") : ""}
      </p>
    </div>
  );
}

/** Légende commune aux deux démonstrations. */
export function Legend() {
  const t = useTranslations("tsp");
  return (
    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-dim">
      <li className="flex items-center gap-2">
        <span className="size-2.5 rounded-full bg-accent-alt" />
        {t("legendDepot")}
      </li>
      <li className="flex items-center gap-2">
        <span className="h-px w-5 border-t border-dashed border-muted-dim" />
        {t("legendForbidden")}
      </li>
      <li className="flex items-center gap-2">
        <span className="h-px w-5 bg-accent-text" />
        {t("legendPrecedence")}
      </li>
      <li>{t("legendCost")}</li>
    </ul>
  );
}
