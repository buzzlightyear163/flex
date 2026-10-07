import { Fragment } from 'react';
import { Link } from 'react-router-dom';

/** Renders **bold** and [label](/href) inside copy strings. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('**')) return <b key={i}>{p.slice(2, -2)}</b>;
        const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(p);
        if (m) {
          const [, label, href] = m;
          return href.startsWith('/') ? (
            <Link key={i} to={href}>
              {label}
            </Link>
          ) : (
            <a key={i} href={href} target="_blank" rel="noopener">
              {label}
            </a>
          );
        }
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}
