import { Link } from 'react-router-dom';
import { footer } from '../data/copy';
import { site } from '../data/site';
import { useLive } from '../lib/liveStore';

export function Footer({ variant }: { variant: 'home' | 'docs' }) {
  const live = useLive();
  if (variant === 'docs') {
    return (
      <footer className="site-footer">
        <div className="wrap site-footer__row">
          <span>
            <b className="site-footer__brand">{site.name}</b> · {site.slogan}
          </span>
          <span>
            <Link to="/">home</Link>
          </span>
        </div>
      </footer>
    );
  }
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__row">
        <span>
          <b className="site-footer__brand">{site.name}</b> · {site.slogan} · <span>{live == null ? '—' : live ? 'feed live' : 'feed reconnecting'}</span>
        </span>
        <span>
          <Link to="/docs">API</Link> · <a href="#cortex">feed</a> · <a href={site.links.x || '#'}>X</a>
        </span>
      </div>
      <div className="wrap site-footer__note">{footer.disclaimer}</div>
    </footer>
  );
}
