import { RevealSection } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { split } from '../data/copy';

export function SplitLoop() {
  return (
    <RevealSection id="split">
      <SectionHeading kick={split.kick} title={split.title} titleDim={split.titleDim} sub={split.sub} />
      <div className="split">
        {split.cols.map((c) => (
          <div key={c.small} className={c.mid ? 'split__col split__col--mid' : 'split__col'}>
            <small>{c.small}</small>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
            <ul>
              {c.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </RevealSection>
  );
}
