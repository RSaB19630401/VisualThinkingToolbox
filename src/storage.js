// storage.js — Lightweight localStorage persistence for "last session" per tool.
// Safe: wrapped in try/catch (Private Mode / quota), no-ops on failure.
const PREFIX = 'vtt:last:';

export function saveLast(tool, payload) {
  try {
    localStorage.setItem(PREFIX + tool, JSON.stringify({ at: Date.now(), payload }));
  } catch (e) { /* ignore quota / private mode */ }
}

export function loadLast(tool) {
  try {
    const raw = localStorage.getItem(PREFIX + tool);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    return obj?.payload || null;
  } catch (e) { return null; }
}

export function clearLast(tool) {
  try { localStorage.removeItem(PREFIX + tool); } catch (e) { /* ignore */ }
}

// Human-readable age, e.g. "vor 3 Min." / "3 min ago"
export function lastAge(tool, lang = 'de') {
  try {
    const raw = localStorage.getItem(PREFIX + tool);
    if (!raw) return null;
    const { at } = JSON.parse(raw);
    if (!at) return null;
    const mins = Math.round((Date.now() - at) / 60000);
    if (lang === 'en') return mins < 1 ? 'just now' : mins < 60 ? `${mins} min ago` : `${Math.round(mins / 60)} h ago`;
    if (lang === 'ru') return mins < 1 ? 'только что' : mins < 60 ? `${mins} мин назад` : `${Math.round(mins / 60)} ч назад`;
    return mins < 1 ? 'gerade eben' : mins < 60 ? `vor ${mins} Min.` : `vor ${Math.round(mins / 60)} Std.`;
  } catch (e) { return null; }
}
