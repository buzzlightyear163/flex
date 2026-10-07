// ─────────────────────────────────────────────────────────────────────────────
// Colour theme for everything drawn on <canvas> (brain, planets, sparkline,
// decision-type colours). The CSS side lives in src/styles/tokens.css — keep
// the two in sync when you change the palette.
// Current look: "volt" — electric lime signal on a green-tinted black, with
// violet as the second colour.
// ─────────────────────────────────────────────────────────────────────────────

export const theme = {
  /** Main signal colour (CSS --accent). */
  accent: '#c8ff2e',
  /** "r,g,b" of accent for rgba() strings (CSS --accent-rgb). */
  accentRgb: '200,255,46',
  /** Second colour, used for Score answers (CSS --second). */
  second: '#a48bff',
  /** Gate answers. */
  gate: '#ffffff',
  /** Text / wordmark colour (CSS --ink). */
  ink: '#e8efe9',
  /** Outlines of the chip and route boxes. */
  line: '#c9d3cc',
  /** Fill of the chip and route boxes. */
  boxFill: '#060807',
  /** Dark → light ramp used to dither the brain (6 steps). Lime is very bright, so the
   *  accent sits at index 4 and only the top step goes pale — keeps the folds readable. */
  brainRamp: ['#0a1204', '#1d3307', '#3f6a0e', '#86c218', '#c8ff2e', '#ecffb0'],
  /** Halftone planets: base dots and the lit side. */
  planet: { base: '#9fd61f', lit: '#d9ff7a' },
} as const;
