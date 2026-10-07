// A tiny, fully local decision engine. It stands in for the reference site's
// backend so the feed and the playground work offline: lexicon scoring with a
// softmax for confidence, and every answer timed with performance.now().
// TODO(backend): replace with a real model by setting VITE_API_BASE (see api.ts).
import type { ChoiceDecision, DecideResult, Decision, GateDecision, ScoreDecision } from './types';

const tokenize = (text: string): string[] => text.toLowerCase().match(/[a-z0-9$]+/g) ?? [];

type Lexicon = Record<string, string[]>;

const NARRATIVES: Lexicon = {
  ai: ['ai', 'agent', 'agents', 'gpt', 'neural', 'bot', 'robot', 'model', 'llm', 'brain', 'intelligence', 'compute', 'cyber', 'machine', 'auto'],
  animal: ['cat', 'dog', 'frog', 'otter', 'fox', 'bear', 'bull', 'monkey', 'ape', 'penguin', 'lobster', 'duck', 'goat', 'hamster', 'owl', 'shark', 'whale', 'bird', 'pup', 'kitty', 'doge', 'llama', 'cow', 'puppy'],
  politics: ['vote', 'president', 'senate', 'election', 'party', 'congress', 'minister', 'policy', 'law', 'campaign', 'mayor', 'tax', 'government'],
  meme: ['lol', 'based', 'chad', 'meme', 'wagmi', 'gm', 'moon', 'send', 'cope', 'giga', 'mog', 'ser', 'fren', 'npc', 'cooked', 'vibes', 'goblin'],
  crypto: ['sol', 'chain', 'swap', 'defi', 'token', 'coin', 'block', 'stake', 'staked', 'yield', 'pool', 'liquidity', 'dex', 'validator', 'bridge', 'wallet', 'protocol', 'lending', 'borrow', 'oracle', 'dao', 'mint', 'vault', 'epoch', 'slashed', 'assets', 'price', 'feeds', 'contract', 'exploited', 'funds'],
};

const TOPICS: Lexicon = {
  ai_depin: ['ai', 'agent', 'compute', 'gpu', 'model', 'inference', 'depin', 'network', 'node', 'sensor', 'hardware'],
  layer1_layer2: ['validator', 'validators', 'epoch', 'epochs', 'consensus', 'block', 'rollup', 'chain', 'stake', 'slashed', 'finality', 'layer', 'fault', 'missed'],
  dev_specs: ['spec', 'rfc', 'api', 'sdk', 'interface', 'standard', 'release', 'version', 'changelog', 'implementation', 'tooling'],
  security: ['exploit', 'exploited', 'attack', 'hack', 'drain', 'draining', 'vulnerability', 'paused', 'audit', 'withdraw', 'urgent', 'immediately'],
  defi: ['lending', 'borrow', 'liquidity', 'pool', 'swap', 'yield', 'collateral', 'staked', 'repay', 'market', 'fees', 'amm', 'vault', 'deposits'],
  governance: ['dao', 'proposal', 'vote', 'delegates', 'grants', 'governance', 'quorum', 'treasury', 'council', 'deadline', 'round'],
  research: ['research', 'paper', 'analysis', 'study', 'model', 'data', 'report', 'findings', 'theory'],
  oracles_data: ['oracle', 'price', 'updates', 'feed', 'feeds', 'interval', 'confidence', 'publish', 'asset', 'data', 'cadence'],
};

const URGENT = ['urgent', 'now', 'immediately', 'breaking', 'exploit', 'exploited', 'drain', 'draining', 'paused', 'halt', 'emergency', 'critical', 'withdraw', 'hack'];
const SOON = ['deadline', 'before', 'today', 'soon', 'vote', 'please', 'slashed', 'fault', 'outage'];

function softmax(scores: number[], temp = 1): number[] {
  const m = Math.max(...scores);
  const e = scores.map((s) => Math.exp((s - m) / temp));
  const z = e.reduce((a, b) => a + b, 0);
  return e.map((x) => x / z);
}

function score(words: string[], lex: Lexicon): number[] {
  return Object.values(lex).map((list) => words.reduce((n, w) => n + (list.includes(w) ? 1 : 0), 0));
}

/** Run fn repeatedly so sub-microsecond work can be measured with performance.now(). */
function timed<T>(fn: () => T, reps = 40): [T, number] {
  let out = fn();
  const t0 = performance.now();
  for (let i = 0; i < reps; i++) out = fn();
  const us = ((performance.now() - t0) * 1000) / reps;
  return [out, Math.max(0.3, Math.round(us * 10) / 10)];
}

const round2 = (x: number) => Math.round(x * 100) / 100;

