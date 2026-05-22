// MindMapTool.jsx — Mind Map generator + editor
import React, { useState, useCallback } from 'react';
import { mkR, rr } from './primitives.js';
import { Ic } from './icons.jsx';
import { gc } from './palettes.js';
import { FONT_CSS as FC, T } from './translations.js';
import { callMindMapAPI } from './api.js';
import { dlS, dlP, dlJ } from './downloads.js';

function MindMapSVG({ data, pal }) {
  const W = 1100, H = 750, cx = W / 2, cy = H / 2;
  const seed = (data.title || '').length * 7 + 42, rng = mkR(seed);
  const branches = data.branches || [];
  const n = branches.length || 1;

  return (<svg id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', background: pal.bg, borderRadius: 12 }}>
    <defs><style>{FC}</style></defs>
    <rect width={W} height={H} fill={pal.bg} rx="10" />

    {/* Central node */}
    <ellipse cx={cx} cy={cy} rx="90" ry="42" fill={pal.p} opacity="0.12" stroke={pal.p} strokeWidth="3" />
    <text x={cx} y={cy + 6} textAnchor="middle" fontFamily="Caveat" fontSize="22" fontWeight="700" fill={pal.t}>{data.title}</text>

    {/* Branches */}
    {branches.map((br, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const r1 = 130, r2 = 260;
      const bx = cx + Math.cos(angle) * r1, by = cy + Math.sin(angle) * r1;
      const bx2 = cx + Math.cos(angle) * r2, by2 = cy + Math.sin(angle) * r2;
      const col = gc(pal, br.color || 'primary');
      const brRng = mkR(seed + i * 77);
      const children = br.children || [];

      return (<g key={i}>
        {/* Branch line */}
        <path d={`M${cx},${cy} Q${(cx + bx2) / 2 + (brRng() - 0.5) * 30},${(cy + by2) / 2 + (brRng() - 0.5) * 30} ${bx2},${by2}`}
          fill="none" stroke={col} strokeWidth="3" opacity="0.5" />

        {/* Branch node */}
        <ellipse cx={bx2} cy={by2} rx="70" ry="22" fill={col} opacity="0.1" stroke={col} strokeWidth="2.5" />
        <text x={bx2} y={by2 + 5} textAnchor="middle" fontFamily="Caveat" fontSize="16" fontWeight="700" fill={pal.t}>{(br.label || '').slice(0, 22)}</text>

        {/* Children */}
        {children.map((ch, j) => {
          const ca = angle + ((j - (children.length - 1) / 2) * 0.35);
          const cr = 90;
          const chx = bx2 + Math.cos(ca) * cr, chy = by2 + Math.sin(ca) * cr;
          return (<g key={j}>
            <path d={`M${bx2},${by2} Q${(bx2 + chx) / 2 + (brRng() - 0.5) * 12},${(by2 + chy) / 2 + (brRng() - 0.5) * 12} ${chx},${chy}`}
              fill="none" stroke={col} strokeWidth="1.8" opacity="0.35" />
            <ellipse cx={chx} cy={chy} rx="55" ry="16" fill="#fff" stroke={col} strokeWidth="1.5" />
            <text x={chx} y={chy + 4.5} textAnchor="middle" fontFamily="Patrick Hand" fontSize="12.5" fill={pal.t}>{(ch || '').slice(0, 22)}</text>
          </g>);
        })}
      </g>);
    })}
  </svg>);
}

