// MindMapTool.jsx — Interactive Mind Map with draggable nodes
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { mkR, rr } from './primitives.js';
import { Ic } from './icons.jsx';
import { gc } from './palettes.js';
import { FONT_CSS as FC } from './translations.js';
import { callMindMapAPI } from './api.js';
import { dlS, dlP } from './downloads.js';

// Calculate initial radial positions for branches + children
function initPositions(data, W, H) {
  const cx = W / 2, cy = H / 2;
  const pos = { center: { x: cx, y: cy } };
  const branches = data.branches || [];
  const n = branches.length || 1;

  branches.forEach((br, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = 220;
    const bx = cx + Math.cos(angle) * r, by = cy + Math.sin(angle) * r;
    pos[`b${i}`] = { x: bx, y: by };

    (br.children || []).forEach((_, j) => {
      const ca = angle + ((j - ((br.children.length - 1) / 2)) * 0.4);
      const cr = 110;
      pos[`b${i}c${j}`] = { x: bx + Math.cos(ca) * cr, y: by + Math.sin(ca) * cr };
    });
  });
  return pos;
}

function InteractiveMindMap({ data, pal, positions, onDrag }) {
  const W = 1100, H = 750;
  const seed = (data.title || '').length * 7 + 42;
  const svgRef = useRef(null);
  const dragRef = useRef(null);

  // Convert screen coords to SVG coords
  const toSVG = useCallback((clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const svgPt = pt.matrixTransform(ctm.inverse());
    return { x: svgPt.x, y: svgPt.y };
  }, []);

  const onPointerDown = useCallback((e, nodeId) => {
    e.preventDefault(); e.stopPropagation();
    const svg = svgRef.current;
    if (svg) svg.setPointerCapture?.(e.pointerId);
    const p = toSVG(e.clientX, e.clientY);
    const np = positions[nodeId] || { x: 0, y: 0 };
    dragRef.current = { id: nodeId, offsetX: np.x - p.x, offsetY: np.y - p.y };
  }, [positions, toSVG]);

  const onPointerMove = useCallback((e) => {
    if (!dragRef.current) return;
    const p = toSVG(e.clientX, e.clientY);
    const { id, offsetX, offsetY } = dragRef.current;
    onDrag(id, p.x + offsetX, p.y + offsetY);
  }, [toSVG, onDrag]);

  const onPointerUp = useCallback(() => { dragRef.current = null; }, []);

  const cp = positions.center || { x: W / 2, y: H / 2 };
  const branches = data.branches || [];

  return (
    <svg ref={svgRef} id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', background: pal.bg, borderRadius: 12, touchAction: 'none', cursor: 'default' }}
      onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
      <defs><style>{FC}</style></defs>
      <rect width={W} height={H} fill={pal.bg} rx="10" />

      {/* Connection lines (behind nodes) */}
      {branches.map((br, i) => {
        const bp = positions[`b${i}`] || { x: 0, y: 0 };
        const col = gc(pal, br.color || 'primary');
        const rng = mkR(seed + i * 77);
        return (
          <g key={`lines${i}`}>
            {/* Center → Branch */}
            <path d={`M${cp.x},${cp.y} Q${(cp.x + bp.x) / 2 + (rng() - 0.5) * 25},${(cp.y + bp.y) / 2 + (rng() - 0.5) * 25} ${bp.x},${bp.y}`}
              fill="none" stroke={col} strokeWidth="3" opacity="0.45" />
            {/* Branch → Children */}
            {(br.children || []).map((_, j) => {
              const chp = positions[`b${i}c${j}`] || { x: 0, y: 0 };
              return (
                <path key={j} d={`M${bp.x},${bp.y} Q${(bp.x + chp.x) / 2 + (rng() - 0.5) * 10},${(bp.y + chp.y) / 2 + (rng() - 0.5) * 10} ${chp.x},${chp.y}`}
                  fill="none" stroke={col} strokeWidth="1.8" opacity="0.3" />
              );
            })}
          </g>
        );
      })}

      {/* Central node (draggable) */}
      <g style={{ cursor: 'grab' }} onPointerDown={e => onPointerDown(e, 'center')}>
        <ellipse cx={cp.x} cy={cp.y} rx="95" ry="44" fill={pal.p} opacity="0.12" stroke={pal.p} strokeWidth="3" />
        <text x={cp.x} y={cp.y + 7} textAnchor="middle" fontFamily="Caveat" fontSize="22" fontWeight="700" fill={pal.t}>{data.title}</text>
      </g>

      {/* Branch nodes (draggable) */}
      {branches.map((br, i) => {
        const bp = positions[`b${i}`] || { x: 0, y: 0 };
        const col = gc(pal, br.color || 'primary');
        return (
          <g key={`br${i}`}>
            {/* Branch label node */}
            <g style={{ cursor: 'grab' }} onPointerDown={e => onPointerDown(e, `b${i}`)}>
              <ellipse cx={bp.x} cy={bp.y} rx="72" ry="24" fill={col} opacity="0.1" stroke={col} strokeWidth="2.5" />
              <text x={bp.x} y={bp.y + 5.5} textAnchor="middle" fontFamily="Caveat" fontSize="16" fontWeight="700" fill={pal.t}>{(br.label || '').slice(0, 24)}</text>
            </g>

            {/* Child leaf nodes (draggable) */}
            {(br.children || []).map((ch, j) => {
              const chp = positions[`b${i}c${j}`] || { x: 0, y: 0 };
              return (
                <g key={j} style={{ cursor: 'grab' }} onPointerDown={e => onPointerDown(e, `b${i}c${j}`)}>
                  <ellipse cx={chp.x} cy={chp.y} rx="58" ry="17" fill="#fff" stroke={col} strokeWidth="1.5" />
                  <text x={chp.x} y={chp.y + 4.5} textAnchor="middle" fontFamily="Patrick Hand" fontSize="12.5" fill={pal.t}>{(ch || '').slice(0, 24)}</text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default function MindMapTool({ lang, pal, baseColor, onBack }) {
  const [topic, setTopic] = useState('');
  const [data, setData] = useState(null);
  const [positions, setPositions] = useState({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [ed, setEd] = useState(false);

  const W = 1100, H = 750;

  const generate = useCallback(async () => {
    if (!topic.trim()) return;
    setLoading(true); setErr(null);
    try {
      const d = await callMindMapAPI(topic, lang);
      setData(d);
      setPositions(initPositions(d, W, H));
    } catch (e) { setErr(e.message); }
    setLoading(false);
  }, [topic, lang]);

  // Drag handler: update single node position
  const handleDrag = useCallback((nodeId, x, y) => {
    setPositions(prev => ({ ...prev, [nodeId]: { x, y } }));
  }, []);

  // Reset layout to radial
  const resetLayout = () => { if (data) setPositions(initPositions(data, W, H)); };

  // Edit handlers
  const updBranch = (i, f, v) => {
    const nd = { ...data, branches: data.branches.map((b, j) => j === i ? { ...b, [f]: v } : b) };
    setData(nd);
  };
  const updChild = (bi, ci, v) => {
    const nd = { ...data, branches: data.branches.map((b, j) => j === bi ? { ...b, children: b.children.map((c, k) => k === ci ? v : c) } : b) };
    setData(nd);
  };
  const addChild = (bi) => {
    const nd = { ...data, branches: data.branches.map((b, j) => j === bi ? { ...b, children: [...b.children, '...'] } : b) };
    setData(nd);
    // Add position for new child
    const bp = positions[`b${bi}`] || { x: W / 2, y: H / 2 };
    const ci = data.branches[bi].children.length;
    const angle = Math.random() * Math.PI * 2;
    setPositions(p => ({ ...p, [`b${bi}c${ci}`]: { x: bp.x + Math.cos(angle) * 100, y: bp.y + Math.sin(angle) * 100 } }));
  };
  const addBranch = () => {
    const bi = data.branches.length;
    const angle = Math.random() * Math.PI * 2;
    const cx = W / 2, cy = H / 2;
    const nd = { ...data, branches: [...data.branches, { label: 'Neuer Ast', color: 'accent', children: ['...'] }] };
    setData(nd);
    const bx = cx + Math.cos(angle) * 220, by = cy + Math.sin(angle) * 220;
    setPositions(p => ({
      ...p,
      [`b${bi}`]: { x: bx, y: by },
      [`b${bi}c0`]: { x: bx + Math.cos(angle) * 100, y: by + Math.sin(angle) * 100 },
    }));
  };

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
      <p style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 13, color: '#999', marginBottom: 10 }}>
        {lang === 'en' ? 'AI generates branches — then drag nodes freely!' : 'KI generiert Äste — danach Knoten frei verschieben!'}
      </p>
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
        <button onClick={resetLayout} style={bt2('#FF9800', false)}>↻ Reset Layout</button>
        <button onClick={() => dlS(data.title)} style={bt2('#2E86AB', false)}>SVG</button>
        <button onClick={() => dlP(data.title, pal)} style={bt2('#4CAF50', false)}>PNG</button>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', boxShadow: '0 6px 28px rgba(0,0,0,.1)', borderRadius: 12, overflow: 'hidden', background: pal.bg }}>
        <InteractiveMindMap data={data} pal={pal} positions={positions} onDrag={handleDrag} />
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
