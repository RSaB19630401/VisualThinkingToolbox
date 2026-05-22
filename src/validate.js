// validate.js — Validate and normalize API JSON response
import { SCENE_NAMES } from './scenes.jsx';
import { ICON_NAMES } from './icons.jsx';

export function vd(d) {
  if (!d || typeof d !== 'object') throw new Error('Ungültig');
  return {
    title: String(d.title || 'Sketchnote'),
    subtitle: d.subtitle ? String(d.subtitle) : '',
    orientation: d.orientation === 'portrait' ? 'portrait' : 'landscape',
    mood: d.mood || 'neutral',
    cm: d.centralMessage ? String(d.centralMessage) : '',
    layout: { columns: Number(d.layout?.columns) || 3 },
    sections: Array.isArray(d.sections)
      ? d.sections.map((s, i) => ({
          n: s.number || i + 1,
          title: String(s.title || ''),
          scene: SCENE_NAMES.includes(s.scene) ? s.scene : null,
          sym: ICON_NAMES.includes(s.symbol) ? s.symbol : 'star',
          color: s.color || 'primary',
          items: Array.isArray(s.items) ? s.items.map(String).slice(0, 5) : [],
        }))
      : [],
    footer: {
      title: String(d.footer?.title || ''),
      items: Array.isArray(d.footer?.items) ? d.footer.items.map(String).slice(0, 4) : [],
    },
  };
}
