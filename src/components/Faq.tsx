import { RevealSection } from './Reveal';
import { RichText } from './RichText';
import { faq } from '../data/copy';

/** Native <details> accordion, like the reference (multiple can be open). */
export function Faq() {
  return (
    <RevealSection>
      <div className="kick">{faq.kick}</div>
      <h2 className="section__title">{faq.title}</h2>
      <div className="faq">
        {faq.items.map((it) => (
          <details key={it.q}>
            <summary>{it.q}</summary>
            <p>
              <RichText text={it.a} />
            </p>
          </details>
        ))}
      </div>
    </RevealSection>
  );
}
