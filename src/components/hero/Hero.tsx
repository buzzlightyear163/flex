import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { BrainScene } from './BrainScene';
import { HalftoneBackdrop } from './HalftoneBackdrop';
import { ContractBox } from '../ContractBox';
import { RichText } from '../RichText';
import { hero } from '../../data/copy';
import { site } from '../../data/site';
import { fmt, usf } from '../../lib/format';
import type { BrainState } from '../../lib/types';

function Corner({ lines, right = false }: { lines: string[]; right?: boolean }) {
  return (
    <div className={right ? 'corner-list corner-list--right' : 'corner-list'}>
      {lines.map((l, i) => (
        <span key={i}>
          {l}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </div>
  );
}

/** The reference wordmark is sized for 3 letters; longer names scale down to keep the same footprint. */
const WM_SCALE = site.name.length <= 3 ? 1 : 3.3 / site.name.length;
const wordmarkVars = { '--wm-scale': WM_SCALE, '--wm-scale-sm': Math.min(1, WM_SCALE + 0.1) } as CSSProperties;

export function Hero({ state, decisions }: { state: BrainState | null; decisions: number }) {
  const kpis = [
    state ? fmt(decisions) : '—',
    state?.latency.median ? usf(state.latency.median) : '—',
    state ? fmt(state.counters.tokens) : '—',
    '$0',
  ];
  return (
    <div className="wrap">
      <section className="hero">
        <HalftoneBackdrop />
        <BrainScene />
        <Corner lines={hero.cornerRight} right />
        <div className="hero__copy">
          <Corner lines={hero.cornerLeft} />
          <h1 className="wordmark" style={wordmarkVars}>
            {site.name}
          </h1>
          <div className="tagline">
            {hero.taglineBefore}
            <span>{hero.taglineAccent}</span>
            {hero.taglineAfter}
          </div>
          <p className="lede">
            <RichText text={hero.lede} />
          </p>
          <div className="hero__ctas">
            <a className="btn btn--primary" href="#cortex">
              {hero.ctaPrimary} <span className="btn__key">↓</span>
            </a>
            <a className="btn" href="#play">
              {hero.ctaSecondary}
            </a>
            <Link className="btn" to="/docs">
              {hero.ctaApi}
            </Link>
          </div>
          <div className="kpis">
            {kpis.map((v, i) => (
              <div key={i}>
                <b>{v}</b>
                <span>{hero.kpis[i]}</span>
              </div>
            ))}
          </div>
          <ContractBox full />
        </div>
      </section>
    </div>
  );
}
