import type { Decision, DecisionType } from './types';
import { theme } from '../data/theme';

export const fmt = (n: number | null | undefined): string =>
  n == null ? '—' : Math.round(n).toLocaleString('en-US');

/** Microseconds → "9.5µs", "43µs", "1.3ms". */
export const usf = (x: number): string =>
  x >= 1000 ? `${(x / 1000).toFixed(1)}ms` : `${x.toFixed(x < 10 ? 1 : 0)}µs`;

/** The display value of a decision. */
export const val = (d: Decision): string =>
  d.type === 'choice' ? d.choice : d.type === 'score' ? d.label : d.answer ? 'yes' : 'no';

export const options = (d: Decision): string[] =>
  d.type === 'choice' ? d.options : d.type === 'score' ? d.labels : ['yes', 'no'];

export const TYPE_COLOR: Record<DecisionType, string> = {
  choice: theme.accent,
  score: theme.second,
  noul: theme.gate,
};

/** [css modifier, label]. The binary type is shown as "GATE". */
export const TYPE_TAG: Record<DecisionType, [string, string]> = {
  choice: ['c', 'CHOICE'],
  score: ['s', 'SCORE'],
  noul: ['n', 'GATE'],
};

export const shortMint = (m: string): string => `${m.slice(0, 4)}…${m.slice(-4)}`;

export const clockTime = (ms: number): string => new Date(ms).toTimeString().slice(0, 8);
