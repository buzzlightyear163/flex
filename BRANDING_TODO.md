# BRANDING_TODO

Namn (**RFLX**), logga, favicon, banner och färger är klara. Det som fortfarande är platshållare är markerat nedan.

## Namn och token — `src/data/site.ts`

- [x] `name` – **RFLX** (wordmarket skalas automatiskt för namn längre än 3 tecken)
- [x] `ticker` – `$RFLX`
- [ ] `slogan` – footer och sidtitel
- [ ] `contract` – riktig mint/kontraktsadress (platshållaren är 44 tecken)
- [ ] `links.buy`, `links.dex` – kontrollera URL-mallarna (`{ca}` ersätts automatiskt)
- [ ] `links.x` – X/Twitter-länk (tom = X-knappen döljs, som i referensen)
- [ ] `routes` / `routesNarrow` – etiketterna i rutorna till höger om hjärnan

## Text — `src/data/copy.ts`

- [ ] Hero: corner-listor, tagline, lede, CTA-texter
- [ ] Sektionerna How it works, Three answers, Live feed, Playground, The model, The token
- [ ] FAQ (särskilt "Who is behind this?" och "Is the live feed real?")
- [ ] Footer-disclaimer
- [ ] `src/pages/DocsPage.tsx` – docs-texten
- [ ] `src/pages/NotFoundPage.tsx`

## Bilder

- [x] `src/components/Logo.tsx` – synapse-märket (samma som `brand/rflx-mark.svg`)
- [x] `public/favicon.svg`
- [x] `public/banner.png` – OG-bild 1200×630
- [x] `index.html` – title, description, og:title

## Data / API

- [ ] `VITE_API_BASE` i `.env.local` om du har en egen backend (kontraktet finns på `/docs`) – `TODO(backend)`
- [ ] `public/api/state.json` – modellfakta och startvärden för mock-läget
- [ ] FAQ-svaret om att flödet är simulerat ska ändras om du kopplar in riktig data

## Valfritt

- [x] Färgpalett "volt" – ändras i `src/styles/tokens.css` (CSS) och `src/data/theme.ts` (canvas)
