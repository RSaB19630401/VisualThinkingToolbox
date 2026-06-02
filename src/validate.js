// validate.js — Validate/normalize JSON. Accepts BOTH raw API format
// (number/symbol/centralMessage) AND already-validated format (n/sym/cm) for re-import.
import { SCENE_NAMES } from './scenes.jsx';
import { ICON_NAMES } from './icons.jsx';

export function vd(d) {
  if (!d || typeof d !== 'object') throw new Error('Ungültiges Sketchnote-Format');
  return {
    title: String(d.title || 'Sketchnote'),
    subtitle: d.subtitle ? String(d.subtitle) : '',
    orientation: d.orientation === 'portrait' ? 'portrait' : 'landscape',
    mood: d.mood || 'neutral',
    // accept cm (validated) OR centralMessage (raw)
    cm: String(d.cm || d.centralMessage || ''),
    layout: { columns: Number(d.layout?.columns) || 3 },
    sections: Array.isArray(d.sections)
      ? d.sections.map((s, i) => {
          const scene = s.scene && SCENE_NAMES.includes(s.scene) ? s.scene : null;
          // accept sym (validated) OR symbol (raw)
          const symRaw = s.sym || s.symbol;
          return {
            n: s.n || s.number || i + 1,
            title: String(s.title || ''),
            scene,
            sym: symRaw && ICON_NAMES.includes(symRaw) ? symRaw : 'star',
            color: s.color || 'primary',
            items: Array.isArray(s.items) ? s.items.map(String).slice(0, 5) : [],
          };
        })
      : [],
    footer: {
      title: String(d.footer?.title || ''),
      items: Array.isArray(d.footer?.items) ? d.footer.items.map(String).slice(0, 4) : [],
    },
  };
}
