// Hero visual: a slowly turning brain rendered as dithered pixels in the theme colour, a
// chip with the brand name at its centre, and glowing traces to the "routes"
// it hands work to. fire() starts a wave of activity and sends a pulse down a trace.
import { makeBrain } from './brainGeometry';
import { theme } from '../data/theme';

/** Standard 4×4 ordered-dither (Bayer) matrix. */
const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];
/** Dark → light ramp the brain is dithered into (see src/data/theme.ts). */
export const PALETTE: readonly string[] = theme.brainRamp;
const SIGNAL = theme.accent;
const INK = theme.ink;
const LINE = theme.line;

export interface PixelBrainOptions {
  label: string;
  routes: readonly string[];
  /** Pixel cell size in CSS px. */
  px?: number;
  brainX?: number;
  brainY?: number;
  brainR?: number;
  boxX?: number;
  boxW?: number;
  yaw?: number;
  points?: number;
}

interface Wave { front: number[]; seen: Set<number>; left: number }
interface Pulse { route: number; u: number }
interface Box { label: string; x: number; y: number; w: number; h: number }
type Pt = [number, number];

export interface PixelBrain {
  draw(t: number): void;
  fire(strength?: number, route?: number): void;
}

export function createPixelBrain(canvas: HTMLCanvasElement, opts: PixelBrainOptions): PixelBrain {
  const { label, routes, px = 5, brainX = 0.4, brainY = 0.5, brainR = 0.3, boxX = 0.86, yaw = -1.32, points = 4200 } = opts;
  const ctx = canvas.getContext('2d');
  const buf = document.createElement('canvas');
  const bctx = buf.getContext('2d', { willReadFrequently: true });
  if (!ctx || !bctx) return { draw: () => {}, fire: () => {} };
  const g: CanvasRenderingContext2D = ctx, bg: CanvasRenderingContext2D = bctx;

  const mesh = makeBrain(points, 11);
  const heat = new Float32Array(mesh.points.length);
  const waves: Wave[] = [];
  const pulses: Pulse[] = [];
  const flash = new Float32Array(routes.length);
  const drips = Array.from({ length: 16 }, (_, i) => ({ x: -0.4 + i * 0.055 + Math.sin(i * 7) * 0.02, len: 0.1 + (((i * 37) % 11) / 11) * 0.32, w: i % 3 ? 1 : 2 }));
  let W = 0, H = 0, last = 0, onScreen = true;

  new IntersectionObserver((es) => es.forEach((e) => (onScreen = e.isIntersecting))).observe(canvas);

  function fire(strength = 1, route?: number): void {
    const seed = Math.floor(Math.random() * mesh.points.length * 0.84);
    waves.push({ front: [seed], seen: new Set([seed]), left: Math.round(10 + strength * 12) });
    pulses.push({ route: route ?? Math.floor(Math.random() * routes.length), u: 0 });
  }

  function spread(): void {
    for (let k = waves.length - 1; k >= 0; k--) {
      const w = waves[k], next: number[] = [];
      for (const i of w.front) {
        heat[i] = Math.min(1.5, heat[i] + 1);
        for (const j of mesh.neighbours[i]) if (!w.seen.has(j) && Math.random() < 0.85) { w.seen.add(j); next.push(j); }
      }
      w.front = next.slice(0, 220);
      if (--w.left <= 0 || w.front.length === 0) waves.splice(k, 1);
    }
  }

  function geometry() {
    const R = Math.min(W * brainR, H * 0.46), cx = W * brainX, cy = H * brainY;
    const bw = opts.boxW ?? Math.min(110, W * 0.075), bh = bw * 0.78;
    const step = (H * 0.84 - bh) / Math.max(1, routes.length - 1);
    const boxes: Box[] = routes.map((l, i) => ({ label: l, x: W * boxX - bw / 2, y: H * 0.08 + i * step, w: bw, h: bh }));
    const chip = R * 0.36, chipX = cx + R * 0.1, chipY = cy - R * 0.02;
    return { R, cx, cy, boxes, chip, chipX, chipY };
  }
  type Geo = ReturnType<typeof geometry>;

  function trace(G: Geo, k: number): Pt[] {
    const b = G.boxes[k];
    const sx = G.chipX + G.chip / 2, sy = G.chipY + (k - (G.boxes.length - 1) / 2) * G.chip * 0.16;
    const ex = b.x, ey = b.y + b.h / 2, mx = sx + (ex - sx) * (0.45 + k * 0.05);
    return [[sx, sy], [mx, sy], [mx, ey], [ex, ey]];
  }

  function pointOn(path: Pt[], u: number): Pt {
    const lens = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]));
    let s = u * lens.reduce((a, b) => a + b, 0);
    for (let i = 0; i < lens.length; i++) {
      if (s <= lens[i]) { const f = s / lens[i]; return [path[i][0] + (path[i + 1][0] - path[i][0]) * f, path[i][1] + (path[i + 1][1] - path[i][1]) * f]; }
      s -= lens[i];
    }
    return path[path.length - 1];
  }

  function roundRect(x: number, y: number, w: number, h: number, r: number): void {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }

  function drawRoutes(G: Geo, dt: number): void {
    g.lineWidth = 2;
    g.strokeStyle = SIGNAL;
    g.shadowColor = SIGNAL;
    g.shadowBlur = 8;
    G.boxes.forEach((_, k) => {
      const p = trace(G, k);
      g.beginPath();
      g.moveTo(p[0][0], p[0][1]);
      for (const q of p.slice(1)) g.lineTo(q[0], q[1]);
      g.stroke();
      g.fillStyle = SIGNAL;
      g.fillRect(p[3][0] - 9, p[3][1] - 5, 9, 10);
    });
    g.shadowBlur = 0;

    for (let i = pulses.length - 1; i >= 0; i--) {
      const q = pulses[i];
      q.u += dt * 1.1;
      if (q.u >= 1) { flash[q.route] = 1; pulses.splice(i, 1); continue; }
      const [x, y] = pointOn(trace(G, q.route), q.u);
      g.fillStyle = '#fff';
      g.shadowColor = SIGNAL;
      g.shadowBlur = 14;
      g.fillRect(x - 4, y - 4, 8, 8);
      g.shadowBlur = 0;
    }

    G.boxes.forEach((b, k) => {
      flash[k] = Math.max(0, flash[k] - dt * 1.5);
      const lit = flash[k] > 0.05;
      g.fillStyle = theme.boxFill;
      roundRect(b.x, b.y, b.w, b.h, 6);
      g.fill();
      g.lineWidth = 1.6;
      g.strokeStyle = lit ? '#fff' : LINE;
      g.stroke();
      if (lit) { g.fillStyle = `rgba(${theme.accentRgb},${flash[k] * 0.35})`; g.fill(); }
      g.fillStyle = INK;
      g.font = `700 ${Math.round(b.w * 0.19)}px "Space Mono", monospace`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2 + 1);
      g.textAlign = 'start';
      g.textBaseline = 'alphabetic';
      g.fillStyle = LINE;
      g.fillRect(b.x + 6, b.y + 6, 4, 4);
    });
  }

  function drawBrain(G: Geo, t: number, turn: number): void {
    const cols = Math.ceil(W / px), rows = Math.ceil(H / px);
    if (buf.width !== cols || buf.height !== rows) { buf.width = cols; buf.height = rows; }
    bg.clearRect(0, 0, cols, rows);

    const cy = Math.cos(turn), sy = Math.sin(turn), tilt = -0.16, ct = Math.cos(tilt), st = Math.sin(tilt);
    const R = G.R / px, ox = G.cx / px, oy = G.cy / px;
    const proj = mesh.points.map((p, i) => {
      const x = p.x * cy + p.z * sy, z = -p.x * sy + p.z * cy;
      const y2 = p.y * ct - z * st, z2 = p.y * st + z * ct, f = 3.2 / (3.2 + z2);
      return { sx: ox + x * R * f, sy: oy - y2 * R * f, z: z2, lx: x, i };
    });
    proj.sort((a, b) => b.z - a.z);
    const dot = Math.max(1.4, R * 0.045);
    for (const q of proj) {
      const p = mesh.points[q.i];
      const light = 0.45 + (0.35 * -q.z) / 1.1 + 0.22 * p.y - 0.1 * q.lx;
      const v = Math.max(0, Math.min(1, light * 0.52 + p.relief * 0.38 + heat[q.i] * 0.6 - 0.04));
      const c = Math.round(v * 255);
      bg.fillStyle = `rgb(${c},${c},${c})`;
      bg.beginPath();
      bg.arc(q.sx, q.sy, dot * (p.region === 2 ? 0.8 : 1), 0, Math.PI * 2);
      bg.fill();
    }
    // melting drips under the brain
    bg.fillStyle = 'rgb(150,150,150)';
    for (const d of drips) {
      const x = Math.round(ox + d.x * R * 1.6), y0 = Math.round(oy + R * 0.42 + Math.abs(d.x) * R * 0.3);
      const len = Math.round(d.len * R * (1 + 0.15 * Math.sin(t * 0.8 + d.x * 20)));
      bg.fillRect(x, y0, d.w, len);
      bg.fillRect(x - 1, y0 + len, d.w + 2, 2);
    }

    const data = bg.getImageData(0, 0, cols, rows).data;
    const top = PALETTE.length - 1;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const k = (y * cols + x) * 4, alpha = data[k + 3];
        if (alpha < 40) continue;
        const v = (data[k] / 255) * (alpha / 255);
        const th = (BAYER4[y % 4][x % 4] + 0.5) / 16;
        const lv = v * top, base = Math.floor(lv);
        const idx = Math.min(top, base + (lv - base > th ? 1 : 0));
        if (idx <= 0 && th > 0.5) continue;
        g.fillStyle = PALETTE[idx];
        g.fillRect(x * px, y * px, px - 1, px - 1);
      }
    }
  }

  function drawChip(G: Geo): void {
    const s = G.chip, x = G.chipX - s / 2, y = G.chipY - s / 2;
    g.strokeStyle = LINE;
    g.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const u = (i + 0.5) / 6;
      const pins: [number, number, number, number][] = [
        [x + u * s, y, x + u * s, y - 8],
        [x + u * s, y + s, x + u * s, y + s + 8],
        [x, y + u * s, x - 8, y + u * s],
        [x + s, y + u * s, x + s + 8, y + u * s],
      ];
      for (const [a, b, c, d] of pins) { g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); }
    }
    g.fillStyle = theme.boxFill;
    roundRect(x, y, s, s, 6);
    g.fill();
    g.strokeStyle = INK;
    g.lineWidth = 2;
    g.stroke();
    g.fillStyle = INK;
    g.font = `700 ${Math.round(s * 0.3 * Math.min(1, 3.4 / label.length))}px "Archivo Black", sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(label, x + s / 2, y + s / 2 + 1);
    g.textAlign = 'start';
    g.textBaseline = 'alphabetic';
    g.fillStyle = LINE;
    g.fillRect(x + 6, y + 6, 4, 4);
  }

  function draw(t: number): void {
    if (!onScreen) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    if (!W || !H) return;
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    const dt = Math.min(0.05, t - last || 0.016);
    last = t;
    if (Math.floor(t * 30) !== Math.floor((t - dt) * 30)) spread();
    // time-based so the glow fades at the same speed on slow and fast displays (0.95 per 60 Hz frame)
    const decay = Math.pow(0.95, dt * 60);
    for (let i = 0; i < heat.length; i++) heat[i] *= decay;
    if (Math.random() < 1 - Math.pow(0.98, dt * 60)) fire(0.4); // idle sparks


    const G = geometry();
    drawRoutes(G, dt);
    drawBrain(G, t, yaw + Math.sin(t * 0.25) * 0.12);
    drawChip(G);
  }

  return { draw, fire };
}
