import { DEPOT, type Instance, type Point } from "@/lib/tsp";

/**
 * Rendu partagé par les deux démonstrations : mêmes couleurs, mêmes symboles,
 * pour qu'on puisse comparer les deux animations sans réapprendre la légende.
 *
 * Les couleurs sont relues dans le thème courant à chaque image, ce qui fait
 * suivre la bascule jour/nuit sans code dédié.
 */

export type Palette = {
  edge: string;
  city: string;
  depot: string;
  forbidden: string;
  precedence: string;
};

export function readPalette(): Palette {
  const style = getComputedStyle(document.documentElement);
  const get = (name: string, fallback: string) =>
    style.getPropertyValue(name).trim() || fallback;

  return {
    edge: get("--color-accent", "#3693b8"),
    city: get("--color-ink", "#f0f3f6"),
    depot: get("--color-accent-alt", "#88aafd"),
    forbidden: get("--color-muted-dim", "#96a6b4"),
    precedence: get("--color-accent-text", "#5cbde0"),
  };
}

/** Prépare le canvas à la taille de son conteneur et rend les coordonnées. */
export function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));

  if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
    canvas.width = width * dpr;
    canvas.height = height * dpr;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  return {
    ctx,
    width,
    height,
    px: (p: Point) => ({ x: p.x * width, y: p.y * height }),
  };
}

export function drawInstance(
  canvas: HTMLCanvasElement,
  instance: Instance,
  tour: number[],
): void {
  const setup = setupCanvas(canvas);
  if (!setup) return;
  const { ctx, px } = setup;
  const palette = readPalette();
  const { cities } = instance;

  // Arêtes interdites, en pointillés très discrets : elles doivent se deviner
  // sans concurrencer la tournée.
  ctx.save();
  ctx.setLineDash([3, 5]);
  ctx.strokeStyle = palette.forbidden;
  ctx.globalAlpha = 0.28;
  ctx.lineWidth = 1;
  for (let u = 0; u < cities.length; u++) {
    for (let v = u + 1; v < cities.length; v++) {
      if (!instance.forbidden[u][v]) continue;
      const a = px(cities[u]);
      const b = px(cities[v]);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }
  ctx.restore();

  // Contraintes de précédence : une flèche courbe du « avant » vers l'« après ».
  ctx.save();
  ctx.strokeStyle = palette.precedence;
  ctx.fillStyle = palette.precedence;
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = 1.4;
  for (const pair of instance.precedence) {
    const a = px(cities[pair.before]);
    const b = px(cities[pair.after]);
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    // Décale le point de contrôle perpendiculairement pour courber la flèche.
    const cx = mx - (dy / len) * 26;
    const cy = my + (dx / len) * 26;

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(cx, cy, b.x, b.y);
    ctx.stroke();

    const angle = Math.atan2(b.y - cy, b.x - cx);
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(
      b.x - 8 * Math.cos(angle - 0.4),
      b.y - 8 * Math.sin(angle - 0.4),
    );
    ctx.lineTo(
      b.x - 8 * Math.cos(angle + 0.4),
      b.y - 8 * Math.sin(angle + 0.4),
    );
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // La tournée courante.
  if (tour.length > 1) {
    ctx.strokeStyle = palette.edge;
    ctx.lineWidth = 1.8;
    ctx.lineJoin = "round";
    ctx.beginPath();
    const first = px(cities[tour[0]]);
    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < tour.length; i++) {
      const p = px(cities[tour[i]]);
      ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Les villes, le dépôt en évidence.
  for (let i = 0; i < cities.length; i++) {
    const p = px(cities[i]);
    const isDepot = i === DEPOT;
    ctx.fillStyle = isDepot ? palette.depot : palette.city;
    ctx.beginPath();
    ctx.arc(p.x, p.y, isDepot ? 6 : 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Courbe d'évolution du coût. La ligne pâle est le coût courant, la ligne pleine
 * le meilleur trouvé : c'est l'écart entre les deux qui rend visible le fait
 * d'accepter temporairement une dégradation.
 */
export function drawCostHistory(
  canvas: HTMLCanvasElement,
  current: number[],
  best: number[],
  baseline: number | null,
): void {
  const setup = setupCanvas(canvas);
  if (!setup) return;
  const { ctx, width, height } = setup;
  const palette = readPalette();
  if (current.length === 0) return;

  // Avant le premier lot de mouvements il n'y a qu'un point : on le double pour
  // tracer quand même le repère, plutôt que de laisser un cadre vide.
  if (current.length < 2) {
    current = [...current, ...current];
    best = [...best, ...best];
  }

  const values = [...current, ...best];
  if (baseline !== null) values.push(baseline);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (max - min < 1e-6) max = min + 1;
  const pad = (max - min) * 0.08;
  min -= pad;
  max += pad;

  const toY = (v: number) => height - ((v - min) / (max - min)) * height;
  const toX = (i: number) => (i / (current.length - 1)) * width;

  if (baseline !== null) {
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = palette.forbidden;
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, toY(baseline));
    ctx.lineTo(width, toY(baseline));
    ctx.stroke();
    ctx.restore();
  }

  ctx.strokeStyle = palette.precedence;
  ctx.globalAlpha = 0.4;
  ctx.lineWidth = 1;
  ctx.beginPath();
  current.forEach((v, i) => (i ? ctx.lineTo(toX(i), toY(v)) : ctx.moveTo(0, toY(v))));
  ctx.stroke();

  ctx.globalAlpha = 1;
  ctx.strokeStyle = palette.edge;
  ctx.lineWidth = 2;
  ctx.beginPath();
  best.forEach((v, i) => (i ? ctx.lineTo(toX(i), toY(v)) : ctx.moveTo(0, toY(v))));
  ctx.stroke();
}
