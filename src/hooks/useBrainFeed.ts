import { useEffect, useRef, useState } from 'react';
import { fetchState, openStream } from '../lib/api';
import { brainBus } from '../lib/brainBus';
import { setLive } from '../lib/liveStore';
import type { BrainState, FeedEvent } from '../lib/types';

export interface FeedRow {
  key: string;
  e: FeedEvent;
  /** Arrived live (animate in) vs. part of the initial snapshot. */
  fresh: boolean;
}

const MAX_ROWS = 30;
const MAX_TAPE = 22;
const rowKey = (e: FeedEvent) => `${e.kind}:${e.mint}:${e.at}`;

/**
 * Polls /api/state every 4 s (counters, latency, model facts) and listens to the
 * live stream of decided launches. Mirrors the reference page's data flow.
 */
export function useBrainFeed() {
  const [state, setState] = useState<BrainState | null>(null);
  const [rows, setRows] = useState<FeedRow[]>([]);
  const [tape, setTape] = useState<FeedRow[]>([]);
  const [latest, setLatest] = useState<FeedEvent[]>([]);
  const [decisions, setDecisions] = useState(0);
  const skew = useRef(0);
  const seeded = useRef(false);

  useEffect(() => {
    let stop = false, timer: number | undefined;
    const poll = async () => {
      try {
        const s = await fetchState(40);
        if (stop) return;
        skew.current = Date.now() - s.now;
        if (!seeded.current) {
          seeded.current = true;
          setRows(s.feed.slice(0, 18).map((e) => ({ key: rowKey(e), e, fresh: false })));
          setTape(s.feed.filter((e) => e.kind === 'create').slice(0, 14).map((e) => ({ key: rowKey(e), e, fresh: false })));
          setLatest(s.feed);
        }
        setDecisions((d) => Math.max(d, s.counters.decisions));
        setState(s);
        setLive(s.live);
      } catch {
        setLive(false);
      }
      if (!stop) timer = window.setTimeout(poll, 4000);
    };
    void poll();
    return () => {
      stop = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const timers: number[] = [];
    const off = openStream((e) => {
      const row = { key: rowKey(e), e, fresh: true };
      setRows((r) => [row, ...r.filter((x) => x.key !== row.key)].slice(0, MAX_ROWS));
      if (e.kind === 'create') setTape((t) => [row, ...t].slice(0, MAX_TAPE));
      setLatest((l) => [e, ...l].slice(0, 60));
      setDecisions((d) => d + (e.decisions?.length ?? 0));
      (e.decisions ?? []).forEach((_, i) => timers.push(window.setTimeout(() => brainBus.fire(1), i * 140)));
      if (e.kind === 'migrate') brainBus.fire(2);
    });
    return () => {
      off();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return { state, rows, tape, latest, decisions, skew: skew.current };
}
