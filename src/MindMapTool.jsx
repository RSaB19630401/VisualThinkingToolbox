// MindMapTool.jsx — Mind Map generator + editor with drag, import/export, delete, undo
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { mkR } from './primitives.js';
import { gc } from './palettes.js';
import { FONT_CSS as FC, T } from './translations.js';
import { callMindMapAPI } from './api.js';
import { dlS, dlP } from './downloads.js';
import { saveLast, loadLast, lastAge } from './storage.js';

function dlB(b, n) {
  const u = URL.createObjectURL(b);
  const a = Object.assign(document.createElement('a'), { href: u, download: n });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}

// Convert screen coords to SVG coords
function svgPt(svgEl, clientX, clientY) {
  const pt = svgEl.createSVGPoint();
  pt.x = clientX; pt.y = clientY;
  return pt.matrixTransform(svgEl.getScreenCTM().inverse());
}

function MindMapSVG({ data, pal, offsets, onDragStart }) {
  const W = 1100, H = 750, cx = W / 2, cy = H / 2;
  const seed = (data.title || '').length * 7 + 42;
  const branches = data.branches || [];
  const n = branches.length || 1;

  return (
    <svg id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', background: pal.bg, borderRadius: 12, cursor: 'default' }}>
      <defs><style>{FC}</style></defs>
      <rect width={W} height={H} fill={pal.bg} rx="10" />

      {/* Central node — draggable */}
      <g style={{ cursor: 'grab' }}
        onMouseDown={e => onDragStart(e, 'center', -1, -1)}
        onTouchStart={e => onDragStart(e, 'center', -1, -1)}>
        <ellipse cx={cx + (offsets.center?.dx || 0)} cy={cy + (offsets.center?.dy || 0)}
          rx="90" ry="42" fill={pal.p} opacity="0.12" stroke={pal.p} strokeWidth="3" />
        <text x={cx + (offsets.center?.dx || 0)} y={cy + (offsets.center?.dy || 0) + 6}
          textAnchor="middle" fontFamily="Caveat" fontSize="22" fontWeight="700" fill={pal.t}>{data.title}</text>
      </g>

      {/* Branches */}
      {branches.map((br, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const r2 = 260;
        const baseBx = cx + Math.cos(angle) * r2;
        const baseBy = cy + Math.sin(angle) * r2;
        const bx = baseBx + (offsets[`b${i}`]?.dx || 0);
        const by = baseBy + (offsets[`b${i}`]?.dy || 0);
        const cxOff = cx + (offsets.center?.dx || 0);
        const cyOff = cy + (offsets.center?.dy || 0);
        const col = gc(pal, br.color || 'primary');
        const brRng = mkR(seed + i * 77);
        const children = br.children || [];

        return (
          <g key={i}>
            {/* Branch line from center to branch */}
            <path d={`M${cxOff},${cyOff} Q${(cxOff + bx) / 2 + (brRng() - 0.5) * 30},${(cyOff + by) / 2 + (brRng() - 0.5) * 30} ${bx},${by}`}
              fill="none" stroke={col} strokeWidth="3" opacity="0.5" />

            {/* Branch node — draggable */}
            <g style={{ cursor: 'grab' }}
              onMouseDown={e => onDragStart(e, 'branch', i, -1)}
              onTouchStart={e => onDragStart(e, 'branch', i, -1)}>
              <ellipse cx={bx} cy={by} rx="70" ry="22" fill={col} opacity="0.1" stroke={col} strokeWidth="2.5" />
              <text x={bx} y={by + 5} textAnchor="middle" fontFamily="Caveat" fontSize="16" fontWeight="700" fill={pal.t}>{(br.label || '').slice(0, 22)}</text>
            </g>

            {/* Children */}
            {children.map((ch, j) => {
              const ca = angle + ((j - (children.length - 1) / 2) * 0.35);
              const cr = 90;
              const baseChx = bx + Math.cos(ca) * cr;
              const baseChy = by + Math.sin(ca) * cr;
              const chx = baseChx + (offsets[`c${i}_${j}`]?.dx || 0);
              const chy = baseChy + (offsets[`c${i}_${j}`]?.dy || 0);
              return (
                <g key={j}>
                  <path d={`M${bx},${by} Q${(bx + chx) / 2 + (brRng() - 0.5) * 12},${(by + chy) / 2 + (brRng() - 0.5) * 12} ${chx},${chy}`}
                    fill="none" stroke={col} strokeWidth="1.8" opacity="0.35" />
                  <g style={{ cursor: 'grab' }}
                    onMouseDown={e => onDragStart(e, 'child', i, j)}
                    onTouchStart={e => onDragStart(e, 'child', i, j)}>
                    <ellipse cx={chx} cy={chy} rx="55" ry="16" fill="#fff" stroke={col} strokeWidth="1.5" />
                    <text x={chx} y={chy + 4.5} textAnchor="middle" fontFamily="Patrick Hand" fontSize="12.5" fill={pal.t}>{(ch || '').slice(0, 22)}</text>
                  </g>
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
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [ed, setEd] = useState(false);
  const [fs, setFs] = useState(false);
  const [offsets, setOffsets] = useState({});
  const undoRef = useRef(null);
  const fileRef = useRef(null);
  const dragRef = useRef(null);
  const svgRef = useRef(null);
  const t = T[lang] || T.de;

  // Persistenz: letzten Stand speichern (#8)
  useEffect(() => {
    if (data) saveLast('mindmap', { topic, data, offsets });
  }, [data, offsets]);

  const saveUndo = () => { undoRef.current = { data: JSON.parse(JSON.stringify(data)), offsets: { ...offsets } }; };
  const undo = () => { if (undoRef.current) { setData(undoRef.current.data); setOffsets(undoRef.current.offsets); undoRef.current = null; } };
  const withUndo = (fn) => setData(prev => { if (!prev) return prev; undoRef.current = { data: JSON.parse(JSON.stringify(prev)), offsets: { ...offsets } }; const d = JSON.parse(JSON.stringify(prev)); fn(d); return d; });

  const generate = useCallback(async () => {
    if (!topic.trim()) return;
    setLoading(true); setErr(null); setOffsets({});
    try { const d = await callMindMapAPI(topic, lang); setData(d); }
    catch (e) { setErr(e.message); }
    setLoading(false);
  }, [topic, lang]);

  // ── Drag handling ──
  const onDragStart = useCallback((e, type, bi, ci) => {
    e.preventDefault(); e.stopPropagation();
    const svgEl = document.getElementById('sketchnote-svg');
    if (!svgEl) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const startPt = svgPt(svgEl, clientX, clientY);
    const key = type === 'center' ? 'center' : type === 'branch' ? `b${bi}` : `c${bi}_${ci}`;
    const startOff = { dx: offsets[key]?.dx || 0, dy: offsets[key]?.dy || 0 };
    saveUndo();
    dragRef.current = { key, startPt, startOff, svgEl };
  }, [offsets]);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current) return;
      const { key, startPt, startOff, svgEl } = dragRef.current;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const pt = svgPt(svgEl, clientX, clientY);
      setOffsets(prev => ({ ...prev, [key]: { dx: startOff.dx + (pt.x - startPt.x), dy: startOff.dy + (pt.y - startPt.y) } }));
    };
    const onEnd = () => { dragRef.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, []);

  // ── Edit helpers ──
  const updBranch = (i, f, v) => withUndo(d => { d.branches[i][f] = v; });
  const updChild = (bi, ci, v) => withUndo(d => { d.branches[bi].children[ci] = v; });
  const addChild = (bi) => withUndo(d => { d.branches[bi].children.push('...'); });
  const delChild = (bi, ci) => withUndo(d => { d.branches[bi].children.splice(ci, 1); });
  const addBranch = () => withUndo(d => { d.branches.push({ label: 'Neuer Ast', color: ['primary', 'secondary', 'accent'][d.branches.length % 3], children: ['...'] }); });
  const delBranch = (i) => withUndo(d => { d.branches.splice(i, 1); });
  const updTitle = (v) => withUndo(d => { d.title = v; });
  const resetPositions = () => { saveUndo(); setOffsets({}); };

  // ── JSON Export/Import ──
  const exportJSON = () => {
    if (!data) return;
    const sl = (data.title || 'mindmap').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    dlB(new Blob([JSON.stringify({ v: 2, tool: 'mindmap', topic, data, offsets, at: new Date().toISOString() }, null, 2)], { type: 'application/json' }), `mm-${sl}.json`);
  };
  const importJSON = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const j = JSON.parse(ev.target.result);
        if (j.data?.title && j.data?.branches) { setData(j.data); setTopic(j.topic || j.data.title); setOffsets(j.offsets || {}); }
        else if (j.title && j.branches) { setData(j); setTopic(j.title); setOffsets({}); }
        else throw new Error('Ungültiges Format');
      } catch (err2) { setErr('Import fehlgeschlagen: ' + err2.message); }
    };
    reader.readAsText(f); e.target.value = '';
  };

  const bt2 = (c, f) => ({ padding: '8px 14px', borderRadius: 10, border: f ? 'none' : `2px solid ${c}`, background: f ? c : '#fff', color: f ? '#fff' : c, fontFamily: 'Caveat,cursive', fontSize: 15, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' });
  const eS = { width: '100%', padding: '7px 10px', borderRadius: 8, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#FAFAFA' };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <style>{FC}</style>
      <div style={{ width: 40, height: 40, border: '4px solid #f0e0e0', borderTop: '4px solid #3B7DD8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
      <div style={{ fontFamily: 'Caveat,cursive', fontSize: 18, color: '#3B7DD8', marginTop: 12 }}>Mind Map wird erstellt...</div>
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
      <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
        <button onClick={onBack} style={bt2('#888', false)}>← Zurück</button>
        <button onClick={generate} disabled={!topic.trim()} style={bt2(topic.trim() ? '#3B7DD8' : '#ccc', true)}>✨ Erstellen</button>
        <button onClick={() => fileRef.current?.click()} style={bt2('#F5A623', false)}>📂 Laden</button>
        {loadLast('mindmap') && (
          <button onClick={() => { const l = loadLast('mindmap'); if (l?.data) { setData(l.data); setTopic(l.topic || ''); setOffsets(l.offsets || {}); } }} style={bt2('#8B6544', false)}>
            ↩ Letzter Stand {lastAge('mindmap', lang) ? `(${lastAge('mindmap', lang)})` : ''}
          </button>
        )}
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={importJSON} />
      </div>
    </div>
  );

  if (fs) return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#fff', zIndex: 9999, overflow: 'auto' }}>
      <style>{FC}</style>
      <button onClick={() => setFs(false)} style={{ position: 'fixed', top: 12, right: 12, zIndex: 10000, ...bt2('#E8584F', true), fontSize: 18 }}>✕ Schließen</button>
      <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
        <div style={{ width: '100%', maxWidth: 1200, touchAction: 'none' }}>
          <MindMapSVG data={data} pal={pal} offsets={offsets} onDragStart={onDragStart} />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <style>{FC}</style>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={onBack} style={bt2('#888', false)}>← Zurück</button>
        <button onClick={generate} style={bt2('#3B7DD8', false)}>🎲 Neu</button>
        <button onClick={undo} disabled={!undoRef.current} style={bt2(undoRef.current ? '#E8584F' : '#ccc', false)}>↩ Undo</button>
        <button onClick={() => setEd(e => !e)} style={bt2(ed ? '#E8584F' : '#7B68AE', ed)}>{ed ? '✓ Fertig' : '📝 Bearbeiten'}</button>
        <button onClick={resetPositions} style={bt2('#888', false)}>↺ Reset Position</button>
        <button onClick={() => setFs(true)} style={bt2('#555', false)}>⛶ Vollbild</button>
        <button onClick={() => dlS(data.title)} style={bt2('#2E86AB', false)}>SVG</button>
        <button onClick={() => dlP(data.title, pal)} style={bt2('#4CAF50', false)}>PNG</button>
        <button onClick={exportJSON} style={bt2('#F5A623', false)}>💾 JSON</button>
        <button onClick={() => fileRef.current?.click()} style={bt2('#8B6544', false)}>📂 Laden</button>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={importJSON} />
      </div>
      <p style={{ textAlign: 'center', fontFamily: 'Patrick Hand,cursive', fontSize: 13, color: '#aaa', margin: '0 0 8px' }}>
        {lang === 'en' ? 'Drag nodes to rearrange' : 'Knoten ziehen zum Verschieben'}
      </p>
      <div style={{ maxWidth: 1100, margin: '0 auto', boxShadow: '0 6px 28px rgba(0,0,0,.1)', borderRadius: 12, overflow: 'hidden', touchAction: 'none' }}>
        <MindMapSVG data={data} pal={pal} offsets={offsets} onDragStart={onDragStart} />
      </div>
      {ed && (
        <div style={{ maxWidth: 700, margin: '16px auto', padding: 16, background: '#fff', borderRadius: 12, border: '2px solid #e0e0e0' }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontFamily: 'Caveat,cursive', fontSize: 14, color: '#888' }}>Zentrales Thema</label>
            <input value={data.title} onChange={e => updTitle(e.target.value)} style={{ ...eS, fontWeight: 700, fontSize: 16 }} />
          </div>
          {data.branches.map((br, bi) => (
            <div key={bi} style={{ marginBottom: 10, padding: 10, borderRadius: 8, border: `1px solid ${gc(pal, br.color || 'primary')}40`, background: '#fafafa' }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                <input value={br.label} onChange={e => updBranch(bi, 'label', e.target.value)} style={{ ...eS, flex: 1, fontWeight: 600 }} />
                <select value={br.color || 'primary'} onChange={e => updBranch(bi, 'color', e.target.value)} style={{ ...eS, width: 100, flex: 'none' }}>
                  <option value="primary">Primär</option><option value="secondary">Sekundär</option><option value="accent">Akzent</option>
                </select>
                <button onClick={() => delBranch(bi)} style={{ background: 'none', border: 'none', color: '#E8584F', cursor: 'pointer', fontSize: 18 }} title="Ast löschen">✕</button>
              </div>
              {br.children.map((ch, ci) => (
                <div key={ci} style={{ display: 'flex', gap: 6, marginBottom: 3, paddingLeft: 20, alignItems: 'center' }}>
                  <input value={ch} onChange={e => updChild(bi, ci, e.target.value)} style={{ ...eS, flex: 1 }} />
                  <button onClick={() => delChild(bi, ci)} style={{ background: 'none', border: 'none', color: '#E8584F', cursor: 'pointer', fontSize: 16 }} title="Löschen">✕</button>
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
