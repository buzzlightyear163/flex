// Procedural brain point cloud: two folded hemispheres, a ridged cerebellum
// and a short stem, plus a nearest-neighbour graph used to spread "activity".

export interface Neuron {
  x: number;
  y: number;
  z: number;
  /** 0 = cortex, 1 = cerebellum, 2 = stem */
  region: 0 | 1 | 2;
  /** Surface relief in [-1, 1]: folds (gyri) are positive, grooves (sulci) negative. */
  relief: number;
}

export interface BrainMesh {
  points: Neuron[];
  neighbours: number[][];
}

function rng(seed: number): () => number {
  let s = seed % 2147483647 || 1;
  return () => (s = (s * 48271) % 2147483647) / 2147483647;
}

/** Layered sines give a convincing gyri pattern without a noise library. */
function folds(theta: number, phi: number): number {
  return (
    0.07 * Math.sin(theta * 9 + 1.5 * Math.sin(phi * 4)) * Math.cos(phi * 7) +
    0.05 * Math.sin(theta * 17 + phi * 5) +
    0.03 * Math.sin(phi * 23 + theta * 3)
  );
}

export function makeBrain(count = 4200, seed = 11): BrainMesh {
  const rand = rng(seed);
  const points: Neuron[] = [];
  const cortex = Math.floor(count * 0.84);

  for (let i = 0; i < cortex; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const f = folds(theta, phi);
    const r = (1 + f) * (0.93 + rand() * 0.09);
    let x = Math.abs(Math.sin(phi) * Math.cos(theta)) * 0.62 * r;
    let y = Math.cos(phi) * 0.78 * r;
    const z = Math.sin(phi) * Math.sin(theta) * 1.06 * r;
    if (y < -0.35) y = -0.35 + (y + 0.35) * 0.45; // flatter base
    x += 0.07; // gap between the hemispheres
    if (x < 0.1) x = 0.07 + x * 0.4; // flat medial wall
    points.push({ x: x * side, y: y + 0.05, z, region: 0, relief: 0 });
  }

  for (let i = 0; i < count * 0.11; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const k = 1 + 0.06 * Math.sin(phi * 22);
    points.push({
      x: Math.sin(phi) * Math.cos(theta) * 0.52 * k,
      y: -0.48 + Math.cos(phi) * 0.2 * k,
      z: -0.72 + Math.sin(phi) * Math.sin(theta) * 0.3 * k,
      region: 1,
      relief: 0,
    });
  }

  for (let i = 0; i < count * 0.05; i++) {
    const a = rand() * Math.PI * 2;
    const h = rand();
    points.push({
      x: Math.cos(a) * 0.12 * (1 - h * 0.3),
      y: -0.5 - h * 0.5,
      z: -0.32 + Math.sin(a) * 0.12 - h * 0.12,
      region: 2,
      relief: 0,
    });
  }

  // relief = how far a point sits outside the base ellipsoid: folds come out
  // bright, grooves (and the flattened base / medial wall / stem) go dark
  for (const p of points) {
    const n = Math.hypot(p.x / 0.66, p.y / 0.82, p.z / 1.1);
    p.relief = Math.max(-1, Math.min(1, (n - 0.96) * 16));
  }

  // spatial hash → 3 nearest neighbours each (undirected)
  const cell = 0.16;
  const key = (x: number, y: number, z: number) => `${x},${y},${z}`;
  const grid = new Map<string, number[]>();
  const cellOf = (p: Neuron) => [Math.floor(p.x / cell), Math.floor(p.y / cell), Math.floor(p.z / cell)] as const;
  points.forEach((p, i) => {
    const k = key(...cellOf(p));
    const list = grid.get(k);
    if (list) list.push(i);
    else grid.set(k, [i]);
  });
  const neighbours: number[][] = points.map(() => []);
  points.forEach((p, i) => {
    const [cx, cy, cz] = cellOf(p);
    const near: [number, number][] = [];
    for (let a = -1; a <= 1; a++)
      for (let b = -1; b <= 1; b++)
        for (let c = -1; c <= 1; c++)
          for (const j of grid.get(key(cx + a, cy + b, cz + c)) ?? []) {
            if (j === i) continue;
            const q = points[j];
            near.push([j, (q.x - p.x) ** 2 + (q.y - p.y) ** 2 + (q.z - p.z) ** 2]);
          }
    near.sort((u, v) => u[1] - v[1]);
    for (const [j] of near.slice(0, 3)) {
      if (!neighbours[i].includes(j)) neighbours[i].push(j);
      if (!neighbours[j].includes(i)) neighbours[j].push(i);
    }
  });

  return { points, neighbours };
}
