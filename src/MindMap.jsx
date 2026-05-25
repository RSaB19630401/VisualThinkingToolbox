import React, { useState, useCallback } from "react";

const FC = `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap');`;
const COLORS = ['#E8584F','#3B7DD8','#4CAF50','#F5A623','#7B68AE','#E07BAB','#5A8F7B','#D4A853'];

const SYSTEM = `Du bist ein Mind-Map-Experte. Erstelle eine Mind Map zum gegebenen Thema.
Antworte NUR mit JSON (kein Markdown, keine Erklärung):
{
  "center": "Hauptthema",
  "branches": [
    { "label": "Ast-Titel", "sub": ["Unterpunkt 1", "Unterpunkt 2", "Unterpunkt 3"] }
  ]
}
REGELN:
- 5-8 Hauptäste
- Jeder Ast hat 2-4 Unterpunkte
- Kurze, prägnante Begriffe (max 3-4 Wörter pro Punkt)
- Alle Texte auf Deutsch
- Logische, sinnvolle Gruppierung`;

function dlSVG(title) {
  const el = document.getElementById('tool-svg');
  if (!el) return;
  const s = new XMLSerializer().serializeToString(el);
  const b = new Blob([s], { type: 'image/svg+xml' });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(b), download: `mindmap-${title.replace(/\s+/g, '_')}.svg` });
  a.click();
}

function dlPNG(title) {
  const el = document.getElementById('tool-svg');
  if (!el) return;
  const s = new XMLSerializer().serializeToString(el);
  const c = document.createElement('canvas');
  const vb = el.getAttribute('viewBox')?.split(' ') || [0, 0, 900, 900];
  c.width = +vb[2] * 2; c.height = +vb[3] * 2;
  const ctx = c.getContext('2d');
  const img = new Image();
  img.onload = () => { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height); c.toBlob(b => { const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(b), download: `mindmap-${title.replace(/\s+/g, '_')}.png` }); a.click(); }); };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
}

function MindMapSVG({ data }) {
  const cx = 450, cy = 450, W = 900, H = 900;
  const branches = data.branches || [];
  const n = branches.length;

  return (
    <svg id="tool-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', background: '#fff', borderRadius: 12 }}>
      <defs><style>{FC}</style></defs>
      <rect width={W} height={H} fill="#fff" rx="10"/>

      {branches.map((br, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const bx = cx + Math.cos(angle) * 200;
        const by = cy + Math.sin(angle) * 200;
        const col = COLORS[i % COLORS.length];

        return (
          <g key={i}>
            {/* Branch line */}
            <line x1={cx} y1={cy} x2={bx} y2={by} stroke={col} strokeWidth="3" opacity="0.6"/>

            {/* Branch node */}
            <ellipse cx={bx} cy={by} rx={Math.min(br.label.length * 6 + 20, 90)} ry="22" fill={col} opacity="0.15" stroke={col} strokeWidth="2"/>
            <text x={bx} y={by + 5} textAnchor="middle" fontFamily="Caveat" fontSize="16" fontWeight="700" fill="#2D2D2D">{br.label}</text>

            {/* Sub-nodes */}
            {(br.sub || []).map((sub, j) => {
              const subAngle = angle + ((j - (br.sub.length - 1) / 2) * 0.35);
              const sx = cx + Math.cos(subAngle) * 340;
              const sy = cy + Math.sin(subAngle) * 340;
              return (
                <g key={j}>
                  <line x1={bx} y1={by} x2={sx} y2={sy} stroke={col} strokeWidth="1.5" opacity="0.4"/>
                  <ellipse cx={sx} cy={sy} rx={Math.min(sub.length * 5 + 14, 80)} ry="16" fill="#fff" stroke={col} strokeWidth="1.5"/>
                  <text x={sx} y={sy + 4} textAnchor="middle" fontFamily="Patrick Hand" fontSize="12.5" fill="#2D2D2D">{sub}</text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Center node (on top) */}
      <ellipse cx={cx} cy={cy} rx={Math.min(data.center.length * 8 + 30, 130)} ry="35" fill="#E8584F" opacity="0.92"/>
      <text x={cx} y={cy + 7} textAnchor="middle" fontFamily="Caveat" fontSize="22" fontWeight="700" fill="#fff">{data.center}</text>
    </svg>
  );
}

export default function MindMapApp({ onBack }) {
  const [topic, setTopic] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const generate = useCallback(async () => {
    if (!topic.trim()) return;
    setLoading(true); setErr(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api/generate';
      const res = await fetch(apiUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 2000, system: SYSTEM, messages: [{ role: 'user', content: `Mind Map zum Thema: "${topic}"` }] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const text = (json.content?.[0]?.text || '').replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(text);
      if (!parsed.center || !parsed.branches) throw new Error('Ungültiges Format');
      setData(parsed);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }, [topic]);

  const bs = { padding: '10px 20px', borderRadius: 10, border: 'none', fontFamily: 'Caveat, cursive', fontSize: 16, cursor: 'pointer' };

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', padding: 20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap');`}</style>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={onBack} style={{ ...bs, background: '#fff', color: '#3B7DD8', border: '2px solid #3B7DD8' }}>← Toolbox</button>
          <span style={{ fontFamily: 'Caveat, cursive', fontSize: 28, fontWeight: 700, color: '#3B7DD8' }}>🧠 Mind Map</span>
        </div>

        {!data ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', maxWidth: 500, margin: '60px auto', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Caveat, cursive', fontSize: 22, color: '#3B7DD8', marginBottom: 20 }}>Welches Thema möchtest du visualisieren?</p>
            <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="z.B. Agiles Projektmanagement" onKeyDown={e => e.key === 'Enter' && generate()}
              style={{ width: '100%', padding: 14, borderRadius: 10, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand, cursive', fontSize: 16, boxSizing: 'border-box', outline: 'none', marginBottom: 16 }}/>
            <button onClick={generate} disabled={!topic.trim() || loading} style={{ ...bs, background: loading ? '#ccc' : '#3B7DD8', color: '#fff', fontSize: 18, width: '100%' }}>
              {loading ? '⏳ Wird generiert...' : '🧠 Mind Map erstellen'}
            </button>
            {err && <p style={{ color: '#E8584F', fontFamily: 'Patrick Hand', marginTop: 12 }}>⚠ {err}</p>}
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <button onClick={() => setData(null)} style={{ ...bs, background: '#fff', color: '#3B7DD8', border: '2px solid #3B7DD8' }}>← Neu</button>
              <button onClick={() => generate()} style={{ ...bs, background: '#F5A623', color: '#fff' }}>🎲 Neu würfeln</button>
              <button onClick={() => dlSVG(data.center)} style={{ ...bs, background: '#2E86AB', color: '#fff' }}>SVG</button>
              <button onClick={() => dlPNG(data.center)} style={{ ...bs, background: '#4CAF50', color: '#fff' }}>PNG</button>
            </div>
            <MindMapSVG data={data}/>
          </div>
        )}
      </div>
    </div>
  );
}
