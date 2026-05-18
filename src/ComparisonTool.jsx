// ComparisonTool.jsx — Vorher/Nachher Visual Comparison
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FONT_CSS, mkR, rr, ln, arr, blob } from './primitives.js';
import { Sc, SCENE_NAMES } from './scenes.jsx';
import { Ic, ICON_NAMES } from './icons.jsx';
import { PAL, gc } from './palettes.js';
import { useSettings, DARK_PAL, saveToGallery, consumePendingGalleryItem } from './settings.js';

// ═══════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════
const CT = {
  de: {
    title: 'Vorher / Nachher', sub: 'Transformationen sichtbar machen · Sketch oder Clean',
    inputTitle: 'Welche Transformation möchtest du zeigen?',
    inputHint: 'KI erstellt Ausgangslage, Zielzustand und den Weg dazwischen.',
    inputPh: 'z.B. Von der Angst vor Veränderung zum mutigen Neuanfang\nDigitalisierung: Papier-Chaos → digitaler Workflow\nTeam: Silos → echte Zusammenarbeit',
    create: '✨ Generieren', loading: 'Vergleich wird erstellt...',
    neu: '← Neu', reroll: '🎲 Neu generieren',
    bikablo: '✏️ Sketch', clean: '📐 Clean',
    edit: '📝 Bearbeiten', done: '✓ Fertig',
    fullscreen: '⛶ Vollbild', exitFs: '✕ Schließen', save: '💾 JSON',
    before: 'VORHER', after: 'NACHHER', transform: 'TRANSFORMATION',
    titleL: 'Überschrift', subtitleBefore: 'Vorher-Titel', subtitleAfter: 'Nachher-Titel',
    transLabel: 'Brücke / Weg', noScene: 'Kein Bild',
    addItem: '+ Punkt', apiLang: 'Deutsch',
  },
  en: {
    title: 'Before / After', sub: 'Make transformations visible · Sketch or Clean',
    inputTitle: 'What transformation do you want to show?',
    inputHint: 'AI creates starting point, target state and the path between.',
    inputPh: 'e.g. From fear of change to courageous new beginning\nDigitization: paper chaos → digital workflow\nTeam: silos → real collaboration',
    create: '✨ Generate', loading: 'Creating comparison...',
    neu: '← New', reroll: '🎲 Regenerate',
    bikablo: '✏️ Sketch', clean: '📐 Clean',
    edit: '📝 Edit', done: '✓ Done',
    fullscreen: '⛶ Fullscreen', exitFs: '✕ Close', save: '💾 JSON',
    before: 'BEFORE', after: 'AFTER', transform: 'TRANSFORMATION',
    titleL: 'Headline', subtitleBefore: 'Before title', subtitleAfter: 'After title',
    transLabel: 'Bridge / Path', noScene: 'No image',
    addItem: '+ Point', apiLang: 'English',
  },
  ru: {
    title: 'До / После', sub: 'Визуализация трансформаций · Эскиз или Чистый',
    inputTitle: 'Какую трансформацию показать?',
    inputHint: 'ИИ создаст начальное и целевое состояние и путь между ними.',
    inputPh: 'напр. От страха перемен к смелому новому началу\nЦифровизация: бумажный хаос → цифровой процесс',
    create: '✨ Создать', loading: 'Создание сравнения...',
    neu: '← Новый', reroll: '🎲 Заново',
    bikablo: '✏️ Эскиз', clean: '📐 Чистый',
    edit: '📝 Редактировать', done: '✓ Готово',
    fullscreen: '⛶ Полный экран', exitFs: '✕ Закрыть', save: '💾 JSON',
    before: 'ДО', after: 'ПОСЛЕ', transform: 'ТРАНСФОРМАЦИЯ',
    titleL: 'Заголовок', subtitleBefore: 'Заголовок До', subtitleAfter: 'Заголовок После',
    transLabel: 'Мост / Путь', noScene: 'Без картинки',
    addItem: '+ Пункт', apiLang: 'Russian',
  },
};

