// ValuesSquareTool.jsx — Wertequadrat with 3 variants
import React, { useState, useCallback } from 'react';
import { mkR, rr, arr } from './primitives.js';
import { Ic } from './icons.jsx';
import { gc } from './palettes.js';
import { FONT_CSS as FC } from './translations.js';
import { callValuesSquareAPI } from './api.js';
import { dlS, dlP } from './downloads.js';

function ValuesSquareSVG({ data, pal, variant }) {
  const W = 900, H = 680;
  const seed = (data.title || '').length * 7 + 42, rng = mkR(seed);
  const q = data.quadrants || [];
  const tl = q.find(x => x.position === 'topLeft') || {};
  const tr = q.find(x => x.position === 'topRight') || {};
  const bl = q.find(x => x.position === 'bottomLeft') || {};
  const br2 = q.find(x => x.position === 'bottomRight') || {};

  const showArrows = variant === 'dialectic';
  const showQuestion = !!data.centralQuestion;
  const qx = [
    { d: tl, x: 60, y: 100, w: 360, h: 200, pos: 'tl' },
    { d: tr, x: 480, y: 100, w: 360, h: 200, pos: 'tr' },
    { d: bl, x: 60, y: 340, w: 360, h: 200, pos: 'bl' },
    { d: br2, x: 480, y: 340, w: 360, h: 200, pos: 'br' },
  ];

  return (<svg id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', background: pal.bg, borderRadius: 12 }}>
    <defs><style>{FC}</style></defs>
    <rect width={W} height={H} fill={pal.bg} rx="10" />
    <path d={rr(6, 6, W - 12, H - 12, 14, rng, 3)} fill="none" stroke={pal.t} strokeWidth="1.5" opacity="0.08" />

    {/* Title */}
    <text x={W / 2} y={42} textAnchor="middle" fontFamily="Caveat" fontSize="26" fontWeight="700" fill={pal.t}>{data.title}</text>
    {/* Labels: positive top, exaggeration bottom */}
    <text x={W / 2} y={90} textAnchor="middle" fontFamily="Patrick Hand" fontSize="13" fill={pal.p} opacity="0.6">✦ positive Werte ✦</text>
    <text x={W / 2} y={330} textAnchor="middle" fontFamily="Patrick Hand" fontSize="13" fill={pal.a || '#999'} opacity="0.6">↓ Übertreibung ↓</text>

    {/* 4 quadrants */}
    {qx.map(({ d: qd, x, y, w, h, pos }) => {
      const col = gc(pal, qd.color || (pos.startsWith('t') ? 'primary' : 'accent'));
      const isBottom = pos.startsWith('b');
      const qRng = mkR(seed + x * 7 + y);
      return (<g key={pos}>
        <path d={rr(x, y, w, h, 14, qRng, 3)} fill={isBottom ? '#fff' : col + '12'} stroke={col} strokeWidth={isBottom ? '1.5' : '2.5'} strokeDasharray={isBottom ? '6,4' : 'none'} />
        <text x={x + w / 2} y={y + 36} textAnchor="middle" fontFamily="Caveat" fontSize="22" fontWeight="700" fill={col}>{(qd.label || '').toUpperCase()}</text>
        <path d={`M${x + 20},${y + 46} L${x + w - 20},${y + 46}`} fill="none" stroke={col} strokeWidth="1.5" opacity="0.25" />
        {qd.description && (() => {
          const words = (qd.description || '').split(' ');
          const lines = []; let cur = '';
          words.forEach(wd => { if ((cur + ' ' + wd).trim().length > 30 && cur) { lines.push(cur.trim()); cur = wd; } else cur = cur ? cur + ' ' + wd : wd; });
          if (cur.trim()) lines.push(cur.trim());
          return lines.slice(0, 4).map((line, li) => (
            <text key={li} x={x + w / 2} y={y + 72 + li * 22} textAnchor="middle" fontFamily="Patrick Hand" fontSize="15" fill={pal.t} opacity={isBottom ? 0.6 : 0.85}>{line}</text>
          ));
        })()}
      </g>);
    })}

    {/* Arrows between quadrants */}
    {showArrows && (() => {
      const tensions = data.tensions || [];
      const posMap = { topLeft: [240, 200], topRight: [660, 200], bottomLeft: [240, 440], bottomRight: [660, 440] };
      return tensions.map((ten, i) => {
        const [fx, fy] = posMap[ten.from] || [0, 0];
        const [tx, ty] = posMap[ten.to] || [0, 0];
        const mx = (fx + tx) / 2, my = (fy + ty) / 2;
        const aRng = mkR(seed + i * 33);
        const isHoriz = Math.abs(fx - tx) > Math.abs(fy - ty);
        return (<g key={i} opacity="0.45">
          {arr(fx, fy, tx, ty, aRng, 8).map((p, j) => (
            <path key={j} d={p} fill="none" stroke={pal.p} strokeWidth="2" strokeLinecap="round" />
          ))}
          {ten.label && <text x={mx} y={my + (isHoriz ? -8 : 4)} textAnchor="middle" fontFamily="Patrick Hand" fontSize="11" fill={pal.p} fontStyle="italic">{ten.label}</text>}
        </g>);
      });
    })()}

    {/* Central question */}
    {showQuestion && variant === 'simple' && (<g>
      <ellipse cx={W / 2} cy={H / 2 - 20} rx="100" ry="30" fill="#fff" stroke={pal.p} strokeWidth="2" />
      <text x={W / 2} y={H / 2 - 14} textAnchor="middle" fontFamily="Caveat" fontSize="15" fontWeight="600" fill={pal.p}>{(data.centralQuestion || '').slice(0, 35)}</text>
    </g>)}

    {/* Footer with central question */}
    {showQuestion && variant !== 'simple' && (
      <text x={W / 2} y={H - 16} textAnchor="middle" fontFamily="Caveat" fontSize="15" fontWeight="600" fill={pal.p} fontStyle="italic">{data.centralQuestion}</text>
    )}
  </svg>);
}

