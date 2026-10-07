import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { site } from '../data/site';

export function NotFoundPage() {
  useDocumentTitle(`${site.name} · not found`);
  return (
    <main className="wrap not-found">
      <div className="kick">404</div>
      <h1>Lost.</h1>
      <p>That page doesn't exist. The reflex is still deciding on the home page.</p>
      <Link className="btn btn--primary" to="/">
        Back to the reflex
      </Link>
    </main>
  );
}
