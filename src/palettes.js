// palettes.js — Mood palettes + base color derivation

export const MOOD_VALS = ['optimistisch', 'neutral', 'nachdenklich', 'energisch', 'empathisch'];
export const ORIENT_VALS = ['landscape', 'portrait', 'auto'];

export const PAL = {
  optimistisch: { p: '#E8584F', s: '#F5A623', a: '#4CAF50', t: '#2D2D2D', bg: '#FFF8F0', sb: '#FFFAF5' },
  neutral:      { p: '#3B7DD8', s: '#6B7B8D', a: '#E8584F', t: '#2D2D2D', bg: '#F5F7FA', sb: '#F0F4F8' },
  nachdenklich: { p: '#7B68AE', s: '#5A8F7B', a: '#D4A853', t: '#2D2D2D', bg: '#F8F5FF', sb: '#F3F0FA' },
  energisch:    { p: '#E8584F', s: '#FF6B35', a: '#FFD23F', t: '#2D2D2D', bg: '#FFF5F0', sb: '#FFF0EB' },
  empathisch:   { p: '#E07BAB', s: '#7DAFCB', a: '#95C77E', t: '#2D2D2D', bg: '#FFF5F9', sb: '#FFF0F5' },
};

export function gc(pal, key) {
  return key === 'secondary' ? pal.s : key === 'accent' ? pal.a : pal.p;
}

// --- Base color derivation ---

function hexToHSL(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const a2 = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const c = l - a2 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Derive a full palette from a base color + mood.
 * Base color → primary; mood shifts secondary, accent, backgrounds.
 */
export function derivePalette(baseHex, moodKey) {
  if (!baseHex || baseHex === '#000000') return PAL[moodKey] || PAL.neutral;

  const [h, s, l] = hexToHSL(baseHex);

  // Mood-specific offsets for secondary/accent hue shifts and background warmth
  const moodShifts = {
    optimistisch:  { sHue: 40,  aHue: 140, bgL: 97, sbL: 96, bgWarm: 8 },
    neutral:       { sHue: 200, aHue: 160, bgL: 97, sbL: 96, bgWarm: 0 },
    nachdenklich:  { sHue: 150, aHue: 60,  bgL: 97, sbL: 96, bgWarm: 4 },
    energisch:     { sHue: 25,  aHue: 55,  bgL: 96, sbL: 95, bgWarm: 10 },
    empathisch:    { sHue: 180, aHue: 130, bgL: 97, sbL: 96, bgWarm: 6 },
  };
  const ms = moodShifts[moodKey] || moodShifts.neutral;

  const primary   = baseHex;
  const secondary = hslToHex(h + ms.sHue, Math.max(s - 15, 25), Math.min(l + 10, 60));
  const accent    = hslToHex(h + ms.aHue, Math.max(s - 10, 30), Math.min(l + 5, 55));
  const bg        = hslToHex(h + ms.bgWarm, Math.min(s, 20), ms.bgL);
  const sb        = hslToHex(h + ms.bgWarm, Math.min(s, 15), ms.sbL);

  return { p: primary, s: secondary, a: accent, t: '#2D2D2D', bg, sb };
}

/**
 * Resolve palette: if baseColor is set, derive; otherwise use mood palette.
 */
export function resolvePalette(baseColor, moodKey) {
  if (baseColor) return derivePalette(baseColor, moodKey);
  return PAL[moodKey] || PAL.neutral;
}
