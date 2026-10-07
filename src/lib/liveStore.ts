// Shared "is the feed live?" flag for the header pill and footer.
import { useSyncExternalStore } from 'react';

type Live = boolean | null; // null = not known yet
let live: Live = null;
const subs = new Set<() => void>();

export function setLive(v: boolean): void {
  if (v === live) return;
  live = v;
  subs.forEach((f) => f());
}

export function useLive(): Live {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => {
        subs.delete(f);
      };
    },
    () => live,
  );
}
