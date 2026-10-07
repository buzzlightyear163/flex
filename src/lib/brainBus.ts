// Tiny pub/sub so any component can make the hero brain light up.
type Fire = (strength: number) => void;
const subs = new Set<Fire>();

export const brainBus = {
  fire(strength = 1): void {
    subs.forEach((f) => f(strength));
  },
  on(f: Fire): () => void {
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  },
};
