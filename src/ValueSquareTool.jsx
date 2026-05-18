// ValueSquareTool.jsx — Wertequadrat nach Schulz von Thun
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FONT_CSS, mkR, rr, ln, arr } from './primitives.js';
import { Ic } from './icons.jsx';
import { PAL, gc } from './palettes.js';
import { useSettings, DARK_PAL, saveToGallery, consumePendingGalleryItem } from './settings.js';

// ═══════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════
const VT = {
  de: {
    title: 'Wertequadrat', sub: 'Nach Schulz von Thun · KI-generiert · Bikablo oder Clean',
    inputTitle: 'Welchen Wert oder welches Spannungsfeld möchtest du beleuchten?',
    inputHint: 'KI erstellt die vier Felder: zwei positive Werte und ihre Übertreibungen.',
    inputPh: 'z.B. Sparsamkeit vs. Großzügigkeit\nFreiheit vs. Verbindlichkeit\nSelbstfürsorge vs. Hilfsbereitschaft\noder einfach: Mut',
    create: '✨ Generieren', loading: 'Wertequadrat wird erstellt...',
    neu: '← Neu', reroll: '🎲 Neu generieren',
    bikablo: '✏️ Bikablo', clean: '📐 Clean',
    edit: '📝 Bearbeiten', done: '✓ Fertig',
    fullscreen: '⛶ Vollbild', exitFs: '✕ Schließen', save: '💾 JSON',
    posA: 'Positiver Wert A', posB: 'Positiver Wert B',
    negA: 'Übertreibung A', negB: 'Übertreibung B',
    descLabel: 'Beschreibung', topLabel: 'Positive Spannung',
    botLabel: 'Entwertende Übertreibung', diagLabel: 'Entwicklungsrichtung',
    apiLang: 'Deutsch',
  },
  en: {
    title: 'Value Square', sub: 'Based on Schulz von Thun · AI-generated · Bikablo or Clean',
    inputTitle: 'Which value or tension would you like to explore?',
    inputHint: 'AI creates the four fields: two positive values and their exaggerations.',
    inputPh: 'e.g. Frugality vs. Generosity\nFreedom vs. Commitment\nSelf-care vs. Helpfulness\nor simply: Courage',
    create: '✨ Generate', loading: 'Creating value square...',
    neu: '← New', reroll: '🎲 Regenerate',
    bikablo: '✏️ Bikablo', clean: '📐 Clean',
    edit: '📝 Edit', done: '✓ Done',
    fullscreen: '⛶ Fullscreen', exitFs: '✕ Close', save: '💾 JSON',
    posA: 'Positive Value A', posB: 'Positive Value B',
    negA: 'Exaggeration A', negB: 'Exaggeration B',
    descLabel: 'Description', topLabel: 'Positive tension',
    botLabel: 'Devaluing exaggeration', diagLabel: 'Development direction',
    apiLang: 'English',
  },
  ru: {
    title: 'Квадрат Ценностей', sub: 'По Шульцу фон Туну · ИИ · Бикабло или Чистый',
    inputTitle: 'Какую ценность или напряжение вы хотите рассмотреть?',
    inputHint: 'ИИ создаст четыре поля: две положительные ценности и их преувеличения.',
    inputPh: 'напр. Бережливость vs. Щедрость\nСвобода vs. Обязательность\nЗабота о себе vs. Готовность помочь',
    create: '✨ Создать', loading: 'Создание квадрата...',
    neu: '← Новый', reroll: '🎲 Заново',
    bikablo: '✏️ Бикабло', clean: '📐 Чистый',
    edit: '📝 Редактировать', done: '✓ Готово',
    fullscreen: '⛶ Полный экран', exitFs: '✕ Закрыть', save: '💾 JSON',
    posA: 'Позит. ценность A', posB: 'Позит. ценность B',
    negA: 'Преувеличение A', negB: 'Преувеличение B',
    descLabel: 'Описание', topLabel: 'Позитивное напряжение',
    botLabel: 'Обесценивающее преувеличение', diagLabel: 'Направление развития',
    apiLang: 'Russian',
  },
};

