/**
 * Shared utilities for Sketchnote Visualizer
 * Extracted from App.jsx for use across layout modules.
 */

export const FC = `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap');`;

export function mkR(seed) {
  let s = Math.abs(seed || 42) % 2147483646 + 1;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export function rr(x, y, w, h, rad, rng, a = 2) {
  const r = () => (rng() - 0.5) * a, c = Math.min(rad, w / 2, h / 2);
  return `M${x+c+r()},${y+r()} L${x+w-c+r()},${y+r()} Q${x+w+r()},${y+r()} ${x+w+r()},${y+c+r()} L${x+w+r()},${y+h-c+r()} Q${x+w+r()},${y+h+r()} ${x+w-c+r()},${y+h+r()} L${x+c+r()},${y+h+r()} Q${x+r()},${y+h+r()} ${x+r()},${y+h-c+r()} L${x+r()},${y+c+r()} Q${x+r()},${y+r()} ${x+c+r()},${y+r()} Z`;
}

export function ln(x1, y1, x2, y2, rng) {
  return `M${x1},${y1} Q${(x1+x2)/2+(rng()-0.5)*5},${(y1+y2)/2+(rng()-0.5)*5} ${x2},${y2}`;
}

export function arr(x1, y1, x2, y2, rng, h = 10) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return [
    ln(x1, y1, x2, y2, rng),
    `M${x2},${y2}L${x2+Math.cos(a+2.5)*h},${y2+Math.sin(a+2.5)*h}`,
    `M${x2},${y2}L${x2+Math.cos(a-2.5)*h},${y2+Math.sin(a-2.5)*h}`
  ];
}

export function blob(cx, cy, rx, ry, rng) {
  const p = [];
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * Math.PI * 2, d = 1 + (rng() - 0.5) * 0.25;
    p.push(`${cx+Math.cos(a)*rx*d},${cy+Math.sin(a)*ry*d}`);
  }
  return `M${p[0]} ` + p.slice(1).map(v => `L${v}`).join(' ') + ' Z';
}

export function wt(t, m = 22) {
  if (!t) return [];
  const w = t.split(' '), l = [];
  let c = '';
  w.forEach(x => {
    if ((c + ' ' + x).trim().length > m && c) { l.push(c.trim()); c = x; }
    else c = c ? c + ' ' + x : x;
  });
  if (c.trim()) l.push(c.trim());
  return l;
}

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
