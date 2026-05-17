// MindMapTool.jsx — Interactive Mind-Map with AI generation
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FONT_CSS, mkR, rr, ln } from './primitives.js';
import { Ic } from './icons.jsx';
import { PAL, gc } from './palettes.js';

// ═══════════════════════════════════════
// TRANSLATIONS (mind-map specific)
// ═══════════════════════════════════════
const MT = {
  de: {
    title: 'Mind-Map Generator', sub: 'KI-generiert · Interaktiv · Bikablo oder Clean',
    inputTitle: 'Thema für deine Mind-Map', inputHint: 'KI erstellt Äste und Verzweigungen automatisch.',
    inputPh: 'z.B. Projektplanung App-Launch, Lernstrategie Mathematik, Marketingkanäle...',
    create: '✨ Generieren', loading: 'Mind-Map wird erstellt...',
    neu: '← Neu', reroll: '🎲 Neu generieren',
    bikablo: '✏️ Bikablo', clean: '📐 Clean',
    addChild: '+ Ast', del: '✕', edit: '✎', collapse: '−', expand: '+',
    fullscreen: '⛶ Vollbild', exitFs: '✕ Schließen', save: '💾 JSON',
    root: 'Hauptthema', branch: 'Neuer Ast', sub: 'Unterpunkt',
    clickToEdit: 'Klick = Bearbeiten · Doppelklick = Zuklappen · Ziehen = Verschieben',
    apiLang: 'Deutsch',
  },
  en: {
    title: 'Mind-Map Generator', sub: 'AI-generated · Interactive · Bikablo or Clean',
    inputTitle: 'Topic for your mind map', inputHint: 'AI creates branches and sub-branches automatically.',
    inputPh: 'e.g. Project planning app launch, Learning strategy mathematics, Marketing channels...',
    create: '✨ Generate', loading: 'Creating mind map...',
    neu: '← New', reroll: '🎲 Regenerate',
    bikablo: '✏️ Bikablo', clean: '📐 Clean',
    addChild: '+ Branch', del: '✕', edit: '✎', collapse: '−', expand: '+',
    fullscreen: '⛶ Fullscreen', exitFs: '✕ Close', save: '💾 JSON',
    root: 'Main topic', branch: 'New branch', sub: 'Sub-item',
    clickToEdit: 'Click = Edit · Double-click = Collapse · Drag = Move',
    apiLang: 'English',
  },
  ru: {
    title: 'Генератор Майнд-Карт', sub: 'ИИ-генерация · Интерактив · Бикабло или Чистый',
    inputTitle: 'Тема для майнд-карты', inputHint: 'ИИ автоматически создаст ветви.',
    inputPh: 'напр. Планирование проекта, Стратегия обучения, Маркетинговые каналы...',
    create: '✨ Создать', loading: 'Создание майнд-карты...',
    neu: '← Новый', reroll: '🎲 Заново',
    bikablo: '✏️ Бикабло', clean: '📐 Чистый',
    addChild: '+ Ветвь', del: '✕', edit: '✎', collapse: '−', expand: '+',
    fullscreen: '⛶ Полный экран', exitFs: '✕ Закрыть', save: '💾 JSON',
    root: 'Главная тема', branch: 'Новая ветвь', sub: 'Подпункт',
    clickToEdit: 'Клик = Редактировать · Двойной клик = Свернуть · Тащить = Двигать',
    apiLang: 'Russian',
  },
};

// ═══════════════════════════════════════
// TREE UTILITIES
// ═══════════════════════════════════════
let _idCounter = 0;
const uid = () => `n${++_idCounter}`;

function buildNode(label, color = 'primary', children = []) {
  return { id: uid(), label, color, collapsed: false, x: 0, y: 0, children };
}

function findNode(tree, id) {
  if (tree.id === id) return tree;
  for (const c of tree.children) { const r = findNode(c, id); if (r) return r; }
  return null;
}

function findParent(tree, id) {
  for (const c of tree.children) {
    if (c.id === id) return tree;
    const r = findParent(c, id);
    if (r) return r;
  }
  return null;
}

function deepClone(tree) { return JSON.parse(JSON.stringify(tree)); }

function countDescendants(node) {
  if (!node.children?.length) return 0;
  return node.children.length + node.children.reduce((s, c) => s + countDescendants(c), 0);
}

// ═══════════════════════════════════════
// RADIAL LAYOUT
// ═══════════════════════════════════════
const LEVEL_RADIUS = [0, 200, 160, 130, 110];