// ═══════════════════════════════════════
// AI GENERATION
// ═══════════════════════════════════════
async function generateValueSquare(topic, lang = 'de') {
  const tLang = VT[lang]?.apiLang || 'Deutsch';
  const sys = `Du bist Experte für das Wertequadrat nach Schulz von Thun. Erstelle ein Wertequadrat als reines JSON. Keine Backticks, kein Text.
Das Wertequadrat hat 4 Felder:
- posA: Ein positiver Wert (z.B. Sparsamkeit)
- posB: Der komplementäre positive Gegenwert (z.B. Großzügigkeit)
- negA: Die entwertende Übertreibung von posA (z.B. Geiz)
- negB: Die entwertende Übertreibung von posB (z.B. Verschwendung)
Beziehungen: posA↔posB = positive Spannung (oben), negA↔negB = entwertende Übertreibung (unten), posA↘negB und posB↘negA = Entwicklungsrichtung (diagonal)

Format: {"title":"Überschrift (max 30Z)","posA":{"label":"Wert (max 18Z)","desc":"Kurzbeschreibung (max 40Z)","icon":"star"},"posB":{"label":"Gegenwert","desc":"Kurzbeschreibung","icon":"heart"},"negA":{"label":"Übertreibung A","desc":"Kurzbeschreibung","icon":"warning"},"negB":{"label":"Übertreibung B","desc":"Kurzbeschreibung","icon":"warning"},"topRelation":"Positive Spannung (max 25Z)","bottomRelation":"Entwertende Spannung (max 25Z)","diagA":"Entwicklung A→ (max 25Z)","diagB":"Entwicklung B→ (max 25Z)"}
Icons: star,heart,shield,key,brain,eye,target,flag,growth,checkmark,warning,exclamation,question,thumbsUp
WICHTIG: Alle Texte in ${tLang}!`;
  const usr = `THEMA: ${topic}\nJSON:`;

  const apiUrl = import.meta.env?.VITE_API_URL || '/api/generate';
  const res = await fetch(apiUrl, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514', max_tokens: 1200,
      system: sys, messages: [{ role: 'user', content: usr }],
    }),
  });
  if (!res.ok) throw new Error(`API-Fehler ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || data.error);
  const text = (data.content || []).map(b => b.text || '').join('');
  const cl = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  let p;
  try { p = JSON.parse(cl); } catch { const mt = cl.match(/\{[\s\S]*\}/); if (mt) p = JSON.parse(mt[0]); else throw new Error('JSON-Fehler'); }
  return p;
}

// ═══════════════════════════════════════
// BIKABLO RENDERER
// ═══════════════════════════════════════
function BikabloSVG({ data, pal }) {
  const W = 900, H = 700;
  const seed = (data.title || '').length * 13 + 41;
  const rng = mkR(seed);
  const BW = 300, BH = 200, gx = 70, gy = 130;
  const posCol = pal.p, negCol = '#B0B0B0';

  function ValueBox({ x, y, label, desc, icon, color, isPositive }) {
    const r = mkR(seed + x * 7 + y * 13);
    const ic = icon || (isPositive ? 'star' : 'warning');
    return (<g>
      <path d={rr(x, y, BW, BH, 16, r, 3)} fill={isPositive ? '#fff' : '#F8F5F0'} stroke={color} strokeWidth="2.5" opacity="0.95"/>
      {Ic(ic, x + BW/2 - 16, y + 14, 32, color)}
      <text x={x + BW/2} y={y + 60} textAnchor="middle" fontFamily="Caveat" fontSize="22" fontWeight="700" fill={color}>{(label || '').toUpperCase()}</text>
      <path d={ln(x + 30, y + 70, x + BW - 30, y + 70, r)} fill="none" stroke={color} strokeWidth="1.5" opacity="0.3"/>
      {(desc || '').length > 0 && (() => {
        const words = desc.split(' ');
        const lines = [];
        let cur = '';
        words.forEach(w => { if ((cur + ' ' + w).length > 28 && cur) { lines.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; });
        if (cur) lines.push(cur);
        return lines.slice(0, 3).map((l, i) => (
          <text key={i} x={x + BW/2} y={y + 92 + i * 20} textAnchor="middle" fontFamily="Patrick Hand" fontSize="14" fill={pal.t} opacity="0.8">{l}</text>
        ));
      })()}
    </g>);
  }

  return (
    <svg id="valuesquare-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', background: pal.bg, borderRadius: 12 }}>
      <defs><style>{FONT_CSS}</style></defs>
      <rect width={W} height={H} fill={pal.bg} rx="10"/>
      <path d={rr(6, 6, W-12, H-12, 16, rng, 3)} fill="none" stroke={pal.t} strokeWidth="1.8" opacity="0.1"/>

      {/* Title */}
      <path d={rr(W/2 - 180, 12, 360, 44, 10, rng, 3)} fill={pal.p} stroke={pal.t} strokeWidth="1.5" opacity="0.9"/>
      <text x={W/2} y={42} textAnchor="middle" fontFamily="Caveat" fontSize="24" fontWeight="700" fill="#fff" letterSpacing="1">{data.title?.toUpperCase()}</text>
      <text x={W/2} y={88} textAnchor="middle" fontFamily="Patrick Hand" fontSize="12" fill={pal.t} opacity="0.5">Wertequadrat nach Schulz von Thun</text>

      {/* Positive row label */}
      <text x={W/2} y={gy - 10} textAnchor="middle" fontFamily="Caveat" fontSize="13" fontWeight="600" fill={posCol} opacity="0.7">✦ POSITIVE WERTE ✦</text>

      {/* Four boxes */}
      <ValueBox x={gx} y={gy} label={data.posA?.label} desc={data.posA?.desc} icon={data.posA?.icon} color={posCol} isPositive={true}/>
      <ValueBox x={W - gx - BW} y={gy} label={data.posB?.label} desc={data.posB?.desc} icon={data.posB?.icon} color={posCol} isPositive={true}/>
      <ValueBox x={gx} y={gy + BH + 80} label={data.negA?.label} desc={data.negA?.desc} icon={data.negA?.icon} color={negCol} isPositive={false}/>
      <ValueBox x={W - gx - BW} y={gy + BH + 80} label={data.negB?.label} desc={data.negB?.desc} icon={data.negB?.icon} color={negCol} isPositive={false}/>

      {/* Negative row label */}
      <text x={W/2} y={gy + BH + 70} textAnchor="middle" fontFamily="Caveat" fontSize="13" fontWeight="600" fill={negCol} opacity="0.7">⚠ ÜBERTREIBUNGEN ⚠</text>

      {/* Top relation (positive tension) */}
      <path d={ln(gx + BW + 10, gy + BH/2, W - gx - BW - 10, gy + BH/2, rng)} fill="none" stroke={posCol} strokeWidth="2.5" strokeDasharray="8,4" opacity="0.5"/>
      <path d={rr(W/2 - 80, gy + BH/2 - 14, 160, 28, 8, rng, 2)} fill={pal.bg} stroke={posCol} strokeWidth="1.5"/>
      <text x={W/2} y={gy + BH/2 + 5} textAnchor="middle" fontFamily="Caveat" fontSize="13" fontWeight="600" fill={posCol}>{data.topRelation || 'Positive Spannung'}</text>

      {/* Bottom relation (devaluing) */}
      <path d={ln(gx + BW + 10, gy + BH + 80 + BH/2, W - gx - BW - 10, gy + BH + 80 + BH/2, mkR(seed+55))} fill="none" stroke={negCol} strokeWidth="2" strokeDasharray="6,4" opacity="0.4"/>
      <path d={rr(W/2 - 80, gy + BH + 80 + BH/2 - 14, 160, 28, 8, mkR(seed+66), 2)} fill={pal.bg} stroke={negCol} strokeWidth="1.5"/>
      <text x={W/2} y={gy + BH + 80 + BH/2 + 5} textAnchor="middle" fontFamily="Caveat" fontSize="13" fontWeight="600" fill={negCol}>{data.bottomRelation || 'Entwertende Spannung'}</text>

      {/* Vertical arrows (exaggeration) */}
      {arr(gx + BW/2, gy + BH + 6, gx + BW/2, gy + BH + 74, mkR(seed+20), 10).map((p, j) => (
        <path key={`va${j}`} d={p} fill="none" stroke={negCol} strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
      ))}
      {arr(W - gx - BW/2, gy + BH + 6, W - gx - BW/2, gy + BH + 74, mkR(seed+30), 10).map((p, j) => (
        <path key={`vb${j}`} d={p} fill="none" stroke={negCol} strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
      ))}

      {/* Diagonal arrows (development direction) */}
      {/* negA → posB (bottom-left to top-right) */}
      <line x1={gx + BW + 15} y1={gy + BH + 75} x2={W - gx - BW - 15} y2={gy + BH + 5} stroke={pal.a} strokeWidth="2.5" opacity="0.45" strokeDasharray="6,3"/>
      <path d={rr(W/2 + 40, gy + BH + 20, 120, 22, 6, rng, 2)} fill={pal.bg} stroke={pal.a} strokeWidth="1.2"/>
      <text x={W/2 + 100} y={gy + BH + 36} textAnchor="middle" fontFamily="Patrick Hand" fontSize="11" fill={pal.a}>{data.diagA || '→ Entwicklung'}</text>

      {/* negB → posA (bottom-right to top-left) */}
      <line x1={W - gx - BW - 15} y1={gy + BH + 75} x2={gx + BW + 15} y2={gy + BH + 5} stroke={pal.a} strokeWidth="2.5" opacity="0.45" strokeDasharray="6,3"/>
      <path d={rr(W/2 - 160, gy + BH + 20, 120, 22, 6, mkR(seed+88), 2)} fill={pal.bg} stroke={pal.a} strokeWidth="1.2"/>
      <text x={W/2 - 100} y={gy + BH + 36} textAnchor="middle" fontFamily="Patrick Hand" fontSize="11" fill={pal.a}>{data.diagB || '← Entwicklung'}</text>
    </svg>
  );
}

// ═══════════════════════════════════════
// CLEAN RENDERER
// ═══════════════════════════════════════
function CleanSVG({ data, pal }) {
  const W = 900, H = 700;
  const BW = 300, BH = 195, gx = 70, gy = 130;
  const posCol = pal.p, negCol = '#999';

  function ValueBox({ x, y, label, desc, icon, color, isPositive }) {
    const ic = icon || (isPositive ? 'star' : 'warning');
    return (<g>
      <rect x={x} y={y} width={BW} height={BH} rx="14" fill={isPositive ? '#fff' : '#F7F6F4'} stroke={color} strokeWidth="2"/>
      {Ic(ic, x + BW/2 - 14, y + 14, 28, color)}
      <text x={x + BW/2} y={y + 58} textAnchor="middle" fontFamily="Patrick Hand" fontSize="21" fontWeight="700" fill={color}>{(label || '').toUpperCase()}</text>
      <line x1={x + 40} y1={y + 68} x2={x + BW - 40} y2={y + 68} stroke={color} strokeWidth="1" opacity="0.2"/>
      {(desc || '').length > 0 && (() => {
        const words = desc.split(' ');
        const lines = [];
        let cur = '';
        words.forEach(w => { if ((cur + ' ' + w).length > 30 && cur) { lines.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; });
        if (cur) lines.push(cur);
        return lines.slice(0, 3).map((l, i) => (
          <text key={i} x={x + BW/2} y={y + 90 + i * 20} textAnchor="middle" fontFamily="Patrick Hand" fontSize="14" fill="#555">{l}</text>
        ));
      })()}
    </g>);
  }

  return (
    <svg id="valuesquare-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', background: '#FAFBFC', borderRadius: 12 }}>
      <defs><style>{FONT_CSS}</style></defs>
      <rect width={W} height={H} fill="#FAFBFC" rx="10"/>
      <rect x="4" y="4" width={W-8} height={H-8} rx="12" fill="none" stroke="#e0e0e0" strokeWidth="1"/>

      <rect x={W/2 - 170} y={14} width="340" height="40" rx="10" fill={posCol}/>
      <text x={W/2} y={41} textAnchor="middle" fontFamily="Patrick Hand" fontSize="22" fontWeight="700" fill="#fff">{data.title?.toUpperCase()}</text>
      <text x={W/2} y={86} textAnchor="middle" fontFamily="Patrick Hand" fontSize="12" fill="#aaa">Wertequadrat nach Schulz von Thun</text>

      <text x={W/2} y={gy - 8} textAnchor="middle" fontFamily="Patrick Hand" fontSize="12" fontWeight="600" fill={posCol} opacity="0.6">✦ POSITIVE WERTE ✦</text>

      <ValueBox x={gx} y={gy} label={data.posA?.label} desc={data.posA?.desc} icon={data.posA?.icon} color={posCol} isPositive={true}/>
      <ValueBox x={W - gx - BW} y={gy} label={data.posB?.label} desc={data.posB?.desc} icon={data.posB?.icon} color={posCol} isPositive={true}/>
      <ValueBox x={gx} y={gy + BH + 80} label={data.negA?.label} desc={data.negA?.desc} icon={data.negA?.icon} color={negCol} isPositive={false}/>
      <ValueBox x={W - gx - BW} y={gy + BH + 80} label={data.negB?.label} desc={data.negB?.desc} icon={data.negB?.icon} color={negCol} isPositive={false}/>

      <text x={W/2} y={gy + BH + 70} textAnchor="middle" fontFamily="Patrick Hand" fontSize="12" fontWeight="600" fill={negCol} opacity="0.6">⚠ ÜBERTREIBUNGEN ⚠</text>

      {/* Top horizontal */}
      <line x1={gx + BW + 8} y1={gy + BH/2} x2={W - gx - BW - 8} y2={gy + BH/2} stroke={posCol} strokeWidth="2" strokeDasharray="8,4" opacity="0.35"/>
      <rect x={W/2 - 75} y={gy + BH/2 - 13} width="150" height="26" rx="8" fill="#FAFBFC" stroke={posCol} strokeWidth="1.5"/>
      <text x={W/2} y={gy + BH/2 + 5} textAnchor="middle" fontFamily="Patrick Hand" fontSize="12" fontWeight="600" fill={posCol}>{data.topRelation || 'Positive Spannung'}</text>

      {/* Bottom horizontal */}
      <line x1={gx + BW + 8} y1={gy + BH + 80 + BH/2} x2={W - gx - BW - 8} y2={gy + BH + 80 + BH/2} stroke={negCol} strokeWidth="1.5" strokeDasharray="6,4" opacity="0.3"/>
      <rect x={W/2 - 75} y={gy + BH + 80 + BH/2 - 13} width="150" height="26" rx="8" fill="#FAFBFC" stroke={negCol} strokeWidth="1.2"/>
      <text x={W/2} y={gy + BH + 80 + BH/2 + 5} textAnchor="middle" fontFamily="Patrick Hand" fontSize="12" fontWeight="600" fill={negCol}>{data.bottomRelation || 'Entwertende Spannung'}</text>

      {/* Vertical arrows */}
      <line x1={gx + BW/2} y1={gy + BH + 4} x2={gx + BW/2} y2={gy + BH + 76} stroke={negCol} strokeWidth="1.5" opacity="0.3" markerEnd="url(#arrDown)"/>
      <line x1={W - gx - BW/2} y1={gy + BH + 4} x2={W - gx - BW/2} y2={gy + BH + 76} stroke={negCol} strokeWidth="1.5" opacity="0.3" markerEnd="url(#arrDown)"/>
      <defs><marker id="arrDown" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 5 10 L 10 0 z" fill={negCol} opacity="0.3"/></marker></defs>

      {/* Diagonals */}
      <line x1={gx + BW + 10} y1={gy + BH + 76} x2={W - gx - BW - 10} y2={gy + BH + 4} stroke={pal.a} strokeWidth="2" opacity="0.35" strokeDasharray="6,3"/>
      <rect x={W/2 + 30} y={gy + BH + 18} width="125" height="22" rx="6" fill="#FAFBFC" stroke={pal.a} strokeWidth="1.2"/>
      <text x={W/2 + 92} y={gy + BH + 34} textAnchor="middle" fontFamily="Patrick Hand" fontSize="11" fill={pal.a}>{data.diagA || '→ Entwicklung'}</text>

      <line x1={W - gx - BW - 10} y1={gy + BH + 76} x2={gx + BW + 10} y2={gy + BH + 4} stroke={pal.a} strokeWidth="2" opacity="0.35" strokeDasharray="6,3"/>
      <rect x={W/2 - 155} y={gy + BH + 18} width="125" height="22" rx="6" fill="#FAFBFC" stroke={pal.a} strokeWidth="1.2"/>
      <text x={W/2 - 92} y={gy + BH + 34} textAnchor="middle" fontFamily="Patrick Hand" fontSize="11" fill={pal.a}>{data.diagB || '← Entwicklung'}</text>
    </svg>
  );
}

// ═══════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════
function dlBlob(b, n) {
  const u = URL.createObjectURL(b);
  const a = Object.assign(document.createElement('a'), { href: u, download: n });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
function slug(t) { return (t || 'x').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30); }
function exportSVG(title) {
  const el = document.getElementById('valuesquare-svg'); if (!el) return;
  const c = el.cloneNode(true); c.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  dlBlob(new Blob([new XMLSerializer().serializeToString(c)], { type: 'image/svg+xml' }), `wq-${slug(title)}.svg`);
}
function exportPNG(title, bg) {
  const el = document.getElementById('valuesquare-svg'); if (!el) return;
  const c = el.cloneNode(true); c.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const s = new XMLSerializer().serializeToString(c);
  const vb = el.getAttribute('viewBox').split(' ').map(Number);
  const cv = Object.assign(document.createElement('canvas'), { width: vb[2] * 2, height: vb[3] * 2 });
  const ctx = cv.getContext('2d'); const img = new Image();
  img.onload = () => { ctx.fillStyle = bg; ctx.fillRect(0, 0, cv.width, cv.height); ctx.drawImage(img, 0, 0, cv.width, cv.height);
    cv.toBlob(b => { if (b) dlBlob(b, `wq-${slug(title)}.png`); }, 'image/png'); };
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(s)));
}
function exportJSON(data, topic) {
  dlBlob(new Blob([JSON.stringify({ v: 1, tool: 'valuesquare', topic, data, at: new Date().toISOString() }, null, 2)],
    { type: 'application/json' }), `wq-${slug(topic)}.json`);
}

// ═══════════════════════════════════════
// BUTTON
// ═══════════════════════════════════════
const bt = (c, f) => ({
  padding: '8px 14px', borderRadius: 10, border: f ? 'none' : `2px solid ${c}`,
  background: f ? c : '#fff', color: f ? '#fff' : c,
  fontFamily: 'Caveat,cursive', fontSize: 15, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
});

// ═══════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════
export default function ValueSquareTool() {
  const [phase, setPhase] = useState('input');
  const [topic, setTopic] = useState('');
  const [data, setData] = useState(null);
  const [style, setStyle] = useState('bikablo');
  const [lang, setLang] = useState('de');
  const [err, setErr] = useState(null);
  const [ed, setEd] = useState(false);
  const [fs, setFs] = useState(false);
  const fileRef = useRef(null);
  const { dark } = useSettings();
  const t = VT[lang] || VT.de;
  const pal = dark ? DARK_PAL.neutral : PAL.neutral;
  const bgGrad = dark ? 'linear-gradient(145deg,#12122A,#1A1A2E)' : 'linear-gradient(145deg,#FEFCFB,#F5F0EB)';
  const textCol = dark ? '#E8E8E8' : '#2D2D2D';
  const subCol = dark ? '#777' : '#aaa';

  // Auto-load from gallery
  useEffect(() => {
    const item = consumePendingGalleryItem();
    if (item?.tool === "valuesquare" && item.data) {
      setData(item.data); setTopic(item.topic || ""); setPhase("result");
    }
  }, []);

  const generate = useCallback(async (tp) => {
    setPhase('loading'); setErr(null); setTopic(tp);
    try {
      const d = await generateValueSquare(tp, lang);
      setData(d); setPhase('result');
      saveToGallery({ tool: 'valuesquare', title: d.title || tp, topic: tp, data: d });
    } catch (e) { console.error(e); setErr(e.message); setPhase('input'); }
  }, [lang]);

  const loadJSON = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      try {
        const p = JSON.parse(ev.target.result);
        if (p.data) { setData(p.data); setTopic(p.topic || ''); setPhase('result'); }
      } catch { alert('Ungültige JSON-Datei'); }
    };
    r.readAsText(f);
  };

  const undoRef = useRef(null);
  const undo = () => { if (undoRef.current) { setData(undoRef.current); undoRef.current = null; } };
  const upd = (path, val) => setData(prev => {
    undoRef.current = prev;
    if (!prev) return prev;
    const d = JSON.parse(JSON.stringify(prev));
    const parts = path.split('.');
    let obj = d;
    for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
    obj[parts[parts.length - 1]] = val;
    return d;
  });

  // Shared UI
  const langBar = (
    <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 6 }}>
      {[['de', '🇩🇪'], ['en', '🇬🇧'], ['ru', '🇷🇺']].map(([k, fl]) => (
        <button key={k} onClick={() => setLang(k)} style={{ padding: '4px 10px', borderRadius: 8, border: lang === k ? '2px solid #4CAF50' : '2px solid transparent', background: lang === k ? '#F0FFF0' : 'transparent', fontSize: 16, cursor: 'pointer' }}>{fl}</button>
      ))}
    </div>
  );
  const hdr = (
    <div style={{ textAlign: 'center', padding: '16px 16px 3px' }}>
      <h1 style={{ fontFamily: 'Caveat,cursive', fontSize: 30, fontWeight: 700, color: textCol, margin: 0 }}>◆ {t.title}</h1>
      <p style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 13, color: subCol, marginTop: 2 }}>{t.sub}</p>
      {langBar}
    </div>
  );
  const errBox = err ? (
    <div style={{ maxWidth: 500, margin: '0 auto 8px', padding: '10px 16px', background: '#FFF0F0', border: '2px solid #E8584F', borderRadius: 10, textAlign: 'center', fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#E8584F' }}>
      {err}<button onClick={() => setErr(null)} style={{ marginLeft: 12, background: 'none', border: 'none', color: '#E8584F', cursor: 'pointer', fontSize: 16 }}>x</button>
    </div>
  ) : null;
  const eS = { width: '100%', padding: '6px 10px', borderRadius: 8, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#FAFAFA' };

  // ═══ INPUT ═══
  if (phase === 'input') return (
    <div style={{ minHeight: '100vh', background: bgGrad }}>
      <style>{FONT_CSS}</style>{hdr}{errBox}
      <div style={{ maxWidth: 560, margin: '0 auto', padding: 20 }}>
        <h2 style={{ fontFamily: 'Caveat,cursive', fontSize: 24, fontWeight: 700, color: textCol, marginBottom: 5 }}>{t.inputTitle}</h2>
        <p style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#888', marginBottom: 12 }}>{t.inputHint}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {["Sparsamkeit vs. Großzügigkeit", "Freiheit vs. Bindung", "Mut vs. Vorsicht", "Ordnung vs. Flexibilität", "Nähe vs. Distanz"].map(tpl => (
            <button key={tpl} onClick={() => setTopic(tpl)} style={{ padding: "4px 12px", borderRadius: 8, border: `1px solid ${dark ? "#444" : "#ddd"}`, background: dark ? "#222240" : "#F0FFF0", fontFamily: "Patrick Hand,cursive", fontSize: 13, color: "#4CAF50", cursor: "pointer" }}>{tpl}</button>
          ))}
        </div>
        <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder={t.inputPh}
          style={{ width: '100%', minHeight: 100, padding: 15, borderRadius: 14, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 15, resize: 'vertical', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box', lineHeight: 1.6 }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
          <button onClick={() => fileRef.current?.click()} style={{ ...bt('#888', false), fontSize: 14 }}>📂 Laden</button>
          <button onClick={() => { if (topic.trim()) generate(topic.trim()); }} disabled={!topic.trim()}
            style={{ ...bt(topic.trim() ? '#4CAF50' : '#ccc', true), fontSize: 18 }}>{t.create}</button>
        </div>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={loadJSON}/>
      </div>
    </div>
  );

  // ═══ LOADING ═══
  if (phase === 'loading') return (
    <div style={{ minHeight: '100vh', background: bgGrad, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <style>{FONT_CSS}</style>
      <div style={{ width: 46, height: 46, border: '4px solid #e0f0e0', borderTop: '4px solid #4CAF50', borderRadius: '50%', animation: 'spin 1s linear infinite' }}/>
      <div style={{ fontFamily: 'Caveat,cursive', fontSize: 20, color: '#4CAF50', fontWeight: 600 }}>{t.loading}</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  // ═══ RESULT ═══
  if (phase === 'result' && data) {
    const svg = style === 'bikablo' ? <BikabloSVG data={data} pal={pal}/> : <CleanSVG data={data} pal={pal}/>;

    if (fs) return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#fff', zIndex: 9999, overflow: 'auto' }}>
        <style>{FONT_CSS}</style>
        <button onClick={() => setFs(false)} style={{ position: 'fixed', top: 12, right: 12, zIndex: 10000, ...bt('#E8584F', true), fontSize: 18 }}>{t.exitFs}</button>
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
          <div style={{ width: '100%', maxWidth: 1000 }}>{svg}</div>
        </div>
      </div>
    );

    return (
      <div style={{ minHeight: '100vh', background: bgGrad }}>
        <style>{FONT_CSS}</style>{hdr}
        <div style={{ padding: 14 }}>
          <div style={{ display: 'flex', gap: 7, marginBottom: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => { setPhase('input'); setData(null); setEd(false); }} style={bt('#888', false)}>{t.neu}</button>
            <button onClick={() => generate(topic)} style={bt('#4CAF50', false)}>{t.reroll}</button>
            <button onClick={undo} disabled={!undoRef.current} style={bt(undoRef.current ? '#E8584F' : '#ccc', false)}>↩ Undo</button>
            <button onClick={() => setStyle(s => s === 'bikablo' ? 'clean' : 'bikablo')} style={bt('#7B68AE', false)}>{style === 'bikablo' ? t.clean : t.bikablo}</button>
            <button onClick={() => setEd(e2 => !e2)} style={bt(ed ? '#E8584F' : '#5A8F7B', ed)}>{ed ? t.done : t.edit}</button>
            <button onClick={() => setFs(true)} style={bt('#555', false)}>{t.fullscreen}</button>
            <button onClick={() => exportSVG(data.title)} style={bt('#2E86AB', false)}>SVG</button>
            <button onClick={() => exportPNG(data.title, pal.bg)} style={bt('#4CAF50', false)}>PNG</button>
            <button onClick={() => exportJSON(data, topic)} style={bt('#F5A623', false)}>{t.save}</button>
          </div>

          <div style={{ maxWidth: 950, margin: '0 auto', boxShadow: '0 6px 28px rgba(0,0,0,.08)', borderRadius: 12, overflow: 'auto' }}>{svg}</div>

          {/* Edit panel */}
          {ed && (
            <div style={{ maxWidth: 900, margin: '20px auto', padding: 20, background: '#fff', borderRadius: 14, border: '2px solid #e0e0e0' }}>
              <h3 style={{ fontFamily: 'Caveat,cursive', fontSize: 20, color: '#2D2D2D', marginBottom: 14 }}>📝 {t.edit}</h3>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontFamily: 'Caveat,cursive', fontSize: 14, color: '#888' }}>{t.title}</label>
                <input value={data.title || ''} onChange={e => upd('title', e.target.value)} style={eS}/>
              </div>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
                {[['posA', t.posA, pal.p], ['posB', t.posB, pal.p], ['negA', t.negA, '#999'], ['negB', t.negB, '#999']].map(([key, label, col]) => (
                  <div key={key} style={{ flex: 1, minWidth: 200, padding: 12, borderRadius: 10, border: `2px solid ${col}`, background: '#FAFAFA' }}>
                    <div style={{ fontFamily: 'Caveat,cursive', fontSize: 15, fontWeight: 700, color: col, marginBottom: 6 }}>{label}</div>
                    <input value={data[key]?.label || ''} onChange={e => upd(`${key}.label`, e.target.value)} style={{ ...eS, fontWeight: 600, marginBottom: 4 }} placeholder="Wert"/>
                    <input value={data[key]?.desc || ''} onChange={e => upd(`${key}.desc`, e.target.value)} style={eS} placeholder={t.descLabel}/>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ fontFamily: 'Caveat,cursive', fontSize: 13, color: '#888' }}>{t.topLabel}</label>
                  <input value={data.topRelation || ''} onChange={e => upd('topRelation', e.target.value)} style={eS}/>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ fontFamily: 'Caveat,cursive', fontSize: 13, color: '#888' }}>{t.botLabel}</label>
                  <input value={data.bottomRelation || ''} onChange={e => upd('bottomRelation', e.target.value)} style={eS}/>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ fontFamily: 'Caveat,cursive', fontSize: 13, color: '#888' }}>{t.diagLabel} A</label>
                  <input value={data.diagA || ''} onChange={e => upd('diagA', e.target.value)} style={eS}/>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ fontFamily: 'Caveat,cursive', fontSize: 13, color: '#888' }}>{t.diagLabel} B</label>
                  <input value={data.diagB || ''} onChange={e => upd('diagB', e.target.value)} style={eS}/>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
