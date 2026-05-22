// ComparisonTool.jsx — Vergleichsbild: 2/3/4-col + Venn 2/3 circles
import React, { useState, useCallback } from 'react';
import { mkR, rr } from './primitives.js';
import { Ic } from './icons.jsx';
import { gc } from './palettes.js';
import { FONT_CSS as FC } from './translations.js';
import { callComparisonAPI } from './api.js';
import { dlS, dlP } from './downloads.js';

/* ── COLUMN VIEW ── */
function ColumnSVG({ data, pal }) {
  const cols = data.columns || [];
  const n = cols.length || 1;
  const W = Math.max(600, 80 + n * 240), H = 580;
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
      const cRng = mkR(seed + i * 99);
      return (<g key={i}>
        <path d={rr(cx + 4, 78, colW - 8, H - 148, 12, cRng, 3)} fill="#fff" stroke={color} strokeWidth="2" opacity="0.6" />
        {Ic(col.icon || 'star', cx + colW / 2 - 22, 90, 44, color)}
        <text x={cx + colW / 2} y={150} textAnchor="middle" fontFamily="Caveat" fontSize="20" fontWeight="700" fill={color}>{(col.label || '').toUpperCase()}</text>
        <path d={`M${cx + 20},${158} L${cx + colW - 20},${158}`} fill="none" stroke={color} strokeWidth="2" opacity="0.3" />
        {(col.items || []).map((item, j) => (
          <g key={j}><circle cx={cx + 20} cy={178 + j * 30} r="4" fill={color} opacity="0.5" />
          <text x={cx + 30} y={182 + j * 30} fontFamily="Patrick Hand" fontSize="14" fill={pal.t}>{(item || '').slice(0, 30)}</text></g>
        ))}
      </g>);
    })}
    {data.conclusion && (<g>
      <path d={rr(30, H - 58, W - 60, 40, 10, rng, 2)} fill="#fff" stroke={pal.p} strokeWidth="1.5" strokeDasharray="6,4" />
      <text x={W / 2} y={H - 32} textAnchor="middle" fontFamily="Caveat" fontSize="15" fontWeight="600" fill={pal.p} fontStyle="italic">{data.conclusion}</text>
    </g>)}
  </svg>);
}

/* ── VENN 2 CIRCLES ── */
function Venn2SVG({ data, pal }) {
  const cols = data.columns || [];
  const W = 960, H = 640;
  const c1 = gc(pal, cols[0]?.color || 'primary');
  const c2 = gc(pal, cols[1]?.color || 'secondary');
  const r = 200, cx1 = 310, cx2 = 650, cy = 340;
  const leftX = cx1 - 80, rightX = cx2 + 80, midX = (cx1 + cx2) / 2;
  const shared = data.shared || [];
  const sharedTotal = shared.length;
  const sharedStartY = cy - (sharedTotal * 36) / 2;

  return (<svg id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', background: pal.bg, borderRadius: 12 }}>
    <defs><style>{FC}</style></defs>
    <rect width={W} height={H} fill={pal.bg} rx="10" />
    <text x={W / 2} y={38} textAnchor="middle" fontFamily="Caveat" fontSize="26" fontWeight="700" fill={pal.t}>{data.title}</text>
    {data.subtitle && <text x={W / 2} y={58} textAnchor="middle" fontFamily="Patrick Hand" fontSize="13" fill={pal.t} opacity="0.5">{data.subtitle}</text>}
    <circle cx={cx1} cy={cy} r={r} fill={c1} opacity="0.07" stroke={c1} strokeWidth="2.5" />
    <circle cx={cx2} cy={cy} r={r} fill={c2} opacity="0.07" stroke={c2} strokeWidth="2.5" />

    {/* Left — label + items spaced at 46px */}
    <text x={leftX} y={cy - 135} textAnchor="middle" fontFamily="Caveat" fontSize="19" fontWeight="700" fill={c1}>{cols[0]?.label || 'A'}</text>
    <line x1={leftX - 60} y1={cy - 127} x2={leftX + 60} y2={cy - 127} stroke={c1} strokeWidth="1.5" opacity="0.3" />
    {(cols[0]?.items || []).map((item, j) => (
      <text key={j} x={leftX} y={cy - 96 + j * 46} textAnchor="middle" fontFamily="Patrick Hand" fontSize="14" fill={pal.t}>{(item || '').slice(0, 20)}</text>
    ))}

    {/* Right — label + items */}
    <text x={rightX} y={cy - 135} textAnchor="middle" fontFamily="Caveat" fontSize="19" fontWeight="700" fill={c2}>{cols[1]?.label || 'B'}</text>
    <line x1={rightX - 60} y1={cy - 127} x2={rightX + 60} y2={cy - 127} stroke={c2} strokeWidth="1.5" opacity="0.3" />
    {(cols[1]?.items || []).map((item, j) => (
      <text key={j} x={rightX} y={cy - 96 + j * 46} textAnchor="middle" fontFamily="Patrick Hand" fontSize="14" fill={pal.t}>{(item || '').slice(0, 20)}</text>
    ))}

    {/* Shared — centered, well-spaced at 36px */}
    {sharedTotal > 0 && (<g>
      <text x={midX} y={sharedStartY - 12} textAnchor="middle" fontFamily="Caveat" fontSize="14" fontWeight="700" fill={pal.p} opacity="0.6">Gemeinsam</text>
      {shared.map((item, j) => (
        <text key={j} x={midX} y={sharedStartY + 14 + j * 36} textAnchor="middle" fontFamily="Patrick Hand" fontSize="13" fontWeight="600" fill={pal.p}>{(item || '').slice(0, 20)}</text>
      ))}
    </g>)}

    {data.conclusion && <text x={W / 2} y={H - 16} textAnchor="middle" fontFamily="Caveat" fontSize="15" fontWeight="600" fill={pal.p} fontStyle="italic">{data.conclusion}</text>}
  </svg>);
}

