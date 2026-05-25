import React, { useState, useCallback } from "react";

const FC = `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap');`;

const SYSTEM = `Du bist ein Vergleichs-Experte. Erstelle einen strukturierten Vergleich zweier Konzepte.
Antworte NUR mit JSON (kein Markdown, keine Erklärung):
{
  "title": "Vergleichstitel",
  "conceptA": { "title": "Konzept A Name", "pros": ["Vorteil 1", "Vorteil 2", "Vorteil 3"], "cons": ["Nachteil 1", "Nachteil 2"] },
  "conceptB": { "title": "Konzept B Name", "pros": ["Vorteil 1", "Vorteil 2", "Vorteil 3"], "cons": ["Nachteil 1", "Nachteil 2"] },
  "shared": ["Gemeinsamkeit 1", "Gemeinsamkeit 2", "Gemeinsamkeit 3"],
  "verdict": "Kurzes Fazit in einem Satz"
}
REGELN:
- 3-5 Vorteile und 2-3 Nachteile pro Konzept
- 2-4 Gemeinsamkeiten
- Kurze, prägnante Formulierungen
- Alle Texte auf Deutsch
- Objektiv und ausgewogen`;

function dlSVG(t) { const el=document.getElementById('tool-svg');if(!el)return;const s=new XMLSerializer().serializeToString(el);const b=new Blob([s],{type:'image/svg+xml'});const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(b),download:`vergleich-${t.replace(/\s+/g,'_')}.svg`});a.click(); }
function dlPNG(t) { const el=document.getElementById('tool-svg');if(!el)return;const s=new XMLSerializer().serializeToString(el);const c=document.createElement('canvas');const vb=el.getAttribute('viewBox')?.split(' ')||[0,0,1000,700];c.width=+vb[2]*2;c.height=+vb[3]*2;const ctx=c.getContext('2d');const img=new Image();img.onload=()=>{ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.width,c.height);c.toBlob(b=>{const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(b),download:`vergleich-${t.replace(/\s+/g,'_')}.png`});a.click();});};img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s); }

function ComparisonSVG({ data }) {
  const W = 1000, H = 700, M = 20;
  const colA = '#3B7DD8', colB = '#E8584F', colS = '#4CAF50';
  const halfW = (W - M * 3) / 2;

  const renderList = (items, x, y, col, icon) => items.map((it, i) => (
    <g key={i}>
      <text x={x} y={y + i * 22} fontFamily="Patrick Hand" fontSize="14" fill={col}>{icon}</text>
      <text x={x + 16} y={y + i * 22} fontFamily="Patrick Hand" fontSize="14" fill="#2D2D2D">{it}</text>
    </g>
  ));

  return (
    <svg id="tool-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', background: '#fff', borderRadius: 12 }}>
      <defs><style>{FC}</style></defs>
      <rect width={W} height={H} fill="#fff" rx="10"/>

      {/* Title */}
      <rect x={W/2-200} y={10} width={400} height={42} rx={8} fill="#2D2D2D" opacity="0.9"/>
      <text x={W/2} y={38} textAnchor="middle" fontFamily="Caveat" fontSize="24" fontWeight="700" fill="#fff">{data.title}</text>

      {/* VS circle */}
      <circle cx={W/2} cy={65} r="14" fill="#F5A623"/>
      <text x={W/2} y={70} textAnchor="middle" fontFamily="Caveat" fontSize="14" fontWeight="700" fill="#fff">VS</text>

      {/* Concept A */}
      <rect x={M} y={85} width={halfW} height={H - 200} rx={12} fill={colA} opacity="0.05" stroke={colA} strokeWidth="2"/>
      <rect x={M} y={85} width={halfW} height={38} rx={12} fill={colA} opacity="0.9"/>
      <rect x={M} y={105} width={halfW} height={18} fill={colA} opacity="0.9"/>
      <text x={M + halfW/2} y={110} textAnchor="middle" fontFamily="Caveat" fontSize="20" fontWeight="700" fill="#fff">{data.conceptA.title}</text>

      {/* A Pros */}
      <text x={M + 16} y={145} fontFamily="Caveat" fontSize="16" fontWeight="700" fill={colA}>✅ Vorteile</text>
      {renderList(data.conceptA.pros, M + 20, 168, colA, '•')}

      {/* A Cons */}
      <text x={M + 16} y={168 + data.conceptA.pros.length * 22 + 20} fontFamily="Caveat" fontSize="16" fontWeight="700" fill="#999">⚠ Nachteile</text>
      {renderList(data.conceptA.cons, M + 20, 168 + data.conceptA.pros.length * 22 + 43, '#999', '•')}

      {/* Concept B */}
      <rect x={M*2 + halfW} y={85} width={halfW} height={H - 200} rx={12} fill={colB} opacity="0.05" stroke={colB} strokeWidth="2"/>
      <rect x={M*2 + halfW} y={85} width={halfW} height={38} rx={12} fill={colB} opacity="0.9"/>
      <rect x={M*2 + halfW} y={105} width={halfW} height={18} fill={colB} opacity="0.9"/>
      <text x={M*2 + halfW + halfW/2} y={110} textAnchor="middle" fontFamily="Caveat" fontSize="20" fontWeight="700" fill="#fff">{data.conceptB.title}</text>

      {/* B Pros */}
      <text x={M*2 + halfW + 16} y={145} fontFamily="Caveat" fontSize="16" fontWeight="700" fill={colB}>✅ Vorteile</text>
      {renderList(data.conceptB.pros, M*2 + halfW + 20, 168, colB, '•')}

      {/* B Cons */}
      <text x={M*2 + halfW + 16} y={168 + data.conceptB.pros.length * 22 + 20} fontFamily="Caveat" fontSize="16" fontWeight="700" fill="#999">⚠ Nachteile</text>
      {renderList(data.conceptB.cons, M*2 + halfW + 20, 168 + data.conceptB.pros.length * 22 + 43, '#999', '•')}

      {/* Shared section */}
      <rect x={M} y={H - 100} width={W - M*2} height={80} rx={12} fill={colS} opacity="0.06" stroke={colS} strokeWidth="2" strokeDasharray="6,4"/>
      <text x={W/2} y={H - 78} textAnchor="middle" fontFamily="Caveat" fontSize="18" fontWeight="700" fill={colS}>🤝 Gemeinsamkeiten</text>
      {data.shared.map((it, i) => (
        <text key={i} x={M + 40 + i * ((W - M*2 - 80) / Math.max(data.shared.length, 1))} y={H - 50} fontFamily="Patrick Hand" fontSize="13" fill="#2D2D2D">• {it}</text>
      ))}

      {/* Verdict */}
      {data.verdict && <text x={W/2} y={H - 15} textAnchor="middle" fontFamily="Caveat" fontSize="15" fontWeight="600" fill="#888" fontStyle="italic">★ {data.verdict}</text>}
    </svg>
  );
}