export default function MindMapTool({ lang, pal, baseColor, onBack }) {
  const [topic, setTopic] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [ed, setEd] = useState(false);
  const t = T[lang] || T.de;

  const generate = useCallback(async () => {
    if (!topic.trim()) return;
    setLoading(true); setErr(null);
    try { const d = await callMindMapAPI(topic, lang); setData(d); }
    catch (e) { setErr(e.message); }
    setLoading(false);
  }, [topic, lang]);

  const updBranch = (i, f, v) => setData(p => ({ ...p, branches: p.branches.map((b, j) => j === i ? { ...b, [f]: v } : b) }));
  const updChild = (bi, ci, v) => setData(p => ({ ...p, branches: p.branches.map((b, j) => j === bi ? { ...b, children: b.children.map((c, k) => k === ci ? v : c) } : b) }));
  const addChild = (bi) => setData(p => ({ ...p, branches: p.branches.map((b, j) => j === bi ? { ...b, children: [...b.children, '...'] } : b) }));
  const addBranch = () => setData(p => ({ ...p, branches: [...p.branches, { label: 'Neuer Ast', color: 'accent', children: ['...'] }] }));

  const eS = { width: '100%', padding: '7px 10px', borderRadius: 8, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#FAFAFA' };
  const bt2 = (c, f) => ({ padding: '8px 14px', borderRadius: 10, border: f ? 'none' : `2px solid ${c}`, background: f ? c : '#fff', color: f ? '#fff' : c, fontFamily: 'Caveat,cursive', fontSize: 15, fontWeight: 600, cursor: 'pointer' });

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <style>{FC}</style>
      <div style={{ width: 40, height: 40, border: '4px solid #f0e0e0', borderTop: '4px solid #E8584F', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
      <div style={{ fontFamily: 'Caveat,cursive', fontSize: 18, color: '#E8584F', marginTop: 12 }}>Mind Map wird erstellt...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  if (!data) return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
      <style>{FC}</style>
      <h2 style={{ fontFamily: 'Caveat,cursive', fontSize: 24, color: '#2D2D2D', marginBottom: 12 }}>🧠 Mind Map</h2>
      {err && <div style={{ padding: 10, background: '#FFF0F0', border: '2px solid #E8584F', borderRadius: 10, marginBottom: 12, fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#E8584F' }}>{err}</div>}
      <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder={lang === 'en' ? 'Describe your topic...' : 'Beschreibe dein Thema...'}
        style={{ width: '100%', minHeight: 100, padding: 14, borderRadius: 12, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 15, resize: 'vertical', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' }} />
      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <button onClick={onBack} style={bt2('#888', false)}>← Zurück</button>
        <button onClick={generate} disabled={!topic.trim()} style={bt2(topic.trim() ? '#3B7DD8' : '#ccc', true)}>✨ Erstellen</button>
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
        <button onClick={() => dlS(data.title)} style={bt2('#2E86AB', false)}>SVG</button>
        <button onClick={() => dlP(data.title, pal)} style={bt2('#4CAF50', false)}>PNG</button>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', boxShadow: '0 6px 28px rgba(0,0,0,.1)', borderRadius: 12, overflow: 'auto' }}>
        <MindMapSVG data={data} pal={pal} />
      </div>
      {ed && (
        <div style={{ maxWidth: 700, margin: '16px auto', padding: 16, background: '#fff', borderRadius: 12, border: '2px solid #e0e0e0' }}>
          <input value={data.title} onChange={e => setData(p => ({ ...p, title: e.target.value }))} style={{ ...eS, fontWeight: 700, fontSize: 16, marginBottom: 12 }} />
          {data.branches.map((br, bi) => (
            <div key={bi} style={{ marginBottom: 10, padding: 10, borderRadius: 8, border: '1px solid #eee', background: '#fafafa' }}>
              <input value={br.label} onChange={e => updBranch(bi, 'label', e.target.value)} style={{ ...eS, fontWeight: 600, marginBottom: 6 }} />
              {br.children.map((ch, ci) => (
                <div key={ci} style={{ display: 'flex', gap: 6, marginBottom: 3, paddingLeft: 20 }}>
                  <input value={ch} onChange={e => updChild(bi, ci, e.target.value)} style={{ ...eS, flex: 1 }} />
                </div>
              ))}
              <button onClick={() => addChild(bi)} style={{ marginLeft: 20, background: 'none', border: 'none', color: '#3B7DD8', cursor: 'pointer', fontFamily: 'Patrick Hand,cursive', fontSize: 13 }}>+ Unterpunkt</button>
            </div>
          ))}
          <button onClick={addBranch} style={{ background: 'none', border: 'none', color: '#4CAF50', cursor: 'pointer', fontFamily: 'Caveat,cursive', fontSize: 15 }}>+ Ast hinzufügen</button>
        </div>
      )}
    </div>
  );
}
