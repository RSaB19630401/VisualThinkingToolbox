// settings.js — Global settings with dark mode, language, and React hook
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════
// DARK PALETTES (matching the light PAL structure)
// ═══════════════════════════════════════
export const DARK_PAL = {
  optimistisch: { p: '#FF7B6B', s: '#FFB74D', a: '#66BB6A', t: '#E8E8E8', bg: '#1A1A2E', sb: '#222240' },
  neutral:      { p: '#5B9BD5', s: '#8899AA', a: '#FF7B6B', t: '#E8E8E8', bg: '#1A1A2E', sb: '#222240' },
  nachdenklich: { p: '#B09ADE', s: '#6BAF8B', a: '#E8C06B', t: '#E8E8E8', bg: '#1A1A2E', sb: '#222240' },
  energisch:    { p: '#FF7B6B', s: '#FF8B4D', a: '#FFE055', t: '#E8E8E8', bg: '#1A1A2E', sb: '#222240' },
  empathisch:   { p: '#F09BC0', s: '#8DC5E0', a: '#A8D88E', t: '#E8E8E8', bg: '#1A1A2E', sb: '#222240' },
};

// ═══════════════════════════════════════
// SETTINGS STORE (singleton + event-based)
// ═══════════════════════════════════════
const KEY_DARK = 'vtt-dark';
const KEY_LANG = 'vtt-lang';

let _dark = false;
let _lang = 'de';

// Safe localStorage read
try {
  _dark = localStorage.getItem(KEY_DARK) === 'true';
  _lang = localStorage.getItem(KEY_LANG) || 'de';
} catch (e) { /* SSR or privacy mode */ }

const _listeners = new Set();
function notify() { const s = getSettings(); _listeners.forEach(fn => fn(s)); }

export function getSettings() {
  return { dark: _dark, lang: _lang };
}

export function setDark(v) {
  _dark = !!v;
  try { localStorage.setItem(KEY_DARK, _dark); } catch (e) {}
  notify();
}

export function setLang(v) {
  _lang = v || 'de';
  try { localStorage.setItem(KEY_LANG, _lang); } catch (e) {}
  notify();
}

export function subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

// ═══════════════════════════════════════
// GALLERY (last creations in localStorage)
// ═══════════════════════════════════════
const GALLERY_KEY = 'vtt-gallery';
const MAX_GALLERY = 10;

export function saveToGallery(item) {
  // item: { tool, title, topic, data, at }
  try {
    const list = getGallery();
    list.unshift({ ...item, at: new Date().toISOString() });
    if (list.length > MAX_GALLERY) list.length = MAX_GALLERY;
    localStorage.setItem(GALLERY_KEY, JSON.stringify(list));
  } catch (e) {}
}

export function getGallery() {
  try {
    return JSON.parse(localStorage.getItem(GALLERY_KEY) || '[]');
  } catch { return []; }
}

export function clearGallery() {
  try { localStorage.removeItem(GALLERY_KEY); } catch {}
}

// Gallery → Tool handoff
export let pendingGalleryItem = null;
export function setPendingGalleryItem(item) { pendingGalleryItem = item; }
export function consumePendingGalleryItem() { const i = pendingGalleryItem; pendingGalleryItem = null; return i; }

export function useSettings() {
  const [s, setS] = useState(getSettings);
  useEffect(() => subscribe(setS), []);
  return s;
}
