import { useEffect, useRef } from 'react';
import { createPixelBrain } from '../../lib/pixelBrain';
import { brainBus } from '../../lib/brainBus';
import { site } from '../../data/site';

/** The animated pixel brain on the right of the hero (stacks on top on mobile). */
export function BrainScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let raf = 0, alive = true, off = () => {};
    const start = async () => {
      // canvas text needs the web fonts; don't wait forever if they are blocked
      await Promise.race([
        Promise.all([document.fonts.load('700 20px "Archivo Black"'), document.fonts.load('700 20px "Space Mono"')]).catch(() => undefined),
        new Promise((r) => setTimeout(r, 1500)),
      ]);
      if (!alive) return;
      const narrow = window.innerWidth < 700;
      const brain = createPixelBrain(
        canvas,
        narrow
          ? { label: site.name, routes: site.routesNarrow, brainX: 0.36, brainR: 0.33, px: 4, boxW: 62, boxX: 0.85 }
          : { label: site.name, routes: site.routes, brainX: 0.4, brainR: 0.3, px: 5 },
      );
      off = brainBus.on((s) => brain.fire(s));
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        brain.draw(now / 1000);
      };
      raf = requestAnimationFrame(loop);
    };
    void start();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      off();
    };
  }, []);

  return <canvas ref={ref} className="hero__scene" aria-hidden="true" />;
}
