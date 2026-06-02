// ComparisonTool.jsx — Vergleichsbild: Spalten (2-4) + Venn (2-4 Kreise)
// Layout-Wechsel direkt in Ergebnisansicht
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { mkR, rr } from './primitives.js';
import { Ic } from './icons.jsx';
import { gc } from './palettes.js';
import { FONT_CSS as FC } from './translations.js';
import { callComparisonAPI } from './api.js';
import { dlS, dlP } from './downloads.js';
import { saveLast, loadLast, lastAge } from './storage.js';

function dlB(b, n) {
  const u = URL.createObjectURL(b);
  const a = Object.assign(document.createElement('a'), { href: u, download: n });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}

/* ═══ COLUMN LAYOUT ═══ */
function ColumnSVG({ data, pal }) {
  const cols = data.columns || [];
  const n = cols.length || 1;
  const W = 200 + n * 260, H = 600;
  const seed = (data.title || '').length * 7 + 42, rng = mkR(seed);
  const colW = (W - 60) / n;
  return (<svg id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', background: pal.bg, borderRadius: 12 }}>
    <defs><style>{FC}</style></defs>
    <rect width={W} height={H} fill={pal.bg} rx="10" />
    <path d={rr(6, 6, W - 12, H - 12, 14, rng, 3)} fill="none" stroke={pal.t} strokeWidth="1.5" opacity="0.08" />
    <text x={W / 2} y={40} textAnchor="middle" fontFamily="Caveat" fontSize="28" fontWeight="700" fill={pal.t}>{data.title}</text>
    {data.subtitle && <text x={W / 2} y={62} textAnchor="middle" fontFamily="Patrick Hand" fontSize="14" fill={pal.t} opacity="0.5">{data.subtitle}</text>}
    {cols.map((col, i) => {
      const cx = 30 + i * colW, color = gc(pal, col.color || 'primary');
      return (<g key={i}>
        <path d={rr(cx + 4, 80, colW - 8, H - 160, 12, mkR(seed + i * 99), 3)} fill="#fff" stroke={color} strokeWidth="2" opacity="0.6" />
        {Ic(col.icon || 'star', cx + colW / 2 - 22, 92, 44, color)}
        <text x={cx + colW / 2} y={152} textAnchor="middle" fontFamily="Caveat" fontSize="20" fontWeight="700" fill={color}>{(col.label || '').toUpperCase()}</text>
        <path d={`M${cx + 20},${160} L${cx + colW - 20},${160}`} fill="none" stroke={color} strokeWidth="2" opacity="0.3" />
        {(col.items || []).map((item, j) => (<g key={j}><circle cx={cx + 20} cy={178 + j * 28} r="4" fill={color} opacity="0.5" /><text x={cx + 30} y={182 + j * 28} fontFamily="Patrick Hand" fontSize="14" fill={pal.t}>{(item || '').slice(0, 30)}</text></g>))}
      </g>);
    })}
    {data.conclusion && (<g>
      <path d={rr(30, H - 60, W - 60, 40, 10, rng, 2)} fill="#fff" stroke={pal.p} strokeWidth="1.5" strokeDasharray="6,4" />
      {Ic('star', 40, H - 54, 18, pal.p)}
      <text x={W / 2} y={H - 34} textAnchor="middle" fontFamily="Caveat" fontSize="15" fontWeight="600" fill={pal.p} fontStyle="italic">{data.conclusion}</text>
    </g>)}
  </svg>);
}

