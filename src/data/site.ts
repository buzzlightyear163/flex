// ─────────────────────────────────────────────────────────────────────────────
// Brand configuration. Everything that identifies the project lives here, so a
// rebrand is one file: name, ticker, contract address and outbound links.
// See BRANDING_TODO.md. Name: RFLX ("reflex"). Contract and links are still placeholders.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  /** Short brand name ("reflex"): the giant hero wordmark, logo text and the chip in the brain. The wordmark scales down for names longer than 3 letters. */
  name: 'RFLX',
  /** Ticker without "$". */
  ticker: 'RFLX',
  /** Used in <title>-style strings and the footer. */
  slogan: 'the reflex that decides',
  /**
   * Token mint / contract address. 44 characters like a real pump.fun mint so the
   * CA box wraps exactly like the reference. TODO(branding): set your real mint.
   */
  contract: 'RFLXxPLACEHOLDERxMINTxADDRESSx0000000000pump',
  links: {
    /** `{ca}` is replaced with the contract address. */
    buy: 'https://pump.fun/coin/{ca}',
    dex: 'https://dexscreener.com/solana/{ca}',
    /** Leave empty to hide the X button (the reference hides it when unset). */
    x: '',
  },
  /** Labels on the boxes the brain routes to (the last one is a "more" box). */
  routes: ['LLM', 'CODE', 'AGENT', 'HUMAN', '•••'],
  routesNarrow: ['LLM', 'CODE', 'AGENT', 'HUMAN'],
} as const;

export const withCa = (url: string): string => url.replace('{ca}', site.contract);