export default function ComparisonApp({ onBack }) {
  const [topicA, setTopicA] = useState('');
  const [topicB, setTopicB] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const generate = useCallback(async () => {
    if (!topicA.trim() || !topicB.trim()) return;
    setLoading(true); setErr(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api/generate';
      const res = await fetch(apiUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 2000, system: SYSTEM, messages: [{ role: 'user', content: `Vergleiche: "${topicA}" vs "${topicB}"` }] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const text = (json.content?.[0]?.text || '').replace(/```json|```/g, '').trim();
      setData(JSON.parse(text));
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }, [topicA, topicB]);

  const bs = { padding: '10px 20px', borderRadius: 10, border: 'none', fontFamily: 'Caveat, cursive', fontSize: 16, cursor: 'pointer' };

  return (
    <div style={{ minHeight: '100vh', background: '#F0FFF0', padding: 20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap');`}</style>
      <div style={{ maxWidth: 1050, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={onBack} style={{ ...bs, background: '#fff', color: '#4CAF50', border: '2px solid #4CAF50' }}>← Toolbox</button>
          <span style={{ fontFamily: 'Caveat, cursive', fontSize: 28, fontWeight: 700, color: '#4CAF50' }}>⚖️ Vergleichsbild</span>
        </div>

        {!data ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', maxWidth: 500, margin: '60px auto', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Caveat, cursive', fontSize: 22, color: '#4CAF50', marginBottom: 20 }}>Welche zwei Konzepte vergleichen?</p>
            <input value={topicA} onChange={e => setTopicA(e.target.value)} placeholder="Konzept A (z.B. Remote Work)"
              style={{ width: '100%', padding: 14, borderRadius: 10, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand, cursive', fontSize: 16, boxSizing: 'border-box', outline: 'none', marginBottom: 12 }}/>
            <div style={{ fontFamily: 'Caveat, cursive', fontSize: 20, color: '#F5A623', margin: '4px 0' }}>VS</div>
            <input value={topicB} onChange={e => setTopicB(e.target.value)} placeholder="Konzept B (z.B. Büroarbeit)" onKeyDown={e => e.key === 'Enter' && generate()}
              style={{ width: '100%', padding: 14, borderRadius: 10, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand, cursive', fontSize: 16, boxSizing: 'border-box', outline: 'none', marginBottom: 16 }}/>
            <button onClick={generate} disabled={!topicA.trim() || !topicB.trim() || loading} style={{ ...bs, background: loading ? '#ccc' : '#4CAF50', color: '#fff', fontSize: 18, width: '100%' }}>
              {loading ? '⏳ Wird generiert...' : '⚖️ Vergleich erstellen'}
            </button>
            {err && <p style={{ color: '#E8584F', fontFamily: 'Patrick Hand', marginTop: 12 }}>⚠ {err}</p>}
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <button onClick={() => setData(null)} style={{ ...bs, background: '#fff', color: '#4CAF50', border: '2px solid #4CAF50' }}>← Neu</button>
              <button onClick={generate} style={{ ...bs, background: '#F5A623', color: '#fff' }}>🎲 Neu würfeln</button>
              <button onClick={() => dlSVG(data.title)} style={{ ...bs, background: '#2E86AB', color: '#fff' }}>SVG</button>
              <button onClick={() => dlPNG(data.title)} style={{ ...bs, background: '#4CAF50', color: '#fff' }}>PNG</button>
            </div>
            <ComparisonSVG data={data}/>
          </div>
        )}
      </div>
    </div>
  );
}
