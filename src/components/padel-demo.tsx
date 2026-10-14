"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  RALLY_CONTACTS,
  RALLY_DISTANCE,
  RALLY_FPS,
  RALLY_FRAMES,
  RALLY_PLAYERS,
  type PadelPair,
  type PadelSurface,
} from "@/content/padel-rally";

/**
 * Démonstration : un échange réel, rejoué vu de dessus.
 *
 * Les positions des joueurs et les contacts sont ceux que le projet a mesurés
 * sur la vidéo. Seule la balle entre deux contacts est reconstituée : elle va
 * en ligne droite, à vitesse constante, d'un point d'impact au suivant. Vu de
 * dessus, c'est presque sa trajectoire ; la note sous la démonstration le dit.
 *
 * Le court est couché : la caméra à gauche, le filet au milieu. Un point (x, y)
 * du court devient (y, x) dans le dessin.
 */

const LAST = RALLY_FRAMES - 1;
/** 1,5 s de trace derrière chaque joueur. */
const TRAIL = 45;
/** Trajets de la balle restés nets ; les plus anciens s'estompent. */
const RECENT = 3;
const SURFACES: PadelSurface[] = ["stroke", "floor", "glass", "mesh", "net"];
const PRESENT = SURFACES.filter((s) => RALLY_CONTACTS.some((c) => c.surface === s));
const PAIRS: PadelPair[] = ["near", "far"];
const PLAYERS = Object.values(RALLY_PLAYERS);
const PAIR_COLOR: Record<PadelPair, string> = {
  near: "var(--color-accent)",
  far: "var(--color-accent-alt)",
};

function playerAt(xy: number[], frame: number): [number, number] {
  const i = Math.min(Math.floor(frame), LAST);
  const j = Math.min(i + 1, LAST);
  const t = frame - i;
  return [
    xy[2 * i] + (xy[2 * j] - xy[2 * i]) * t,
    xy[2 * i + 1] + (xy[2 * j + 1] - xy[2 * i + 1]) * t,
  ];
}

