// App.jsx — Visual Thinking Toolbox: Tool Router with Dark Mode
import React, { useState } from 'react';
import SketchnoteTool from './SketchnoteTool.jsx';
import MindMapTool from './MindMapTool.jsx';
import ComparisonTool from './ComparisonTool.jsx';
import ValueSquareTool from './ValueSquareTool.jsx';
import SettingsTool from './SettingsTool.jsx';
import { useSettings, getGallery, setPendingGalleryItem } from './settings.js';

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
    desc: 'Transformationen sichtbar machen — KI-generierte Vergleichsbilder.',
    icon: '🔄',
    color: '#3B7DD8',
    ready: true,
    component: ComparisonTool,
  },
  {
    id: 'valuequad',
    name: 'Wertequadrat',
    desc: 'Werte und Übertreibungen nach Schulz von Thun — KI-generiert.',
    icon: '◆',
    color: '#4CAF50',
    ready: true,
    component: ValueSquareTool,
  },
  {
    id: 'settings',
    name: 'Einstellungen',
    desc: 'Dark Mode, Sprache und Export-Tipps.',
    icon: '⚙️',
    color: '#6B7B8D',
    ready: true,
    component: SettingsTool,
  },
];

function ToolCard({ tool, onSelect, dark }) {
  const [hover, setHover] = useState(false);
  const bgDefault = dark ? '#1E1E36' : '#FEFCFB';
  const bgHover = dark ? '#2A2A4A' : `${tool.color}08`;
  const descCol = dark ? '#999' : '#666';
  const borderInactive = dark ? '#444' : '#d0d0d0';

  return (
    <div
      onClick={() => tool.ready && onSelect(tool.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '22px 20px',
        borderRadius: 16,
        border: `2px solid ${tool.ready ? tool.color : borderInactive}`,
        background: hover && tool.ready ? bgHover : bgDefault,
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
            <span style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 12, color: '#bbb', background: dark ? '#333' : '#f0f0f0', padding: '2px 8px', borderRadius: 6 }}>
              coming soon
            </span>
          )}
        </div>
      </div>
      <div style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: descCol, lineHeight: 1.4 }}>
        {tool.desc}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTool, setActiveTool] = useState(null);
  const { dark } = useSettings();

  const bgGrad = dark
    ? 'linear-gradient(145deg, #12122A 0%, #1A1A2E 100%)'
    : 'linear-gradient(145deg, #FEFCFB 0%, #F5F0EB 100%)';
  const textCol = dark ? '#E8E8E8' : '#2D2D2D';
  const subCol = dark ? '#777' : '#888';
  const backBg = dark ? 'rgba(30,30,54,0.9)' : 'rgba(255,255,255,0.9)';
  const backCol = dark ? '#aaa' : '#555';
  const backBorder = dark ? '#555' : '#888';

  // If a tool is selected, render it with a back button
  if (activeTool) {
    const tool = TOOLS.find(t => t.id === activeTool);
    if (tool?.component) {
      const Component = tool.component;
      return (
        <div>
          <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 10001 }}>
            <button
              onClick={() => setActiveTool(null)}
              style={{
                padding: '6px 14px', borderRadius: 10, border: `2px solid ${backBorder}`,
                background: backBg, color: backCol,
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
    <div style={{ minHeight: '100vh', background: bgGrad, transition: 'background 0.3s ease' }}>
      <style>{FONT_CSS}</style>
      <div style={{ textAlign: 'center', padding: '36px 20px 12px' }}>
        <h1 style={{ fontFamily: 'Caveat,cursive', fontSize: 38, fontWeight: 700, color: textCol, margin: 0, letterSpacing: 1, transition: 'color 0.3s' }}>
          🎨 Visual Thinking Toolbox
        </h1>
        <p style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 16, color: subCol, marginTop: 6, transition: 'color 0.3s' }}>
          Visuell denken, verstehen, kommunizieren.
        </p>
      </div>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '12px 20px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {TOOLS.map(tool => (
          <ToolCard key={tool.id} tool={tool} onSelect={setActiveTool} dark={dark} />
        ))}
      </div>
      <div style={{ textAlign: 'center', padding: '0 0 30px', fontFamily: 'Patrick Hand,cursive', fontSize: 12, color: dark ? '#444' : '#ccc', transition: 'color 0.3s' }}>
        Visual Thinking Toolbox · v2.0
      </div>
      {/* Gallery */}
      {(() => {
        const gallery = getGallery();
        if (!gallery.length) return null;
        const toolIcons = { sketchnote: '✏️', mindmap: '🧠', comparison: '🔄', valuesquare: '◆' };
        const toolColors = { sketchnote: '#E8584F', mindmap: '#7B68AE', comparison: '#3B7DD8', valuesquare: '#4CAF50' };
        return (
          <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px 40px' }}>
            <h3 style={{ fontFamily: 'Caveat,cursive', fontSize: 20, color: dark ? '#999' : '#aaa', textAlign: 'center', marginBottom: 12 }}>📋 Letzte Arbeiten</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {gallery.slice(0, 6).map((item, i) => (
                <div key={i} onClick={() => {
                  setPendingGalleryItem(item);
                  setActiveTool(item.tool === 'valuesquare' ? 'valuequad' : item.tool);
                }} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 12,
                  border: `1px solid ${dark ? '#333' : '#e8e8e8'}`, background: dark ? '#1E1E36' : '#fff',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  <span style={{ fontSize: 20 }}>{toolIcons[item.tool] || '📄'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Caveat,cursive', fontSize: 16, fontWeight: 600, color: toolColors[item.tool] || '#888' }}>{item.title || 'Ohne Titel'}</div>
                    <div style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 12, color: dark ? '#666' : '#bbb' }}>{new Date(item.at).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <span style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 12, color: dark ? '#555' : '#ccc' }}>→</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
