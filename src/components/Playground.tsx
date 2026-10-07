import { useCallback, useEffect, useState } from 'react';
import { RevealSection } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { playground } from '../data/copy';
import { postDecide } from '../lib/api';
import { brainBus } from '../lib/brainBus';
import { TYPE_COLOR, TYPE_TAG, usf, val } from '../lib/format';
import type { DecideResult, Decision } from '../lib/types';

/** Pretty JSON with the same colour classes as the reference (.k keys, .s strings, .n numbers). */
function JsonView({ value }: { value: unknown }) {
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c);
  const html = esc(JSON.stringify(value, null, 2))
    .replace(/&quot;([^&]+?)&quot;:/g, '<span class="k">"$1"</span>:')
    .replace(/: &quot;(.*?)&quot;/g, ': <span class="s">"$1"</span>')
    .replace(/: (-?[\d.]+)/g, ': <span class="n">$1</span>');
  return <div className="json" dangerouslySetInnerHTML={{ __html: html }} />;
}

function Answer({ d }: { d: Decision }) {
  const color = TYPE_COLOR[d.type];
  const valueColor = d.type === 'noul' ? (d.answer ? '#fff' : 'var(--red)') : color;
  return (
    <div className="answer">
      <div className="answer__top">
        <div>
          <div className="answer__q">
            <i style={{ background: `${color}22`, color }}>{TYPE_TAG[d.type][1]}</i>
            {d.q}
          </div>
          <div className="answer__v" style={{ color: valueColor }}>
            {val(d)}
          </div>
        </div>
        <div className="answer__conf">
          <b>{d.confidence.toFixed(2)}</b>confidence
        </div>
      </div>
      <div className="bar">
        <i style={{ width: `${d.confidence * 100}%`, background: color }} />
      </div>
    </div>
  );
}

const toJson = (r: DecideResult) => ({
  decisions: Object.fromEntries(
    r.decisions.map((d) => [
      d.q,
      d.type === 'choice' ? { choice: d.choice, confidence: d.confidence } : d.type === 'score' ? { label: d.label, confidence: d.confidence } : { answer: d.answer, confidence: d.confidence },
    ]),
  ),
  latency_us: r.us,
});

export function Playground() {
  const [text, setText] = useState(playground.initial);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<DecideResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (input: string) => {
    const t = input.trim();
    if (!t) return;
    setBusy(true);
    try {
      const r = await postDecide(t);
      setResult(r);
      setError(null);
      r.decisions.forEach((_, i) => window.setTimeout(() => brainBus.fire(1.4), i * 120));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
    setBusy(false);
  }, []);

  // the reference decides the default text on load
  useEffect(() => {
    void run(playground.initial);
  }, [run]);

  return (
    <RevealSection id="play">
      <SectionHeading kick={playground.kick} title={playground.title} titleDim={playground.titleDim} sub={playground.sub} />
      <div className="play">
        <div className="panel">
          <div className="panel__head">
            <b>{playground.stateLabel}</b>
            <span>{playground.stateSub}</span>
          </div>
          <textarea
            maxLength={4000}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void run(text);
              }
            }}
          />
          <div className="play__actions">
            <div className="examples">
              {playground.examples.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  onClick={() => {
                    setText(ex.text);
                    void run(ex.text);
                  }}
                >
                  {ex.label}
                </button>
              ))}
            </div>
            <button type="button" className="btn btn--primary btn--sm" disabled={busy} onClick={() => void run(text)}>
              {playground.decide} ⏎
            </button>
          </div>
        </div>
        <div className="panel">
          <div className="panel__head">
            <b>{playground.answersLabel}</b>
            <span>
              {result ? (
                <>
                  <span className="t-accent">{usf(result.us)}</span> · {result.decisions.length} answers · {result.words} words
                </>
              ) : (
                '—'
              )}
            </span>
          </div>
          <div className="answers">
            {error ? <div className="answer t-mute">{error}</div> : result?.decisions.map((d) => <Answer key={d.q} d={d} />)}
          </div>
          {result && !error ? <JsonView value={toJson(result)} /> : <div className="json" />}
        </div>
      </div>
    </RevealSection>
  );
}
