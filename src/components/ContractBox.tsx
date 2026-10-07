import { useState, type CSSProperties } from 'react';
import { site, withCa } from '../data/site';

interface Props {
  /** Hero version: live dot, "$TICKER · LIVE · CA" label, copy + buy buttons. */
  full?: boolean;
  style?: CSSProperties;
}

export function ContractBox({ full = false, style }: Props) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard?.writeText(site.contract).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    });
  };
  return (
    <div className="ca-box" style={style}>
      <span className="ca-box__label">
        {full ? (
          <>
            <i className="dot" />${site.ticker} · LIVE · CA
          </>
        ) : (
          'CA'
        )}
      </span>
      <code>{site.contract}</code>
      {full && (
        <>
          <span className="ca-box__spacer" />
          <button type="button" className="btn btn--sm" onClick={copy}>
            {copied ? 'Copied' : 'Copy'}
          </button>
          <a className="btn btn--sm btn--light" href={withCa(site.links.buy)} target="_blank" rel="noopener">
            Buy on pump.fun
          </a>
        </>
      )}
    </div>
  );
}
