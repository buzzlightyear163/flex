import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function SiteLayout() {
  const { pathname, hash } = useLocation();
  const variant = pathname === '/' ? 'home' : 'docs';

  // New page without a hash → start at the top (MPA-like behaviour).
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return (
    <div className={variant === 'home' ? 'page page--home' : 'page page--docs'}>
      <Header variant={variant} />
      <Outlet />
      <Footer variant={variant} />
    </div>
  );
}
