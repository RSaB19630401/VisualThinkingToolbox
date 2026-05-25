import React, { useState, useCallback } from "react";

const FC = `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap');`;

const SYSTEM = `Du bist ein Coaching-Experte für das Wertequadrat nach Friedemann Schulz von Thun.
Erstelle ein Wertequadrat zum gegebenen Wert/Thema.
Antworte NUR mit JSON (kein Markdown, keine Erklärung):
{
  "topic": "Übergeordnetes Thema",
  "topLeft": { "title": "Wert/Tugend", "desc": "Kurze Beschreibung (1-2 Sätze)" },
  "topRight": { "title": "Gegenwert/Schwesterntugend", "desc": "Komplementäre positive Qualität" },
  "bottomLeft": { "title": "Entwertende Übertreibung", "desc": "Was passiert wenn der Wert übertrieben wird" },
  "bottomRight": { "title": "Entwertende Übertreibung", "desc": "Was passiert wenn der Gegenwert übertrieben wird" },
  "topTension": "Positive Spannung zwischen den Werten (kurz)",
  "bottomTension": "Negative Spannung zwischen den Entwertungen (kurz)"
}
REGELN:
- Oben links: Der positive Wert/die Tugend
- Oben rechts: Die komplementäre Tugend (Schwesterntugend)
- Unten links: Die Übertreibung/Entartung des Wertes
- Unten rechts: Die Übertreibung/Entartung des Gegenwertes
- Die obere Zeile zeigt positive Spannung
- Die untere Zeile zeigt negative/problematische Pole
- Alle Texte auf Deutsch, prägnant`;

function dlSVG(t) { const el=document.getElementById('tool-svg');if(!el)return;const s=new XMLSerializer().serializeToString(el);const b=new Blob([s],{type:'image/svg+xml'});const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(b),download:`wertequadrat-${t.replace(/\s+/g,'_')}.svg`});a.click(); }
function dlPNG(t) { const el=document.getElementById('tool-svg');if(!el)return;const s=new XMLSerializer().serializeToString(el);const c=document.createElement('canvas');c.width=1800;c.height=1200;const ctx=c.getContext('2d');const img=new Image();img.onload=()=>{ctx.fillStyle='#fff';ctx.fillRect(0,0,1800,1200);ctx.drawImage(img,0,0,1800,1200);c.toBlob(b=>{const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(b),download:`wertequadrat-${t.replace(/\s+/g,'_')}.png`});a.click();});};img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s); }

function wrapText(text, maxLen) {
  if (!text) return [];
  const words = text.split(' '), lines = [];
  let cur = '';
  words.forEach(w => { if ((cur + ' ' + w).trim().length > maxLen && cur) { lines.push(cur.trim()); cur = w; } else cur = cur ? cur + ' ' + w : w; });
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}

function ValueQuadSVG({ data }) {
  const W = 900, H = 600, M = 30;
  const qw = (W - M * 3) / 2, qh = 180;
  const topY = 80, botY = topY + qh + 80;
  const colPos = '#4CAF50', colNeg = '#E8584F', colArrow = '#7B68AE';

  const Quad = ({ x, y, title, desc, color, positive }) => {
    const descLines = wrapText(desc, 35);
    return (
      <g>
        <rect x={x} y={y} width={qw} height={qh} rx={14} fill={color} opacity="0.08" stroke={color} strokeWidth="2.5"/>
        <rect x={x} y={y} width={qw} height={40} rx={14} fill={color} opacity={positive ? 0.85 : 0.6}/>
        <rect x={x} y={y + 26} width={qw} height={14} fill={color} opacity={positive ? 0.85 : 0.6}/>
        <text x={x + qw/2} y={y + 27} textAnchor="middle" fontFamily="Caveat" fontSize="20" fontWeight="700" fill="#fff">{title}</text>
        {positive && <text x={x + qw - 12} y={y + 22} fontFamily="Caveat" fontSize="16" fill="#fff" opacity="0.7">✦</text>}
        {descLines.map((line, i) => (
          <text key={i} x={x + qw/2} y={y + 62 + i * 20} textAnchor="middle" fontFamily="Patrick Hand" fontSize="14" fill="#2D2D2D">{line}</text>
        ))}
      </g>
    );
  };

  const Arrow = ({ x1, y1, x2, y2, label, color, dashed }) => {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const h = 8;
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.5" strokeDasharray={dashed ? "6,4" : "none"} opacity="0.7"/>
        <polygon points={`${x2},${y2} ${x2-Math.cos(angle-0.4)*h},${y2-Math.sin(angle-0.4)*h} ${x2-Math.cos(angle+0.4)*h},${y2-Math.sin(angle+0.4)*h}`} fill={color} opacity="0.7"/>
        {label && <>
          <rect x={mx - label.length * 3.5 - 6} y={my - 10} width={label.length * 7 + 12} height={18} rx={4} fill="#fff" opacity="0.9"/>
          <text x={mx} y={my + 3} textAnchor="middle" fontFamily="Patrick Hand" fontSize="11" fill={color}>{label}</text>
        </>}
      </g>
    );
  };

  const lx = M, rx = M * 2 + qw;

  return (
    <svg id="tool-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', background: '#fff', borderRadius: 12 }}>
      <defs><style>{FC}</style></defs>
      <rect width={W} height={H} fill="#fff" rx="10"/>

      {/* Title */}
      <text x={W/2} y={35} textAnchor="middle" fontFamily="Caveat" fontSize="28" fontWeight="700" fill="#2D2D2D">Wertequadrat: {data.topic}</text>
      <text x={W/2} y={56} textAnchor="middle" fontFamily="Patrick Hand" fontSize="13" fill="#888">nach Schulz von Thun</text>

      {/* Row labels */}
      <text x={14} y={topY + qh/2 + 4} fontFamily="Caveat" fontSize="13" fontWeight="700" fill={colPos} transform={`rotate(-90,14,${topY + qh/2})`} textAnchor="middle">POSITIV</text>
      <text x={14} y={botY + qh/2 + 4} fontFamily="Caveat" fontSize="13" fontWeight="700" fill={colNeg} transform={`rotate(-90,14,${botY + qh/2})`} textAnchor="middle">NEGATIV</text>

      {/* Four quadrants */}
      <Quad x={lx} y={topY} title={data.topLeft.title} desc={data.topLeft.desc} color={colPos} positive={true}/>
      <Quad x={rx} y={topY} title={data.topRight.title} desc={data.topRight.desc} color={colPos} positive={true}/>
      <Quad x={lx} y={botY} title={data.bottomLeft.title} desc={data.bottomLeft.desc} color={colNeg} positive={false}/>
      <Quad x={rx} y={botY} title={data.bottomRight.title} desc={data.bottomRight.desc} color={colNeg} positive={false}/>

      {/* Horizontal arrows: positive tension (top) */}
      <Arrow x1={lx + qw + 8} y1={topY + qh/2} x2={rx - 8} y2={topY + qh/2} label={data.topTension} color={colPos}/>
      {/* Reverse arrow */}
      <Arrow x1={rx - 8} y1={topY + qh/2 + 12} x2={lx + qw + 8} y2={topY + qh/2 + 12} label="" color={colPos}/>

      {/* Horizontal arrows: negative tension (bottom) */}
      <Arrow x1={lx + qw + 8} y1={botY + qh/2} x2={rx - 8} y2={botY + qh/2} label={data.bottomTension} color={colNeg} dashed={true}/>
      <Arrow x1={rx - 8} y1={botY + qh/2 + 12} x2={lx + qw + 8} y2={botY + qh/2 + 12} label="" color={colNeg} dashed={true}/>

      {/* Vertical arrows: degradation */}
      <Arrow x1={lx + qw/2} y1={topY + qh + 6} x2={lx + qw/2} y2={botY - 6} label="Übertreibung ↓" color="#999"/>
      <Arrow x1={rx + qw/2} y1={topY + qh + 6} x2={rx + qw/2} y2={botY - 6} label="Übertreibung ↓" color="#999"/>

      {/* Diagonal arrows: development/correction (dashed) */}
      <Arrow x1={lx + qw - 20} y1={botY + 10} x2={rx + 20} y2={topY + qh - 10} label="Entwicklung" color={colArrow} dashed={true}/>
      <Arrow x1={rx + qw - 20} y1={botY + 10} x2={lx + 20} y2={topY + qh - 10} label="Entwicklung" color={colArrow} dashed={true}/>

      {/* Footer */}
      <text x={W/2} y={H - 12} textAnchor="middle" fontFamily="Patrick Hand" fontSize="11" fill="#bbb">💎 Wertequadrat · Visual Thinking Toolbox</text>
    </svg>
  );
}

