# RFLX (Vite + React + TypeScript)

**RFLX** (uttalas "reflex") – byggt på layouten, komponenterna och interaktionerna från https://jevllm.fun/, men med eget namn, egen logga, egen text och egen färgpalett ("volt": elektrisk lime på grönsvart, violett som andrafärg). Kontraktsadressen är den riktiga pump.fun-minten; X-länken är fortfarande tom (se `BRANDING_TODO.md`).

## Starta

**Windows:** dubbelklicka på `start.bat`. Den kör `npm install` första gången och startar sedan dev-servern på http://localhost:5190.

`verify.bat` kör `npm install`, `tsc -b` och `npm run build` och skriver allt till `verify.log`.

Manuellt:

```bash
npm install
npm run dev        # utveckling, http://localhost:5190
npm run typecheck  # tsc -b (strict)
npm run build      # typecheck + produktionsbuild till dist/
npm run preview    # servera dist/ på http://localhost:4190
```

Kräver Node 20+.

## Routes

| Route   | Sida                                                                 |
| ------- | -------------------------------------------------------------------- |
| `/`     | Startsidan: hero, tape, How it works, Three answers, Live feed, Playground, The model + token, FAQ |
| `/docs` | API-dokumentationen med sticky sidomeny                              |
| `*`     | 404-sida i samma stil (finns inte i referensen, men behövs i en SPA) |

Navigeringslänkar som `/#cortex` fungerar både från startsidan (vanliga ankare) och från `/docs` (router + scroll till sektionen).

## Projektstruktur

```
public/
  favicon.svg            RFLX-märket "synapse" på mörk ruta
  banner.png             OG/Twitter-bild, 1200×630
  api/state.json         fixture för mock-motorn (räknare, modellfakta, historik)
src/
  data/site.ts           ALLT varumärke: namn, ticker, CA, länkar  ← börja här vid rebrand
  data/copy.ts           all text på sidan
  data/theme.ts          färger för allt som ritas på canvas (hjärna, planeter, staplar)
  components/            Header, Footer, Hero (BrainScene, HalftoneBackdrop), Tape, SplitLoop,
                         AnswerCards, Cortex, Playground, ModelToken, Faq, ContractBox, DecisionChip …
  layouts/SiteLayout.tsx header + footer + scroll-hantering
  pages/                 HomePage, DocsPage, NotFoundPage
  routes/AppRoutes.tsx   route-inventering
  hooks/                 useBrainFeed (polling + ström), useHashScroll, useDocumentTitle
  lib/
    pixelBrain.ts        canvas-hjärnan: punktmoln → Bayer-dither i temafärgen, chip, kretsbanor, pulser
    brainGeometry.ts     procedurellt hjärnmoln + grannskapsgraf för aktivitetsvågor
    halftone.ts          halvtonsplaneterna bakom hero
    localBrain.ts        lokal beslutsmotor (Choice/Score/Gate) med µs-tidtagning
    mockFeed.ts          simulerade lanseringar + serverstate
    api.ts               väljer riktig backend (VITE_API_BASE) eller mock
    types.ts, format.ts, brainBus.ts, liveStore.ts
  styles/                tokens.css, base.css, layout.css, home.css, docs.css
```

## Dependencies

Endast `react`, `react-dom`, `react-router-dom` (+ Vite, TypeScript och typer som dev-deps). Hjärnan, planeterna och sparklinen är ren Canvas 2D – ingen three.js/GSAP behövs. Typsnitten (Archivo Black, Baloo 2, Space Mono, Geist, Geist Mono) laddas från Google Fonts precis som i referensen.

## Responsivitet

Brytpunkterna är desamma som referensens:

- **≤ 1100 px:** navigeringen döljs, hero blir en kolumn (hjärnan överst, 440 px hög), alla grids blir en kolumn, wordmark 150 px (skalas för namn > 3 tecken), rubriker 38 px, KPI:er 2×2.
- **≤ 700 px (vid sidladdning):** hjärnan ritas med mindre pixlar (4 px) och fyra rutor i stället för fem.
- **≤ 640 px:** gutter 16 px, live-pillen döljs, wordmark 118 px, hjärnan 320 px hög, tidsstämpeln i flödet döljs.
- **Docs ≤ 1000 px:** sidomenyn döljs.

## API och mock-data

Referensen har en riktig backend (`GET /api/state`, SSE `GET /api/stream`, `POST /api/decide`). Den går inte att återanvända, så projektet kör som standard en **lokal mock-motor i webbläsaren**:

- `mockFeed.ts` genererar syntetiska token-lanseringar (namn, ticker, avatar, mcap, dev buy) var 1–4 sekund och ibland en "graduated"-händelse.
- Varje lansering bedöms på riktigt av `localBrain.ts` (narrative/metadata/copycat/dev_buy) och varje svar tidsmäts med `performance.now()`.
- Playground-anropet körs också lokalt (topic/is_crypto/urgency/narrative).
- Räknare, modellfakta och en timmes historik för stapeldiagrammet kommer från `public/api/state.json`.

**Riktig backend:** kopiera `.env.example` till `.env.local` och sätt `VITE_API_BASE=https://din-backend`. Då används samma kontrakt som referensen (beskrivet på `/docs`). Backenden måste tillåta CORS. Platser i koden som väntar på detta är märkta `TODO(backend)`.

## Auth / Web3

Referensen har ingen inloggning och ingen plånboksanslutning – bara länkar till pump.fun/DexScreener och en kopiera-knapp för kontraktsadressen. Klonen gör samma sak. Kontraktsadressen och länkarna styrs från `src/data/site.ts`.

## Ersatta element

| Original                         | I klonen                                               |
| -------------------------------- | ------------------------------------------------------ |
| Namn/wordmark "JEV", $JEV        | **RFLX** / `$RFLX` (wordmarket skalas automatiskt till 4 tecken) |
| Färger: magenta + krämvit + blå  | lime `#c8ff2e` + kall vit `#e8efe9` + violett `#a48bff` på grönsvart `#050706` |
| Kontraktsadress                  | `C5rHymhU1aWPybt4U3dKttvDN5WXcCW2Z74uKeUvpump` |
| Logotyp + favicon                | RFLX-märket "synapse" (samma som i `brand/`-grafiken)  |
| All brödtext, rubriker, FAQ, docs | egen neutral text med ungefär samma längd             |
| "Noul"-frågetypen                | heter "Gate" i UI:t (wire-format fortfarande `noul`)   |
| banner.png                       | egen genererad OG-bild                                 |
| Token-bilder i flödet (IPFS)     | genererade avatarer                                    |
| Live-data                        | lokal simulering (se ovan)                             |

## Rebranding

1. `src/data/site.ts` – namn, ticker, slogan, kontraktsadress, köp/Dex/X-länkar, etiketter på hjärnans rutor.
2. `src/data/copy.ts` – all text.
3. `src/components/Logo.tsx` och `public/favicon.svg` – logotyp.
4. `public/banner.png` – OG-bild (1200×630).
5. `index.html` – `<title>`, description och OG-taggar.
6. Färger: `src/styles/tokens.css` (CSS: `--accent`, `--accent-rgb`, `--second` m.fl.) och `src/data/theme.ts` (canvas: hjärnans ramp, planeter, staplar). Håll de två i synk.

Se `BRANDING_TODO.md` för checklistan.
