// SketchnoteTool.jsx — The Sketchnote Generator tool (full wizard + renderer)
// Now with 6 layout modes: Kästchen, Journey, Poster, Flow, KI-Bild, KI-Sketch
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FONT_CSS } from './primitives.js';
import { SCENE_NAMES } from './scenes.jsx';
import { ICON_NAMES } from './icons.jsx';
import { PAL, MOOD_VALS, gc } from './palettes.js';
import { useSettings, DARK_PAL, saveToGallery, consumePendingGalleryItem } from './settings.js';
import { T } from './translations.js';
import { callAPI } from './api.js';
import { dlS, dlP, dlJ } from './downloads.js';
import { vd } from './validate.js';
import { StructSVG, JourneySVG, PosterSVG, FlowSVG } from './Layouts.jsx';

// ═══════════════════════════════════════════
// AI IMAGE LAYOUT (GPT Image via Worker)
// ═══════════════════════════════════════════
const IMAGE_WORKER_URL = 'https://sketchnote-image.rsab1963.workers.dev';

function ImageLayout({ data, pal }) {
  const [imgSrc, setImgSrc] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const dataKey = React.useRef('');

  const generate = React.useCallback(async () => {
    setLoading(true); setErr(null); setImgSrc(null);
    try {
      const res = await fetch(IMAGE_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title, subtitle: data.subtitle, mood: data.mood,
          sections: (data.sections || []).map(s => ({ title: s.title, scene: s.scene, items: s.items })),
          footer: data.footer, cm: data.cm,
        }),
      });
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const errJson = await res.json();
        throw new Error(errJson.detail || errJson.error || 'Unbekannter Fehler');
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) setImgSrc(reader.result);
        else setErr('Bild konnte nicht geladen werden');
      };
      reader.readAsDataURL(blob);
    } catch (e) { setErr(e.message || 'Bildgenerierung fehlgeschlagen'); }
    finally { setLoading(false); }
  }, [data]);

  React.useEffect(() => {
    const key = JSON.stringify(data.title + (data.sections || []).map(s => s.title).join());
    if (key !== dataKey.current) { dataKey.current = key; generate(); }
  }, [data, generate]);

  if (loading) return (
    <div style={{ width: '100%', aspectRatio: '1536/1024', background: '#fff', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid #f0e0d8' }}>
      <div style={{ fontSize: 48, animation: 'spin 1.5s linear infinite' }}>🎨</div>
      <p style={{ fontFamily: 'Caveat, cursive', fontSize: 22, color: '#E8584F', marginTop: 16 }}>KI zeichnet dein Sketchnote...</p>
      <p style={{ fontFamily: 'Patrick Hand, cursive', fontSize: 14, color: '#888' }}>Professionelle Illustration mit lesbarem Text · ~15-20 Sek.</p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (err) return (
    <div style={{ width: '100%', aspectRatio: '1536/1024', background: '#fff', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid #f0e0d8' }}>
      <p style={{ fontFamily: 'Patrick Hand, cursive', fontSize: 16, color: '#E8584F', maxWidth: 400, textAlign: 'center' }}>⚠ {err}</p>
      <button onClick={generate} style={{ marginTop: 12, padding: '8px 24px', borderRadius: 10, border: 'none', background: '#E8584F', color: '#fff', fontFamily: 'Caveat, cursive', fontSize: 16, cursor: 'pointer' }}>🔄 Erneut versuchen</button>
    </div>
  );
  if (imgSrc) return (
    <div style={{ position: 'relative' }}>
      <img id="sketchnote-ai-img" src={imgSrc} alt={data.title} style={{ display: 'block', width: '100%', borderRadius: 12, border: '2px solid #f0e0d8' }}/>
      <button onClick={generate} style={{ position: 'absolute', top: 12, right: 12, padding: '6px 14px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.92)', color: '#E8584F', fontFamily: 'Caveat, cursive', fontSize: 14, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>🎲 Neu zeichnen</button>
    </div>
  );
  return null;
}

// ═══════════════════════════════════════════
// CLAUDE SVG SKETCH LAYOUT
// ═══════════════════════════════════════════
const SVG_SYSTEM = `Du bist ein Sketchnote-Designer. Generiere ein SVG im Bikablo-Stil.
REGELN: viewBox="0 0 1100 780". Schriften: Caveat (Titel, 700), Patrick Hand (Text). Importiere: @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap'). Akzent: #E8584F. Text: #2D2D2D. Hintergrund: weiß.
Figuren: Runde Köpfe (circle r=12-14), Punkte für Augen, Kurve für Mund, Haare als path, Körper als Linien (stroke-width=2), expressive Posen. Deko: Pfeile, Herzen, Sterne, Sprechblasen, Banner.
LAYOUT: 1) Großer Titel oben im farbigen Banner. 2) 4-6 nummerierte Sektionen mit Illustration + Stichpunkten. 3) Werkzeugkasten/Erinnerung unten. 4) Zentrale Botschaft.
WICHTIG: NUR SVG-Code, kein Markdown. Beginne mit <svg, ende mit </svg>. Alle Texte Deutsch. Mindestens 4 verschiedene Figuren.`;

function SketchLayout({ data, pal }) {
  const [svgCode, setSvgCode] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const dataKey = React.useRef('');

  const generate = React.useCallback(async () => {
    setLoading(true); setErr(null);
    try {
      const secText = (data.sections || []).map((s, i) =>
        `${i + 1}. "${s.title}" — ${(s.items || []).join(', ')}`
      ).join('\n');
      const userPrompt = `Sketchnote: "${data.title}"${data.subtitle ? ` (${data.subtitle})` : ''}\n\nSektionen:\n${secText}\n${data.cm ? `\nBotschaft: ${data.cm}` : ''}${data.footer?.title ? `\nFooter: ${data.footer.title}: ${(data.footer.items||[]).join(', ')}` : ''}\nStimmung: ${data.mood || 'optimistisch'}`;

      const apiUrl = import.meta.env.VITE_API_URL || '/api/generate';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 12000,
          system: SVG_SYSTEM,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      });
      if (!res.ok) throw new Error(`API-Fehler: HTTP ${res.status}`);
      const json = await res.json();
      const text = json.content?.[0]?.text || '';
      const match = text.match(/<svg[\s\S]*<\/svg>/);
      if (!match) throw new Error('Kein SVG in der Antwort');
      setSvgCode(match[0]);
    } catch (e) { setErr(e.message || 'SVG-Generierung fehlgeschlagen'); }
    finally { setLoading(false); }
  }, [data]);

  React.useEffect(() => {
    const key = JSON.stringify(data.title + (data.sections || []).map(s => s.title).join());
    if (key !== dataKey.current) { dataKey.current = key; generate(); }
  }, [data, generate]);

  if (loading) return (
    <div style={{ width: '100%', aspectRatio: '1100/780', background: '#fff', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid #f0e0d8' }}>
      <div style={{ fontSize: 48, animation: 'spin 1.5s linear infinite' }}>✏️</div>
      <p style={{ fontFamily: 'Caveat, cursive', fontSize: 22, color: '#E8584F', marginTop: 16 }}>Claude zeichnet dein Sketchnote...</p>
      <p style={{ fontFamily: 'Patrick Hand, cursive', fontSize: 14, color: '#888' }}>Einzigartige Illustrationen + perfekter Text · ~10-15 Sek.</p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (err) return (
    <div style={{ width: '100%', aspectRatio: '1100/780', background: '#fff', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid #f0e0d8' }}>
      <p style={{ fontFamily: 'Patrick Hand, cursive', fontSize: 16, color: '#E8584F', maxWidth: 400, textAlign: 'center' }}>⚠ {err}</p>
      <button onClick={generate} style={{ marginTop: 12, padding: '8px 24px', borderRadius: 10, border: 'none', background: '#E8584F', color: '#fff', fontFamily: 'Caveat, cursive', fontSize: 16, cursor: 'pointer' }}>🔄 Erneut versuchen</button>
    </div>
  );
  if (svgCode) return (
    <div style={{ position: 'relative' }}>
      <div id="sketchnote-svg-container" dangerouslySetInnerHTML={{ __html: svgCode.replace('<svg', '<svg id="sketchnote-svg" style="width:100%;height:100%;border-radius:12px"') }}/>
      <button onClick={generate} style={{ position: 'absolute', top: 12, right: 12, padding: '6px 14px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.92)', color: '#E8584F', fontFamily: 'Caveat, cursive', fontSize: 14, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>🎲 Neu zeichnen</button>
    </div>
  );
  return null;
}

// ═══════════════════════════════════════════
// LAYOUT MAP + BUTTON STYLE HELPER
// ═══════════════════════════════════════════

const LAYOUT_MAP = { structured: StructSVG, journey: JourneySVG, poster: PosterSVG, flow: FlowSVG };

const bt = (c, f) => ({
  padding: '9px 16px', borderRadius: 10, border: f ? 'none' : `2px solid ${c}`,
  background: f ? c : '#fff', color: f ? '#fff' : c,
  fontFamily: 'Caveat,cursive', fontSize: 16, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
});

const sl = (t) => (t || 'sketchnote').replace(/[^a-zA-Z0-9äöüß]/g, '-').replace(/-+/g, '-').slice(0, 40);

// ═══════════════════════════════════════════
// MAIN SKETCHNOTE TOOL COMPONENT
// ═══════════════════════════════════════════

export default function SketchnoteTool() {
  const [ph, setPh] = useState('mode');
  const [mode, setMode] = useState(null);
  const [ans, setAns] = useState({});
  const [sn, setSn] = useState(null);
  const [pal, setPal] = useState(PAL.neutral);
  const [err, setErr] = useState(null);
  const [rs, setRs] = useState('structured');
  const [step, setStep] = useState(0);
  const [ft, setFt] = useState('');
  const [frs, setFrs] = useState('structured');
  const [ed, setEd] = useState(false);
  const [lang, setLang] = useState('de');
  const [fs, setFs] = useState(false);
  const fr = useRef(null);
  const { dark } = useSettings();
  const t = T[lang] || T.de;
  const bgGrad = dark ? 'linear-gradient(145deg,#12122A,#1A1A2E)' : 'linear-gradient(145deg,#FEFCFB,#F5F0EB)';
  const textCol = dark ? '#E8E8E8' : '#2D2D2D';
  const subCol = dark ? '#777' : '#aaa';

  // Undo
  const undoRef = useRef(null);
  const undo = () => { if (undoRef.current) { setSn(undoRef.current); undoRef.current = null; } };
  const snSet = (fn) => setSn(p => { if (!p) return p; undoRef.current = p; return fn(p); });

  // Section editing helpers
  const updSec = (idx, f2, v) => { snSet(p => ({ ...p, sections: p.sections.map((s, i) => i === idx ? { ...s, [f2]: v } : s) })); };
  const updItem = (si, ii, v) => { snSet(p => ({ ...p, sections: p.sections.map((s, i) => i === si ? { ...s, items: s.items.map((x, j) => j === ii ? v : x) } : s) })); };
  const addItem = (si) => { setSn(p => { if (!p) return p; return { ...p, sections: p.sections.map((s, i) => i === si ? { ...s, items: [...s.items, '...'] } : s) }; }); };
  const delItem = (si, ii) => { setSn(p => { if (!p) return p; return { ...p, sections: p.sections.map((s, i) => i === si ? { ...s, items: s.items.filter((_, j) => j !== ii) } : s) }; }); };
  const updTitle = (v) => { setSn(p => p ? { ...p, title: v } : p); };
  const updSubtitle = (v) => { setSn(p => p ? { ...p, subtitle: v } : p); };
  const updCm = (v) => { setSn(p => p ? { ...p, cm: v } : p); };

  // Auto-load from gallery
  useEffect(() => {
    const item = consumePendingGalleryItem();
    if (item?.tool === "sketchnote" && item.data) {
      const P = dark ? DARK_PAL : PAL;
      setSn(vd(item.data)); setPal(P[item.data.mood || "neutral"] || P.neutral); setPh("result");
    }
  }, []);

  const gen = useCallback(async (a, m) => {
    setAns(a); setPh('loading'); setErr(null);
    try {
      const d = await callAPI(a, m, 0, lang);
      const mi2 = t.steps[5].o.indexOf(a.mood);
      const mk = m === 'guided' ? (MOOD_VALS[mi2 >= 0 ? mi2 : 0] || 'neutral') : (d.mood && PAL[d.mood] ? d.mood : 'empathisch');
      const P = dark ? DARK_PAL : PAL;
      setPal(P[mk] || P.neutral);
      setSn(d);
      setPh('result');
      saveToGallery({ tool: 'sketchnote', title: d.title, topic: a.topic || a.freetext || '', data: d });
    } catch (e) {
      console.error(e);
      setErr(e.message);
      setPh(m === 'guided' ? 'guided' : 'free');
    }
  }, [lang, t]);

  // ─── SHARED HEADER ───
  const hdr = (
    <div style={{ textAlign: 'center', paddingTop: 18, paddingBottom: 6 }}>
      <h1 style={{ fontFamily: 'Caveat,cursive', fontSize: 30, fontWeight: 700, color: textCol, margin: 0, letterSpacing: 1 }}>{t.title}</h1>
      <p style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 15, color: subCol, margin: '4px 0 0' }}>{t.sub}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
        {['de', 'en', 'ru'].map(l => (
          <button key={l} onClick={() => setLang(l)} style={{ padding: '2px 10px', borderRadius: 6, border: lang === l ? '2px solid #E8584F' : '2px solid transparent', background: 'none', fontFamily: 'Caveat,cursive', fontSize: 14, cursor: 'pointer', color: textCol }}>{l.toUpperCase()}</button>
        ))}
      </div>
    </div>
  );
  const errBox = err && (<div style={{ maxWidth: 500, margin: '10px auto', padding: 14, background: '#FFF0F0', borderRadius: 10, border: '1px solid #E8584F', fontFamily: 'Patrick Hand,cursive', color: '#E8584F', fontSize: 14 }}>{err}</div>);

  // ─── MODE SELECT ───
  if (ph === 'mode') return (
    <div style={{ minHeight: '100vh', background: bgGrad }}>
      <style>{FONT_CSS}</style>{hdr}
      <div style={{ maxWidth: 420, margin: '0 auto', padding: 20 }}>
        <h2 style={{ fontFamily: 'Caveat,cursive', fontSize: 22, fontWeight: 700, color: textCol, marginBottom: 16 }}>{t.howStart}</h2>
        {[['guided', t.guided, t.guidedDesc], ['free', t.free, t.freeDesc]].map(([k, la, desc]) => (
          <button key={k} onClick={() => { setMode(k); setPh(k); setStep(0); setAns({}); setFt(''); setErr(null); }}
            style={{ display: 'block', width: '100%', marginBottom: 12, padding: 16, borderRadius: 14, border: '2px solid #e0e0e0', background: dark ? '#1A1A2E' : '#fff', textAlign: 'left', cursor: 'pointer' }}>
            <div style={{ fontFamily: 'Caveat,cursive', fontSize: 19, fontWeight: 700, color: textCol }}>{la}</div>
            <div style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: subCol, marginTop: 2 }}>{desc}</div>
          </button>
        ))}
        <button onClick={() => { fr.current?.click(); }}
          style={{ display: 'block', width: '100%', marginBottom: 12, padding: 16, borderRadius: 14, border: '2px solid #e0e0e0', background: dark ? '#1A1A2E' : '#fff', textAlign: 'left', cursor: 'pointer' }}>
          <div style={{ fontFamily: 'Caveat,cursive', fontSize: 19, fontWeight: 700, color: textCol }}>{t.load}</div>
          <div style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: subCol, marginTop: 2 }}>{t.loadDesc}</div>
        </button>
        <input ref={fr} type="file" accept=".json" style={{ display: 'none' }} onChange={e => {
          const f = e.target.files?.[0]; if (!f) return;
          const reader = new FileReader();
          reader.onload = ev => { try { const j = JSON.parse(ev.target.result); if (j.answers) { setAns(j.answers); setMode(j.mode || 'free'); } const P = dark ? DARK_PAL : PAL; setPal(P[j.data?.mood || 'neutral'] || P.neutral); setRs(j.layout || 'structured'); setSn(vd(j.data)); setPh('result'); } catch(err2) { setErr('JSON ungültig: ' + err2.message); } };
          reader.readAsText(f);
        }}/>
      </div>
    </div>
  );

  // ─── GUIDED ───
  if (ph === 'guided') {
    const steps = t.steps;
    const c = steps[step];
    const ok = c.o ? !!ans[c.id] : !!(ans[c.id] || '').trim();
    return (
      <div style={{ minHeight: '100vh', background: bgGrad }}>
        <style>{FONT_CSS}</style>{hdr}{errBox}
        <div style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
          <div style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 13, color: subCol, marginBottom: 6 }}>{t.step} {step + 1} {t.of} {steps.length} · {c.l}</div>
          <h2 style={{ fontFamily: 'Caveat,cursive', fontSize: 22, fontWeight: 700, color: textCol, marginBottom: 14 }}>{c.q}</h2>
          {c.ph ? (<textarea value={ans[c.id] || ''} onChange={e => setAns(a => ({ ...a, [c.id]: e.target.value }))} placeholder={c.ph} style={{ width: '100%', minHeight: 90, padding: 14, borderRadius: 12, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 14, resize: 'vertical', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box', lineHeight: 1.5 }}/>)
          : (<div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>{c.o.map(o => (<button key={o} onClick={() => setAns(a => ({ ...a, [c.id]: o }))} style={{ padding: '10px 15px', borderRadius: 12, textAlign: 'left', fontFamily: 'Patrick Hand,cursive', fontSize: 15, cursor: 'pointer', border: ans[c.id] === o ? '2px solid #E8584F' : '2px solid #e0e0e0', background: ans[c.id] === o ? '#FFF5F0' : '#FAFAFA', color: textCol }}>{o}</button>))}</div>)}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button onClick={() => step > 0 ? setStep(s => s - 1) : setPh('mode')} style={bt('#888', false)}>{step > 0 ? t.back : t.modeSel}</button>
            <button onClick={() => { if (step < steps.length - 1) setStep(s => s + 1); else { const sv = ans.style || ''; setRs(sv.includes('Free') || sv.includes('Frei') || sv.includes('\u0421\u0432\u043e\u0431\u043e\u0434\u043d\u044b\u0439') ? 'flow' : 'structured'); gen(ans, 'guided'); } }} disabled={!ok} style={{ ...bt(ok ? '#E8584F' : '#ccc', true), fontSize: 18 }}>{step < steps.length - 1 ? t.next : t.create}</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── FREE MODE ───
  if (ph === 'free') {
    const tpls = t.steps[1]?.ph ? [t.steps[1].ph] : [];
    return (
      <div style={{ minHeight: '100vh', background: bgGrad }}>
        <style>{FONT_CSS}</style>{hdr}{errBox}
        <div style={{ maxWidth: 560, margin: '0 auto', padding: 20 }}>
          <h2 style={{ fontFamily: 'Caveat,cursive', fontSize: 24, fontWeight: 700, color: textCol, marginBottom: 5 }}>{t.freeTitle}</h2>
          <p style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: subCol, marginBottom: 12 }}>{t.freeHint}</p>
          <textarea value={ft} onChange={e => setFt(e.target.value)} placeholder={t.freePh} style={{ width: '100%', minHeight: 160, padding: 15, borderRadius: 14, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 15, resize: 'vertical', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box', lineHeight: 1.6 }}/>
          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            {Object.entries(t.layouts || {}).map(([k, la]) => (
              <button key={k} onClick={() => setFrs(k)} style={{ flex: 1, minWidth: 70, padding: 8, borderRadius: 10, border: frs === k ? '2px solid #3B7DD8' : '2px solid #e0e0e0', background: frs === k ? '#F0F4FF' : '#FAFAFA', fontFamily: 'Caveat,cursive', fontSize: 14, cursor: 'pointer', color: textCol }}>{la}</button>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <button onClick={() => setPh('mode')} style={bt('#888', false)}>{t.modeSel}</button>
            <button onClick={() => { if (!ft.trim()) return; setRs(frs); gen({ freetext: ft }, 'free'); }} disabled={!ft.trim()} style={{ ...bt(ft.trim() ? '#3B7DD8' : '#ccc', true), fontSize: 18 }}>{t.create}</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── LOADING ───
  if (ph === 'loading') return (
    <div style={{ minHeight: '100vh', background: bgGrad, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <style>{FONT_CSS}</style>
      <div style={{ width: 46, height: 46, border: '4px solid #f0e0e0', borderTop: '4px solid #E8584F', borderRadius: '50%', animation: 'spin 1s linear infinite' }}/>
      <div style={{ fontFamily: 'Caveat,cursive', fontSize: 20, color: '#E8584F', fontWeight: 600 }}>{t.loading}</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  // ─── RESULT ───
  if (ph === 'result' && sn) {
    let svg;
    if (rs === 'aigen') { svg = <ImageLayout data={sn} pal={pal}/>; }
    else if (rs === 'aisketch') { svg = <SketchLayout data={sn} pal={pal}/>; }
    else {
      try { const Comp = LAYOUT_MAP[rs] || StructSVG; svg = <Comp data={sn} pal={pal}/>; }
      catch (e) { svg = <div style={{ padding: 20, color: '#E8584F' }}>Error: {e.message}</div>; }
    }
    const eS = { width: '100%', padding: '8px 10px', borderRadius: 8, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#FAFAFA' };

    if (fs) return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#fff', zIndex: 9999, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <style>{FONT_CSS}</style>
        <button onClick={() => setFs(false)} style={{ position: 'fixed', top: 12, right: 12, zIndex: 10000, ...bt('#E8584F', true), fontSize: 18 }}>{t.exitFs}</button>
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
          <div style={{ width: '100%', maxWidth: 1200, touchAction: 'pinch-zoom' }}>{svg}</div>
        </div>
      </div>
    );

    return (
      <div style={{ minHeight: '100vh', background: bgGrad }}>
        <style>{FONT_CSS}</style>{hdr}
        <div style={{ padding: 14 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => { setPh('mode'); setMode(null); setAns({}); setSn(null); setErr(null); setEd(false); }} style={bt('#888', false)}>{t.neu}</button>
            <button onClick={() => gen(ans, mode)} style={bt('#E8584F', false)}>{t.reroll}</button>
            <button onClick={undo} disabled={!undoRef.current} style={bt(undoRef.current ? '#E8584F' : '#ccc', false)}>↩ Undo</button>
            <button onClick={() => setEd(e2 => !e2)} style={bt(ed ? '#E8584F' : '#7B68AE', ed)}>{ed ? t.done : t.edit}</button>
          </div>
          {/* Layout selector — 6 modes */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {Object.entries(t.layouts || {}).map(([k, la]) => (
              <button key={k} onClick={() => setRs(k)} style={{ ...bt(rs === k ? '#3B7DD8' : '#999', rs === k), fontSize: 14, padding: '7px 12px' }}>{la}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => setFs(true)} style={bt('#555', false)}>{t.fullscreen}</button>
            {rs !== 'aigen' && <button onClick={() => dlS(sn.title)} style={bt('#2E86AB', false)}>SVG</button>}
            <button onClick={() => {
              if (rs === 'aigen') {
                const im = document.getElementById('sketchnote-ai-img');
                if (!im || !im.src) return;
                const a = Object.assign(document.createElement('a'), { href: im.src, download: `sn-${sl(sn.title)}.png` });
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
              } else dlP(sn.title, pal);
            }} style={bt('#4CAF50', false)}>PNG</button>
            <button onClick={() => dlJ(ans, sn, mode, rs)} style={bt('#F5A623', false)}>{t.save}</button>
          </div>
          <div style={{ maxWidth: 1100, margin: '0 auto', boxShadow: '0 6px 28px rgba(0,0,0,.1)', borderRadius: 12, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>{svg}</div>
          {ed && (
            <div style={{ maxWidth: 800, margin: '20px auto', padding: 20, background: '#fff', borderRadius: 14, border: '2px solid #e0e0e0' }}>
              <h3 style={{ fontFamily: 'Caveat,cursive', fontSize: 22, color: textCol, marginBottom: 12 }}>{t.editTitle}</h3>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 2, minWidth: 150 }}><label style={{ fontFamily: 'Caveat,cursive', fontSize: 14, color: '#888' }}>{t.titleL}</label><input value={sn.title} onChange={e => updTitle(e.target.value)} style={eS}/></div>
                <div style={{ flex: 3, minWidth: 200 }}><label style={{ fontFamily: 'Caveat,cursive', fontSize: 14, color: '#888' }}>{t.subtitleL}</label><input value={sn.subtitle || ''} onChange={e => updSubtitle(e.target.value)} style={eS}/></div>
              </div>
              <div style={{ marginBottom: 16 }}><label style={{ fontFamily: 'Caveat,cursive', fontSize: 14, color: '#888' }}>{t.centralL}</label><input value={sn.cm || ''} onChange={e => updCm(e.target.value)} style={eS}/></div>
              {sn.sections.map((sec, si) => (
                <div key={si} style={{ marginBottom: 14, padding: 12, borderRadius: 10, border: '2px solid #eee', background: '#fafafa' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'Caveat,cursive', fontSize: 16, fontWeight: 700, color: gc(pal, sec.color), minWidth: 24 }}>{sec.n}.</span>
                    <input value={sec.title} onChange={e => updSec(si, 'title', e.target.value)} style={{ ...eS, flex: 1, minWidth: 120, fontWeight: 600 }}/>
                    <select value={sec.scene || ''} onChange={e => updSec(si, 'scene', e.target.value || null)} style={{ ...eS, width: 130, flex: 'none' }}><option value="">{t.noScene}</option>{SCENE_NAMES.map(s2 => (<option key={s2} value={s2}>{s2}</option>))}</select>
                    <select value={sec.color} onChange={e => updSec(si, 'color', e.target.value)} style={{ ...eS, width: 95, flex: 'none' }}><option value="primary">{t.primary}</option><option value="secondary">{t.secondary}</option><option value="accent">{t.accent}</option></select>
                  </div>
                  {sec.items.map((item, ii) => (
                    <div key={ii} style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'center', paddingLeft: 32 }}>
                      <span style={{ color: gc(pal, sec.color), fontSize: 18 }}>*</span>
                      <input value={item} onChange={e => updItem(si, ii, e.target.value)} style={{ ...eS, flex: 1 }}/>
                      <button onClick={() => delItem(si, ii)} style={{ background: 'none', border: 'none', color: '#E8584F', cursor: 'pointer', fontSize: 18, padding: '0 4px' }}>x</button>
                    </div>
                  ))}
                  <button onClick={() => addItem(si)} style={{ marginLeft: 32, background: 'none', border: 'none', color: gc(pal, sec.color), cursor: 'pointer', fontFamily: 'Patrick Hand,cursive', fontSize: 13 }}>{t.addItem}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── FALLBACK ───
  return (
    <div style={{ minHeight: '100vh', background: '#FEFCFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{FONT_CSS}</style>
      <button onClick={() => setPh('mode')} style={bt('#E8584F', true)}>Start</button>
    </div>
  );
}