/** Dernier contact joué à cet instant, et la balle entre lui et le suivant. */
function ballAt(frame: number) {
  let k = -1;
  while (k + 1 < RALLY_CONTACTS.length && RALLY_CONTACTS[k + 1].frame <= frame) k++;
  if (k < 0) return null;
  const a = RALLY_CONTACTS[k];
  const b = RALLY_CONTACTS[k + 1];
  if (!b) return { k, x: a.x, y: a.y };
  const t = (frame - a.frame) / (b.frame - a.frame);
  return { k, x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/** Forme propre à chaque surface : la couleur seule ne suffit pas à les distinguer. */
function Marker({
  surface,
  cx,
  cy,
  r = 0.26,
}: {
  surface: PadelSurface;
  cx: number;
  cy: number;
  r?: number;
}) {
  switch (surface) {
    case "stroke":
      return (
        <circle cx={cx} cy={cy} r={r * 1.15} fill="none" stroke="var(--color-ink)" strokeWidth={r * 0.32} />
      );
    case "floor":
      return <circle cx={cx} cy={cy} r={r} fill="var(--padel-floor)" />;
    case "glass":
      return (
        <rect
          x={cx - r * 0.85}
          y={cy - r * 0.85}
          width={r * 1.7}
          height={r * 1.7}
          transform={`rotate(45 ${cx} ${cy})`}
          fill="var(--padel-glass)"
        />
      );
    case "mesh":
      return <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill="var(--padel-mesh)" />;
    case "net":
      return (
        <polygon
          points={`${cx},${cy - r * 1.2} ${cx + r * 1.1},${cy + r * 0.8} ${cx - r * 1.1},${cy + r * 0.8}`}
          fill="var(--padel-net)"
        />
      );
  }
}

/** Le court, en coordonnées du court : x le long du filet, y vers les fonds. */
function Court() {
  const line = { stroke: "var(--color-muted)", strokeOpacity: 0.55, strokeWidth: 0.05 };
  const glass = { stroke: "var(--padel-glass)", strokeOpacity: 0.55, strokeWidth: 0.12 };
  const mesh = { ...line, strokeDasharray: "0.14 0.14" };
  return (
    <>
      <rect x={-5} y={-10} width={10} height={20} fill="var(--padel-court)" />
      {/* Lignes de service et ligne médiane. */}
      <line x1={-5} y1={-6.95} x2={5} y2={-6.95} {...line} />
      <line x1={-5} y1={6.95} x2={5} y2={6.95} {...line} />
      <line x1={0} y1={-6.95} x2={0} y2={6.95} {...line} />
      {/* Murs : vitre au fond et sur 4,1 m de chaque côté, grillage entre les deux. */}
      <line x1={-5} y1={-10} x2={5} y2={-10} {...glass} />
      <line x1={-5} y1={10} x2={5} y2={10} {...glass} />
      {[-5, 5].map((side) => (
        <g key={side}>
          <line x1={side} y1={-10} x2={side} y2={-5.9} {...glass} />
          <line x1={side} y1={5.9} x2={side} y2={10} {...glass} />
          <line x1={side} y1={-5.9} x2={side} y2={5.9} {...mesh} />
        </g>
      ))}
      {/* Filet et poteaux. */}
      <line x1={-5.25} y1={0} x2={5.25} y2={0} stroke="var(--color-ink)" strokeOpacity={0.75} strokeWidth={0.08} />
      <circle cx={-5.25} cy={0} r={0.1} fill="var(--color-ink)" />
      <circle cx={5.25} cy={0} r={0.1} fill="var(--color-ink)" />
    </>
  );
}

/** L'échange à l'image `frame`, en coordonnées du court. */
function Scene({ frame }: { frame: number }) {
  const ball = ballAt(frame);
  const played = ball ? RALLY_CONTACTS.slice(0, ball.k + 1) : [];
  const latest = ball ? RALLY_CONTACTS[ball.k] : null;
  const path = (contacts: typeof played) =>
    ball ? [...contacts.map((c) => `${c.x},${c.y}`), `${ball.x},${ball.y}`].join(" ") : "";

  return (
    <>
      <Court />

      {/* Le chemin de la balle, de contact en contact : l'échange entier en
          filigrane, les derniers trajets nets. */}
      {ball ? (
        <>
          <polyline
            points={path(played)}
            fill="none"
            stroke="var(--color-ink)"
            strokeOpacity={0.12}
            strokeWidth={0.04}
            strokeLinejoin="round"
          />
          <polyline
            points={path(played.slice(-RECENT))}
            fill="none"
            stroke="var(--color-ink)"
            strokeOpacity={0.5}
            strokeWidth={0.06}
            strokeLinejoin="round"
          />
        </>
      ) : null}

      {played.map((c) => (
        <g key={c.frame} opacity={c === latest ? 1 : 0.8}>
          <Marker surface={c.surface} cx={c.x} cy={c.y} />
        </g>
      ))}

      {/* Une onde sur le contact qui vient d'avoir lieu : l'œil sait où regarder. */}
      {latest && frame - latest.frame < 18 ? (
        <circle
          key={`ripple-${latest.frame}`}
          className="padel-ripple"
          cx={latest.x}
          cy={latest.y}
          r={0.32}
          fill="none"
          stroke={latest.surface === "stroke" ? "var(--color-ink)" : `var(--padel-${latest.surface})`}
          strokeWidth={0.06}
        />
      ) : null}

      {PLAYERS.map((player, i) => {
        const trail: string[] = [];
        for (let f = Math.max(0, Math.floor(frame) - TRAIL); f <= Math.floor(frame); f++) {
          trail.push(playerAt(player.xy, f).join(","));
        }
        const [x, y] = playerAt(player.xy, frame);
        return (
          <g key={i}>
            <polyline
              points={trail.join(" ")}
              fill="none"
              stroke={PAIR_COLOR[player.pair]}
              strokeOpacity={0.4}
              strokeWidth={0.07}
              strokeLinecap="round"
            />
            <circle
              cx={x}
              cy={y}
              r={0.32}
              fill={PAIR_COLOR[player.pair]}
              stroke="var(--color-surface)"
              strokeWidth={0.07}
            />
          </g>
        );
      })}

      {ball ? (
        <circle cx={ball.x} cy={ball.y} r={0.17} fill="var(--padel-ball)" stroke="var(--color-surface)" strokeWidth={0.04} />
      ) : null}
    </>
  );
}

const CAMERA_TEXT = {
  fontSize: 0.42,
  fontWeight: 700,
  letterSpacing: 0.08,
  textAnchor: "middle",
  fill: "var(--color-muted-dim)",
} as const;

export function PadelDemo() {
  const t = useTranslations("padel");
  const locale = useLocale();
  /* L'échange s'ouvre sur sa dernière image : tous les contacts sont déjà
     posés, le court se lit sans rien lancer. */
  const [frame, setFrame] = useState(LAST);
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef(LAST);

  useEffect(() => {
    if (!playing) return;
    let id = 0;
    let previous: number | null = null;
    const tick = (now: number) => {
      // Un onglet revenu au premier plan ne fait pas sauter l'échange.
      const dt = previous === null ? 0 : Math.min((now - previous) / 1000, 0.1);
      previous = now;
      const next = Math.min(frameRef.current + dt * RALLY_FPS, LAST);
      frameRef.current = next;
      setFrame(next);
      if (next >= LAST) {
        setPlaying(false);
        return;
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playing]);

  const seek = (f: number) => {
    frameRef.current = f;
    setFrame(f);
  };

  const toggle = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (frameRef.current >= LAST) seek(0);
    setPlaying(true);
  };

  const ball = ballAt(frame);
  const played = ball ? RALLY_CONTACTS.slice(0, ball.k + 1) : [];
  const counts = Object.fromEntries(
    SURFACES.map((s) => [s, played.filter((c) => c.surface === s).length]),
  ) as Record<PadelSurface, number>;
  const strokes = (pair: PadelPair) =>
    played.filter((c) => c.surface === "stroke" && c.pair === pair).length;

  const seconds = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const metres = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const label = playing ? t("pause") : frame >= LAST ? t("replay") : t("play");

  return (
    <div className="padel rounded-2xl border border-line-soft bg-surface p-5 sm:p-7">
      {/* Le panneau passe sous le court : la page a déjà sa colonne latérale,
          et le court a besoin de toute la largeur pour rester lisible. */}
      <div className="grid gap-7">
        <div className="min-w-0">
          {/* Couché sur grand écran, la caméra à gauche ; debout sur téléphone,
              la caméra en bas comme à la télévision. Le même dessin, deux cadrages. */}
          <svg viewBox="-11.2 -6 22.4 12" className="hidden w-full sm:block" role="img" aria-label={t("courtLabel")}>
            <g transform="matrix(0 1 1 0 0 0)">
              <Scene frame={frame} />
            </g>
            <text x={-10.7} y={0} transform="rotate(-90 -10.7 0)" {...CAMERA_TEXT}>
              {t("camera")}
            </text>
          </svg>
          <svg
            viewBox="-5.8 -10.4 11.6 21.9"
            className="mx-auto block max-h-[64vh] w-full sm:hidden"
            role="img"
            aria-label={t("courtLabelPortrait")}
          >
            <g transform="matrix(1 0 0 -1 0 0)">
              <Scene frame={frame} />
            </g>
            <text x={0} y={11.05} {...CAMERA_TEXT}>
              {t("camera")}
            </text>
          </svg>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-4">
            <button type="button" onClick={toggle} className="btn cursor-pointer">
              {label}
            </button>

            <div className="relative min-w-[12rem] flex-1 pt-3">
              {/* Les contacts sur la frise, à leur instant. */}
              <div aria-hidden className="pointer-events-none absolute inset-x-2 top-0 h-2">
                {RALLY_CONTACTS.map((c) => (
                  <span
                    key={c.frame}
                    className="absolute top-0 h-2 w-0.5 rounded-full"
                    style={{
                      left: `${(c.frame / LAST) * 100}%`,
                      background:
                        c.surface === "stroke" ? "var(--color-muted)" : `var(--padel-${c.surface})`,
                    }}
                  />
                ))}
              </div>
              <input
                type="range"
                min={0}
                max={LAST}
                step={1}
                value={Math.round(frame)}
                onChange={(e) => seek(Number(e.target.value))}
                aria-label={t("scrub")}
                aria-valuetext={`${seconds.format(frame / RALLY_FPS)} s`}
                className="w-full cursor-pointer accent-[var(--color-accent)]"
              />
            </div>

            <p className="text-sm font-semibold tabular-nums text-muted">
              {seconds.format(frame / RALLY_FPS)} s
              <span className="text-muted-dim"> / {seconds.format(LAST / RALLY_FPS)} s</span>
            </p>
          </div>
        </div>

        <aside className="grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-muted-dim">
              {t("contacts")}
            </h4>
            <ul className="mt-3 grid gap-2.5">
              {PRESENT.map((s) => (
                <li key={s} className="flex items-center gap-3">
                  <svg viewBox="-0.5 -0.5 1 1" className="size-4 shrink-0" aria-hidden>
                    <Marker surface={s} cx={0} cy={0} r={0.3} />
                  </svg>
                  <span className="flex-1 text-[0.95rem]">{t(`surface.${s}`)}</span>
                  <span className="font-bold tabular-nums">{counts[s]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-muted-dim">
              {t("pairs")}
            </h4>
            <ul className="mt-3 grid gap-2.5">
              {PAIRS.map((pair) => (
                <li key={pair} className="rounded-xl bg-surface-2 px-4 py-3">
                  <p className="flex items-center gap-2.5 font-semibold">
                    <span
                      aria-hidden
                      className="size-2.5 rounded-full"
                      style={{ background: PAIR_COLOR[pair] }}
                    />
                    {t(`pair.${pair}`)}
                  </p>
                  <p className="mt-1 text-sm tabular-nums text-muted">
                    {t("pairLine", {
                      strokes: strokes(pair),
                      distance: metres.format(RALLY_DISTANCE[pair][Math.floor(frame)]),
                    })}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-dim">{t("note")}</p>
    </div>
  );
}
