// ComparisonTool.jsx — Vergleichsbild with 2/3/4-col + Venn, proper text placement
import React, { useState, useCallback } from 'react';
import { mkR, rr } from './primitives.js';
import { Ic } from './icons.jsx';
import { gc } from './palettes.js';
import { FONT_CSS as FC } from './translations.js';
import { callComparisonAPI } from './api.js';
import { dlS, dlP } from './downloads.js';

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
          <g key={j}>
            <circle cx={cx + 20} cy={178 + j * 30} r="4" fill={color} opacity="0.5" />
            <text x={cx + 30} y={182 + j * 30} fontFamily="Patrick Hand" fontSize="14" fill={pal.t}>{(item || '').slice(0, 30)}</text>
          </g>
        ))}
      </g>);
    })}
    {data.conclusion && (<g>
      <path d={rr(30, H - 58, W - 60, 40, 10, rng, 2)} fill="#fff" stroke={pal.p} strokeWidth="1.5" strokeDasharray="6,4" />
      {Ic('star', 42, H - 52, 18, pal.p)}
      <text x={W / 2} y={H - 32} textAnchor="middle" fontFamily="Caveat" fontSize="15" fontWeight="600" fill={pal.p} fontStyle="italic">{data.conclusion}</text>
    </g>)}
  </svg>);
}

// Wrap text into lines that fit a max width (chars)
function wrapText(str, maxChars) {
  if (!str) return [];
  const words = str.split(' '), lines = [];
  let cur = '';
  words.forEach(w => {
    if ((cur + ' ' + w).trim().length > maxChars && cur) { lines.push(cur.trim()); cur = w; }
    else cur = cur ? cur + ' ' + w : w;
  });
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}

function VennSVG({ data, pal }) {
  const cols = data.columns || [];
  const W = 950, H = 620;
  const seed = (data.title || '').length * 7 + 42, rng = mkR(seed);
  const c1 = gc(pal, cols[0]?.color || 'primary');
  const c2 = gc(pal, cols[1]?.color || 'secondary');

  // Circle geometry
  const r = 195, cx1 = 330, cx2 = 620, cy = 330;
  const overlapX = (cx1 + cx2) / 2; // center of overlap

  return (<svg id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', background: pal.bg, borderRadius: 12 }}>
    <defs>
      <style>{FC}</style>
      <clipPath id="clipLeft"><circle cx={cx1} cy={cy} r={r} /></clipPath>
      <clipPath id="clipRight"><circle cx={cx2} cy={cy} r={r} /></clipPath>
    </defs>
    <rect width={W} height={H} fill={pal.bg} rx="10" />
    <text x={W / 2} y={38} textAnchor="middle" fontFamily="Caveat" fontSize="26" fontWeight="700" fill={pal.t}>{data.title}</text>
    {data.subtitle && <text x={W / 2} y={58} textAnchor="middle" fontFamily="Patrick Hand" fontSize="13" fill={pal.t} opacity="0.5">{data.subtitle}</text>}

    {/* Left circle */}
    <circle cx={cx1} cy={cy} r={r} fill={c1} opacity="0.07" stroke={c1} strokeWidth="2.5" />
    {/* Right circle */}
    <circle cx={cx2} cy={cy} r={r} fill={c2} opacity="0.07" stroke={c2} strokeWidth="2.5" />

    {/* Left label + items (positioned in left exclusive area) */}
    <text x={cx1 - 70} y={cy - r + 50} fontFamily="Caveat" fontSize="20" fontWeight="700" fill={c1}>{cols[0]?.label || 'A'}</text>
    <line x1={cx1 - 120} y1={cy - r + 58} x2={cx1 - 10} y2={cy - r + 58} stroke={c1} strokeWidth="1.5" opacity="0.3" />
    {(cols[0]?.items || []).map((item, j) => {
      const lines = wrapText(item, 18);
      return lines.map((ln, li) => (
        <text key={`${j}-${li}`} x={cx1 - 70} y={cy - r + 82 + j * 42 + li * 18} textAnchor="middle" fontFamily="Patrick Hand" fontSize="13.5" fill={pal.t}>{ln}</text>
      ));
    })}

    {/* Right label + items (positioned in right exclusive area) */}
    <text x={cx2 + 70} y={cy - r + 50} fontFamily="Caveat" fontSize="20" fontWeight="700" fill={c2}>{cols[1]?.label || 'B'}</text>
    <line x1={cx2 + 10} y1={cy - r + 58} x2={cx2 + 120} y2={cy - r + 58} stroke={c2} strokeWidth="1.5" opacity="0.3" />
    {(cols[1]?.items || []).map((item, j) => {
      const lines = wrapText(item, 18);
      return lines.map((ln, li) => (
        <text key={`${j}-${li}`} x={cx2 + 70} y={cy - r + 82 + j * 42 + li * 18} textAnchor="middle" fontFamily="Patrick Hand" fontSize="13.5" fill={pal.t}>{ln}</text>
      ));
    })}

    {/* Shared/overlap items (centered in overlap zone) */}
    {(data.shared || []).length > 0 && (<g>
      <text x={overlapX} y={cy - 60} textAnchor="middle" fontFamily="Caveat" fontSize="15" fontWeight="700" fill={pal.p} opacity="0.7">Gemeinsam</text>
      {(data.shared || []).map((item, j) => {
        const lines = wrapText(item, 16);
        return lines.map((ln, li) => (
          <text key={`s${j}-${li}`} x={overlapX} y={cy - 36 + j * 36 + li * 17} textAnchor="middle" fontFamily="Patrick Hand" fontSize="13" fontWeight="600" fill={pal.p}>{ln}</text>
        ));
      })}
    </g>)}

    {data.conclusion && <text x={W / 2} y={H - 18} textAnchor="middle" fontFamily="Caveat" fontSize="15" fontWeight="600" fill={pal.p} fontStyle="italic">{data.conclusion}</text>}
  </svg>);
}

