import { Route, Routes } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';
import { HomePage } from '../pages/HomePage';
import { DocsPage } from '../pages/DocsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

/** Route inventory (reference: "/" and "/docs"). */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="docs" element={<DocsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
