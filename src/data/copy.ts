// ─────────────────────────────────────────────────────────────────────────────
// Page copy. Neutral placeholder text written to the same length and hierarchy
// as the reference so the layout matches. Replace freely (see BRANDING_TODO.md).
// Strings may contain the token {name} / {ticker}, filled from site.ts.
// ─────────────────────────────────────────────────────────────────────────────
import { site } from './site';

const fill = (s: string) => s.replaceAll('{name}', site.name).replaceAll('{ticker}', site.ticker);

export const nav = [
  { label: 'How it works', href: '/#split' },
  { label: 'Live feed', href: '/#cortex' },
  { label: 'Playground', href: '/#play' },
  { label: 'The model', href: '/#model' },
  { label: 'Docs', href: '/docs' },
];

export const hero = {
  cornerLeft: ['read', 'rank', 'decide', 'skip the chat', '>'],
  cornerRight: ['pick', 'score', 'gate', 'route', '>'],
  taglineBefore: 'The ',
  taglineAccent: 'reflex',
  taglineAfter: ' for your agents',
  /** Rendered as rich text: **bold** segments become <b>. */
  lede: fill(
    'Models draft. **{name} picks.** A fast reflex layer that reads state, answers typed questions with **Choice**, **Score** and **Gate**, and hands back data in microseconds, with a confidence. No chat. No essays. Just the call.',
  ),
  ctaPrimary: 'Watch it work',
  ctaSecondary: 'Try the reflex',
  ctaApi: 'API',
  kpis: ['decisions made', 'median latency', 'launches judged', 'per decision'],
};

export const split = {
  kick: 'How it works',
  title: 'Half the work in a loop is choosing.',
  titleDim: 'Stop paying a writer to choose.',
  sub: 'Is this noise? Who handles it next? Can it ship without a review? None of that needs prose. Routing every fork through a large model is slow, costly and chatty. Give each kind of step its own lane.',
  cols: [
    {
      small: '01 · SLOW PATH',
      title: 'If it writes → LLM',
      text: 'Long answers, drafts and summaries. The big model keeps the work it is great at, and nothing else.',
      items: ['answer the ticket', 'draft the summary', 'rewrite the intro'],
    },
    {
      small: '02 · FAST PATH',
      title: fill('If it picks, ranks or gates → {name}'),
      text: 'Each fork becomes a typed question with a fixed set of options. The reply is plain data that your code can switch on.',
      items: ['Choice · plan / build / check', 'Score · priority low → critical', 'Gate · ok to send? yes, 0.91'],
      mid: true,
    },
    {
      small: '03 · CODE',
      title: 'If it acts → code',
      text: 'Side effects stay deterministic: budgets, retries, checkpoints. Anything permanent waits for a person.',
      items: ['cap 10 steps per run', 'checkpoint after each step', 'send only when approved'],
    },
  ],
};

export const answers = {
  kick: 'Three answers',
  title: 'Choice. Score. Gate.',
  titleDim: 'The entire vocabulary.',
  sub: 'Three question shapes cover nearly every fork an agent runs into. The boxes below show the most recent live answers as they arrive.',
  cards: [
    { type: 'choice' as const, tag: 'CHOICE', title: 'Pick one.', text: 'One labelled option out of a fixed list, plus a confidence. Which queue, which tool, which theme.' },
    { type: 'score' as const, tag: 'SCORE', title: 'Rank it.', text: 'An ordered label: low → critical, bare → complete. Levels your code can set a threshold on.' },
    { type: 'noul' as const, tag: 'GATE', title: 'Yes or no.', text: 'A binary plus a confidence. Duplicate? Safe to run? Needs a human? The check before every step.' },
  ],
  waiting: 'waiting for a launch…',
};

export const cortex = {
  kick: 'Live feed',
  title: 'Every new Solana launch, judged.',
  titleDim: 'As it happens.',
  sub: 'When a token appears on pump.fun, the reflex receives its state and four typed questions: narrative (Choice), metadata (Score), copycat (Gate) and dev buy (Score). Every answer is timed.',
  streamLabel: 'feed.stream',
  streamSub: 'new launches',
  latencyLabel: 'MEDIAN DECISION LATENCY',
  rateLabel: 'DECISIONS / MINUTE · LAST HOUR',
  distLabel: 'narrative · Choice',
  distSub: 'share of launches',
};

export const playground = {
  kick: 'Playground',
  title: 'Hand it state.',
  titleDim: 'Get a decision.',
  sub: 'Paste a post, a changelog, a support ticket or an alert. The reflex answers four typed questions about it. Each call runs and is timed.',
  stateLabel: 'state',
  stateSub: 'any text · up to 4,000 characters',
  initial: 'The new lending market lets users borrow against staked assets and repay at any time with no fixed term.',
  examples: [
    { label: 'validator went offline', text: 'A validator missed several epochs after a hardware fault and part of its stake was slashed by the network.' },
    { label: 'exploit, pull funds now', text: 'Urgent: a vault contract has been exploited and funds are draining. Deposits are paused. Withdraw immediately.' },
    { label: 'vote: new grants round', text: 'Proposal: the DAO should open a new grants round for tooling. Delegates, please vote before the deadline.' },
    { label: 'oracle cadence change', text: 'The oracle network will now publish price updates every 400ms, each with a confidence interval per asset.' },
    { label: 'my dog loves naps', text: 'my dog loves naps and snores all afternoon' },
  ],
  decide: 'Decide',
  answersLabel: 'answers',
};

export const model = {
  kick: 'The model',
  title: 'Small by design.',
  titleDim: 'Measured in the open.',
  sub: 'The topic head is a compact naive Bayes classifier trained on a set of crypto pages and scored on pages it never saw. The figures below come from that held-out test.',
  panel: 'model.topics',
  panelSub: 'retrained on every boot',
  facts: ['held-out accuracy', 'test pages, never seen in training', 'training pages', 'vocabulary'],
};

export const token = {
  kick: 'The token',
  text: fill('A community token for the reflex that decides. The feed, the playground and the API on this site are open and free to use. Nothing promised beyond what you can see running.'),
  buy: 'Buy on pump.fun',
  dex: 'DexScreener',
  x: 'X',
};

export const faq = {
  kick: 'Questions',
  title: 'Before you ask.',
  items: [
    { q: 'Is this a chatbot?', a: 'No. It never produces sentences. It reads state, answers typed questions and returns data with a confidence. The writing stays with your model; the forks move to something quick.' },
    { q: 'Is the live feed real?', a: 'In this local build the feed is simulated in the browser, and every decision on it is computed and timed on your machine. Point it at a backend (see README) to judge real launches.' },
    { q: 'Is it financial advice?', a: 'No. The questions are descriptive: which narrative, how complete the metadata is, whether a name repeats a recent launch, how big the opening buy was. None of them say buy or sell.' },
    { q: 'Can I call it from my own agent?', a: 'Yes, in this early form: [the API](/docs) takes text and returns typed answers. Rate limits and pricing are up to whoever runs the backend.' },
    { q: 'Who is behind this?', a: fill('${ticker} is an independent community token. Replace this answer with your own story, team and links before launch.') },
  ],
};

export const footer = {
  disclaimer: fill('${ticker} is an independent community token. Memecoins are highly speculative. Nothing on this site is financial advice.'),
};
