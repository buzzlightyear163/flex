import { RevealSection } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { ContractBox } from './ContractBox';
import { model, token } from '../data/copy';
import { site, withCa } from '../data/site';
import { fmt } from '../lib/format';
import type { ModelFacts } from '../lib/types';

export function ModelToken({ facts }: { facts: ModelFacts | null }) {
  const values = facts ? [`${(facts.accuracy * 100).toFixed(1)}%`, fmt(facts.tested), fmt(facts.pages), fmt(facts.vocab)] : ['—', '—', '—', '—'];
  return (
    <RevealSection id="model">
      <SectionHeading kick={model.kick} title={model.title} titleDim={model.titleDim} sub={model.sub} />
      <div className="duo">
        <div className="panel">
          <div className="panel__head">
            <b>{model.panel}</b>
            <span>{model.panelSub}</span>
          </div>
          <div className="facts">
            {values.map((v, i) => (
              <div key={model.facts[i]}>
                <b>{v}</b>
                <span>{model.facts[i]}</span>
              </div>
            ))}
          </div>
          <div className="topics">
            {Object.values(facts?.topics ?? {}).map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="panel token-card" id="token">
          <div className="kick">{token.kick}</div>
          <h3>${site.ticker}</h3>
          <p>{token.text}</p>
          <div className="token-card__links">
            <a className="btn btn--light" href={withCa(site.links.buy)} target="_blank" rel="noopener">
              {token.buy}
            </a>
            <a className="btn" href={withCa(site.links.dex)} target="_blank" rel="noopener">
              {token.dex}
            </a>
            {site.links.x && (
              <a className="btn" href={site.links.x} target="_blank" rel="noopener">
                {token.x}
              </a>
            )}
          </div>
          <ContractBox style={{ marginTop: 20 }} />
        </div>
      </div>
    </RevealSection>
  );
}
