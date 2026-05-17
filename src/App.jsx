// App.jsx — Visual Thinking Toolbox: Tool Router
import React, { useState } from 'react';
import SketchnoteTool from './SketchnoteTool.jsx';
import MindMapTool from './MindMapTool.jsx';

const FONT_CSS = `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap');`;

/** Tool definitions — add new tools here */
const TOOLS = [
  {
    id: 'sketchnote',
    name: 'Sketchnote Generator',
    desc: 'KI-generierte Bikablo-Sketchnotes — geführt oder frei.',
    icon: '✏️',
    color: '#E8584F',
    ready: true,
    component: SketchnoteTool,
  },
  {
    id: 'mindmap',
    name: 'Mind-Map',
    desc: 'KI-generierte interaktive Mind-Maps — Bikablo oder Clean.',
    icon: '🧠',
    color: '#7B68AE',
    ready: true,
    component: MindMapTool,
  },
  {
    id: 'comparison',
    name: 'Vorher / Nachher',
    desc: 'Vergleichsbilder für Transformationen visualisieren.',
    icon: '🔄',
    color: '#3B7DD8',
    ready: false,
  },
  {
    id: 'valuequad',
    name: 'Wertequadrat',
    desc: 'Werte und Übertreibungen im Quadrat darstellen.',
    icon: '◆',
    color: '#4CAF50',
    ready: false,
  },
  {
    id: 'darkmode',
    name: 'Einstellungen',
    desc: 'Dark Mode, Sharing-Links und mehr.',
    icon: '⚙️',
    color: '#6B7B8D',
    ready: false,
  },
];

function ToolCard({ tool, onSelect }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={() => tool.ready && onSelect(tool.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '22px 20px',
        borderRadius: 16,
        border: `2px solid ${tool.ready ? tool.color : '#d0d0d0'}`,
        background: hover && tool.ready ? `${tool.color}08` : '#FEFCFB',
        cursor: tool.ready ? 'pointer' : 'default',
        opacity: tool.ready ? 1 : 0.55,
        transition: 'all 0.2s ease',
        transform: hover && tool.ready ? 'translateY(-2px)' : 'none',
        boxShadow: hover && tool.ready ? `0 4px 16px ${tool.color}22` : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <span style={{ fontSize: 28 }}>{tool.icon}</span>
        <div>
          <div style={{ fontFamily: 'Caveat,cursive', fontSize: 22, fontWeight: 700, color: tool.ready ? tool.color : '#999' }}>
            {tool.name}
          </div>
          {!tool.ready && (
            <span style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 12, color: '#bbb', background: '#f0f0f0', padding: '2px 8px', borderRadius: 6 }}>
              coming soon
            </span>
          )}
        </div>
      </div>
      <div style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#666', lineHeight: 1.4 }}>
        {tool.desc}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTool, setActiveTool] = useState(null);

  // If a tool is selected, render it with a back button
  if (activeTool) {
    const tool = TOOLS.find(t => t.id === activeTool);
    if (tool?.component) {
      const Component = tool.component;
      return (
        <div>
          <div style={{
            position: 'fixed', top: 10, left: 10, zIndex: 10001,
          }}>
            <button
              onClick={() => setActiveTool(null)}
              style={{
                padding: '6px 14px', borderRadius: 10, border: '2px solid #888',
                background: 'rgba(255,255,255,0.9)', color: '#555',
                fontFamily: 'Caveat,cursive', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', backdropFilter: 'blur(4px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              ← Toolbox
            </button>
          </div>
          <Component />
        </div>
      );
    }
  }

  // Hub / Landing page
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #FEFCFB 0%, #F5F0EB 100%)' }}>
      <style>{FONT_CSS}</style>
      <div style={{ textAlign: 'center', padding: '36px 20px 12px' }}>
        <h1 style={{ fontFamily: 'Caveat,cursive', fontSize: 38, fontWeight: 700, color: '#2D2D2D', margin: 0, letterSpacing: 1 }}>
          🎨 Visual Thinking Toolbox
        </h1>
        <p style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 16, color: '#888', marginTop: 6 }}>
          Visuell denken, verstehen, kommunizieren.
        </p>
      </div>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '12px 20px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {TOOLS.map(tool => (
          <ToolCard key={tool.id} tool={tool} onSelect={setActiveTool} />
        ))}
      </div>
      <div style={{ textAlign: 'center', padding: '0 0 30px', fontFamily: 'Patrick Hand,cursive', fontSize: 12, color: '#ccc' }}>
        Visual Thinking Toolbox · v2.0
      </div>
    </div>
  );
}
