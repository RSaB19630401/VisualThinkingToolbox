// palettes.js — Mood-based color palettes

/** Five mood-based color palettes: p=primary, s=secondary, a=accent, t=text, bg=background, sb=section-bg */
export const PAL = {
  optimistisch: { p: '#E8584F', s: '#F5A623', a: '#4CAF50', t: '#2D2D2D', bg: '#FFF8F0', sb: '#FFFAF5' },
  neutral:      { p: '#3B7DD8', s: '#6B7B8D', a: '#E8584F', t: '#2D2D2D', bg: '#F5F7FA', sb: '#F0F4F8' },
  nachdenklich: { p: '#7B68AE', s: '#5A8F7B', a: '#D4A853', t: '#2D2D2D', bg: '#F8F5FF', sb: '#F3F0FA' },
  energisch:    { p: '#E8584F', s: '#FF6B35', a: '#FFD23F', t: '#2D2D2D', bg: '#FFF5F0', sb: '#FFF0EB' },
  empathisch:   { p: '#E07BAB', s: '#7DAFCB', a: '#95C77E', t: '#2D2D2D', bg: '#FFF5F9', sb: '#FFF0F5' },
};

/** Mood key values used to map wizard answers to palette keys */
export const MOOD_VALS = ['optimistisch', 'neutral', 'nachdenklich', 'energisch', 'empathisch'];

/** Orientation key values */
export const ORIENT_VALS = ['landscape', 'portrait', 'auto'];

/** Resolve a color role ('primary'|'secondary'|'accent') to an actual hex color */
export function gc(pal, key) {
  return key === 'secondary' ? pal.s : key === 'accent' ? pal.a : pal.p;
}