// ═══════════════════════════════════════
// AI GENERATION
// ═══════════════════════════════════════
async function generateComparison(topic, lang = 'de') {
  const tLang = CT[lang]?.apiLang || 'Deutsch';
  const scL = SCENE_NAMES.join(',');
  const sys = `Du bist ein Visual-Thinking-Experte. Erstelle einen Vorher/Nachher-Vergleich als reines JSON. Keine Backticks, kein Text.
Verfügbare Szenen: ${scL}
Szenen-Guide: figureFear=Angst, figureDoubt=Zweifel, figureThinking=Reflexion, figureCelebrate=Erfolg, figureCourage=Mut, figureHandshake=Zusammenarbeit, figureConversation=Dialog, doorOpen=Neuanfang, bridge=Verbindung, mountainClimb=Herausforderung, targetHit=Ziel, seedToTree=Wachstum, lighthouse=Orientierung, wallBreak=Durchbruch, treasure=Potenzial, windingRoad=Weg, networkNodes=Vernetzung, teamCircle=Team, puzzleFit=Zusammenhang
Format: {"title":"Überschrift (max 30Z)","before":{"title":"VORHER-Titel (max 20Z)","scene":"szenenName","color":"secondary","items":["Punkt1 (max 30Z)","Punkt2","Punkt3","Punkt4"]},"after":{"title":"NACHHER-Titel (max 20Z)","scene":"szenenName","color":"primary","items":["Punkt1","Punkt2","Punkt3","Punkt4"]},"transform":{"label":"Was verändert (max 25Z)","steps":["Schritt1 (max 28Z)","Schritt2","Schritt3"]}}
Regeln: Vorher=Problem/Schmerz (düstere Szene), Nachher=Lösung/Ziel (positive Szene). 3-5 Punkte pro Seite, 2-3 Transformations-Schritte. Szenen müssen aus der Liste sein!
WICHTIG: Alle Texte in ${tLang}!`;
  const usr = `THEMA: ${topic}\nJSON:`;

  const apiUrl = import.meta.env?.VITE_API_URL || '/api/generate';
  const res = await fetch(apiUrl, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514', max_tokens: 1500,
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

  // Validate scenes
  if (p.before?.scene && !SCENE_NAMES.includes(p.before.scene)) p.before.scene = 'figureFear';
  if (p.after?.scene && !SCENE_NAMES.includes(p.after.scene)) p.after.scene = 'figureCelebrate';
  return p;
}

// ═══════════════════════════════════════
// BIKABLO RENDERER
// ═══════════════════════════════════════
function BikabloSVG({ data, pal }) {
  const W = 1100, H = 620;
  const seed = (data.title || '').length * 11 + 37;
  const rng = mkR(seed);
  const PW = 420, PH = 480, gap = 260;
  const bx = 30, ax = W - PW - 30;
  const py = 100;
  const bCol = gc(pal, data.before?.color || 'secondary');
  const aCol = gc(pal, data.after?.color || 'primary');

  return (
    <svg id="comparison-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', background: pal.bg, borderRadius: 12 }}>
      <defs><style>{FONT_CSS}</style></defs>
      <rect width={W} height={H} fill={pal.bg} rx="10"/>
      <path d={rr(6, 6, W-12, H-12, 16, rng, 3)} fill="none" stroke={pal.t} strokeWidth="1.8" opacity="0.1"/>

      {/* Title */}
      <text x={W/2} y={40} textAnchor="middle" fontFamily="Caveat" fontSize="28" fontWeight="700" fill={pal.t} letterSpacing="1">{data.title?.toUpperCase()}</text>
      <path d={ln(W/2-160, 50, W/2+160, 50, rng)} fill="none" stroke={pal.p} strokeWidth="2" opacity="0.3"/>

      {/* BEFORE Panel */}
      <path d={rr(bx, py, PW, PH, 16, rng, 3)} fill="#fff" stroke={bCol} strokeWidth="2.2" opacity="0.9"/>
      <path d={rr(bx+PW/2-70, py-14, 140, 28, 8, rng, 2)} fill={bCol} opacity="0.9"/>
      <text x={bx+PW/2} y={py+5} textAnchor="middle" fontFamily="Caveat" fontSize="18" fontWeight="700" fill="#fff">{data.before?.title?.toUpperCase() || 'VORHER'}</text>

      {data.before?.scene && Sc(data.before.scene, bx+PW/2-45, py+25, 1.1, bCol)}
      {(data.before?.items || []).slice(0, 5).map((item, i) => {
        const iy = py + 140 + i * 32;
        return (<g key={`b${i}`}>
          <circle cx={bx+30} cy={iy} r="4" fill={bCol} opacity="0.6"/>
          <text x={bx+44} y={iy+5} fontFamily="Patrick Hand" fontSize="15" fill={pal.t}>{item.length > 35 ? item.slice(0, 33) + '…' : item}</text>
        </g>);
      })}

      {/* AFTER Panel */}
      <path d={rr(ax, py, PW, PH, 16, mkR(seed+99), 3)} fill="#fff" stroke={aCol} strokeWidth="2.2" opacity="0.9"/>
      <path d={rr(ax+PW/2-70, py-14, 140, 28, 8, mkR(seed+77), 2)} fill={aCol} opacity="0.9"/>
      <text x={ax+PW/2} y={py+5} textAnchor="middle" fontFamily="Caveat" fontSize="18" fontWeight="700" fill="#fff">{data.after?.title?.toUpperCase() || 'NACHHER'}</text>

      {data.after?.scene && Sc(data.after.scene, ax+PW/2-45, py+25, 1.1, aCol)}
      {(data.after?.items || []).slice(0, 5).map((item, i) => {
        const iy = py + 140 + i * 32;
        return (<g key={`a${i}`}>
          {Ic('checkmark', ax+22, iy-8, 16, aCol)}
          <text x={ax+44} y={iy+5} fontFamily="Patrick Hand" fontSize="15" fill={pal.t}>{item.length > 35 ? item.slice(0, 33) + '…' : item}</text>
        </g>);
      })}

      {/* TRANSFORMATION Bridge */}
      <g>
        <path d={rr(W/2-90, py+60, 180, 30, 10, rng, 2)} fill={pal.bg} stroke={pal.p} strokeWidth="1.8"/>
        <text x={W/2} y={py+81} textAnchor="middle" fontFamily="Caveat" fontSize="14" fontWeight="700" fill={pal.p}>{data.transform?.label?.toUpperCase() || ''}</text>

        {/* Arrow */}
        {arr(bx+PW+10, py+180, ax-10, py+180, rng, 14).map((p, j) => (
          <path key={`ar${j}`} d={p} fill="none" stroke={pal.p} strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
        ))}

        {/* Steps */}
        {(data.transform?.steps || []).slice(0, 3).map((step, i) => {
          const sy = py + 220 + i * 36;
          return (<g key={`s${i}`}>
            <circle cx={W/2} cy={sy} r="12" fill={pal.p} opacity="0.15"/>
            <text x={W/2} y={sy+5} textAnchor="middle" fontFamily="Caveat" fontSize="13" fontWeight="700" fill={pal.p}>{i+1}</text>
            <text x={W/2} y={sy+24} textAnchor="middle" fontFamily="Patrick Hand" fontSize="12.5" fill={pal.t}>{step.length > 30 ? step.slice(0, 28) + '…' : step}</text>
          </g>);
        })}
      </g>
    </svg>
  );
}

// ═══════════════════════════════════════
// CLEAN RENDERER
// ═══════════════════════════════════════
function CleanSVG({ data, pal }) {
  const W = 1100, H = 620;
  const PW = 420, PH = 480;
  const bx = 30, ax = W - PW - 30, py = 100;
  const bCol = gc(pal, data.before?.color || 'secondary');
  const aCol = gc(pal, data.after?.color || 'primary');

  return (
    <svg id="comparison-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', background: '#FAFBFC', borderRadius: 12 }}>
      <defs><style>{FONT_CSS}</style></defs>
      <rect width={W} height={H} fill="#FAFBFC" rx="10"/>
      <rect x="4" y="4" width={W-8} height={H-8} rx="12" fill="none" stroke="#e0e0e0" strokeWidth="1"/>

      {/* Title */}
      <text x={W/2} y={42} textAnchor="middle" fontFamily="Patrick Hand" fontSize="26" fontWeight="700" fill="#2D2D2D" letterSpacing="1">{data.title?.toUpperCase()}</text>
      <line x1={W/2-140} y1={52} x2={W/2+140} y2={52} stroke={pal.p} strokeWidth="2" opacity="0.2"/>

      {/* BEFORE */}
      <rect x={bx} y={py} width={PW} height={PH} rx="14" fill="#fff" stroke={bCol} strokeWidth="2"/>
      <rect x={bx+PW/2-60} y={py-13} width="120" height="26" rx="8" fill={bCol}/>
      <text x={bx+PW/2} y={py+4} textAnchor="middle" fontFamily="Patrick Hand" fontSize="16" fontWeight="700" fill="#fff">{data.before?.title?.toUpperCase() || 'VORHER'}</text>

      {data.before?.scene && Sc(data.before.scene, bx+PW/2-45, py+25, 1.1, bCol)}
      {(data.before?.items || []).slice(0, 5).map((item, i) => {
        const iy = py + 140 + i * 32;
        return (<g key={`b${i}`}>
          <circle cx={bx+28} cy={iy} r="3.5" fill={bCol} opacity="0.5"/>
          <text x={bx+42} y={iy+5} fontFamily="Patrick Hand" fontSize="15" fill="#444">{item.length > 35 ? item.slice(0, 33) + '…' : item}</text>
        </g>);
      })}

      {/* AFTER */}
      <rect x={ax} y={py} width={PW} height={PH} rx="14" fill="#fff" stroke={aCol} strokeWidth="2"/>
      <rect x={ax+PW/2-60} y={py-13} width="120" height="26" rx="8" fill={aCol}/>
      <text x={ax+PW/2} y={py+4} textAnchor="middle" fontFamily="Patrick Hand" fontSize="16" fontWeight="700" fill="#fff">{data.after?.title?.toUpperCase() || 'NACHHER'}</text>

      {data.after?.scene && Sc(data.after.scene, ax+PW/2-45, py+25, 1.1, aCol)}
      {(data.after?.items || []).slice(0, 5).map((item, i) => {
        const iy = py + 140 + i * 32;
        return (<g key={`a${i}`}>
          <circle cx={ax+28} cy={iy} r="3.5" fill={aCol} opacity="0.5"/>
          <text x={ax+42} y={iy+5} fontFamily="Patrick Hand" fontSize="15" fill="#444">{item.length > 35 ? item.slice(0, 33) + '…' : item}</text>
        </g>);
      })}

      {/* Center bridge */}
      <rect x={W/2-80} y={py+55} width="160" height="28" rx="8" fill="#FAFBFC" stroke={pal.p} strokeWidth="1.5"/>
      <text x={W/2} y={py+74} textAnchor="middle" fontFamily="Patrick Hand" fontSize="13" fontWeight="700" fill={pal.p}>{data.transform?.label?.toUpperCase() || ''}</text>

      {/* Arrow */}
      <line x1={bx+PW+12} y1={py+180} x2={ax-12} y2={py+180} stroke={pal.p} strokeWidth="2.5" opacity="0.4" markerEnd="url(#arrowClean)"/>
      <defs><marker id="arrowClean" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill={pal.p} opacity="0.4"/></marker></defs>

      {/* Steps */}
      {(data.transform?.steps || []).slice(0, 3).map((step, i) => {
        const sy = py + 215 + i * 38;
        return (<g key={`s${i}`}>
          <circle cx={W/2} cy={sy} r="11" fill="none" stroke={pal.p} strokeWidth="1.5"/>
          <text x={W/2} y={sy+4.5} textAnchor="middle" fontFamily="Patrick Hand" fontSize="12" fontWeight="700" fill={pal.p}>{i+1}</text>
          <text x={W/2} y={sy+24} textAnchor="middle" fontFamily="Patrick Hand" fontSize="12.5" fill="#555">{step.length > 30 ? step.slice(0, 28) + '…' : step}</text>
        </g>);
      })}
    </svg>
  );
}

// ═══════════════════════════════════════
// EXPORT HELPERS
// ═══════════════════════════════════════
function dlBlob(b, n) {
  const u = URL.createObjectURL(b);
  const a = Object.assign(document.createElement('a'), { href: u, download: n });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
function slug(t) { return (t || 'x').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30); }

function exportSVG(title) {
  const el = document.getElementById('comparison-svg');
  if (!el) return;
  const c = el.cloneNode(true); c.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  dlBlob(new Blob([new XMLSerializer().serializeToString(c)], { type: 'image/svg+xml' }), `vn-${slug(title)}.svg`);
}
function exportPNG(title, bg) {
  const el = document.getElementById('comparison-svg');
  if (!el) return;
  const c = el.cloneNode(true); c.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const s = new XMLSerializer().serializeToString(c);
  const vb = el.getAttribute('viewBox').split(' ').map(Number);
  const cv = Object.assign(document.createElement('canvas'), { width: vb[2] * 2, height: vb[3] * 2 });
  const ctx = cv.getContext('2d'); const img = new Image();
  img.onload = () => { ctx.fillStyle = bg; ctx.fillRect(0, 0, cv.width, cv.height); ctx.drawImage(img, 0, 0, cv.width, cv.height);
    cv.toBlob(b => { if (b) dlBlob(b, `vn-${slug(title)}.png`); }, 'image/png'); };
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(s)));
}
function exportJSON(data, topic) {
  dlBlob(new Blob([JSON.stringify({ v: 1, tool: 'comparison', topic, data, at: new Date().toISOString() }, null, 2)],
    { type: 'application/json' }), `vn-${slug(topic)}.json`);
}

