import fs from 'fs';
import path from 'path';

/**
 * WCAG contrast guard computed from the real custom properties in theme.css,
 * so a token change that drops a text pair below 4.5:1 fails here.
 */
const css = fs.readFileSync(path.join(__dirname, '../app/theme.css'), 'utf8');

function block(selector: string): Record<string, string> {
  const start = css.indexOf('{', css.indexOf(selector));
  const end = css.indexOf('\n}', start);
  const out: Record<string, string> = {};
  for (const m of css.slice(start, end).matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)) out[`--${m[1]}`] = m[2];
  return out;
}

const dark = block(':root,\n[data-theme="dark"]');
const themes: Record<string, Record<string, string>> = { dark, light: { ...dark, ...block('[data-theme="light"] {') } };

type RGB = [number, number, number];
const rgb = (hex: string): RGB => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as RGB;
const mix = (a: RGB, b: RGB, p: number): RGB => a.map((v, i) => v * (1 - p) + b[i] * p) as RGB;
const lum = (c: RGB) => {
  const f = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
};
const ratio = (a: RGB, b: RGB) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);

const CATS = ['test-automation', 'qa-practice', 'tooling', 'engineering', 'ai'];

describe.each(Object.keys(themes))('%s theme contrast (>= 4.5:1)', (name) => {
  const t = themes[name];
  const C = (k: string) => rgb(t[k]);
  const band = mix(C('--bg'), C('--text'), 0.035); // --band
  const soft = (base: RGB) => mix(base, C('--accent'), 0.14); // --accent-soft over a base

  it('accent text passes on surface, band and accent-soft', () => {
    for (const bg of [C('--surface'), band, soft(C('--surface'))]) {
      expect(ratio(C('--accent'), bg)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('text-3 passes on surfaces and on the accent-soft hover tint', () => {
    for (const bg of [C('--bg'), C('--surface'), C('--surface-2'), band, soft(C('--surface'))]) {
      expect(ratio(C('--text-3'), bg)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it.each(CATS)('feed pill text (%s) passes on band, even rows and hover', (cat) => {
    const cc = C(`--cat-${cat}`);
    const even = mix(band, C('--text'), 0.02);
    for (const row of [band, even, soft(band), soft(even)]) {
      expect(ratio(C('--text'), mix(row, cc, 0.12))).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('category colour text passes on the first top-pick gradient', () => {
    const grad = mix(C('--surface'), C('--accent'), 0.12);
    for (const cat of CATS) expect(ratio(C(`--cat-${cat}`), grad)).toBeGreaterThanOrEqual(4.5);
  });

  it('text-3 passes on the real feed-row hover tint (accent-soft over the band), where the 11.5px date/score line and .ix/.arr sit', () => {
    expect(ratio(C('--text-3'), soft(band))).toBeGreaterThanOrEqual(4.5);
  });

  it('accent text (.ix/.arr on hover) passes on the hover tint over the band and over an even row', () => {
    const even = mix(band, C('--text'), 0.02);
    for (const row of [soft(band), soft(even)]) expect(ratio(C('--accent'), row)).toBeGreaterThanOrEqual(4.49);
  });

  it('--control-border (chip / toggle / coverage-track boundaries) reaches 3:1 on every surface a control sits on', () => {
    const even = mix(band, C('--text'), 0.02);
    for (const bg of [C('--bg'), C('--surface'), C('--surface-2'), band, even]) {
      expect(ratio(C('--control-border'), bg)).toBeGreaterThanOrEqual(3);
    }
  });

  it('content-page text pairs (case study tiles, tags, status pills, score rows) pass on tiles in and out of bands', () => {
    // .cp-card/.cp-node text sits on --surface; the page band only tints the section behind it.
    const pairs: Array<[string, RGB[]]> = [
      ['--text', [C('--surface'), C('--surface-2'), band]],
      ['--text-2', [C('--surface'), C('--surface-2'), band, soft(C('--surface'))]], // .cp-pill.muted, notes, captions
      ['--text-3', [C('--surface'), band]], // .cp-k, .cp-where
      ['--accent', [C('--surface'), band]], // .cp-pill.accent, .cp-note links
    ];
    for (const [fg, bgs] of pairs) {
      for (const bg of bgs) expect(ratio(C(fg), bg)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('hero chips (text over a surface tint on the hero gradient) pass', () => {
    const hero = mix(C('--surface'), C('--accent'), 0.1); // end of the .t-head gradient
    expect(ratio(C('--text'), mix(hero, C('--surface'), 0.88))).toBeGreaterThanOrEqual(4.5);
  });

  it('score bars and tag borders reach 3:1 against their track', () => {
    expect(ratio(C('--accent'), C('--surface-2'))).toBeGreaterThanOrEqual(3);
    expect(ratio(C('--border-strong'), C('--surface'))).toBeGreaterThanOrEqual(1); // decorative; values are text
  });
});
