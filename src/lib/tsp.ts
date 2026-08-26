/**
 * Modèle du problème TSP-PC-ER utilisé par les démonstrations de la page projet.
 *
 * Reprend les trois éléments qui distinguent le problème réel du voyageur de
 * commerce des manuels :
 *   — un coût d'arête = péage + carburant × distance, et non une simple distance ;
 *   — des arêtes interdites (Edge Restrictions), qu'aucune tournée ne peut emprunter ;
 *   — des contraintes de précédence (Precedence Constraints) entre villes.
 *
 * La génération garantit qu'au moins une tournée réalisable existe : les
 * précédences sont tirées d'un ordre de référence, et aucune arête de cet ordre
 * n'est jamais interdite. Sans cette précaution, une instance peut n'avoir
 * aucune solution — et une démonstration qui échoue au hasard n'apprend rien.
 */

export type Point = { x: number; y: number };

export type Instance = {
  cities: Point[];
  /** `toll[u][v]` : surcoût de péage, symétrique. */
  toll: number[][];
  /** `forbidden[u][v]` : arête impraticable, symétrique. */
  forbidden: boolean[][];
  /** Paires (avant, après) : `before` doit être livrée avant `after`. */
  precedence: { before: number; after: number }[];
  /** Ordre toujours réalisable, utilisé comme filet de sécurité. */
  reference: number[];
};

/** Prix du carburant au kilomètre, dans les unités normalisées du plan. */
const FUEL_PER_KM = 1;
const TOLL_RATIO = 0.25;
const TOLL_MIN = 0.05;
const TOLL_MAX = 0.2;
/** Le dépôt est le point de départ et d'arrivée, comme Paris dans le livrable. */
export const DEPOT = 0;

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Coût réel d'une arête : carburant proportionnel à la distance, plus péage. */
export function edgeCost(instance: Instance, u: number, v: number): number {
  return (
    FUEL_PER_KM * distance(instance.cities[u], instance.cities[v]) +
    instance.toll[u][v]
  );
}

export function tourCost(instance: Instance, tour: number[]): number {
  let total = 0;
  for (let i = 0; i < tour.length; i++) {
    total += edgeCost(instance, tour[i], tour[(i + 1) % tour.length]);
  }
  return total;
}

function emptyMatrix<T>(n: number, value: T): T[][] {
  return Array.from({ length: n }, () => new Array<T>(n).fill(value));
}

export function generateInstance(
  cityCount: number,
  options: { forbiddenEdges?: number; precedencePairs?: number } = {},
): Instance {
  const n = Math.max(5, cityCount);
  const forbiddenEdges = options.forbiddenEdges ?? Math.round(n * 0.45);
  const precedencePairs = options.precedencePairs ?? 3;

  const cities: Point[] = Array.from({ length: n }, () => ({
    x: 0.07 + Math.random() * 0.86,
    y: 0.09 + Math.random() * 0.82,
  }));

  // Ordre de référence : le dépôt, puis une permutation des autres villes.
  const rest = Array.from({ length: n - 1 }, (_, i) => i + 1);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  const reference = [DEPOT, ...rest];

  // Précédences tirées de cet ordre : elles sont donc satisfiables ensemble.
  const precedence: { before: number; after: number }[] = [];
  for (let k = 0; k < precedencePairs && n > 4; k++) {
    const i = 1 + Math.floor(Math.random() * (n - 3));
    const j = i + 1 + Math.floor(Math.random() * (n - 1 - i));
    const pair = { before: reference[i], after: reference[j] };
    if (!precedence.some((p) => p.before === pair.before && p.after === pair.after)) {
      precedence.push(pair);
    }
  }

  // Arêtes protégées : celles de l'ordre de référence ne seront jamais interdites.
  const protectedEdge = emptyMatrix(n, false);
  for (let i = 0; i < reference.length; i++) {
    const u = reference[i];
    const v = reference[(i + 1) % reference.length];
    protectedEdge[u][v] = true;
    protectedEdge[v][u] = true;
  }

  const forbidden = emptyMatrix(n, false);
  let placed = 0;
  let attempts = 0;
  while (placed < forbiddenEdges && attempts < forbiddenEdges * 40) {
    attempts++;
    const u = Math.floor(Math.random() * n);
    const v = Math.floor(Math.random() * n);
    if (u === v || protectedEdge[u][v] || forbidden[u][v]) continue;
    forbidden[u][v] = true;
    forbidden[v][u] = true;
    placed++;
  }

  const toll = emptyMatrix(n, 0);
  for (let u = 0; u < n; u++) {
    for (let v = u + 1; v < n; v++) {
      if (Math.random() < TOLL_RATIO) {
        const value = TOLL_MIN + Math.random() * (TOLL_MAX - TOLL_MIN);
        toll[u][v] = value;
        toll[v][u] = value;
      }
    }
  }

  return { cities, toll, forbidden, precedence, reference };
}