// ═══════════════════════════════════════
// BUTTON STYLE
// ═══════════════════════════════════════
const bt = (c, f) => ({
  padding: '8px 14px', borderRadius: 10, border: f ? 'none' : `2px solid ${c}`,
  background: f ? c : '#fff', color: f ? '#fff' : c,
  fontFamily: 'Caveat,cursive', fontSize: 15, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
});

// ═══════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════
export default function ComparisonTool() {
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
  const t = CT[lang] || CT.de;
  const pal = dark ? DARK_PAL.neutral : PAL.neutral;
  const bgGrad = dark ? 'linear-gradient(145deg,#12122A,#1A1A2E)' : 'linear-gradient(145deg,#FEFCFB,#F5F0EB)';
  const textCol = dark ? '#E8E8E8' : '#2D2D2D';
  const subCol = dark ? '#777' : '#aaa';

  // Auto-load from gallery
  useEffect(() => {
    const item = consumePendingGalleryItem();
    if (item?.tool === "comparison" && item.data) {
      setData(item.data); setTopic(item.topic || ""); setPhase("result");
    }
  }, []);

  const generate = useCallback(async (tp) => {
    setPhase('loading'); setErr(null); setTopic(tp);
    try {
      const d = await generateComparison(tp, lang);
      setData(d); setPhase('result');
      saveToGallery({ tool: 'comparison', title: d.title || tp, topic: tp, data: d });
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

  // Edit helpers
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
  const updItem = (side, idx, val) => setData(prev => {
    if (!prev) return prev;
    const d = JSON.parse(JSON.stringify(prev));
    d[side].items[idx] = val;
    return d;
  });
  const addItem = (side) => setData(prev => {
    if (!prev) return prev;
    const d = JSON.parse(JSON.stringify(prev));
    d[side].items.push('...');
    return d;
  });
  const delItem = (side, idx) => setData(prev => {
    if (!prev) return prev;
    const d = JSON.parse(JSON.stringify(prev));
    d[side].items.splice(idx, 1);
    return d;
  });
  const updStep = (idx, val) => setData(prev => {
    if (!prev) return prev;
    const d = JSON.parse(JSON.stringify(prev));
    d.transform.steps[idx] = val;
    return d;
  });

  // Shared UI
  const langBar = (
    <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 6 }}>
      {[['de', '🇩🇪'], ['en', '🇬🇧'], ['ru', '🇷🇺']].map(([k, fl]) => (
        <button key={k} onClick={() => setLang(k)} style={{ padding: '4px 10px', borderRadius: 8, border: lang === k ? '2px solid #3B7DD8' : '2px solid transparent', background: lang === k ? '#F0F4FF' : 'transparent', fontSize: 16, cursor: 'pointer' }}>{fl}</button>
      ))}
    </div>
  );
  const hdr = (
    <div style={{ textAlign: 'center', padding: '16px 16px 3px' }}>
      <h1 style={{ fontFamily: 'Caveat,cursive', fontSize: 30, fontWeight: 700, color: textCol, margin: 0 }}>🔄 {t.title}</h1>
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
          {["Angst → Mut", "Chaos → Struktur", "Einzelkämpfer → Team", "Analog → Digital", "Stress → Balance"].map(tpl => (
            <button key={tpl} onClick={() => setTopic(tpl)} style={{ padding: "4px 12px", borderRadius: 8, border: `1px solid ${dark ? "#444" : "#ddd"}`, background: dark ? "#222240" : "#F0F4FF", fontFamily: "Patrick Hand,cursive", fontSize: 13, color: "#3B7DD8", cursor: "pointer" }}>{tpl}</button>
          ))}
        </div>
        <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder={t.inputPh}
          style={{ width: '100%', minHeight: 120, padding: 15, borderRadius: 14, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 15, resize: 'vertical', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box', lineHeight: 1.6 }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
          <button onClick={() => fileRef.current?.click()} style={{ ...bt('#888', false), fontSize: 14 }}>📂 Laden</button>
          <button onClick={() => { if (topic.trim()) generate(topic.trim()); }} disabled={!topic.trim()}
            style={{ ...bt(topic.trim() ? '#3B7DD8' : '#ccc', true), fontSize: 18 }}>{t.create}</button>
        </div>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={loadJSON}/>
      </div>
    </div>
  );

  // ═══ LOADING ═══
  if (phase === 'loading') return (
    <div style={{ minHeight: '100vh', background: bgGrad, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <style>{FONT_CSS}</style>
      <div style={{ width: 46, height: 46, border: '4px solid #e0e8f0', borderTop: '4px solid #3B7DD8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}/>
      <div style={{ fontFamily: 'Caveat,cursive', fontSize: 20, color: '#3B7DD8', fontWeight: 600 }}>{t.loading}</div>
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
          <div style={{ width: '100%', maxWidth: 1200 }}>{svg}</div>
        </div>
      </div>
    );

    return (
      <div style={{ minHeight: '100vh', background: bgGrad }}>
        <style>{FONT_CSS}</style>{hdr}
        <div style={{ padding: 14 }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 7, marginBottom: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => { setPhase('input'); setData(null); setEd(false); }} style={bt('#888', false)}>{t.neu}</button>
            <button onClick={() => generate(topic)} style={bt('#3B7DD8', false)}>{t.reroll}</button>
            <button onClick={undo} disabled={!undoRef.current} style={bt(undoRef.current ? '#E8584F' : '#ccc', false)}>↩ Undo</button>
            <button onClick={() => setStyle(s => s === 'bikablo' ? 'clean' : 'bikablo')} style={bt('#7B68AE', false)}>{style === 'bikablo' ? t.clean : t.bikablo}</button>
            <button onClick={() => setEd(e2 => !e2)} style={bt(ed ? '#E8584F' : '#5A8F7B', ed)}>{ed ? t.done : t.edit}</button>
            <button onClick={() => setFs(true)} style={bt('#555', false)}>{t.fullscreen}</button>
            <button onClick={() => exportSVG(data.title)} style={bt('#2E86AB', false)}>SVG</button>
            <button onClick={() => exportPNG(data.title, pal.bg)} style={bt('#4CAF50', false)}>PNG</button>
            <button onClick={() => exportJSON(data, topic)} style={bt('#F5A623', false)}>{t.save}</button>
          </div>

          {/* SVG */}
          <div style={{ maxWidth: 1100, margin: '0 auto', boxShadow: '0 6px 28px rgba(0,0,0,.08)', borderRadius: 12, overflow: 'auto' }}>{svg}</div>

          {/* Edit panel */}
          {ed && (
            <div style={{ maxWidth: 900, margin: '20px auto', padding: 20, background: '#fff', borderRadius: 14, border: '2px solid #e0e0e0' }}>
              <h3 style={{ fontFamily: 'Caveat,cursive', fontSize: 20, color: '#2D2D2D', marginBottom: 14 }}>📝 {t.edit}</h3>

              {/* Title */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontFamily: 'Caveat,cursive', fontSize: 14, color: '#888' }}>{t.titleL}</label>
                <input value={data.title || ''} onChange={e => upd('title', e.target.value)} style={eS}/>
              </div>

              {/* Before + After side by side */}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {/* Before */}
                <div style={{ flex: 1, minWidth: 280, padding: 14, borderRadius: 10, border: `2px solid ${gc(pal, 'secondary')}`, background: '#FAFAFA' }}>
                  <div style={{ fontFamily: 'Caveat,cursive', fontSize: 17, fontWeight: 700, color: gc(pal, 'secondary'), marginBottom: 8 }}>{t.before}</div>
                  <input value={data.before?.title || ''} onChange={e => upd('before.title', e.target.value)} style={{ ...eS, fontWeight: 600, marginBottom: 6 }} placeholder={t.subtitleBefore}/>
                  <select value={data.before?.scene || ''} onChange={e => upd('before.scene', e.target.value || null)} style={{ ...eS, marginBottom: 8 }}>
                    <option value="">{t.noScene}</option>
                    {SCENE_NAMES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {(data.before?.items || []).map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                      <input value={item} onChange={e => updItem('before', i, e.target.value)} style={{ ...eS, flex: 1 }}/>
                      <button onClick={() => delItem('before', i)} style={{ background: 'none', border: 'none', color: '#E8584F', cursor: 'pointer', fontSize: 16 }}>✕</button>
                    </div>
                  ))}
                  <button onClick={() => addItem('before')} style={{ background: 'none', border: 'none', color: gc(pal, 'secondary'), cursor: 'pointer', fontFamily: 'Patrick Hand,cursive', fontSize: 13 }}>{t.addItem}</button>
                </div>

                {/* After */}
                <div style={{ flex: 1, minWidth: 280, padding: 14, borderRadius: 10, border: `2px solid ${gc(pal, 'primary')}`, background: '#FAFAFA' }}>
                  <div style={{ fontFamily: 'Caveat,cursive', fontSize: 17, fontWeight: 700, color: gc(pal, 'primary'), marginBottom: 8 }}>{t.after}</div>
                  <input value={data.after?.title || ''} onChange={e => upd('after.title', e.target.value)} style={{ ...eS, fontWeight: 600, marginBottom: 6 }} placeholder={t.subtitleAfter}/>
                  <select value={data.after?.scene || ''} onChange={e => upd('after.scene', e.target.value || null)} style={{ ...eS, marginBottom: 8 }}>
                    <option value="">{t.noScene}</option>
                    {SCENE_NAMES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {(data.after?.items || []).map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                      <input value={item} onChange={e => updItem('after', i, e.target.value)} style={{ ...eS, flex: 1 }}/>
                      <button onClick={() => delItem('after', i)} style={{ background: 'none', border: 'none', color: '#E8584F', cursor: 'pointer', fontSize: 16 }}>✕</button>
                    </div>
                  ))}
                  <button onClick={() => addItem('after')} style={{ background: 'none', border: 'none', color: gc(pal, 'primary'), cursor: 'pointer', fontFamily: 'Patrick Hand,cursive', fontSize: 13 }}>{t.addItem}</button>
                </div>
              </div>

              {/* Transform */}
              <div style={{ marginTop: 16, padding: 14, borderRadius: 10, border: `2px solid ${pal.p}`, background: '#FAFAFA' }}>
                <div style={{ fontFamily: 'Caveat,cursive', fontSize: 17, fontWeight: 700, color: pal.p, marginBottom: 8 }}>{t.transform}</div>
                <input value={data.transform?.label || ''} onChange={e => upd('transform.label', e.target.value)} style={{ ...eS, fontWeight: 600, marginBottom: 8 }} placeholder={t.transLabel}/>
                {(data.transform?.steps || []).map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Caveat,cursive', fontSize: 14, color: pal.p, fontWeight: 700, minWidth: 20 }}>{i+1}.</span>
                    <input value={step} onChange={e => updStep(i, e.target.value)} style={{ ...eS, flex: 1 }}/>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
