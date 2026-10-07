import { useEffect, useRef } from 'react';
import { drawPlanet } from '../../lib/halftone';

/** Full-bleed canvas behind the hero with two halftone planets. */
export function HalftoneBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const g = c?.getContext('2d');
    if (!c || !g) return;
    const paint = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1), W = c.clientWidth, H = c.clientHeight;
      c.width = W * dpr;
      c.height = H * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawPlanet(g, W * 0.5 - 700, H + 250, 380, { light: [0.6, -0.8], gap: 8 });
      drawPlanet(g, W + 40, H * 0.26, 200, { light: [-0.8, -0.3], gap: 7 });
    };
    paint();
    let t: number | undefined;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(paint, 200);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(t);
    };
  }, []);

  return <canvas ref={ref} className="hero__backdrop" aria-hidden="true" />;
}