export default function ValuesSquareTool({ lang, pal, onBack }) {
  const [topic, setTopic] = useState('');
  const [variant, setVariant] = useState('classic');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [ed, setEd] = useState(false);

  const generate = useCallback(async () => {
    if (!topic.trim()) return;
    setLoading(true); setErr(null);
    try { const d = await callValuesSquareAPI(topic, variant, lang); setData(d); }
    catch (e) { setErr(e.message); }
    setLoading(false);
  }, [topic, variant, lang]);

  const updQ = (pos, f, v) => setData(p => ({ ...p, quadrants: p.quadrants.map(q => q.position === pos ? { ...q, [f]: v } : q) }));

  const eS = { width: '100%', padding: '7px 10px', borderRadius: 8, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#FAFAFA' };
  const bt2 = (c, f) => ({ padding: '8px 14px', borderRadius: 10, border: f ? 'none' : `2px solid ${c}`, background: f ? c : '#fff', color: f ? '#fff' : c, fontFamily: 'Caveat,cursive', fontSize: 15, fontWeight: 600, cursor: 'pointer' });

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <style>{FC}</style>
      <div style={{ width: 40, height: 40, border: '4px solid #e0e0f0', borderTop: '4px solid #7B68AE', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
      <div style={{ fontFamily: 'Caveat,cursive', fontSize: 18, color: '#7B68AE', marginTop: 12 }}>Wertequadrat wird erstellt...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  if (!data) return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
      <style>{FC}</style>
      <h2 style={{ fontFamily: 'Caveat,cursive', fontSize: 24, color: '#2D2D2D', marginBottom: 12 }}>◈ Wertequadrat</h2>
      {err && <div style={{ padding: 10, background: '#FFF0F0', border: '2px solid #E8584F', borderRadius: 10, marginBottom: 12, fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#E8584F' }}>{err}</div>}
      <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder="z.B. Sparsamkeit vs. Großzügigkeit..."
        style={{ width: '100%', minHeight: 80, padding: 14, borderRadius: 12, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 15, resize: 'vertical', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' }} />
      <div style={{ fontFamily: 'Caveat,cursive', fontSize: 16, fontWeight: 600, color: '#555', marginTop: 12, marginBottom: 6 }}>Variante:</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {[['classic', 'Klassisch (2×2)'], ['dialectic', 'Mit Dialektik-Pfeilen'], ['simple', 'Einfach + Leitfrage']].map(([k, l]) => (
          <button key={k} onClick={() => setVariant(k)} style={{ padding: '7px 14px', borderRadius: 8, border: variant === k ? '2px solid #7B68AE' : '2px solid #e0e0e0', background: variant === k ? '#F5F0FF' : '#fff', fontFamily: 'Patrick Hand,cursive', fontSize: 14, cursor: 'pointer', color: '#2D2D2D' }}>{l}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <button onClick={onBack} style={bt2('#888', false)}>← Zurück</button>
        <button onClick={generate} disabled={!topic.trim()} style={bt2(topic.trim() ? '#7B68AE' : '#ccc', true)}>✨ Erstellen</button>
      </div>
    </div>
  );

  return (
    <div>
      <style>{FC}</style>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={onBack} style={bt2('#888', false)}>← Zurück</button>
        <button onClick={generate} style={bt2('#E8584F', false)}>🎲 Neu</button>
        <button onClick={() => setEd(e => !e)} style={bt2(ed ? '#E8584F' : '#7B68AE', ed)}>{ed ? '✓ Fertig' : '📝 Bearbeiten'}</button>
        {[['classic', 'Klassisch'], ['dialectic', 'Dialektik'], ['simple', 'Einfach']].map(([k, l]) => (
          <button key={k} onClick={() => setVariant(k)} style={{ padding: '6px 10px', borderRadius: 8, border: variant === k ? '2px solid #7B68AE' : '2px solid #ddd', background: variant === k ? '#F0EAFE' : '#fff', fontFamily: 'Caveat,cursive', fontSize: 14, cursor: 'pointer', color: variant === k ? '#7B68AE' : '#888' }}>{l}</button>
        ))}
        <button onClick={() => dlS(data.title)} style={bt2('#2E86AB', false)}>SVG</button>
        <button onClick={() => dlP(data.title, pal)} style={bt2('#4CAF50', false)}>PNG</button>
      </div>
      <div style={{ maxWidth: 950, margin: '0 auto', boxShadow: '0 6px 28px rgba(0,0,0,.1)', borderRadius: 12, overflow: 'auto' }}>
        <ValuesSquareSVG data={data} pal={pal} variant={variant} />
      </div>
      {ed && (
        <div style={{ maxWidth: 700, margin: '16px auto', padding: 16, background: '#fff', borderRadius: 12, border: '2px solid #e0e0e0' }}>
          <input value={data.title} onChange={e => setData(p => ({ ...p, title: e.target.value }))} style={{ ...eS, fontWeight: 700, fontSize: 16, marginBottom: 8 }} />
          <input value={data.centralQuestion || ''} onChange={e => setData(p => ({ ...p, centralQuestion: e.target.value }))} placeholder="Leitfrage..." style={{ ...eS, marginBottom: 12, fontStyle: 'italic' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map(pos => {
              const qd = (data.quadrants || []).find(q => q.position === pos) || {};
              const isTop = pos.startsWith('top');
              return (
                <div key={pos} style={{ padding: 10, borderRadius: 8, border: `1px solid ${isTop ? '#dde' : '#eee'}`, background: isTop ? '#fafbff' : '#fafafa' }}>
                  <div style={{ fontFamily: 'Caveat,cursive', fontSize: 12, color: '#999', marginBottom: 4 }}>{isTop ? '✦ Positiv' : '↓ Übertreibung'}</div>
                  <input value={qd.label || ''} onChange={e => updQ(pos, 'label', e.target.value)} style={{ ...eS, fontWeight: 600, marginBottom: 4 }} />
                  <textarea value={qd.description || ''} onChange={e => updQ(pos, 'description', e.target.value)} style={{ ...eS, minHeight: 50, resize: 'vertical' }} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
