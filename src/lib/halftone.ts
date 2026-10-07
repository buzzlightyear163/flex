// Halftone sphere ("planet") made of dots whose size follows the light.
import { theme } from '../data/theme';
export interface PlanetOptions {
  /** 2D light direction; the lit side is opposite this vector. */
  light?: [number, number];
  gap?: number;
}

export function drawPlanet(g: CanvasRenderingContext2D, cx: number, cy: number, r: number, { light = [-0.5, -0.6], gap = 7 }: PlanetOptions = {}): void {
  for (let y = cy - r; y < cy + r; y += gap) {
    for (let x = cx - r; x < cx + r; x += gap) {
      const nx = (x - cx) / r, ny = (y - cy) / r, d2 = nx * nx + ny * ny;
      if (d2 > 1) continue;
      const nz = Math.sqrt(1 - d2);
      const lum = Math.max(0, -(nx * light[0] + ny * light[1]) * 0.8 + nz * 0.5);
      const rad = gap * 0.5 * Math.min(1, 0.15 + lum * 1.1);
      g.fillStyle = lum > 0.55 ? theme.planet.lit : theme.planet.base;
      g.beginPath();
      g.arc(x, y, rad, 0, Math.PI * 2);
      g.fill();
    }
  }
}
