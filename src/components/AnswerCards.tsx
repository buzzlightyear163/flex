import { RevealSection } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { answers } from '../data/copy';
import { TYPE_COLOR, options, usf, val } from '../lib/format';
import type { Decision, DecisionType, FeedEvent } from '../lib/types';

function latestOf(feed: FeedEvent[], type: DecisionType): [FeedEvent, Decision] | null {
  for (const e of feed) for (const d of e.decisions ?? []) if (d.type === type) return [e, d];
  return null;
}

function Example({ feed, type }: { feed: FeedEvent[]; type: DecisionType }) {
  const hit = latestOf(feed, type);
  if (!hit) return <div className="card__example">{answers.waiting}</div>;
  const [e, d] = hit;
  const v = val(d);
  return (
    <div className="card__example">
      <div className="q">
        {d.q} <span className="t-mute">· ${e.kind === 'create' ? e.symbol : ''}</span>
      </div>
      {options(d).map((o) => (
        <div key={o} className={o === v ? 'opt opt--on' : 'opt'}>
          <span>
            {o === v ? '●' : '○'} {o}
          </span>
          <span className="opt__bar">
            <i style={{ width: `${o === v ? d.confidence * 100 : 0}%`, background: TYPE_COLOR[d.type] }} />
          </span>
        </div>
      ))}
      <div className="t-mute" style={{ marginTop: 6 }}>
        confidence {d.confidence.toFixed(2)} · {usf(d.us)}
      </div>
    </div>
  );
}

export function AnswerCards({ feed }: { feed: FeedEvent[] }) {
  return (
    <RevealSection id="answers">
      <SectionHeading kick={answers.kick} title={answers.title} titleDim={answers.titleDim} sub={answers.sub} />
      <div className="trio">
        {answers.cards.map((c) => (
          <div key={c.type} className="card">
            <span className={`card__tag card__tag--${c.type}`}>{c.tag}</span>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
            <Example feed={feed} type={c.type} />
          </div>
        ))}
      </div>
    </RevealSection>
  );
}