/* ═══ VENN DIAGRAM — 2, 3, or 4 circles, collision-aware text ═══ */
function VennSVG({ data, pal, circleCount }) {
  const cols = data.columns || [];
  const n = Math.min(circleCount || cols.length, 4);
  const W = n <= 2 ? 920 : 1040, H = n <= 2 ? 600 : 720;
  const cx0 = W / 2, cy0 = H / 2 + 10;
  const colors = cols.map((c, i) => gc(pal, c.color || ['primary', 'secondary', 'accent', 'primary'][i]));

  // Circle positions
  const positions = {
    2: [{ cx: cx0 - 110, cy: cy0, r: 175 }, { cx: cx0 + 110, cy: cy0, r: 175 }],
    3: [{ cx: cx0 - 105, cy: cy0 - 75, r: 150 }, { cx: cx0 + 105, cy: cy0 - 75, r: 150 }, { cx: cx0, cy: cy0 + 110, r: 150 }],
    4: [{ cx: cx0 - 100, cy: cy0 - 95, r: 135 }, { cx: cx0 + 100, cy: cy0 - 95, r: 135 }, { cx: cx0 - 100, cy: cy0 + 95, r: 135 }, { cx: cx0 + 100, cy: cy0 + 95, r: 135 }],
  };
  const pos = (positions[n] || positions[2]).slice(0, n);

  return (<svg id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', background: pal.bg, borderRadius: 12 }}>
    <defs><style>{FC}</style></defs>
    <rect width={W} height={H} fill={pal.bg} rx="10" />
    <text x={W / 2} y={36} textAnchor="middle" fontFamily="Caveat" fontSize="26" fontWeight="700" fill={pal.t}>{data.title}</text>
    {data.subtitle && <text x={W / 2} y={56} textAnchor="middle" fontFamily="Patrick Hand" fontSize="13" fill={pal.t} opacity="0.5">{data.subtitle}</text>}

    {/* Circles */}
    {pos.map((p, i) => (
      <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={colors[i] || pal.p} opacity="0.08" stroke={colors[i] || pal.p} strokeWidth="2.5" />
    ))}

    {/* Labels + items — placed radially outward from cluster center */}
    {cols.slice(0, n).map((col, i) => {
      const p = pos[i];
      const dx = p.cx - cx0, dy = p.cy - cy0;
      const len = Math.hypot(dx, dy) || 1;
      // text anchor point pushed outward beyond circle edge
      const tx = p.cx + (dx / len) * (p.r * 0.55);
      const ty = p.cy + (dy / len) * (p.r * 0.55) - 10;
      const anchor = dx < -20 ? 'end' : dx > 20 ? 'start' : 'middle';
      const items = (col.items || []).slice(0, 4);
      return (<g key={i}>
        <text x={tx} y={ty} textAnchor={anchor} fontFamily="Caveat" fontSize="18" fontWeight="700" fill={colors[i] || pal.p}>{(col.label || String.fromCharCode(65 + i)).slice(0, 18)}</text>
        {items.map((item, j) => (
          <text key={j} x={tx} y={ty + 20 + j * 19} textAnchor={anchor} fontFamily="Patrick Hand" fontSize="12.5" fill={pal.t}>{(item || '').slice(0, 24)}</text>
        ))}
      </g>);
    })}

    {/* Shared area — center of cluster */}
    {(data.shared || []).length > 0 && (<g>
      <text x={cx0} y={cy0 - 8} textAnchor="middle" fontFamily="Caveat" fontSize="13" fontWeight="600" fill={pal.p} opacity="0.6">∩ Gemeinsam</text>
      {(data.shared || []).slice(0, 3).map((item, j) => (
        <text key={j} x={cx0} y={cy0 + 12 + j * 18} textAnchor="middle" fontFamily="Patrick Hand" fontSize="12" fontWeight="600" fill={pal.p}>{(item || '').slice(0, 22)}</text>
      ))}
    </g>)}

    {data.conclusion && <text x={W / 2} y={H - 16} textAnchor="middle" fontFamily="Caveat" fontSize="15" fontWeight="600" fill={pal.p} fontStyle="italic">{data.conclusion}</text>}
  </svg>);
}

/* ═══ LAYOUT DEFINITIONS ═══ */
const LAYOUTS = [
  { id: '2col', label: '2 Spalten', short: '‖ 2' },
  { id: '3col', label: '3 Spalten', short: '‖ 3' },
  { id: '4col', label: '4 Spalten', short: '‖ 4' },
  { id: 'venn2', label: 'Venn 2', short: '◎ 2' },
  { id: 'venn3', label: 'Venn 3', short: '◎ 3' },
  { id: 'venn4', label: 'Venn 4', short: '◎ 4' },
];

