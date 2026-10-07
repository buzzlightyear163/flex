import { DecisionChip } from './DecisionChip';
import type { FeedRow } from '../hooks/useBrainFeed';

/** Strip under the hero: newest launches first, $TICKER followed by three decisions. */
export function Tape({ rows }: { rows: FeedRow[] }) {
  return (
    <div className="tape">
      <div className="tape__track">
        {rows.map(({ key, e, fresh }) =>
          e.kind === 'create' ? (
            <span key={key} className={fresh ? 'tape__item tape__item--new' : 'tape__item'}>
              <span className="chip chip--token">${e.symbol}</span>
              {e.decisions.slice(0, 3).map((d) => (
                <DecisionChip key={d.q} d={d} />
              ))}
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}