/* ── VENN 3 CIRCLES ── */
function Venn3SVG({ data, pal }) {
  const cols = data.columns || [];
  const W = 960, H = 740;
  const c1 = gc(pal, cols[0]?.color || 'primary');
  const c2 = gc(pal, cols[1]?.color || 'secondary');
  const c3 = gc(pal, cols[2]?.color || 'accent');
  const r = 175, cX = W / 2, cY = 390;
  const cx1 = cX, cy1 = cY - 115;
  const cx2 = cX - 145, cy2 = cY + 75;
  const cx3 = cX + 145, cy3 = cY + 75;

  return (<svg id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', background: pal.bg, borderRadius: 12 }}>
    <defs><style>{FC}</style></defs>
    <rect width={W} height={H} fill={pal.bg} rx="10" />
    <text x={W / 2} y={38} textAnchor="middle" fontFamily="Caveat" fontSize="26" fontWeight="700" fill={pal.t}>{data.title}</text>
    {data.subtitle && <text x={W / 2} y={58} textAnchor="middle" fontFamily="Patrick Hand" fontSize="13" fill={pal.t} opacity="0.5">{data.subtitle}</text>}

    <circle cx={cx1} cy={cy1} r={r} fill={c1} opacity="0.06" stroke={c1} strokeWidth="2.5" />
    <circle cx={cx2} cy={cy2} r={r} fill={c2} opacity="0.06" stroke={c2} strokeWidth="2.5" />
    <circle cx={cx3} cy={cy3} r={r} fill={c3} opacity="0.06" stroke={c3} strokeWidth="2.5" />

    {/* Top circle items */}
    <text x={cx1} y={cy1 - 110} textAnchor="middle" fontFamily="Caveat" fontSize="18" fontWeight="700" fill={c1}>{cols[0]?.label || 'A'}</text>
    {(cols[0]?.items || []).slice(0, 4).map((item, j) => (
      <text key={j} x={cx1} y={cy1 - 74 + j * 30} textAnchor="middle" fontFamily="Patrick Hand" fontSize="13" fill={pal.t}>{(item || '').slice(0, 22)}</text>
    ))}

    {/* Bottom-left circle items */}
    <text x={cx2 - 60} y={cy2 - 60} textAnchor="middle" fontFamily="Caveat" fontSize="18" fontWeight="700" fill={c2}>{cols[1]?.label || 'B'}</text>
    {(cols[1]?.items || []).slice(0, 4).map((item, j) => (
      <text key={j} x={cx2 - 60} y={cy2 - 26 + j * 30} textAnchor="middle" fontFamily="Patrick Hand" fontSize="13" fill={pal.t}>{(item || '').slice(0, 22)}</text>
    ))}

    {/* Bottom-right circle items */}
    <text x={cx3 + 60} y={cy3 - 60} textAnchor="middle" fontFamily="Caveat" fontSize="18" fontWeight="700" fill={c3}>{cols[2]?.label || 'C'}</text>
    {(cols[2]?.items || []).slice(0, 4).map((item, j) => (
      <text key={j} x={cx3 + 60} y={cy3 - 26 + j * 30} textAnchor="middle" fontFamily="Patrick Hand" fontSize="13" fill={pal.t}>{(item || '').slice(0, 22)}</text>
    ))}

    {/* Shared center */}
    {(data.shared || []).length > 0 && (() => {
      const shared = data.shared || [];
      const sy = cY + 4;
      return (<g>
        <text x={cX} y={sy - 12} textAnchor="middle" fontFamily="Caveat" fontSize="13" fontWeight="700" fill={pal.p} opacity="0.6">Gemeinsam</text>
        {shared.slice(0, 3).map((item, j) => (
          <text key={j} x={cX} y={sy + 8 + j * 24} textAnchor="middle" fontFamily="Patrick Hand" fontSize="12" fontWeight="600" fill={pal.p}>{(item || '').slice(0, 18)}</text>
        ))}
      </g>);
    })()}

    {data.conclusion && <text x={W / 2} y={H - 16} textAnchor="middle" fontFamily="Caveat" fontSize="15" fontWeight="600" fill={pal.p} fontStyle="italic">{data.conclusion}</text>}
  </svg>);
}

