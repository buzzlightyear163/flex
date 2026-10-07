import { useEffect, useRef } from 'react';
import { RevealSection } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { DecisionChip } from './DecisionChip';
import { cortex } from '../data/copy';
import { clockTime, fmt, shortMint, usf } from '../lib/format';
import { theme } from '../data/theme';
import type { BrainState } from '../lib/types';
import type { FeedRow } from '../hooks/useBrainFeed';

const FALLBACK_IMG = '/favicon.svg';
const NARRATIVE_ORDER = ['ai', 'animal', 'meme', 'politics', 'crypto', 'other'];

function LaunchRow({ row, skew }: { row: FeedRow; skew: number }) {
  const { e, fresh } = row;
  const t = clockTime(e.at + skew);
  const cls = `launch${fresh ? ' launch--new' : ''}${e.kind === 'migrate' ? ' launch--migrate' : ''}`;
  if (e.kind === 'migrate') {
    return (
      <div className={cls}>
        <span className="launch__time">{t}</span>
        <div>
          <div className="launch__name">
            graduated to PumpSwap <small>{shortMint(e.mint)}</small>
          </div>
        </div>
        <span className="launch__us">event</span>
      </div>
    );
  }
  return (
    <div className={cls}>
      <span className="launch__time">{t}</span>
      <div className="launch__body">
        <img
          className="launch__img"
          src={e.img || FALLBACK_IMG}
          loading="lazy"
          alt=""
          onError={(ev) => {
            ev.currentTarget.src = FALLBACK_IMG;
          }}
        />
        <div>
          <a className="launch__name" href={`https://pump.fun/coin/${e.mint}`} target="_blank" rel="noopener">
            {e.name} <small>${e.symbol}</small>
            <small className="launch__mcap">{e.mcapSol ? `${e.mcapSol} SOL mcap` : ''}</small>
          </a>
          <div className="launch__chips">
            {e.decisions.map((d) => (
              <DecisionChip key={d.q} d={d} />
            ))}
          </div>
        </div>
      </div>
      <span className="launch__us">
        {usf(e.us)}
        <small>{e.decisions.length} answers</small>
      </span>
    </div>
  );
}

function Sparkline({ perMin }: { perMin: [number, number][] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const draw = () => {
      const c = ref.current, g = c?.getContext('2d');
      if (!c || !g) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1), W = c.clientWidth, H = c.clientHeight;
      c.width = W * dpr;
      c.height = H * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const nowM = Math.floor(Date.now() / 60000);
      const vals = Array.from({ length: 60 }, (_, i) => perMin.find((x) => x[0] === nowM - 59 + i)?.[1] ?? 0);
      const max = Math.max(4, ...vals), bw = W / 60;
      g.clearRect(0, 0, W, H);
      vals.forEach((v, i) => {
        const h = (v / max) * (H - 6);
        g.fillStyle = i === 59 ? theme.accent : `rgba(${theme.accentRgb},.35)`;
        g.fillRect(i * bw + 1, H - h, bw - 2, h);
      });
    };
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [perMin]);
  return <canvas ref={ref} className="spark" />;
}

function NarrativeShare({ narratives }: { narratives: Record<string, number> }) {
  const total = Object.values(narratives).reduce((a, b) => a + b, 0) || 1;
  return (
    <div className="dist">
      {NARRATIVE_ORDER.map((k) => {
        const n = narratives[k] ?? 0, pct = (n / total) * 100;
        return (
          <div key={k} className="dist__row">
            <span>{k}</span>
            <span className="dist__bar">
              <i style={{ width: `${pct}%` }} />
            </span>
            <span>{Math.round(pct)}%</span>
          </div>
        );
      })}
    </div>
  );
}

interface Props {
  state: BrainState | null;
  rows: FeedRow[];
  /** ms offset between this browser's clock and the server's. */
  skew: number;
}

export function Cortex({ state, rows, skew }: Props) {
  const live = state?.live ?? true;
  return (
    <RevealSection id="cortex">
      <SectionHeading kick={cortex.kick} title={cortex.title} titleDim={cortex.titleDim} sub={cortex.sub} />
      <div className="cortex">
        <div className="panel">
          <div className="panel__head">
            <span>
              <i className={live ? 'dot' : 'dot dot--off'} style={{ marginRight: 8 }} />
              <b>{cortex.streamLabel}</b> · {cortex.streamSub}
            </span>
            <span>{state ? `${fmt(state.counters.tokens)} judged · ${state.perMinute}/min` : '—'}</span>
          </div>
          <div className="stream">
            {rows.map((r) => (
              <LaunchRow key={r.key} row={r} skew={skew} />
            ))}
          </div>
        </div>
        <div className="cortex__side">
          <div className="panel metric">
            <div className="metric__label">{cortex.latencyLabel}</div>
            <div className="metric__big">
              {state?.latency.median ? state.latency.median.toFixed(0) : '—'}
              <small>µs</small>
            </div>
            <div className="metric__label">{state?.latency.p99 ? `p99 ${usf(state.latency.p99)} · per question` : 'p99 —'}</div>
          </div>
          <div className="panel metric">
            <div className="metric__label">{cortex.rateLabel}</div>
            <Sparkline perMin={state?.perMin ?? []} />
          </div>
          <div className="panel">
            <div className="panel__head">
              <b>{cortex.distLabel}</b>
              <span>{cortex.distSub}</span>
            </div>
            <NarrativeShare narratives={state?.narratives ?? {}} />
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