function layoutRadial(node, cx, cy, startAngle, endAngle, level) {
  node.x = cx;
  node.y = cy;
  if (node.collapsed || !node.children?.length) return;
  const kids = node.children;
  const r = LEVEL_RADIUS[Math.min(level + 1, LEVEL_RADIUS.length - 1)];
  const span = endAngle - startAngle;
  const step = span / kids.length;
  kids.forEach((child, i) => {
    const angle = startAngle + step * (i + 0.5);
    const nx = cx + r * Math.cos(angle);
    const ny = cy + r * Math.sin(angle);
    layoutRadial(child, nx, ny, angle - step * 0.45, angle + step * 0.45, level + 1);
  });
}

function applyLayout(tree) {
  layoutRadial(tree, 0, 0, -Math.PI, Math.PI, 0);
  return tree;
}

// ═══════════════════════════════════════
// AI GENERATION
// ═══════════════════════════════════════
const COLORS = ['primary', 'secondary', 'accent'];

async function generateMindMap(topic, lang = 'de') {
  const tLang = MT[lang]?.apiLang || 'Deutsch';
  const sys = `Du bist ein Mind-Map-Experte. Erstelle eine Mind-Map als reines JSON. Keine Backticks, kein Text.
Format: {"topic":"Hauptthema","branches":[{"label":"Ast (max 20 Zeichen)","color":"primary|secondary|accent","sub":[{"label":"Unterast","sub":[]}]}]}
Regeln: 4-7 Hauptäste, je 2-4 Unteräste, Unteräste können 1-2 weitere Ebenen haben.
Labels kurz (max 20 Zeichen)! Farben abwechseln: primary, secondary, accent.
WICHTIG: Alle Texte in ${tLang} schreiben!`;
  const usr = `THEMA: ${topic}\nJSON:`;

  const apiUrl = import.meta.env?.VITE_API_URL || '/api/generate';
  const res = await fetch(apiUrl, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514', max_tokens: 2000,
      system: sys, messages: [{ role: 'user', content: usr }],
    }),
  });
  if (!res.ok) throw new Error(`API-Fehler ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const text = (data.content || []).map(b => b.text || '').join('');
  const cl = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  let p;
  try { p = JSON.parse(cl); } catch { const mt = cl.match(/\{[\s\S]*\}/); if (mt) p = JSON.parse(mt[0]); else throw new Error('JSON-Fehler'); }

  // Convert API response to tree
  _idCounter = 0;
  function conv(b) {
    return buildNode(b.label || '?', b.color || 'primary', (b.sub || []).map(conv));
  }
  const root = buildNode(p.topic || topic, 'primary', (p.branches || []).map(conv));
  return applyLayout(root);
}

// ═══════════════════════════════════════
// SVG COORDINATE HELPER
// ═══════════════════════════════════════
function svgPt(svgEl, clientX, clientY) {
  const pt = svgEl.createSVGPoint();
  pt.x = clientX; pt.y = clientY;
  return pt.matrixTransform(svgEl.getScreenCTM().inverse());
}

// ═══════════════════════════════════════
// RENDERING — BIKABLO STYLE
// ═══════════════════════════════════════
function renderBikabloNode(node, pal, level, selected, rng) {
  const col = gc(pal, node.color);
  const isRoot = level === 0;
  const rx = isRoot ? 80 : Math.min(10 + node.label.length * 4.5, 75);
  const ry = isRoot ? 36 : 22;
  const fs = isRoot ? 16 : level === 1 ? 13 : 11;
  const sw = selected ? 3 : isRoot ? 2.5 : 1.8;
  const selStroke = selected ? '#E8584F' : col;

  // Truncate label
  const label = node.label.length > 22 ? node.label.slice(0, 20) + '…' : node.label;
  // Word wrap for root
  const lines = isRoot && label.length > 16 ? [label.slice(0, Math.ceil(label.length / 2)), label.slice(Math.ceil(label.length / 2))] : [label];

  return (
    <g key={node.id} data-id={node.id}>
      <path d={rr(node.x - rx, node.y - ry, rx * 2, ry * 2, isRoot ? 20 : 14, rng, isRoot ? 3 : 2)}
        fill={isRoot ? col : pal.sb} stroke={selStroke} strokeWidth={sw} opacity={0.95} style={{ cursor: 'grab' }}/>
      {lines.map((l, i) => (
        <text key={i} x={node.x} y={node.y + (i - (lines.length - 1) / 2) * (fs + 2) + fs * 0.35}
          textAnchor="middle" fontFamily="Caveat" fontSize={fs} fontWeight={isRoot ? 700 : 600}
          fill={isRoot ? '#fff' : pal.t} style={{ pointerEvents: 'none', userSelect: 'none' }}>{l}</text>
      ))}
      {node.collapsed && node.children?.length > 0 && (
        <g>
          <circle cx={node.x + rx - 8} cy={node.y - ry + 8} r="10" fill={col} opacity="0.8"/>
          <text x={node.x + rx - 8} y={node.y - ry + 12} textAnchor="middle" fontFamily="Caveat"
            fontSize="11" fontWeight="700" fill="#fff" style={{ pointerEvents: 'none' }}>+{countDescendants(node)}</text>
        </g>
      )}
    </g>
  );
}

function renderBikabloEdge(parent, child, pal, rng) {
  const col = gc(pal, child.color);
  const mx = (parent.x + child.x) / 2 + (rng() - 0.5) * 20;
  const my = (parent.y + child.y) / 2 + (rng() - 0.5) * 20;
  return (
    <path key={`e-${parent.id}-${child.id}`}
      d={`M${parent.x},${parent.y} Q${mx},${my} ${child.x},${child.y}`}
      fill="none" stroke={col} strokeWidth="2.2" opacity="0.5" strokeLinecap="round"/>
  );
}

// ═══════════════════════════════════════
// RENDERING — CLEAN STYLE
// ═══════════════════════════════════════
function renderCleanNode(node, pal, level, selected) {
  const col = gc(pal, node.color);
  const isRoot = level === 0;
  const rx = isRoot ? 80 : Math.min(10 + node.label.length * 4.2, 72);
  const ry = isRoot ? 32 : 20;
  const fs = isRoot ? 16 : level === 1 ? 13 : 11;
  const sw = selected ? 3 : isRoot ? 2 : 1.5;
  const selStroke = selected ? '#E8584F' : col;
  const label = node.label.length > 22 ? node.label.slice(0, 20) + '…' : node.label;
  const lines = isRoot && label.length > 16 ? [label.slice(0, Math.ceil(label.length / 2)), label.slice(Math.ceil(label.length / 2))] : [label];

  return (
    <g key={node.id} data-id={node.id}>
      <rect x={node.x - rx} y={node.y - ry} width={rx * 2} height={ry * 2}
        rx={isRoot ? 18 : 12} fill={isRoot ? col : '#fff'} stroke={selStroke} strokeWidth={sw}
        style={{ cursor: 'grab' }}/>
      {lines.map((l, i) => (
        <text key={i} x={node.x} y={node.y + (i - (lines.length - 1) / 2) * (fs + 2) + fs * 0.35}
          textAnchor="middle" fontFamily="Patrick Hand" fontSize={fs} fontWeight={isRoot ? 700 : 400}
          fill={isRoot ? '#fff' : pal.t} style={{ pointerEvents: 'none', userSelect: 'none' }}>{l}</text>
      ))}
      {node.collapsed && node.children?.length > 0 && (
        <g>
          <circle cx={node.x + rx - 6} cy={node.y - ry + 6} r="9" fill={col} opacity="0.85"/>
          <text x={node.x + rx - 6} y={node.y - ry + 10} textAnchor="middle" fontFamily="Patrick Hand"
            fontSize="10" fontWeight="700" fill="#fff" style={{ pointerEvents: 'none' }}>+{countDescendants(node)}</text>
        </g>
      )}
    </g>
  );
}

function renderCleanEdge(parent, child, pal) {
  const col = gc(pal, child.color);
  return (
    <line key={`e-${parent.id}-${child.id}`}
      x1={parent.x} y1={parent.y} x2={child.x} y2={child.y}
      stroke={col} strokeWidth="1.8" opacity="0.35" strokeLinecap="round"/>
  );
}

// ═══════════════════════════════════════
// COLLECT ALL VISIBLE NODES + EDGES
// ═══════════════════════════════════════
function collectEdges(node) {
  const edges = [];
  if (!node.collapsed && node.children) {
    for (const c of node.children) {
      edges.push({ parent: node, child: c });
      edges.push(...collectEdges(c));
    }
  }
  return edges;
}

function collectNodes(node, level = 0) {
  const nodes = [{ node, level }];
  if (!node.collapsed && node.children) {
    for (const c of node.children) nodes.push(...collectNodes(c, level + 1));
  }
  return nodes;
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

function exportSVG(title) {
  const el = document.getElementById('mindmap-svg');
  if (!el) return;
  const c = el.cloneNode(true);
  c.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  dlBlob(new Blob([new XMLSerializer().serializeToString(c)], { type: 'image/svg+xml' }),
    `mm-${(title || 'map').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}.svg`);
}

function exportPNG(title, bg) {
  const el = document.getElementById('mindmap-svg');
  if (!el) return;
  const c = el.cloneNode(true); c.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const s = new XMLSerializer().serializeToString(c);
  const vb = el.getAttribute('viewBox').split(' ').map(Number);
  const cv = Object.assign(document.createElement('canvas'), { width: vb[2] * 2, height: vb[3] * 2 });
  const ctx = cv.getContext('2d'); const img = new Image();
  img.onload = () => { ctx.fillStyle = bg; ctx.fillRect(0, 0, cv.width, cv.height); ctx.drawImage(img, 0, 0, cv.width, cv.height);
    cv.toBlob(b => { if (b) dlBlob(b, `mm-${(title || 'map').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}.png`); }, 'image/png'); };
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(s)));
}

function exportJSON(tree, topic) {
  dlBlob(new Blob([JSON.stringify({ v: 1, tool: 'mindmap', topic, tree, at: new Date().toISOString() }, null, 2)],
    { type: 'application/json' }), `mm-${(topic || 'map').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}.json`);
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
export default function MindMapTool() {
  const [phase, setPhase] = useState('input');
  const [topic, setTopic] = useState('');
  const [tree, setTree] = useState(null);
  const [style, setStyle] = useState('bikablo');
  const [lang, setLang] = useState('de');
  const [err, setErr] = useState(null);
  const [sel, setSel] = useState(null);     // selected node id
  const [dragId, setDragId] = useState(null);
  const [dragOff, setDragOff] = useState({ dx: 0, dy: 0 });
  const [fs, setFs] = useState(false);
  const [editLabel, setEditLabel] = useState('');
  const svgRef = useRef(null);
  const t = MT[lang] || MT.de;
  const pal = PAL.neutral;

  // Generate mind map
  const generate = useCallback(async (tp) => {
    setPhase('loading'); setErr(null); setTopic(tp);
    try {
      const newTree = await generateMindMap(tp, lang);
      setTree(newTree); setSel(null); setPhase('map');
    } catch (e) { console.error(e); setErr(e.message); setPhase('input'); }
  }, [lang]);

  // ─── TREE MUTATION HELPERS ───
  const updateTree = (fn) => setTree(prev => { if (!prev) return prev; const t2 = deepClone(prev); fn(t2); return t2; });

  const toggleCollapse = (id) => updateTree(t2 => {
    const n = findNode(t2, id); if (n) n.collapsed = !n.collapsed;
  });

  const addChild = (parentId) => updateTree(t2 => {
    const p = findNode(t2, parentId);
    if (p) {
      p.collapsed = false;
      const child = buildNode(t.branch, COLORS[(p.children.length) % 3]);
      // Position near parent
      const angle = Math.random() * Math.PI * 2;
      child.x = p.x + Math.cos(angle) * 120;
      child.y = p.y + Math.sin(angle) * 120;
      p.children.push(child);
    }
  });

  const deleteNode = (id) => updateTree(t2 => {
    const p = findParent(t2, id);
    if (p) p.children = p.children.filter(c => c.id !== id);
  });

  const renameNode = (id, label) => updateTree(t2 => {
    const n = findNode(t2, id); if (n) n.label = label;
  });

  const recolor = (id) => updateTree(t2 => {
    const n = findNode(t2, id);
    if (n) { const ci = COLORS.indexOf(n.color); n.color = COLORS[(ci + 1) % COLORS.length]; }
  });

  const relayout = () => updateTree(t2 => applyLayout(t2));

  // ─── DRAG HANDLERS ───
  const onPointerDown = (e) => {
    const g = e.target.closest('[data-id]');
    if (!g || !svgRef.current) return;
    const id = g.dataset.id;
    const pt = svgPt(svgRef.current, e.clientX, e.clientY);
    const node = findNode(tree, id);
    if (!node) return;
    setDragId(id);
    setDragOff({ dx: node.x - pt.x, dy: node.y - pt.y });
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!dragId || !svgRef.current) return;
    const pt = svgPt(svgRef.current, e.clientX, e.clientY);
    updateTree(t2 => {
      const n = findNode(t2, dragId);
      if (n) { n.x = pt.x + dragOff.dx; n.y = pt.y + dragOff.dy; }
    });
    e.preventDefault();
  };

  const onPointerUp = () => { setDragId(null); };

  // ─── CLICK HANDLING ───
  const onNodeClick = (e, nodeId) => {
    if (dragId) return; // was dragging
    const node = findNode(tree, nodeId);
    if (!node) return;
    if (sel === nodeId) { setSel(null); return; }
    setSel(nodeId);
    setEditLabel(node.label);
  };

  const onNodeDblClick = (e, nodeId) => {
    e.stopPropagation();
    toggleCollapse(nodeId);
  };

  // ─── SHARED UI ───
  const langBar = (
    <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 6 }}>
      {[['de', '🇩🇪'], ['en', '🇬🇧'], ['ru', '🇷🇺']].map(([k, fl]) => (
        <button key={k} onClick={() => setLang(k)} style={{ padding: '4px 10px', borderRadius: 8, border: lang === k ? '2px solid #3B7DD8' : '2px solid transparent', background: lang === k ? '#F0F4FF' : 'transparent', fontSize: 16, cursor: 'pointer' }}>{fl}</button>
      ))}
    </div>
  );
  const hdr = (
    <div style={{ textAlign: 'center', padding: '16px 16px 3px' }}>
      <h1 style={{ fontFamily: 'Caveat,cursive', fontSize: 30, fontWeight: 700, color: '#2D2D2D', margin: 0 }}>🧠 {t.title}</h1>
      <p style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 13, color: '#aaa', marginTop: 2 }}>{t.sub}</p>
      {langBar}
    </div>
  );
  const errBox = err ? (
    <div style={{ maxWidth: 500, margin: '0 auto 8px', padding: '10px 16px', background: '#FFF0F0', border: '2px solid #E8584F', borderRadius: 10, textAlign: 'center', fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#E8584F' }}>
      {err}<button onClick={() => setErr(null)} style={{ marginLeft: 12, background: 'none', border: 'none', color: '#E8584F', cursor: 'pointer', fontSize: 16 }}>x</button>
    </div>
  ) : null;

  // ═══ INPUT PHASE ═══
  if (phase === 'input') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg,#FEFCFB,#F5F0EB)' }}>
      <style>{FONT_CSS}</style>{hdr}{errBox}
      <div style={{ maxWidth: 560, margin: '0 auto', padding: 20 }}>
        <h2 style={{ fontFamily: 'Caveat,cursive', fontSize: 24, fontWeight: 700, color: '#2D2D2D', marginBottom: 5 }}>{t.inputTitle}</h2>
        <p style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#888', marginBottom: 12 }}>{t.inputHint}</p>
        <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder={t.inputPh}
          style={{ width: '100%', minHeight: 100, padding: 15, borderRadius: 14, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 15, resize: 'vertical', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box', lineHeight: 1.6 }}/>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
          <button onClick={() => { if (topic.trim()) generate(topic.trim()); }} disabled={!topic.trim()}
            style={{ ...bt(topic.trim() ? '#3B7DD8' : '#ccc', true), fontSize: 18 }}>{t.create}</button>
        </div>
      </div>
    </div>
  );

  // ═══ LOADING ═══
  if (phase === 'loading') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg,#FEFCFB,#F5F0EB)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <style>{FONT_CSS}</style>
      <div style={{ width: 46, height: 46, border: '4px solid #e0e8f0', borderTop: '4px solid #3B7DD8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}/>
      <div style={{ fontFamily: 'Caveat,cursive', fontSize: 20, color: '#3B7DD8', fontWeight: 600 }}>{t.loading}</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  // ═══ MAP PHASE ═══
  if (phase === 'map' && tree) {
    const edges = collectEdges(tree);
    const nodes = collectNodes(tree);
    const rng = mkR((tree.label || '').length * 13 + 7);

    // Compute viewBox from node positions
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(({ node: n }) => {
      const rx = n.label.length * 5 + 30;
      minX = Math.min(minX, n.x - rx); maxX = Math.max(maxX, n.x + rx);
      minY = Math.min(minY, n.y - 40); maxY = Math.max(maxY, n.y + 40);
    });
    const pad = 60;
    const vbX = minX - pad, vbY = minY - pad, vbW = maxX - minX + pad * 2, vbH = maxY - minY + pad * 2;

    const mapSvg = (
      <svg id="mindmap-svg" ref={svgRef} viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: fs ? '100vh' : '70vh', background: pal.bg, borderRadius: 12, touchAction: 'none' }}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
        <defs><style>{FONT_CSS}</style></defs>
        <rect x={vbX} y={vbY} width={vbW} height={vbH} fill={pal.bg}/>
        {/* Edges */}
        {edges.map(({ parent: p, child: c }) =>
          style === 'bikablo'
            ? renderBikabloEdge(p, c, pal, mkR(p.id.charCodeAt(1) * 7 + c.id.charCodeAt(1) * 13))
            : renderCleanEdge(p, c, pal)
        )}
        {/* Nodes — render deeper levels first, root last */}
        {[...nodes].reverse().map(({ node: n, level }) => {
          const el = style === 'bikablo'
            ? renderBikabloNode(n, pal, level, sel === n.id, mkR(n.id.charCodeAt(1) * 37))
            : renderCleanNode(n, pal, level, sel === n.id);
          return (
            <g key={n.id} onClick={(e) => onNodeClick(e, n.id)} onDoubleClick={(e) => onNodeDblClick(e, n.id)}>
              {el}
            </g>
          );
        })}
      </svg>
    );

    // Fullscreen
    if (fs) return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: pal.bg, zIndex: 9999 }}>
        <style>{FONT_CSS}</style>
        <button onClick={() => setFs(false)} style={{ position: 'fixed', top: 12, right: 12, zIndex: 10000, ...bt('#E8584F', true), fontSize: 18 }}>{t.exitFs}</button>
        {mapSvg}
      </div>
    );

    const selectedNode = sel ? findNode(tree, sel) : null;

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg,#FEFCFB,#F5F0EB)' }}>
        <style>{FONT_CSS}</style>{hdr}
        <div style={{ padding: 14 }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 7, marginBottom: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => { setPhase('input'); setTree(null); setSel(null); }} style={bt('#888', false)}>{t.neu}</button>
            <button onClick={() => generate(topic)} style={bt('#3B7DD8', false)}>{t.reroll}</button>
            <button onClick={() => setStyle(s => s === 'bikablo' ? 'clean' : 'bikablo')}
              style={bt('#7B68AE', false)}>{style === 'bikablo' ? t.clean : t.bikablo}</button>
            <button onClick={relayout} style={bt('#5A8F7B', false)}>↻ Layout</button>
            <button onClick={() => setFs(true)} style={bt('#555', false)}>{t.fullscreen}</button>
            <button onClick={() => exportSVG(topic)} style={bt('#2E86AB', false)}>SVG</button>
            <button onClick={() => exportPNG(topic, pal.bg)} style={bt('#4CAF50', false)}>PNG</button>
            <button onClick={() => exportJSON(tree, topic)} style={bt('#F5A623', false)}>{t.save}</button>
          </div>

          <p style={{ textAlign: 'center', fontFamily: 'Patrick Hand,cursive', fontSize: 12, color: '#aaa', marginBottom: 8 }}>{t.clickToEdit}</p>

          {/* SVG map */}
          <div style={{ maxWidth: 1200, margin: '0 auto', boxShadow: '0 6px 28px rgba(0,0,0,.08)', borderRadius: 12, overflow: 'hidden' }}>
            {mapSvg}
          </div>

          {/* Edit panel for selected node */}
          {selectedNode && (
            <div style={{ maxWidth: 500, margin: '14px auto', padding: 16, background: '#fff', borderRadius: 14, border: `2px solid ${gc(pal, selectedNode.color)}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input value={editLabel} onChange={e => setEditLabel(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { renameNode(sel, editLabel); } }}
                  onBlur={() => renameNode(sel, editLabel)}
                  style={{ flex: 1, padding: '6px 10px', borderRadius: 8, border: '2px solid #e0e0e0', fontFamily: 'Caveat,cursive', fontSize: 17, fontWeight: 600, outline: 'none' }}/>
                <button onClick={() => recolor(sel)} style={{ ...bt(gc(pal, selectedNode.color), true), padding: '6px 12px', fontSize: 13 }}>🎨</button>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={() => addChild(sel)} style={bt('#3B7DD8', false)}>{t.addChild}</button>
                <button onClick={() => toggleCollapse(sel)}
                  style={bt('#7B68AE', false)}>{selectedNode.collapsed ? t.expand : t.collapse}</button>
                {sel !== tree.id && (
                  <button onClick={() => { deleteNode(sel); setSel(null); }} style={bt('#E8584F', false)}>{t.del}</button>
                )}
                <button onClick={() => setSel(null)} style={bt('#888', false)}>✓</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
