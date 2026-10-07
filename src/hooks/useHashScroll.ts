import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const OFFSET = 80; // matches `scroll-padding-top` in base.css (sticky header + breathing room)

/**
 * When routed to "/#id" from another page, scroll to that section once it exists,
 * then correct once more after live data has filled the page above it.
 */
export function useHashScroll(): void {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const timers: number[] = [];
    let tries = 0;
    const go = () => {
      const el = document.getElementById(id);
      if (!el) {
        if (tries++ < 20) timers.push(window.setTimeout(go, 50));
        return;
      }
      el.scrollIntoView({ behavior: 'smooth' });
      timers.push(
        window.setTimeout(() => {
          const top = el.getBoundingClientRect().top;
          if (Math.abs(top - OFFSET) > 8) window.scrollTo({ top: window.scrollY + top - OFFSET, behavior: 'smooth' });
        }, 1100),
      );
    };
    go();
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [hash]);
}
