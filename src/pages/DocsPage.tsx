import type { ReactNode } from 'react';
import { site } from '../data/site';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const N = site.name;

function Row({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div>
      <b>{k}</b>
      <span>{children}</span>
    </div>
  );
}

export function DocsPage() {
  useDocumentTitle(`${N} · docs`);
  const host = typeof window === 'undefined' ? 'this-site' : window.location.host;
  return (
    <main className="wrap docs">
      <aside className="docs__nav">
        <h5>BASICS</h5>
        <a href="#what">What {N} is</a>
        <a href="#split">The split</a>
        <a href="#types">Question types</a>
        <h5>API</h5>
        <a href="#decide">POST /api/decide</a>
        <a href="#state">GET /api/state</a>
        <a href="#stream">GET /api/stream</a>
        <h5>LIVE</h5>
        <a href="#cortex">The feed</a>
        <a href="#model">The model</a>
        <a href="#limits">Limits &amp; honesty</a>
      </aside>

      <article className="doc">
        <h1>Docs</h1>
        <p className="doc__lead">
          {N} is a fast reflex layer for agents. Send it state and it returns decisions as data. No chat, no generated text, and every answer is timed.
        </p>

        <h2 id="what">What {N} is</h2>
        <p>
          Agent loops spend their priciest calls on forks: is this noise, who goes next, can this ship. Those are choices, not writing. {N} is the cheap layer that makes
          them, so the big model only writes.
        </p>

        <h2 id="split">The split</h2>
        <div className="dtable">
          <Row k="writes">→ the LLM: answers, drafts, summaries.</Row>
          <Row k="picks · ranks · gates">→ {N}: typed questions with a fixed set of options.</Row>
          <Row k="acts">→ code: budgets, retries, checkpoints, a human gate on anything permanent.</Row>
        </div>

        <h2 id="types">Question types</h2>
        <div className="dtable">
          <Row k="Choice">
            Exactly one labelled option. Returns <code>choice</code> + <code>confidence</code>.
          </Row>
          <Row k="Score">
            An ordered label (low → critical). Returns <code>label</code> + <code>confidence</code>.
          </Row>
          <Row k="Gate">
            Yes or no. Returns <code>answer</code> (boolean) + <code>confidence</code>. On the wire the type is <code>"noul"</code>.
          </Row>
        </div>
        <p>Confidence is how certain the model is of its own answer, not a guarantee. Use it as a threshold: act above it, escalate below it.</p>

        <h2 id="decide">POST /api/decide</h2>
        <p>
          Send text as state. {N} answers four typed questions about it: topic (Choice), is_crypto (Gate), urgency (Score) and narrative (Choice).
        </p>
        <pre>
          <span className="c"># request</span>
          {`\ncurl -X POST https://${host}/api/decide \\\n  -H 'content-type: application/json' \\\n  -d '{"text":"The new lending market lets users borrow against staked assets."}'\n\n`}
          <span className="c"># response (fields trimmed)</span>
          {'\n{\n  '}
          <span className="k">"decisions"</span>
          {': [\n    { '}
          <span className="k">"type"</span>: <span className="s">"choice"</span>, <span className="k">"q"</span>: <span className="s">"topic"</span>, <span className="k">"choice"</span>:{' '}
          <span className="s">"defi"</span>, <span className="k">"confidence"</span>: 0.88, <span className="k">"us"</span>: 41.3
          {' },\n    { '}
          <span className="k">"type"</span>: <span className="s">"noul"</span>, <span className="k">"q"</span>: <span className="s">"is_crypto"</span>, <span className="k">"answer"</span>: true,{' '}
          <span className="k">"confidence"</span>: 0.81
          {' },\n    { '}
          <span className="k">"type"</span>: <span className="s">"score"</span>, <span className="k">"q"</span>: <span className="s">"urgency"</span>, <span className="k">"label"</span>:{' '}
          <span className="s">"low"</span>, <span className="k">"confidence"</span>: 0.70
          {' },\n    { '}
          <span className="k">"type"</span>: <span className="s">"choice"</span>, <span className="k">"q"</span>: <span className="s">"narrative"</span>, <span className="k">"choice"</span>:{' '}
          <span className="s">"crypto"</span>, <span className="k">"confidence"</span>: 0.95
          {' }\n  ],\n  '}
          <span className="k">"us"</span>
          {': 152.6\n}'}
        </pre>
        <p>Rate limits are set by whoever hosts the backend. In this local build the call runs in your browser.</p>

        <h2 id="state">GET /api/state</h2>
        <p>Counters, latency (median and p99, in microseconds), narrative share, decisions per minute over the last hour, model facts and the most recent decisions.</p>

        <h2 id="stream">GET /api/stream</h2>
        <p>Server-sent events. One event per judged launch, sent the moment it happens:</p>
        <pre>
          {`const es = new EventSource('/api/stream');\nes.onmessage = m => console.log(JSON.parse(m.data));\n`}
          <span className="c">{'// { kind: "create", name, symbol, mint, decisions: [...4 typed answers], us }'}</span>
        </pre>

        <h2 id="cortex">The feed</h2>
        <p>The backend watches pump.fun's public stream of new tokens. For every launch it reads the token's own metadata and answers:</p>
        <div className="dtable">
          <Row k="narrative">Choice · ai / animal / politics / meme / crypto / other</Row>
          <Row k="metadata">Score · bare / partial / complete (socials, site, description)</Row>
          <Row k="copycat">Gate · does the name or ticker repeat a launch from the last 24 hours?</Row>
          <Row k="dev_buy">Score · none / small / large / whale, from the creator's opening buy</Row>
        </div>
        <div className="note">These are descriptions, not signals. {N} never tells anyone to buy or sell.</div>

        <h2 id="model">The model</h2>
        <p>
          The topic head is a multinomial naive Bayes classifier, retrained at boot from a set of crypto pages (docs, research, governance, security, specs). Accuracy is
          measured on a held-out slice it never trained on and shown on the home page. The narrative, metadata, copycat and dev-buy heads are lexicon and rule based, and
          everything runs on a single CPU in microseconds.
        </p>

        <h2 id="limits">Limits &amp; honesty</h2>
        <ul>
          <li>{N} is small. It is built for quick, cheap forks, not careful judgement. Escalate low-confidence answers.</li>
          <li>${site.ticker} is an independent community token.</li>
          <li>Memecoins are highly speculative. Nothing here is financial advice.</li>
        </ul>
      </article>
    </main>
  );
}
