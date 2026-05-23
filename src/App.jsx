// App.jsx — Visual Thinking Toolbox Router with shared color/language state
import React, { useState } from 'react';
import { PAL, resolvePalette, PALETTE_CARDS, paletteFromCard } from './palettes.js';
import { FONT_CSS as FC } from './translations.js';
import ColorChooser from './ColorChooser.jsx';
import SketchnoteTool from './SketchnoteTool.jsx';
import MindMapTool from './MindMapTool.jsx';
import ComparisonTool from './ComparisonTool.jsx';
import ValuesSquareTool from './ValuesSquareTool.jsx';

const TOOLS = [
  { id: 'sketchnote', emoji: '✏️', de: 'Sketchnote', en: 'Sketchnote', ru: 'Скетчноут', descDe: '4 Stile: Strukturiert, Frei, Profi-Karten, Bildstark', descEn: '4 styles: Structured, Free, Pro Cards, Visual Bold', color: '#E8584F' },
  { id: 'mindmap',    emoji: '🧠', de: 'Mind Map',    en: 'Mind Map',    ru: 'Карта ума',   descDe: 'Thema → KI-generierte Äste → bearbeiten', descEn: 'Topic → AI-generated branches → edit', color: '#3B7DD8' },
  { id: 'comparison', emoji: '⚖️', de: 'Vergleichsbild', en: 'Comparison', ru: 'Сравнение', descDe: '2–4 Spalten oder Venn-Diagramm', descEn: '2–4 columns or Venn diagram', color: '#4CAF50' },
  { id: 'values',     emoji: '◈', de: 'Wertequadrat', en: 'Values Square', ru: 'Квадрат ценностей', descDe: 'Klassisch, Dialektik oder Einfach', descEn: 'Classic, dialectic, or simple', color: '#7B68AE' },
];

export default function App() {
  const [tool, setTool] = useState(null);
  const [lang, setLang] = useState('de');
  const [baseColor, setBaseColor] = useState(null);
  const [moodKey, setMoodKey] = useState('neutral');
  const [pal, setPal] = useState(PAL.neutral);

  const recalcPal = (bc, mk) => { setPal(resolvePalette(bc, mk)); };
  const onColorChange = (hex) => { setBaseColor(hex); recalcPal(hex, moodKey); };
  const onPaletteSelect = (card) => { setBaseColor(card.p); setMoodKey(card.mood); setPal(paletteFromCard(card)); };
  const goHome = () => setTool(null);

  const nameKey = lang === 'ru' ? 'ru' : lang === 'en' ? 'en' : 'de';
  const descKey = lang === 'en' ? 'descEn' : 'descDe';
  const title = { de: 'Visual Thinking Toolbox', en: 'Visual Thinking Toolbox', ru: 'Visual Thinking Toolbox' }[lang];
  const subtitle = { de: 'Wähle ein Werkzeug', en: 'Choose a tool', ru: 'Выберите инструмент' }[lang];

  // ── Tool views ──
  if (tool === 'sketchnote') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg,#FEFCFB,#F5F0EB)' }}>
      <SketchnoteTool lang={lang} sharedPal={pal} sharedBaseColor={baseColor} sharedMoodKey={moodKey} onHome={goHome} />
    </div>
  );
  if (tool === 'mindmap') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg,#FEFCFB,#F0F4F8)', padding: 20 }}>
      <style>{FC}</style>
      <MindMapTool lang={lang} pal={pal} baseColor={baseColor} onBack={goHome} />
    </div>
  );
  if (tool === 'comparison') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg,#FEFCFB,#F0F8F0)', padding: 20 }}>
      <style>{FC}</style>
      <ComparisonTool lang={lang} pal={pal} onBack={goHome} />
    </div>
  );
  if (tool === 'values') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg,#FEFCFB,#F5F0FA)', padding: 20 }}>
      <style>{FC}</style>
      <ValuesSquareTool lang={lang} pal={pal} onBack={goHome} />
    </div>
  );

  // ── LANDING PAGE ──
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg,#FEFCFB,#F5F0EB)' }}>
      <style>{FC}</style>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h1 style={{ fontFamily: 'Caveat,cursive', fontSize: 34, fontWeight: 700, color: '#2D2D2D', margin: 0 }}>🎨 {title}</h1>
          <p style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#aaa', marginTop: 4 }}>Sketchnote · Mind Map · Vergleichsbild · Wertequadrat</p>
          {/* Language bar */}
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 8 }}>
            {[['de', '🇩🇪'], ['en', '🇬🇧'], ['ru', '🇷🇺']].map(([k, fl]) => (
              <button key={k} onClick={() => setLang(k)} style={{ padding: '4px 10px', borderRadius: 8, border: lang === k ? '2px solid #E8584F' : '2px solid transparent', background: lang === k ? '#FFF5F0' : 'transparent', fontSize: 16, cursor: 'pointer' }}>{fl}</button>
            ))}
          </div>
        </div>

        {/* Color palette chooser */}
        <ColorChooser lang={lang} baseColor={baseColor} moodKey={moodKey} onColorChange={onColorChange} onPaletteSelect={onPaletteSelect} />

        {/* Tool selection subtitle */}
        <div style={{ fontFamily: 'Caveat,cursive', fontSize: 22, fontWeight: 700, color: '#2D2D2D', textAlign: 'center', marginBottom: 14 }}>{subtitle}</div>

        {/* Tool cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {TOOLS.map(t => (
            <div key={t.id} onClick={() => setTool(t.id)}
              style={{
                padding: '20px 18px', borderRadius: 16, cursor: 'pointer',
                background: '#fff', border: `2px solid ${t.color}30`,
                boxShadow: '0 3px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${t.color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${t.color}30`; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.05)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 28 }}>{t.emoji}</span>
                <span style={{ fontFamily: 'Caveat,cursive', fontSize: 22, fontWeight: 700, color: t.color }}>{t[nameKey]}</span>
              </div>
              <div style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#777', lineHeight: 1.4 }}>{t[descKey]}</div>
              {/* Palette preview */}
              <div style={{ display: 'flex', gap: 3, marginTop: 10 }}>
                {[pal.p, pal.s, pal.a].map((c, i) => (
                  <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: c, border: '1px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Active palette info */}
        <div style={{ textAlign: 'center', marginTop: 16, fontFamily: 'Patrick Hand,cursive', fontSize: 13, color: '#aaa' }}>
          {baseColor ? `Grundfarbe: ${baseColor}` : 'Stimmungspalette aktiv'} · {moodKey}
        </div>
      </div>
    </div>
  );
}