export function narrative(text: string): ChoiceDecision {
  const options = ['ai', 'animal', 'politics', 'meme', 'crypto', 'other'];
  const [res, us] = timed(() => {
    const w = tokenize(text);
    const s = score(w, NARRATIVES);
    const hits = s.reduce((a, b) => a + b, 0);
    const p = softmax([...s.map((x) => x * 3), hits ? 0.5 : 2.2]);
    const i = p.indexOf(Math.max(...p));
    return { choice: options[i], confidence: Math.min(0.99, Math.max(0.4, p[i])) };
  });
  return { type: 'choice', q: 'narrative', options, choice: res.choice, confidence: round2(res.confidence), us };
}

export function topic(text: string): ChoiceDecision {
  const options = Object.keys(TOPICS);
  const [res, us] = timed(() => {
    const w = tokenize(text);
    const s = score(w, TOPICS);
    const p = softmax(s.map((x) => x * 1.4 + 0.01 * Math.random()));
    const order = p.map((v, i) => [v, i] as const).sort((a, b) => b[0] - a[0]);
    return { choice: options[order[0][1]], runner: options[order[1][1]], confidence: order[0][0] };
  }, 20);
  return { type: 'choice', q: 'topic', options, choice: res.choice, runner: res.runner, confidence: round2(Math.max(0.2, res.confidence)), us };
}

export function isCrypto(text: string): GateDecision {
  const [res, us] = timed(() => {
    const w = tokenize(text);
    const hits = w.filter((x) => NARRATIVES.crypto.includes(x) || TOPICS.defi.includes(x) || TOPICS.governance.includes(x)).length;
    const ratio = hits / Math.max(1, w.length);
    const answer = hits >= 1 && ratio > 0.04;
    return { answer, confidence: answer ? Math.min(0.97, 0.6 + ratio * 2) : Math.min(0.97, 0.75 + (w.length < 8 ? 0.2 : 0.05)) };
  });
  return { type: 'noul', q: 'is_crypto', answer: res.answer, confidence: round2(res.confidence), us };
}

export function urgency(text: string): ScoreDecision {
  const labels = ['low', 'medium', 'high', 'critical'];
  const [res, us] = timed(() => {
    const w = tokenize(text);
    const u = w.filter((x) => URGENT.includes(x)).length;
    const s = w.filter((x) => SOON.includes(x)).length;
    const lvl = u >= 3 ? 3 : u >= 1 ? 2 : s >= 1 ? 1 : 0;
    const conf = lvl === 0 ? 0.7 : Math.min(0.96, 0.62 + (u + s) * 0.08);
    return { label: labels[lvl], confidence: conf };
  });
  return { type: 'score', q: 'urgency', labels, label: res.label, confidence: round2(res.confidence), us };
}

export function metadata(socials: number, hasDescription: boolean): ScoreDecision {
  const labels = ['bare', 'partial', 'complete'];
  const [res, us] = timed(() => {
    const pts = socials + (hasDescription ? 1 : 0);
    const i = pts >= 3 ? 2 : pts >= 1 ? 1 : 0;
    return { label: labels[i], confidence: i === 1 ? 0.95 : 0.98 };
  });
  return { type: 'score', q: 'metadata', labels, label: res.label, confidence: res.confidence, us };
}

export function copycat(name: string, symbol: string, recent: { name: string; symbol: string; mint: string }[]): GateDecision {
  const [res, us] = timed(() => {
    const n = name.toLowerCase(), s = symbol.toLowerCase();
    const twin = recent.find((r) => r.name.toLowerCase() === n || r.symbol.toLowerCase() === s);
    return twin ? { answer: true, confidence: 0.98, twin: twin.mint } : { answer: false, confidence: 0.9 + Math.random() * 0.08 };
  }, 10);
  return { type: 'noul', q: 'copycat', answer: res.answer, confidence: round2(res.confidence), twin: 'twin' in res ? res.twin : undefined, us };
}

export function devBuy(sol: number): ScoreDecision {
  const labels = ['none', 'small', 'large', 'whale'];
  const [res, us] = timed(() => ({ label: labels[sol <= 0 ? 0 : sol < 2 ? 1 : sol < 10 ? 2 : 3] }));
  return { type: 'score', q: 'dev_buy', labels, label: res.label, confidence: 1, sol, us };
}

/** The playground call: four typed questions about free text. */
export function decide(text: string): DecideResult {
  const t0 = performance.now();
  const decisions: Decision[] = [topic(text), isCrypto(text), urgency(text), narrative(text)];
  const wall = (performance.now() - t0) * 1000;
  const sum = decisions.reduce((a, d) => a + d.us, 0);
  return { decisions, us: Math.round(Math.min(wall, sum * 1.15) * 10) / 10, words: tokenize(text).length };
}
