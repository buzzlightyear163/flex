# Referensanalys – https://jevllm.fun/

Analyserad 2026-10-06 via DOM, stylesheet, klientskript och nätverksanrop.

## Teknik i referensen

- Statisk HTML + en `style.css` + ES-moduler (`app.mjs`, `pixbrain.mjs`, `brain.mjs`). Inget ramverk.
- Data: `GET /api/state?feed=40` (pollas var 4:e s), `EventSource('/api/stream')` (en händelse per lansering), `POST /api/decide` (playground).
- Typsnitt via Google Fonts: Archivo Black, Baloo 2 (600–800), Space Mono (400/700), Geist (400–700), Geist Mono (400–600).

## Routes

| Route         | Typ                                     |
| ------------- | --------------------------------------- |
| `/`           | startsida                               |
| `/docs`       | dokumentation (egen HTML, egen `<style>`) |
| `/robots.txt` | finns · `/sitemap.xml` saknas (404)     |

Inga dynamiska routes. Sektioner nås via ankare: `#split`, `#answers`, `#cortex`, `#play`, `#model`, `#token`.

## Layout

- Container: `max-width: 1240px`, padding `0 28px` (16 px ≤ 640).
- Sticky header 64 px, `rgba(5,5,5,.78)` + `backdrop-filter: blur(14px)`.
- Hero `min-height: 720px`: text till vänster (max 600 px), canvas-hjärna 760×620 absolut till höger (`right: -60px`), fullbredds-canvas med halvtonsplaneter bakom.
- Sektioner: `padding-top: 110px`, kicker (mono 12 px, versaler, accent) → H2 (Archivo Black 50 px, andra halvan i `#5f5a56`) → ingress 17 px.
- Grids: split 1fr/1.15fr/1fr, trio 3×1fr, cortex 1.55fr/1fr, play 1fr/1fr, duo 1fr/1fr. Gap 16 px, kort-radie 16 px.
- Footer `margin-top: 120px`.

## Designsystem

| Token  | Värde                                                     |
| ------ | --------------------------------------------------------- |
| bg     | `#050505` / bg2 `#09090a`                                 |
| panel  | `#0c0c0e`, linjer `#1b1b1f` / `#26262c`                   |
| ink    | `#f2e8dc` (krämvit), dim `#9b9ba3`, mute `#63636b`        |
| accent | `#ff2e93` (magenta), blå `#8ab4ff`, röd `#ff5a5a`, guld `#ffcf6b` |
| knappar | 42 px / radie 10; sm 34 px / radie 8; primär magenta, "w" ljus `#f4f4f2` |

Typografi: brödtext Geist 15/1.6; siffror och rubriker Archivo Black; tagline Baloo 2 700 46 px; etiketter Space Mono. Wordmark 230 px Archivo Black med mask: solid upptill, punktraster (6 px) nertill.

Effekter: filmkorn (SVG-turbulens, opacity .09, fixed) över hela sidan; glödande magenta skuggor; gradient-ram runt mittkolumnen i split.

## Brytpunkter

1100 px (en kolumn, nav döljs, hjärnan i flödet 440 px), 700 px (hjärn-konfiguration vid laddning), 640 px (mobil), docs 1000 px.

## Komponenter

Header + live-pill · hero (corner-listor, wordmark, tagline, lede, CTA:er, KPI:er, CA-ruta med Copy/Buy) · tape (chips) · split-kort · tre svarskort med live-exempel · cortex (ström, latens-metric, sparkline, narrative-fördelning) · playground (textarea, exempelknappar, svar, JSON) · modellfakta + token-kort · FAQ (`<details>`) · footer · docs (sticky sidomeny, tabeller, kodblock, notis).

## Animationer

- Hjärnan: långsam gungning (yaw ± .12 rad), aktivitetsvågor genom grannskapsgrafen vid varje beslut, pulser längs kretsbanorna, rutor blinkar när pulsen når fram, slumpmässiga tomgångsgnistor, droppar under hjärnan.
- `.rv`-sektioner: opacity/translateY 16 px, 0.8 s, IntersectionObserver (threshold .08).
- Nya rader i strömmen: `slidein` 0.55 s cubic-bezier(.2,.8,.2,1) med magenta-ton.
- Live-prick: pulse 1.6 s. Fördelningsstaplar: width-transition 0.6 s. Smooth scroll med `scroll-padding-top: 80px`.

## Funktioner

Polling + SSE, räknare som tickar, copy-to-clipboard, playground med Enter-för-att-skicka, exempelknappar, FAQ-accordion, externa länkar till pump.fun/DexScreener.

## Externa integrationer

pump.fun-flöde (backend), pump.fun- och DexScreener-länkar, token-bilder från IPFS-gateways, Google Fonts. Ingen auth, ingen plånbok.
