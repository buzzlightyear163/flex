// RFLX mark ("synapse"): two halves of a circle with the impulse crossing the gap.
// Same geometry as brand/rflx-mark.svg; the viewBox is tight around the shape so it
// drops into the 26px header slot unchanged.
import { theme } from '../data/theme';

export function LogoMark() {
  return (
    <svg viewBox="20 20 160 160" aria-hidden="true">
      <path d="M72 25.1 A80 80 0 0 0 72 174.9 Z" fill={theme.ink} />
      <path d="M128 25.1 A80 80 0 0 1 128 174.9 Z" fill={theme.ink} />
      <rect x="86" y="86" width="28" height="28" rx="3" fill={theme.accent} />
    </svg>
  );
}
