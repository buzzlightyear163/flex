import { Link } from 'react-router-dom';
import { LogoMark } from './Logo';
import { nav } from '../data/copy';
import { site } from '../data/site';
import { useLive } from '../lib/liveStore';

interface Props {
  variant: 'home' | 'docs';
}

/** On the home page in-page links stay plain anchors; elsewhere they route back to "/#id". */
function NavItem({ href, label, onHome, current }: { href: string; label: string; onHome: boolean; current?: boolean }) {
  const cls = current ? 'is-current' : undefined;
  if (href.startsWith('/#')) {
    return onHome ? (
      <a className={cls} href={href.slice(1)}>
        {label}
      </a>
    ) : (
      <Link className={cls} to={href}>
        {label}
      </Link>
    );
  }
  return (
    <Link className={cls} to={href}>
      {label}
    </Link>
  );
}

export function Header({ variant }: Props) {
  const live = useLive();
  const onHome = variant === 'home';
  // The docs header omits "The model", like the reference.
  const items = onHome ? nav : nav.filter((n) => n.href !== '/#model');
  return (
    <header className="site-header">
      <div className="wrap site-header__row">
        <Link className="brand" to="/">
          <LogoMark />
          {site.name}
        </Link>
        <nav className="main-nav">
          {items.map((n) => (
            <NavItem key={n.href} {...n} onHome={onHome} current={!onHome && n.href === '/docs'} />
          ))}
        </nav>
        <div className="site-header__spacer" />
        {onHome ? (
          <div className="site-header__live">
            <span className="pill">
              <i className={live === false ? 'dot dot--off' : 'dot'} />
              {live === false ? (
                <b>reconnecting</b>
              ) : (
                <>
                  <b>live</b> · deciding
                </>
              )}
            </span>
          </div>
        ) : (
          <Link className="btn btn--sm" to="/">
            Back to the reflex
          </Link>
        )}
      </div>
    </header>
  );
}
