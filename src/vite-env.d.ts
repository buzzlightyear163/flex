/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional backend origin, e.g. https://api.example.com. Empty = local mock engine. */
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
