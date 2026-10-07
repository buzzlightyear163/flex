import { TYPE_TAG, val } from '../lib/format';
import type { Decision } from '../lib/types';

export function DecisionChip({ d }: { d: Decision }) {
  const [mod, label] = TYPE_TAG[d.type];
  return (
    <span className="chip">
      <i className={`chip__tag chip__tag--${mod}`}>{label}</i>
      {d.q} <b>{val(d)}</b>
      <span className="chip__conf">{d.confidence != null ? d.confidence.toFixed(2) : ''}</span>
    </span>
  );
}
