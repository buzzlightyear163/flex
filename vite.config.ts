import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// SPA: Vite's dev server and `vite preview` both fall back to index.html,
// so /docs and other client routes work on refresh.
export default defineConfig({
  plugins: [react()],
  // own port so it doesn't collide with other local clones (5173/5174 are often taken)
  server: { port: 5190, open: true },
  preview: { port: 4190 },
});
