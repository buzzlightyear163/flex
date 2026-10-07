// Data access. With VITE_API_BASE set, the site talks to a real backend that
// implements the documented contract (GET /api/state, SSE /api/stream,
// POST /api/decide). Without it, everything runs on the local mock engine.
import { decide as localDecide } from './localBrain';
import { MockEngine } from './mockFeed';
import type { BrainState, DecideResult, FeedEvent } from './types';

const BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '');
export const isRemote = BASE.length > 0;

let engine: MockEngine | null = null;
const mock = () => (engine ??= new MockEngine());

export async function fetchState(feed = 40): Promise<BrainState> {
  if (!isRemote) return mock().snapshot(feed);
  const r = await fetch(`${BASE}/api/state?feed=${feed}`, { cache: 'no-store' });
  if (!r.ok) throw new Error(`state ${r.status}`);
  return (await r.json()) as BrainState;
}

/** Subscribe to decided launches. Returns an unsubscribe function. Reconnects on error. */
export function openStream(onEvent: (e: FeedEvent) => void): () => void {
  if (!isRemote) return mock().subscribe(onEvent);
  let es: EventSource | null = null, retry: number | undefined, closed = false;
  const connect = () => {
    es = new EventSource(`${BASE}/api/stream`);
    es.onmessage = (m) => onEvent(JSON.parse(m.data as string) as FeedEvent);
    es.onerror = () => {
      es?.close();
      if (!closed) retry = window.setTimeout(connect, 3000);
    };
  };
  connect();
  return () => {
    closed = true;
    window.clearTimeout(retry);
    es?.close();
  };
}

export async function postDecide(text: string): Promise<DecideResult> {
  if (!isRemote) {
    // Yield a frame so the button state paints, like a network round trip would.
    await new Promise((r) => setTimeout(r, 30));
    return localDecide(text);
  }
  const r = await fetch(`${BASE}/api/decide`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  const j = (await r.json()) as DecideResult;
  if (j.error) throw new Error(j.error);
  return j;
}