export default function ValueQuadApp({ onBack }) {
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
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 2000, system: SYSTEM, messages: [{ role: 'user', content: `Wertequadrat zum Wert/Thema: "${topic}"` }] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const text = (json.content?.[0]?.text || '').replace(/```json|```/g, '').trim();
      setData(JSON.parse(text));
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }, [topic]);

  const bs = { padding: '10px 20px', borderRadius: 10, border: 'none', fontFamily: 'Caveat, cursive', fontSize: 16, cursor: 'pointer' };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F5FF', padding: 20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap');`}</style>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={onBack} style={{ ...bs, background: '#fff', color: '#7B68AE', border: '2px solid #7B68AE' }}>← Toolbox</button>
          <span style={{ fontFamily: 'Caveat, cursive', fontSize: 28, fontWeight: 700, color: '#7B68AE' }}>💎 Wertequadrat</span>
        </div>

        {!data ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', maxWidth: 500, margin: '60px auto', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Caveat, cursive', fontSize: 22, color: '#7B68AE', marginBottom: 8 }}>Welchen Wert oder welche Tugend analysieren?</p>
            <p style={{ fontFamily: 'Patrick Hand, cursive', fontSize: 13, color: '#999', marginBottom: 20 }}>z.B. Sparsamkeit, Ehrlichkeit, Führungsstärke, Empathie</p>
            <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="z.B. Sparsamkeit" onKeyDown={e => e.key === 'Enter' && generate()}
              style={{ width: '100%', padding: 14, borderRadius: 10, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand, cursive', fontSize: 16, boxSizing: 'border-box', outline: 'none', marginBottom: 16 }}/>
            <button onClick={generate} disabled={!topic.trim() || loading} style={{ ...bs, background: loading ? '#ccc' : '#7B68AE', color: '#fff', fontSize: 18, width: '100%' }}>
              {loading ? '⏳ Wird generiert...' : '💎 Wertequadrat erstellen'}
            </button>
            {err && <p style={{ color: '#E8584F', fontFamily: 'Patrick Hand', marginTop: 12 }}>⚠ {err}</p>}
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <button onClick={() => setData(null)} style={{ ...bs, background: '#fff', color: '#7B68AE', border: '2px solid #7B68AE' }}>← Neu</button>
              <button onClick={generate} style={{ ...bs, background: '#F5A623', color: '#fff' }}>🎲 Neu würfeln</button>
              <button onClick={() => dlSVG(data.topic)} style={{ ...bs, background: '#2E86AB', color: '#fff' }}>SVG</button>
              <button onClick={() => dlPNG(data.topic)} style={{ ...bs, background: '#4CAF50', color: '#fff' }}>PNG</button>
            </div>
            <ValueQuadSVG data={data}/>
          </div>
        )}
      </div>
    </div>
  );
}
