// Simulated launch feed + server state. Generates synthetic token launches,
// judges each one with the local brain and keeps the same counters/latency/
// per-minute series the reference backend exposes on /api/state.
// TODO(backend): only used when VITE_API_BASE is not set.
import { copycat, devBuy, metadata, narrative } from './localBrain';
import type { BrainState, CreateEvent, FeedEvent, ModelFacts } from './types';
import { site } from '../data/site';

const ADJ = ['Turbo', 'Quiet', 'Neural', 'Based', 'Glitch', 'Tiny', 'Cosmic', 'Sleepy', 'Agent', 'Mega', 'Lucky', 'Pixel', 'Retro', 'Hyper', 'Soft', 'Golden', 'Feral', 'Lazy', 'Senate', 'Giga', 'Chain', 'Sol', 'Auto', 'Robo'];
const NOUN = ['Otter', 'Lobster', 'Frog', 'Llama', 'Duck', 'Penguin', 'Goblin', 'Fren', 'Cat', 'Dog', 'Owl', 'Hamster', 'Moon', 'Vote', 'Bot', 'Model', 'Swap', 'Vault', 'Bridge', 'Shark', 'Goat', 'Chad', 'Brain', 'Mayor', 'Vibes', 'Pool'];
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];
const mintId = (): string => Array.from({ length: 40 }, () => pick(B58.split(''))).join('') + 'pump';