/** Une tournée est réalisable si elle n'emprunte aucune arête interdite et
 *  respecte tous les ordres de passage imposés. */
export function isFeasible(instance: Instance, tour: number[]): boolean {
  const n = tour.length;
  for (let i = 0; i < n; i++) {
    if (instance.forbidden[tour[i]][tour[(i + 1) % n]]) return false;
  }
  const rank = new Array<number>(n);
  for (let i = 0; i < n; i++) rank[tour[i]] = i;
  return instance.precedence.every((p) => rank[p.before] < rank[p.after]);
}

/**
 * Plus proche voisin contraint : à chaque étape on ne considère que les villes
 * dont tous les prédécesseurs sont déjà livrés et joignables. En cas d'impasse,
 * on retombe sur l'ordre de référence — toujours réalisable.
 */
export function nearestNeighbour(instance: Instance): number[] {
  const n = instance.cities.length;
  const visited = new Array<boolean>(n).fill(false);
  const tour = [DEPOT];
  visited[DEPOT] = true;

  const predecessorsDone = (city: number) =>
    instance.precedence.every((p) => p.after !== city || visited[p.before]);

  for (let step = 1; step < n; step++) {
    const current = tour[tour.length - 1];
    let best = -1;
    let bestCost = Infinity;

    for (let c = 0; c < n; c++) {
      if (visited[c] || instance.forbidden[current][c]) continue;
      if (!predecessorsDone(c)) continue;
      const cost = edgeCost(instance, current, c);
      if (cost < bestCost) {
        bestCost = cost;
        best = c;
      }
    }

    if (best === -1) return [...instance.reference];
    visited[best] = true;
    tour.push(best);
  }

  return isFeasible(instance, tour) ? tour : [...instance.reference];
}

/**
 * Inverse le segment [i+1 .. j] si le mouvement est réalisable et rentable.
 * Retourne le gain obtenu, ou 0 si le mouvement est rejeté.
 *
 * Le contrôle de faisabilité est le vrai ajout par rapport au 2-opt classique :
 * une inversion retourne l'ordre du segment, donc peut casser une précédence,
 * et les deux arêtes créées peuvent être interdites.
 */
export type TwoOptResult = {
  /** Gain obtenu, 0 si le mouvement n'a pas été appliqué. */
  gain: number;
  /** Le mouvement aurait amélioré la tournée mais viole une contrainte. */
  blocked: boolean;
};

export function tryTwoOpt(
  instance: Instance,
  tour: number[],
  i: number,
  j: number,
): TwoOptResult {
  const n = tour.length;
  const a = tour[i];
  const b = tour[i + 1];
  const c = tour[j];
  const d = tour[(j + 1) % n];

  // On évalue le gain d'abord : cela permet de distinguer un mouvement sans
  // intérêt d'un mouvement intéressant mais interdit — c'est le second qui
  // mesure l'effet réel des contraintes.
  const before = edgeCost(instance, a, b) + edgeCost(instance, c, d);
  const after = edgeCost(instance, a, c) + edgeCost(instance, b, d);
  const gain = before - after;
  if (gain <= 1e-9) return { gain: 0, blocked: false };

  if (instance.forbidden[a][c] || instance.forbidden[b][d]) {
    return { gain: 0, blocked: true };
  }

  reverseSegment(tour, i + 1, j);
  if (!isFeasible(instance, tour)) {
    reverseSegment(tour, i + 1, j);
    return { gain: 0, blocked: true };
  }
  return { gain, blocked: false };
}

export function reverseSegment(tour: number[], lo: number, hi: number): void {
  while (lo < hi) {
    [tour[lo], tour[hi]] = [tour[hi], tour[lo]];
    lo++;
    hi--;
  }
}

/** Descente 2-opt jusqu'à l'optimum local, sans animation. */
export function twoOptToLocalOptimum(
  instance: Instance,
  tour: number[],
): number[] {
  const n = tour.length;
  let improved = true;
  let guard = 0;
  while (improved && guard < 10_000) {
    improved = false;
    guard++;
    for (let i = 0; i < n - 2; i++) {
      for (let j = i + 2; j < n; j++) {
        if (tryTwoOpt(instance, tour, i, j).gain > 0) improved = true;
      }
    }
  }
  return tour;
}
