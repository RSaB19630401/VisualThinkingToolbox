import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import SketchnoteApp from './App.jsx';
import MindMapApp from './MindMap.jsx';
import ComparisonApp from './Comparison.jsx';
import ValueQuadApp from './ValueQuad.jsx';

const TOOLS = [
  { id: 'sketchnote', icon: '📋', label: 'Sketchnote', desc: 'Visuelles Poster mit Sektionen, Illustrationen und Struktur', color: '#E8584F' },
  { id: 'mindmap', icon: '🧠', label: 'Mind Map', desc: 'Radiale Gedankenlandkarte mit Ästen und Verzweigungen', color: '#3B7DD8' },
  { id: 'comparison', icon: '⚖️', label: 'Vergleichsbild', desc: 'Zwei Konzepte visuell gegenübergestellt', color: '#4CAF50' },
  { id: 'valuequad', icon: '💎', label: 'Wertequadrat', desc: 'Coaching-Tool nach Schulz von Thun', color: '#7B68AE' },
];

function StartScreen({ onSelect }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF8F0 0%, #F0F4FF 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap');`}</style>
      <div style={{ fontSize: 48, marginBottom: 8 }}>✏️</div>
      <h1 style={{ fontFamily: 'Caveat, cursive', fontSize: 42, fontWeight: 700, color: '#2D2D2D', margin: '0 0 4px', textAlign: 'center' }}>Visual Thinking Toolbox</h1>
      <p style={{ fontFamily: 'Patrick Hand, cursive', fontSize: 18, color: '#888', margin: '0 0 40px', textAlign: 'center' }}>KI-gestützte Visualisierung · Wähle dein Werkzeug</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, maxWidth: 1100, width: '100%' }}>
        {TOOLS.map(t => (
          <button key={t.id} onClick={() => onSelect(t.id)} style={{
            background: '#fff', border: `2px solid ${t.color}22`, borderRadius: 16, padding: '28px 24px',
            cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${t.color}22`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${t.color}22`; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{t.icon}</div>
            <div style={{ fontFamily: 'Caveat, cursive', fontSize: 26, fontWeight: 700, color: t.color, marginBottom: 8 }}>{t.label}</div>
            <div style={{ fontFamily: 'Patrick Hand, cursive', fontSize: 15, color: '#666', lineHeight: 1.5 }}>{t.desc}</div>
          </button>
        ))}
      </div>
      <p style={{ fontFamily: 'Patrick Hand, cursive', fontSize: 13, color: '#bbb', marginTop: 40 }}>Powered by Claude & GPT Image 2 · Visual Thinking Toolbox v2.0</p>
    </div>
  );
}

function ToolRouter() {
  const [tool, setTool] = useState(null);
  const back = () => setTool(null);
  if (!tool) return <StartScreen onSelect={setTool} />;
  if (tool === 'sketchnote') return <SketchnoteApp onBack={back} />;
  if (tool === 'mindmap') return <MindMapApp onBack={back} />;
  if (tool === 'comparison') return <ComparisonApp onBack={back} />;
  if (tool === 'valuequad') return <ValueQuadApp onBack={back} />;
  return <StartScreen onSelect={setTool} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><ToolRouter /></React.StrictMode>);
