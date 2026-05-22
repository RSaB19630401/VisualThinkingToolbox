// ColorChooser.jsx — Shared palette card selector + custom color picker
import React from 'react';
import { PALETTE_CARDS, paletteFromCard, resolvePalette } from './palettes.js';

export default function ColorChooser({ lang, baseColor, moodKey, onColorChange, onPaletteSelect }) {
  const label = { de: 'Farbpalette wählen', en: 'Choose palette', ru: 'Выбрать палитру' }[lang] || 'Farbpalette wählen';
  const customLabel = { de: 'Eigene Farbe', en: 'Custom color', ru: 'Свой цвет' }[lang] || 'Eigene Farbe';
  const nameKey = lang === 'ru' ? 'ru' : lang === 'en' ? 'en' : 'de';

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: 'Caveat,cursive', fontSize: 17, fontWeight: 700, color: '#2D2D2D', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {PALETTE_CARDS.map(card => {
          const active = baseColor === card.p;
          return (
            <div key={card.id} onClick={() => onPaletteSelect(card)}
              style={{
                padding: '8px 12px', borderRadius: 10, cursor: 'pointer', minWidth: 110,
                border: active ? `2px solid ${card.p}` : '2px solid #e0e0e0',
                background: active ? `${card.p}10` : '#fff',
                transition: 'all 0.15s',
              }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                {[card.p, card.s, card.a].map((c, i) => (
                  <div key={i} style={{ width: 18, height: 18, borderRadius: '50%', background: c, border: '1.5px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
                ))}
              </div>
              <div style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 12, color: '#555', lineHeight: 1.2 }}>{card[nameKey]}</div>
            </div>
          );
        })}

        {/* Custom color picker */}
        <div style={{
          padding: '8px 12px', borderRadius: 10, border: '2px solid #e0e0e0', background: '#fff',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 90,
        }}>
          <input type="color" value={baseColor || '#E8584F'} onChange={e => onColorChange(e.target.value)}
            style={{ width: 40, height: 28, border: '2px solid #e0e0e0', borderRadius: 6, cursor: 'pointer', padding: 0 }} />
          <div style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 12, color: '#555' }}>{customLabel}</div>
        </div>
      </div>
    </div>
  );
}