export default function ComparisonTool({ lang, pal, onBack }) {
  const [topic, setTopic] = useState('');
  const [layout, setLayout] = useState('2col');
  const [data, setData] = useState(null);
  const [genLayout, setGenLayout] = useState(null); // layout used for generation
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [ed, setEd] = useState(false);

  const generate = useCallback(async (overrideLayout) => {
    if (!topic.trim()) return;
    const lay = overrideLayout || layout;
    setLoading(true); setErr(null);
    try {
      const d = await callComparisonAPI(topic, lay, lang);
      setData(d);
      setGenLayout(lay);
      setLayout(lay);
    } catch (e) { setErr(e.message); }
    setLoading(false);
  }, [topic, layout, lang]);

  // Check if current layout matches generated data
  const colCount = (data?.columns || []).length;
  const layoutNeedsCols = layout === '2col' ? 2 : layout === '3col' ? 3 : layout === '4col' ? 4 : 2;
  const layoutMismatch = data && layout !== 'venn' && colCount !== layoutNeedsCols;
  const vennNeedsTwoCols = data && layout === 'venn' && colCount !== 2;

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
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
      <style>{FC}</style>
      <h2 style={{ fontFamily: 'Caveat,cursive', fontSize: 24, color: '#2D2D2D', marginBottom: 12 }}>⚖️ Vergleichsbild</h2>
      {err && <div style={{ padding: 10, background: '#FFF0F0', border: '2px solid #E8584F', borderRadius: 10, marginBottom: 12, fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#E8584F' }}>{err}</div>}
      <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder="z.B. Remote-Arbeit vs. Büroarbeit..."
        style={{ width: '100%', minHeight: 80, padding: 14, borderRadius: 12, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 15, resize: 'vertical', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' }} />
      <div style={{ fontFamily: 'Caveat,cursive', fontSize: 16, fontWeight: 600, color: '#555', marginTop: 12, marginBottom: 6 }}>Layout:</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {[['2col', '2 Spalten'], ['3col', '3 Spalten'], ['4col', '4 Spalten'], ['venn', 'Venn-Diagramm']].map(([k, l]) => (
          <button key={k} onClick={() => setLayout(k)} style={{ padding: '7px 14px', borderRadius: 8, border: layout === k ? '2px solid #3B7DD8' : '2px solid #e0e0e0', background: layout === k ? '#F0F4FF' : '#fff', fontFamily: 'Patrick Hand,cursive', fontSize: 14, cursor: 'pointer', color: '#2D2D2D' }}>{l}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <button onClick={onBack} style={bt2('#888', false)}>← Zurück</button>
        <button onClick={() => generate()} disabled={!topic.trim()} style={bt2(topic.trim() ? '#3B7DD8' : '#ccc', true)}>✨ Erstellen</button>
      </div>
    </div>
  );

  // Determine which SVG to show
  let svg = null;
  let mismatchMsg = null;

  if (layout === 'venn') {
    if (colCount === 2) {
      svg = <VennSVG data={data} pal={pal} />;
    } else {
      mismatchMsg = `Venn-Diagramm braucht genau 2 Spalten — aktuell sind ${colCount} vorhanden.`;
    }
  } else {
    if (colCount === layoutNeedsCols) {
      svg = <ColumnSVG data={data} pal={pal} />;
    } else {
      mismatchMsg = `Dieses Layout braucht ${layoutNeedsCols} Spalten — aktuell sind ${colCount} vorhanden.`;
    }
  }

  return (
    <div>
      <style>{FC}</style>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={onBack} style={bt2('#888', false)}>← Zurück</button>
        <button onClick={() => generate()} style={bt2('#E8584F', false)}>🎲 Neu ({layout})</button>
        <button onClick={() => setEd(e => !e)} style={bt2(ed ? '#E8584F' : '#7B68AE', ed)}>{ed ? '✓ Fertig' : '📝 Bearbeiten'}</button>
        {[['2col', '2 Spalten'], ['3col', '3 Spalten'], ['4col', '4 Spalten'], ['venn', 'Venn']].map(([k, l]) => (
          <button key={k} onClick={() => setLayout(k)} style={{ padding: '6px 10px', borderRadius: 8, border: layout === k ? '2px solid #3B7DD8' : '2px solid #ddd', background: layout === k ? '#E8F0FE' : '#fff', fontFamily: 'Caveat,cursive', fontSize: 14, cursor: 'pointer', color: layout === k ? '#3B7DD8' : '#888' }}>{l}</button>
        ))}
        <button onClick={() => dlS(data.title)} style={bt2('#2E86AB', false)}>SVG</button>
        <button onClick={() => dlP(data.title, pal)} style={bt2('#4CAF50', false)}>PNG</button>
      </div>

      {/* Mismatch warning with regenerate button */}
      {mismatchMsg && (
        <div style={{ maxWidth: 600, margin: '0 auto 14px', padding: '12px 18px', background: '#FFF8E1', border: '2px solid #FFB300', borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#6D4C00', marginBottom: 8 }}>⚠️ {mismatchMsg}</div>
          <button onClick={() => generate(layout)} style={bt2('#FFB300', true)}>🎲 Neu generieren für {layout === 'venn' ? 'Venn (2 Spalten)' : `${layoutNeedsCols} Spalten`}</button>
        </div>
      )}

      {svg && (
        <div style={{ maxWidth: 1100, margin: '0 auto', boxShadow: '0 6px 28px rgba(0,0,0,.1)', borderRadius: 12, overflow: 'auto' }}>{svg}</div>
      )}

      {ed && (
        <div style={{ maxWidth: 700, margin: '16px auto', padding: 16, background: '#fff', borderRadius: 12, border: '2px solid #e0e0e0' }}>
          <input value={data.title} onChange={e => setData(p => ({ ...p, title: e.target.value }))} style={{ ...eS, fontWeight: 700, fontSize: 16, marginBottom: 10 }} />
          {(data.columns || []).map((col, ci) => (
            <div key={ci} style={{ marginBottom: 10, padding: 10, borderRadius: 8, border: `1px solid ${gc(pal, col.color)}30`, background: '#fafafa' }}>
              <input value={col.label} onChange={e => updCol(ci, 'label', e.target.value)} style={{ ...eS, fontWeight: 600, marginBottom: 6 }} />
              {(col.items || []).map((item, ii) => (
                <div key={ii} style={{ paddingLeft: 16, marginBottom: 3 }}>
                  <input value={item} onChange={e => updColItem(ci, ii, e.target.value)} style={{ ...eS }} />
                </div>
              ))}
            </div>
          ))}
          {layout === 'venn' && (
            <div style={{ marginTop: 10, padding: 10, borderRadius: 8, border: '1px solid #ddd', background: '#f8f8ff' }}>
              <div style={{ fontFamily: 'Caveat,cursive', fontSize: 14, fontWeight: 700, color: pal.p, marginBottom: 4 }}>Gemeinsam:</div>
              {(data.shared || []).map((item, i) => (
                <div key={i} style={{ paddingLeft: 16, marginBottom: 3 }}>
                  <input value={item} onChange={e => setData(p => ({ ...p, shared: p.shared.map((x, j) => j === i ? e.target.value : x) }))} style={{ ...eS }} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