function avatar(symbol: string): string {
  let h = 0;
  for (const c of symbol) h = (h * 31 + c.charCodeAt(0)) % 360;
  const a = `hsl(${h},70%,55%)`, b = `hsl(${(h + 60) % 360},65%,30%)`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="40" height="40" fill="url(#g)"/><text x="20" y="25" font-family="monospace" font-size="13" font-weight="700" text-anchor="middle" fill="#fff">${symbol.slice(0, 2)}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

interface Fixture {
  counters: { decisions: number; tokens: number; migrations: number };
  narratives: Record<string, number>;
  perMinHistory: number[];
  latencySeed: number[];
  model: ModelFacts;
}

const FALLBACK: Fixture = {
  counters: { decisions: 10480, tokens: 2620, migrations: 54 },
  narratives: { ai: 118, animal: 231, politics: 21, meme: 152, crypto: 301, other: 880 },
  perMinHistory: Array.from({ length: 59 }, (_, i) => 90 + Math.round(30 * Math.sin(i / 5) + Math.random() * 25)),
  latencySeed: [1.2, 2.1, 9.8, 11.4, 43.2, 1.3, 2.0, 9.9],
  model: { pages: 1000, vocab: 31207, accuracy: 0.948, tested: 200, topics: {} },
};

type Listener = (e: FeedEvent) => void;

export class MockEngine {
  private state: BrainState;
  private listeners = new Set<Listener>();
  private lat: number[] = [];
  private timer: number | undefined;
  private ready: Promise<void>;

  constructor() {
    const now = Date.now();
    this.state = {
      now,
      live: true,
      perMinute: 0,
      counters: { decisions: 0, tokens: 0, migrations: 0, since: now - 6 * 3600e3 },
      latency: { median: null, p99: null },
      narratives: {},
      perMin: [],
      model: FALLBACK.model,
      token: { ticker: site.ticker, mint: site.contract, x: site.links.x || null },
      feed: [],
    };
    this.ready = this.load();
  }

  private async load(): Promise<void> {
    let fx = FALLBACK;
    try {
      const r = await fetch('/api/state.json', { cache: 'no-store' });
      if (r.ok) fx = { ...FALLBACK, ...((await r.json()) as Partial<Fixture>) };
    } catch {
      /* fixture is optional */
    }
    const s = this.state, nowM = Math.floor(Date.now() / 60000);
    s.counters = { ...s.counters, ...fx.counters };
    s.narratives = { ...fx.narratives };
    s.model = fx.model;
    s.perMin = fx.perMinHistory.slice(-59).map((v, i, a) => [nowM - a.length + i, v] as [number, number]);
    this.lat.push(...fx.latencySeed);
    // seed the feed with launches from the last couple of minutes
    const seeded: FeedEvent[] = [];
    for (let i = 0; i < 40; i++) seeded.push(this.launch(Date.now() - (i + 1) * (2200 + Math.random() * 1800), false));
    s.feed = seeded;
    this.recompute();
  }

  private launch(at: number, count = true): CreateEvent {
    const recent = this.state.feed.slice(0, 60).filter((e): e is CreateEvent => e.kind === 'create');
    const copy = recent.length > 5 && Math.random() < 0.12 ? pick(recent) : null;
    const name = copy ? copy.name : `${pick(ADJ)} ${pick(NOUN)}`;
    const symbol = copy ? copy.symbol : name.split(' ').map((w, i) => (i ? w : w.slice(0, Math.random() < 0.5 ? 1 : 0))).join('').toUpperCase().slice(0, 8);
    const socials = Math.floor(Math.random() * 4);
    const r = Math.random();
    const sol = r < 0.25 ? 0 : r < 0.7 ? Math.round(Math.random() * 19) / 10 : r < 0.93 ? 2 + Math.round(Math.random() * 70) / 10 : 10 + Math.round(Math.random() * 300) / 10;
    const decisions = [narrative(name), metadata(socials, Math.random() < 0.5), copycat(name, symbol, recent), devBuy(sol)];
    const e: CreateEvent = {
      kind: 'create',
      at,
      name,
      symbol,
      mint: mintId(),
      img: avatar(symbol),
      mcapSol: Math.round((26 + Math.random() * 60) * 10) / 10,
      socials: socials > 0,
      decisions,
      us: Math.round(decisions.reduce((a, d) => a + d.us, 0) * 10) / 10,
    };
    if (count) this.account(e);
    return e;
  }

  private account(e: CreateEvent): void {
    const s = this.state;
    s.counters.decisions += e.decisions.length;
    s.counters.tokens += 1;
    const nar = e.decisions[0];
    if (nar.type === 'choice') s.narratives[nar.choice] = (s.narratives[nar.choice] ?? 0) + 1;
    for (const d of e.decisions) this.lat.push(d.us);
    if (this.lat.length > 2000) this.lat.splice(0, this.lat.length - 2000);
    const m = Math.floor(Date.now() / 60000), last = s.perMin[s.perMin.length - 1];
    if (last && last[0] === m) last[1] += e.decisions.length;
    else s.perMin.push([m, e.decisions.length]);
    while (s.perMin.length && s.perMin[0][0] < m - 59) s.perMin.shift();
    this.recompute();
  }

  private recompute(): void {
    const s = this.state, sorted = [...this.lat].sort((a, b) => a - b);
    s.latency = sorted.length
      ? { median: sorted[Math.floor(sorted.length / 2)], p99: sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.99))] }
      : { median: null, p99: null };
    const total = s.perMin.reduce((a, [, v]) => a + v, 0);
    s.perMinute = Math.round((total / Math.max(1, s.perMin.length) / 4) * 10) / 10;
  }

  private tick = (): void => {
    const s = this.state;
    let e: FeedEvent;
    if (Math.random() < 0.04) {
      const c = s.feed.find((x) => x.kind === 'create');
      e = { kind: 'migrate', at: Date.now(), mint: c ? c.mint : mintId() };
      s.counters.migrations += 1;
    } else e = this.launch(Date.now());
    s.feed.unshift(e);
    if (s.feed.length > 80) s.feed.length = 80;
    this.listeners.forEach((l) => l(e));
    this.timer = window.setTimeout(this.tick, 1200 + Math.random() * 2600);
  };

  async snapshot(feed = 40): Promise<BrainState> {
    await this.ready;
    const s = this.state;
    // copy everything mutable so React sees new references on every poll
    return {
      ...s,
      now: Date.now(),
      counters: { ...s.counters },
      latency: { ...s.latency },
      narratives: { ...s.narratives },
      perMin: s.perMin.map(([m, v]) => [m, v] as [number, number]),
      feed: s.feed.slice(0, feed),
    };
  }

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    if (this.timer === undefined) void this.ready.then(() => { if (this.timer === undefined) this.timer = window.setTimeout(this.tick, 900); });
    return () => {
      this.listeners.delete(l);
      if (!this.listeners.size && this.timer !== undefined) {
        window.clearTimeout(this.timer);
        this.timer = undefined;
      }
    };
  }
}