export default function ComparisonTool({ lang, pal, onBack }) {
  const [topic, setTopic] = useState('');
  const [layout, setLayout] = useState('2col');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [ed, setEd] = useState(false);
  const [fs, setFs] = useState(false);
  const undoRef = useRef(null);
  const topicRef = useRef('');
  const layoutCacheRef = useRef({}); // { layoutId: data } — Rückwechsel ohne API-Call

  // Persistenz (#8)
  useEffect(() => {
    if (data) saveLast('comparison', { topic: topicRef.current, layout, data });
  }, [data, layout]);

  const generate = useCallback(async (tp, lay, force = false) => {
    const t = tp || topicRef.current || topic;
    const l = lay || layout;
    if (!t.trim()) return;
    topicRef.current = t;
    // Cache-Treffer? → ohne API-Call anzeigen (außer force = Neu-Würfeln)
    if (!force && layoutCacheRef.current[l]) { setData(layoutCacheRef.current[l]); setLayout(l); return; }
    setLoading(true); setErr(null);
    try { const d = await callComparisonAPI(t, l, lang); setData(d); setLayout(l); layoutCacheRef.current[l] = d; }
    catch (e) { setErr(e.message); }
    setLoading(false);
  }, [topic, layout, lang]);

  const switchLayout = (newLayout) => {
    if (newLayout === layout) return;
    setLayout(newLayout);
    generate(topicRef.current, newLayout);
  };
  const reroll = () => { layoutCacheRef.current = {}; generate(topicRef.current, layout, true); };

  const withUndo = (fn) => setData(prev => { if (!prev) return prev; undoRef.current = JSON.parse(JSON.stringify(prev)); const d = JSON.parse(JSON.stringify(prev)); fn(d); return d; });
  const undo = () => { if (undoRef.current) { setData(undoRef.current); undoRef.current = null; } };
  const updCol = (i, f, v) => withUndo(d => { d.columns[i][f] = v; });
  const updColItem = (ci, ii, v) => withUndo(d => { d.columns[ci].items[ii] = v; });
  const addColItem = (ci) => withUndo(d => { d.columns[ci].items.push('...'); });
  const delColItem = (ci, ii) => withUndo(d => { d.columns[ci].items.splice(ii, 1); });

  const exportJSON = () => {
    if (!data) return;
    const sl = (data.title || 'vergleich').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    dlB(new Blob([JSON.stringify({ v: 2, tool: 'comparison', topic: topicRef.current, layout, data, at: new Date().toISOString() }, null, 2)], { type: 'application/json' }), `vgl-${sl}.json`);
  };

  const eS = { width: '100%', padding: '7px 10px', borderRadius: 8, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#FAFAFA' };
  const bt2 = (c, f) => ({ padding: '8px 14px', borderRadius: 10, border: f ? 'none' : `2px solid ${c}`, background: f ? c : '#fff', color: f ? '#fff' : c, fontFamily: 'Caveat,cursive', fontSize: 15, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' });

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <style>{FC}</style>
      <div style={{ width: 40, height: 40, border: '4px solid #f0e0e0', borderTop: '4px solid #4CAF50', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
      <div style={{ fontFamily: 'Caveat,cursive', fontSize: 18, color: '#4CAF50', marginTop: 12 }}>Vergleichsbild wird erstellt...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  if (!data) return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 20 }}>
      <style>{FC}</style>
      <h2 style={{ fontFamily: 'Caveat,cursive', fontSize: 24, color: '#2D2D2D', marginBottom: 12 }}>⚖️ Vergleichsbild</h2>
      {err && <div style={{ padding: 10, background: '#FFF0F0', border: '2px solid #E8584F', borderRadius: 10, marginBottom: 12, fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#E8584F' }}>{err}</div>}
      <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder={lang === 'en' ? 'e.g. Remote vs. Office work...' : 'z.B. Remote-Arbeit vs. Büroarbeit...'}
        style={{ width: '100%', minHeight: 80, padding: 14, borderRadius: 12, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 15, resize: 'vertical', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' }} />
      <div style={{ fontFamily: 'Caveat,cursive', fontSize: 16, fontWeight: 600, color: '#555', marginTop: 12, marginBottom: 6 }}>Layout:</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {LAYOUTS.map(l => (
          <button key={l.id} onClick={() => setLayout(l.id)} style={{ padding: '7px 14px', borderRadius: 8, border: layout === l.id ? '2px solid #4CAF50' : '2px solid #e0e0e0', background: layout === l.id ? '#F0FFF0' : '#fff', fontFamily: 'Patrick Hand,cursive', fontSize: 14, cursor: 'pointer', color: '#2D2D2D' }}>{l.label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
        <button onClick={onBack} style={bt2('#888', false)}>← Zurück</button>
        <button onClick={() => generate(topic, layout)} disabled={!topic.trim()} style={bt2(topic.trim() ? '#4CAF50' : '#ccc', true)}>✨ Erstellen</button>
        {loadLast('comparison') && (
          <button onClick={() => { const l = loadLast('comparison'); if (l?.data) { setData(l.data); topicRef.current = l.topic || ''; setTopic(l.topic || ''); setLayout(l.layout || '2col'); layoutCacheRef.current = { [l.layout]: l.data }; } }} style={bt2('#8B6544', false)}>
            ↩ Letzter Stand {lastAge('comparison', lang) ? `(${lastAge('comparison', lang)})` : ''}
          </button>
        )}
      </div>
    </div>
  );

  const isVenn = layout.startsWith('venn');
  const vennCount = isVenn ? parseInt(layout.replace('venn', '')) || 2 : 2;
  const svg = isVenn ? <VennSVG data={data} pal={pal} circleCount={vennCount} /> : <ColumnSVG data={data} pal={pal} />;

  if (fs) return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#fff', zIndex: 9999, overflow: 'auto' }}>
      <style>{FC}</style>
      <button onClick={() => setFs(false)} style={{ position: 'fixed', top: 12, right: 12, zIndex: 10000, ...bt2('#E8584F', true), fontSize: 18 }}>✕ Schließen</button>
      <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
        <div style={{ width: '100%', maxWidth: 1200 }}>{svg}</div>
      </div>
    </div>
  );

  return (
    <div>
      <style>{FC}</style>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={onBack} style={bt2('#888', false)}>← Zurück</button>
        <button onClick={reroll} style={bt2('#E8584F', false)}>🎲 Neu</button>
        <button onClick={undo} disabled={!undoRef.current} style={bt2(undoRef.current ? '#E8584F' : '#ccc', false)}>↩ Undo</button>
        <button onClick={() => setEd(e => !e)} style={bt2(ed ? '#E8584F' : '#7B68AE', ed)}>{ed ? '✓ Fertig' : '📝 Bearbeiten'}</button>
      </div>
      {/* Layout-Wechsel — direkt klickbar */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {LAYOUTS.map(l => (
          <button key={l.id} onClick={() => switchLayout(l.id)} style={{ padding: '5px 11px', borderRadius: 8, border: layout === l.id ? '2px solid #4CAF50' : '2px solid #ddd', background: layout === l.id ? '#E8F5E9' : '#fff', fontFamily: 'Caveat,cursive', fontSize: 14, fontWeight: layout === l.id ? 700 : 400, cursor: 'pointer', color: layout === l.id ? '#4CAF50' : '#888' }}>{l.short}</button>
        ))}
        <button onClick={() => setFs(true)} style={bt2('#555', false)}>⛶</button>
        <button onClick={() => dlS(data.title)} style={bt2('#2E86AB', false)}>SVG</button>
        <button onClick={() => dlP(data.title, pal)} style={bt2('#4CAF50', false)}>PNG</button>
        <button onClick={exportJSON} style={bt2('#F5A623', false)}>💾</button>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', boxShadow: '0 6px 28px rgba(0,0,0,.1)', borderRadius: 12, overflow: 'auto' }}>{svg}</div>
      {ed && (
        <div style={{ maxWidth: 700, margin: '16px auto', padding: 16, background: '#fff', borderRadius: 12, border: '2px solid #e0e0e0' }}>
          <input value={data.title} onChange={e => setData(p => ({ ...p, title: e.target.value }))} style={{ ...eS, fontWeight: 700, fontSize: 16, marginBottom: 10 }} />
          {(data.columns || []).map((col, ci) => (
            <div key={ci} style={{ marginBottom: 10, padding: 10, borderRadius: 8, border: `1px solid ${gc(pal, col.color)}30`, background: '#fafafa' }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                <input value={col.label} onChange={e => updCol(ci, 'label', e.target.value)} style={{ ...eS, flex: 1, fontWeight: 600 }} />
                <select value={col.color || 'primary'} onChange={e => updCol(ci, 'color', e.target.value)} style={{ ...eS, width: 100, flex: 'none' }}>
                  <option value="primary">Primär</option><option value="secondary">Sekundär</option><option value="accent">Akzent</option>
                </select>
              </div>
              {(col.items || []).map((item, ii) => (
                <div key={ii} style={{ display: 'flex', gap: 6, paddingLeft: 16, marginBottom: 3, alignItems: 'center' }}>
                  <input value={item} onChange={e => updColItem(ci, ii, e.target.value)} style={{ ...eS, flex: 1 }} />
                  <button onClick={() => delColItem(ci, ii)} style={{ background: 'none', border: 'none', color: '#E8584F', cursor: 'pointer', fontSize: 16 }}>✕</button>
                </div>
              ))}
              <button onClick={() => addColItem(ci)} style={{ marginLeft: 16, background: 'none', border: 'none', color: '#4CAF50', cursor: 'pointer', fontFamily: 'Patrick Hand,cursive', fontSize: 13 }}>+ Punkt</button>
            </div>
          ))}
          {isVenn && data.shared && (
            <div style={{ marginTop: 10, padding: 10, borderRadius: 8, border: '1px solid #ddd', background: '#fafafa' }}>
              <div style={{ fontFamily: 'Caveat,cursive', fontSize: 14, fontWeight: 600, color: '#888', marginBottom: 6 }}>Gemeinsam:</div>
              {data.shared.map((item, i) => (
                <div key={i} style={{ paddingLeft: 16, marginBottom: 3 }}>
                  <input value={item} onChange={e => withUndo(d => { d.shared[i] = e.target.value; })} style={eS} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