/* ── MAIN COMPONENT ── */
const LAYOUTS = [
  { id: '2col', label: '2 Spalten', cols: 2, type: 'col' },
  { id: '3col', label: '3 Spalten', cols: 3, type: 'col' },
  { id: '4col', label: '4 Spalten', cols: 4, type: 'col' },
  { id: 'venn2', label: 'Venn (2)', cols: 2, type: 'venn' },
  { id: 'venn3', label: 'Venn (3)', cols: 3, type: 'venn' },
];

export default function ComparisonTool({ lang, pal, onBack }) {
  const [topic, setTopic] = useState('');
  const [layout, setLayout] = useState('2col');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [ed, setEd] = useState(false);

  const layoutDef = LAYOUTS.find(l => l.id === layout) || LAYOUTS[0];

  const generate = useCallback(async (overrideLayout) => {
    if (!topic.trim()) return;
    const lay = overrideLayout || layout;
    const ld = LAYOUTS.find(l => l.id === lay) || LAYOUTS[0];
    setLoading(true); setErr(null);
    try {
      const d = await callComparisonAPI(topic, lay, lang);
      setData(d);
      setLayout(lay);
    } catch (e) { setErr(e.message); }
    setLoading(false);
  }, [topic, layout, lang]);

  // Mismatch detection
  const colCount = (data?.columns || []).length;
  const needsCols = layoutDef.cols;
  const mismatch = data && colCount !== needsCols;

  const updCol = (i, f, v) => setData(p => ({ ...p, columns: p.columns.map((c, j) => j === i ? { ...c, [f]: v } : c) }));
  const updColItem = (ci, ii, v) => setData(p => ({ ...p, columns: p.columns.map((c, j) => j === ci ? { ...c, items: c.items.map((x, k) => k === ii ? v : x) } : c) }));

  const eS = { width: '100%', padding: '7px 10px', borderRadius: 8, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#FAFAFA' };
  const bt2 = (c, f) => ({ padding: '8px 14px', borderRadius: 10, border: f ? 'none' : `2px solid ${c}`, background: f ? c : '#fff', color: f ? '#fff' : c, fontFamily: 'Caveat,cursive', fontSize: 15, fontWeight: 600, cursor: 'pointer' });

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <style>{FC}</style>
      <div style={{ width: 40, height: 40, border: '4px solid #f0e0e0', borderTop: '4px solid #3B7DD8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
      <div style={{ fontFamily: 'Caveat,cursive', fontSize: 18, color: '#3B7DD8', marginTop: 12 }}>Vergleichsbild wird erstellt...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  if (!data) return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 20 }}>
      <style>{FC}</style>
      <h2 style={{ fontFamily: 'Caveat,cursive', fontSize: 24, color: '#2D2D2D', marginBottom: 12 }}>⚖️ Vergleichsbild</h2>
      {err && <div style={{ padding: 10, background: '#FFF0F0', border: '2px solid #E8584F', borderRadius: 10, marginBottom: 12, fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#E8584F' }}>{err}</div>}
      <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder="z.B. Remote-Arbeit vs. Büroarbeit..."
        style={{ width: '100%', minHeight: 80, padding: 14, borderRadius: 12, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 15, resize: 'vertical', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' }} />
      <div style={{ fontFamily: 'Caveat,cursive', fontSize: 16, fontWeight: 600, color: '#555', marginTop: 12, marginBottom: 6 }}>Layout:</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {LAYOUTS.map(l => (
          <button key={l.id} onClick={() => setLayout(l.id)} style={{ padding: '7px 14px', borderRadius: 8, border: layout === l.id ? '2px solid #3B7DD8' : '2px solid #e0e0e0', background: layout === l.id ? '#F0F4FF' : '#fff', fontFamily: 'Patrick Hand,cursive', fontSize: 14, cursor: 'pointer', color: '#2D2D2D' }}>{l.label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <button onClick={onBack} style={bt2('#888', false)}>← Zurück</button>
        <button onClick={() => generate()} disabled={!topic.trim()} style={bt2(topic.trim() ? '#3B7DD8' : '#ccc', true)}>✨ Erstellen</button>
      </div>
    </div>
  );

  // Determine SVG
  let svg = null;
  if (!mismatch) {
    if (layoutDef.type === 'venn' && colCount === 3) svg = <Venn3SVG data={data} pal={pal} />;
    else if (layoutDef.type === 'venn' && colCount === 2) svg = <Venn2SVG data={data} pal={pal} />;
    else svg = <ColumnSVG data={data} pal={pal} />;
  }

  return (
    <div>
      <style>{FC}</style>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={onBack} style={bt2('#888', false)}>← Zurück</button>
        <button onClick={() => generate()} style={bt2('#E8584F', false)}>🎲 Neu</button>
        <button onClick={() => setEd(e => !e)} style={bt2(ed ? '#E8584F' : '#7B68AE', ed)}>{ed ? '✓ Fertig' : '📝 Bearbeiten'}</button>
        <span style={{ borderLeft: '1px solid #ddd', margin: '0 2px' }} />
        {LAYOUTS.map(l => (
          <button key={l.id} onClick={() => setLayout(l.id)} style={{ padding: '5px 10px', borderRadius: 8, border: layout === l.id ? '2px solid #3B7DD8' : '2px solid #ddd', background: layout === l.id ? '#E8F0FE' : '#fff', fontFamily: 'Caveat,cursive', fontSize: 13, cursor: 'pointer', color: layout === l.id ? '#3B7DD8' : '#888' }}>{l.label}</button>
        ))}
        <span style={{ borderLeft: '1px solid #ddd', margin: '0 2px' }} />
        <button onClick={() => dlS(data.title)} style={bt2('#2E86AB', false)}>SVG</button>
        <button onClick={() => dlP(data.title, pal)} style={bt2('#4CAF50', false)}>PNG</button>
      </div>

      {mismatch && (
        <div style={{ maxWidth: 600, margin: '0 auto 14px', padding: '12px 18px', background: '#FFF8E1', border: '2px solid #FFB300', borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#6D4C00', marginBottom: 8 }}>⚠️ {layoutDef.label} braucht {needsCols} Spalten — aktuell {colCount} vorhanden.</div>
          <button onClick={() => generate(layout)} style={bt2('#FFB300', true)}>🎲 Neu generieren für {layoutDef.label}</button>
        </div>
      )}

      {svg && <div style={{ maxWidth: 1100, margin: '0 auto', boxShadow: '0 6px 28px rgba(0,0,0,.1)', borderRadius: 12, overflow: 'auto' }}>{svg}</div>}

      {ed && (
        <div style={{ maxWidth: 700, margin: '16px auto', padding: 16, background: '#fff', borderRadius: 12, border: '2px solid #e0e0e0' }}>
          <input value={data.title} onChange={e => setData(p => ({ ...p, title: e.target.value }))} style={{ ...eS, fontWeight: 700, fontSize: 16, marginBottom: 10 }} />
          {(data.columns || []).map((col, ci) => (
            <div key={ci} style={{ marginBottom: 10, padding: 10, borderRadius: 8, border: `1px solid ${gc(pal, col.color)}30`, background: '#fafafa' }}>
              <input value={col.label} onChange={e => updCol(ci, 'label', e.target.value)} style={{ ...eS, fontWeight: 600, marginBottom: 6 }} />
              {(col.items || []).map((item, ii) => (
                <div key={ii} style={{ paddingLeft: 16, marginBottom: 3 }}>
                  <input value={item} onChange={e => updColItem(ci, ii, e.target.value)} style={eS} />
                </div>
              ))}
            </div>
          ))}
          {layoutDef.type === 'venn' && (
            <div style={{ marginTop: 10, padding: 10, borderRadius: 8, border: '1px solid #ddd', background: '#f8f8ff' }}>
              <div style={{ fontFamily: 'Caveat,cursive', fontSize: 14, fontWeight: 700, color: pal.p, marginBottom: 4 }}>Gemeinsam:</div>
              {(data.shared || []).map((item, i) => (
                <div key={i} style={{ paddingLeft: 16, marginBottom: 3 }}>
                  <input value={item} onChange={e => setData(p => ({ ...p, shared: p.shared.map((x, j) => j === i ? e.target.value : x) }))} style={eS} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
