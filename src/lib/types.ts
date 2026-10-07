// Data contract shared by the mock engine and a real backend (see docs page / README).

export type DecisionType = 'choice' | 'score' | 'noul';

interface DecisionBase {
  /** Question key, e.g. "narrative", "metadata", "copycat", "dev_buy". */
  q: string;
  confidence: number;
  /** Time spent answering this question, in microseconds. */
  us: number;
}

export interface ChoiceDecision extends DecisionBase {
  type: 'choice';
  options: string[];
  choice: string;
  runner?: string;
}

export interface ScoreDecision extends DecisionBase {
  type: 'score';
  labels: string[];
  label: string;
  sol?: number;
}

/** Binary gate. Wire name kept as "noul" for API compatibility with the reference. */
export interface GateDecision extends DecisionBase {
  type: 'noul';
  answer: boolean;
  twin?: string;
}

export type Decision = ChoiceDecision | ScoreDecision | GateDecision;

export interface CreateEvent {
  kind: 'create';
  at: number;
  name: string;
  symbol: string;
  mint: string;
  img?: string;
  mcapSol?: number;
  socials?: boolean;
  decisions: Decision[];
  /** Total time for all questions, microseconds. */
  us: number;
}

export interface MigrateEvent {
  kind: 'migrate';
  at: number;
  mint: string;
  decisions?: Decision[];
}

export type FeedEvent = CreateEvent | MigrateEvent;

export interface ModelFacts {
  pages: number;
  vocab: number;
  accuracy: number;
  tested: number;
  /** Display name → topic label. */
  topics: Record<string, string>;
}

export interface BrainState {
  now: number;
  live: boolean;
  perMinute: number;
  counters: { decisions: number; tokens: number; migrations: number; since: number };
  latency: { median: number | null; p99: number | null };
  narratives: Record<string, number>;
  /** [epochMinute, decisions] pairs for the last hour. */
  perMin: [number, number][];
  model: ModelFacts;
  token: { ticker: string; mint: string | null; x: string | null };
  feed: FeedEvent[];
}

export interface DecideResult {
  decisions: Decision[];
  us: number;
  words: number;
  error?: string;
}
