import React, { useState, useCallback, useRef, useEffect } from "react";
import { SCENE_NAMES } from "./Scenes.jsx";
import { ICON_NAMES } from "./Icons.jsx";
import { FC, PAL, gc } from "./helpers.js";
import { StructSVG, JourneySVG, PosterSVG, FlowSVG } from "./Layouts.jsx";


const T = {
  de: {
    title:'Sketchnote Visualizer', sub:'Strukturiert oder Frei · Bikablo-Stil',
    howStart:'Wie möchtest du starten?', guided:'📋 Geführt', guidedDesc:'Schritt für Schritt durch Fragen.',
    free:'✍️ Freier Modus', freeDesc:'Alles frei beschreiben — KI leitet alles ab.',
    load:'📂 Projekt laden', loadDesc:'Gespeichertes .json importieren.',
    step:'SCHRITT', of:'von', back:'← Zurück', modeSel:'← Modus', next:'Weiter →', create:'✨ Erstellen',
    freeTitle:'Beschreibe dein Thema frei', freeHint:'KI erkennt Struktur, Stimmung und Szenen automatisch.',
    freePh:'z.B. Coaching: Selbstständigkeit. Angst überwinden, Netzwerk, Kunden finden.',
    structured:'📦 Strukturiert', freeSketch:'🎨 Freie Skizze',
    loading:'Sketchnote wird erstellt...', neu:'← Neu', reroll:'🎲 Neu würfeln',
    edit:'📝 Bearbeiten', done:'✓ Fertig', boxes:'📦 Kästchen', freeL:'🎨 Frei',
    layouts:{structured:'📦 Kästchen',journey:'🗺️ Journey',poster:'📰 Poster',flow:'🔄 Flow',aigen:'🎨 KI-Bild',aisketch:'✏️ KI-Sketch'},
    save:'💾 Speichern', editTitle:'📝 Direkt bearbeiten',
    titleL:'Titel', subtitleL:'Untertitel', centralL:'Zentrale Botschaft',
    noScene:'Kein Bild', primary:'Primär', secondary:'Sekundär', accent:'Akzent',
    addItem:'+ Punkt hinzufügen', fullscreen:'⛶ Vollbild', exitFs:'✕ Schließen',
    steps:[
      {id:'style',l:'Stil',q:'Darstellungsstil?',o:['📦 Strukturiert','🎨 Freie Skizze']},
      {id:'topic',l:'Thema',q:'Beschreibe das Thema.',ph:'z.B. Selbstständigkeit...'},
      {id:'context',l:'Kontext',q:'Wofür?',o:['Selbstreflexion','Coaching','Beratung','Workshop','Präsentation']},
      {id:'goal',l:'Ziel',q:'Was soll verstanden werden?',ph:'z.B. Mut + nächste Schritte'},
      {id:'structure',l:'Struktur',q:'Welche Struktur?',o:['Prozess','Übersicht','Problem-Lösung','Vergleich','Zeitstrahl','Zyklus']},
      {id:'mood',l:'Stimmung',q:'Welche Stimmung?',o:['Optimistisch','Neutral','Nachdenklich','Energisch','Empathisch']},
      {id:'orientation',l:'Format',q:'Format?',o:['Querformat','Hochformat','Automatisch']},
      {id:'extras',l:'Extras',q:'Weitere Elemente? (optional)',ph:'Begriffe...'},
    ],
    apiLang:'Deutsch',
  },
  en: {
    title:'Sketchnote Visualizer', sub:'Structured or Free · Bikablo Style',
    howStart:'How do you want to start?', guided:'📋 Guided', guidedDesc:'Step by step through questions.',
    free:'✍️ Free Mode', freeDesc:'Describe everything freely — AI figures it out.',
    load:'📂 Load Project', loadDesc:'Import a saved .json file.',
    step:'STEP', of:'of', back:'← Back', modeSel:'← Mode', next:'Next →', create:'✨ Create',
    freeTitle:'Describe your topic freely', freeHint:'AI detects structure, mood and scenes automatically.',
    freePh:'e.g. Coaching: self-employment. Overcoming fear, networking, finding clients.',
    structured:'📦 Structured', freeSketch:'🎨 Free Sketch',
    loading:'Creating sketchnote...', neu:'← New', reroll:'🎲 Reroll',
    edit:'📝 Edit', done:'✓ Done', boxes:'📦 Boxes', freeL:'🎨 Free',
    layouts:{structured:'📦 Boxes',journey:'🗺️ Journey',poster:'📰 Poster',flow:'🔄 Flow',aigen:'🎨 AI Image',aisketch:'✏️ AI Sketch'},
    save:'💾 Save', editTitle:'📝 Edit directly',
    titleL:'Title', subtitleL:'Subtitle', centralL:'Central message',
    noScene:'No image', primary:'Primary', secondary:'Secondary', accent:'Accent',
    addItem:'+ Add point', fullscreen:'⛶ Fullscreen', exitFs:'✕ Close',
    steps:[
      {id:'style',l:'Style',q:'Presentation style?',o:['📦 Structured','🎨 Free Sketch']},
      {id:'topic',l:'Topic',q:'Describe the topic.',ph:'e.g. Self-employment...'},
      {id:'context',l:'Context',q:'What for?',o:['Self-reflection','Coaching','Consulting','Workshop','Presentation']},
      {id:'goal',l:'Goal',q:'What should be understood?',ph:'e.g. Courage + next steps'},
      {id:'structure',l:'Structure',q:'Which structure?',o:['Process','Overview','Problem-Solution','Comparison','Timeline','Cycle']},
      {id:'mood',l:'Mood',q:'Which mood?',o:['Optimistic','Neutral','Reflective','Energetic','Empathetic']},
      {id:'orientation',l:'Format',q:'Format?',o:['Landscape','Portrait','Automatic']},
      {id:'extras',l:'Extras',q:'Specific elements? (optional)',ph:'Terms, metaphors...'},
    ],
    apiLang:'English',
  },
  ru: {
    title:'Скетчноут Визуализатор', sub:'Структурированный или свободный · стиль Бикабло',
    howStart:'Как вы хотите начать?', guided:'📋 Пошагово', guidedDesc:'Шаг за шагом через вопросы.',
    free:'✍️ Свободный', freeDesc:'Опишите всё свободно — ИИ определит всё сам.',
    load:'📂 Загрузить', loadDesc:'Импортировать сохранённый .json файл.',
    step:'ШАГ', of:'из', back:'← Назад', modeSel:'← Режим', next:'Далее →', create:'✨ Создать',
    freeTitle:'Опишите тему свободно', freeHint:'ИИ автоматически определит структуру и настроение.',
    freePh:'напр. Коучинг: самозанятость. Преодоление страха, нетворкинг, поиск клиентов.',
    structured:'📦 Структура', freeSketch:'🎨 Свободный',
    loading:'Создание скетчноута...', neu:'← Новый', reroll:'🎲 Перегенерировать',
    edit:'📝 Редактировать', done:'✓ Готово', boxes:'📦 Блоки', freeL:'🎨 Свободный',
    layouts:{structured:'📦 Блоки',journey:'🗺️ Путь',poster:'📰 Постер',flow:'🔄 Поток',aigen:'🎨 ИИ-Арт',aisketch:'✏️ ИИ-Скетч'},
    save:'💾 Сохранить', editTitle:'📝 Прямое редактирование',
    titleL:'Заголовок', subtitleL:'Подзаголовок', centralL:'Главное сообщение',
    noScene:'Без картинки', primary:'Основной', secondary:'Вторичный', accent:'Акцент',
    addItem:'+ Добавить пункт', fullscreen:'⛶ На весь экран', exitFs:'✕ Закрыть',
    steps:[
      {id:'style',l:'Стиль',q:'Стиль представления?',o:['📦 Структурированный','🎨 Свободный скетч']},
      {id:'topic',l:'Тема',q:'Опишите тему.',ph:'напр. Самозанятость...'},
      {id:'context',l:'Контекст',q:'Для чего?',o:['Саморефлексия','Коучинг','Консультация','Мастер-класс','Презентация']},
      {id:'goal',l:'Цель',q:'Что должно быть понято?',ph:'напр. Смелость + следующие шаги'},
      {id:'structure',l:'Структура',q:'Какая структура?',o:['Процесс','Обзор','Проблема-Решение','Сравнение','Хронология','Цикл']},
      {id:'mood',l:'Настроение',q:'Какое настроение?',o:['Оптимистичный','Нейтральный','Задумчивый','Энергичный','Эмпатичный']},
      {id:'orientation',l:'Формат',q:'Формат?',o:['Горизонтальный','Вертикальный','Автоматически']},
      {id:'extras',l:'Дополнения',q:'Особые элементы? (необязательно)',ph:'Термины, метафоры...'},
    ],
    apiLang:'Russian',
  },
};

/* ═══ AI IMAGE LAYOUT (DALL-E 3 via Worker) ═══ */
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
    <div style={{ width: '100%', aspectRatio: '1792/1024', background: '#fff', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid #f0e0d8' }}>
      <div style={{ fontSize: 48, animation: 'spin 1.5s linear infinite' }}>🎨</div>
      <p style={{ fontFamily: 'Caveat, cursive', fontSize: 22, color: '#E8584F', marginTop: 16 }}>DALL·E 3 zeichnet dein Sketchnote...</p>
      <p style={{ fontFamily: 'Patrick Hand, cursive', fontSize: 14, color: '#888' }}>Professionelle Illustration mit lesbarem Text · ~15-20 Sek.</p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (err) return (
    <div style={{ width: '100%', aspectRatio: '1792/1024', background: '#fff', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid #f0e0d8' }}>
      <p style={{ fontFamily: 'Patrick Hand, cursive', fontSize: 16, color: '#E8584F', maxWidth: 400, textAlign: 'center' }}>⚠ {err}</p>
      <button onClick={generate} style={{ marginTop: 12, padding: '8px 24px', borderRadius: 10, border: 'none', background: '#E8584F', color: '#fff', fontFamily: 'Caveat, cursive', fontSize: 16, cursor: 'pointer' }}>🔄 Erneut versuchen</button>
    </div>
  );

  if (imgSrc) return (
    <div style={{ position: 'relative' }}>
      <img id="sketchnote-ai-img" src={imgSrc} alt={data.title}
        style={{ display: 'block', width: '100%', borderRadius: 12, border: '2px solid #f0e0d8' }}/>
      <button onClick={generate}
        style={{ position: 'absolute', top: 12, right: 12, padding: '6px 14px', borderRadius: 8, border: 'none',
          background: 'rgba(255,255,255,0.92)', color: '#E8584F', fontFamily: 'Caveat, cursive', fontSize: 14,
          cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>🎲 Neu zeichnen</button>
    </div>
  );

  return null;
}

/* ═══ CLAUDE SVG SKETCH LAYOUT ═══ */
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

function vd(d){
  if(!d||typeof d!=='object')throw new Error('Ungültig');
  return{title:String(d.title||'Sketchnote'),subtitle:d.subtitle?String(d.subtitle):'',orientation:d.orientation==='portrait'?'portrait':'landscape',mood:d.mood||'neutral',cm:d.centralMessage?String(d.centralMessage):'',
    layout:{columns:Number(d.layout?.columns)||3},
    sections:Array.isArray(d.sections)?d.sections.map((s,i)=>({n:s.number||i+1,title:String(s.title||''),scene:SCENE_NAMES.includes(s.scene)?s.scene:null,sym:ICON_NAMES.includes(s.symbol)?s.symbol:'star',color:s.color||'primary',items:Array.isArray(s.items)?s.items.map(String).slice(0,5):[]})):[],
    footer:{title:String(d.footer?.title||''),items:Array.isArray(d.footer?.items)?d.footer.items.map(String).slice(0,4):[]},
  };
}

/* ═══ WIZARD ═══ */
const MOOD_VALS=['optimistisch','neutral','nachdenklich','energisch','empathisch'];
const ORIENT_VALS=['landscape','portrait','auto'];

async function callAPI(answers,mode,attempt=0,lang='de'){
  const scL=SCENE_NAMES.join(','),syL=ICON_NAMES.join(',');
  const tLang=T[lang]?.apiLang||'Deutsch';
  const base=`Sketchnote-Designer, Bikablo-Stil. NUR reines JSON antworten. Keine Backticks, kein Text.
Szenen:${scL}
Szenen-Guide: mountainClimb=Herausforderung,targetHit=Ziel,bridge=Verbindung,seedToTree=Wachstum,lighthouse=Orientierung,teamCircle=Teamwork,ladder=Aufstieg,compass=Richtung,figureThinking=Reflexion,figureCelebrate=Erfolg,doorOpen=Neuanfang,puzzleFit=Zusammenhang,figureHandshake=Vereinbarung/Kennenlernen,figureConversation=Dialog/Austausch,figureListening=Zuhören/Empathie,figureHug=Nähe/Trost,figureFear=Angst/Hemmung,figureDoubt=Zweifel/Entscheidung,figureBalance=Balance/Gleichgewicht,figureCourage=Mut/Durchbruch,windingRoad=Lebensweg/Prozess,mirrorReflect=Selbstreflexion,scaleBalance=Abwägen,networkNodes=Netzwerk/Vernetzung,treasure=Schatz/Potenzial,wallBreak=Durchbruch/Überwindung
Symbole:${syL}
JSON:{"title":"..","subtitle":"..","orientation":"landscape","mood":"optimistisch","centralMessage":"..","layout":{"columns":3},"sections":[{"number":1,"title":"..","scene":"name|null","symbol":"name","color":"primary","items":["..max28Z"]}],"footer":{"title":"FAZIT","items":[".."]}}
Erste 4-5 Sektionen=Hauptstory,Rest=Werkzeugkasten. 7-9 Sektionen,2-3 kurze Stichpunkte(max 28Z!),Titel max 22Z,mind.5 mit scene,Nutze vielfältige Szenen!
WICHTIG: Alle Texte in ${tLang} schreiben!`;
  let sys,usr;
  const tl=T[lang]||T.de;
  if(mode==='guided'){
    const mi=tl.steps[5].o.indexOf(answers.mood);const mk=MOOD_VALS[mi>=0?mi:0]||'neutral';
    const oi=tl.steps[6].o.indexOf(answers.orientation);const or2=ORIENT_VALS[oi>=0?oi:0]||'landscape';
    sys=base+` Stimmung:${mk} Struktur:${answers.structure} Kontext:${answers.context} Orient:${or2==='auto'?'wähle':or2}`;
    usr=`THEMA:${answers.topic} ZIEL:${answers.goal||''} EXTRA:${answers.extras||''} JSON:`;
  }else{sys=base+' Freie Beschreibung.Leite alles ab.';usr=`BESCHREIBUNG:${answers.freetext} JSON:`;}
  const apiUrl = import.meta.env.VITE_API_URL || '/api/generate';
  const res=await fetch(apiUrl,{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,system:sys,messages:[{role:"user",content:usr}]})});
  if(res.status===429&&attempt<2){await new Promise(r=>setTimeout(r,(attempt+1)*15000));return callAPI(answers,mode,attempt+1,lang);}
  if(!res.ok)throw new Error(res.status===429?'Rate-Limit erreicht. Bitte 30s warten und erneut versuchen.':`API-Fehler ${res.status}`);
  const data=await res.json();if(data.error)throw new Error(data.error.message);
  const text=(data.content||[]).map(b=>b.text||'').join('');if(!text.trim())throw new Error('Leer');
  const cl=text.replace(/```json\s*/g,'').replace(/```\s*/g,'').trim();
  let p;try{p=JSON.parse(cl);}catch(e){const mt=cl.match(/\{[\s\S]*\}/);if(mt)p=JSON.parse(mt[0]);else throw new Error('JSON-Fehler');}
  return vd(p);
}

function dlB(b,n){const u=URL.createObjectURL(b),a=Object.assign(document.createElement('a'),{href:u,download:n});document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(u),1000);}
function sl(t){return(t||'x').toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,30);}
function dlS(t){const el=document.getElementById('sketchnote-svg');if(!el)return;const c=el.cloneNode(true);c.setAttribute('xmlns','http://www.w3.org/2000/svg');dlB(new Blob([new XMLSerializer().serializeToString(c)],{type:'image/svg+xml'}),`sn-${sl(t)}.svg`);}
function dlP(t,p){const el=document.getElementById('sketchnote-svg');if(!el)return;const c=el.cloneNode(true);c.setAttribute('xmlns','http://www.w3.org/2000/svg');const s=new XMLSerializer().serializeToString(c),vb=el.getAttribute('viewBox').split(' ').map(Number);const cv=Object.assign(document.createElement('canvas'),{width:vb[2]*2,height:vb[3]*2}),ctx=cv.getContext('2d'),img=new Image();img.onload=()=>{ctx.fillStyle=p.bg;ctx.fillRect(0,0,cv.width,cv.height);ctx.drawImage(img,0,0,cv.width,cv.height);cv.toBlob(b=>{if(b)dlB(b,`sn-${sl(t)}.png`);},'image/png');};img.onerror=()=>alert('PNG fehler');img.src='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(s)));}
function dlJ(a,d,m,r){dlB(new Blob([JSON.stringify({v:7,mode:m,rs:r,answers:a,data:d,at:new Date().toISOString()},null,2)],{type:'application/json'}),`sn-${sl(d?.title)}.json`);}

const bt=(c,f)=>({padding:'9px 16px',borderRadius:10,border:f?'none':`2px solid ${c}`,background:f?c:'#fff',color:f?'#fff':c,fontFamily:'Caveat,cursive',fontSize:16,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap'});


export default function App({ onBack }){
  const[ph,setPh]=useState('mode');
  const[mode,setMode]=useState(null);
  const[ans,setAns]=useState({});
  const[sn,setSn]=useState(null);
  const[pal,setPal]=useState(PAL.neutral);
  const[err,setErr]=useState(null);
  const[rs,setRs]=useState('structured');
  const[step,setStep]=useState(0);
  const[ft,setFt]=useState('');
  const[frs,setFrs]=useState('flow');
  const[ed,setEd]=useState(false);
  const[lang,setLang]=useState('de');
  const[fs,setFs]=useState(false);
  const fr=useRef(null);
  const t=T[lang]||T.de;

  const updSec=(idx,f2,v)=>{setSn(p=>{if(!p)return p;return{...p,sections:p.sections.map((s,i)=>i===idx?{...s,[f2]:v}:s)};});};
  const updItem=(si,ii,v)=>{setSn(p=>{if(!p)return p;return{...p,sections:p.sections.map((s,i)=>i===si?{...s,items:s.items.map((x,j)=>j===ii?v:x)}:s)};});};
  const addItem=(si)=>{setSn(p=>{if(!p)return p;return{...p,sections:p.sections.map((s,i)=>i===si?{...s,items:[...s.items,'...']}:s)};});};
  const delItem=(si,ii)=>{setSn(p=>{if(!p)return p;return{...p,sections:p.sections.map((s,i)=>i===si?{...s,items:s.items.filter((_,j)=>j!==ii)}:s)};});};
  const updTitle=(v)=>{setSn(p=>p?{...p,title:v}:p);};
  const updSubtitle=(v)=>{setSn(p=>p?{...p,subtitle:v}:p);};
  const updCm=(v)=>{setSn(p=>p?{...p,cm:v}:p);};

  const gen=useCallback(async(a,m)=>{setAns(a);setPh('loading');setErr(null);
    try{const d=await callAPI(a,m,0,lang);const mi2=t.steps[5].o.indexOf(a.mood);const mk=m==='guided'?(MOOD_VALS[mi2>=0?mi2:0]||'neutral'):(d.mood&&PAL[d.mood]?d.mood:'empathisch');setPal(PAL[mk]||PAL.neutral);setSn(d);setPh('result');}
    catch(e){console.error(e);setErr(e.message);setPh(m==='guided'?'guided':'free');}
  },[lang,t]);

  const langBar=(<div style={{display:'flex',gap:4,justifyContent:'center',marginBottom:6}}>{[['de','\u{1F1E9}\u{1F1EA}'],['en','\u{1F1EC}\u{1F1E7}'],['ru','\u{1F1F7}\u{1F1FA}']].map(([k,fl])=>(<button key={k} onClick={()=>setLang(k)} style={{padding:'4px 10px',borderRadius:8,border:lang===k?'2px solid #E8584F':'2px solid transparent',background:lang===k?'#FFF5F0':'transparent',fontSize:16,cursor:'pointer'}}>{fl}</button>))}</div>);
  const hdr=(<div style={{textAlign:'center',padding:'16px 16px 3px',position:'relative'}}>{onBack&&<button onClick={onBack} style={{position:'absolute',left:16,top:16,padding:'8px 16px',borderRadius:10,border:'2px solid #E8584F',background:'#fff',color:'#E8584F',fontFamily:'Caveat,cursive',fontSize:15,cursor:'pointer',fontWeight:600}}>← Toolbox</button>}<h1 style={{fontFamily:'Caveat,cursive',fontSize:30,fontWeight:700,color:'#2D2D2D',margin:0}}>{'\u270F\uFE0F'} {t.title}</h1><p style={{fontFamily:'Patrick Hand,cursive',fontSize:13,color:'#aaa',marginTop:2}}>{t.sub}</p>{langBar}</div>);
  const errBox=err?(<div style={{maxWidth:500,margin:'0 auto 8px',padding:'10px 16px',background:'#FFF0F0',border:'2px solid #E8584F',borderRadius:10,textAlign:'center',fontFamily:'Patrick Hand,cursive',fontSize:14,color:'#E8584F'}}>{err}<button onClick={()=>setErr(null)} style={{marginLeft:12,background:'none',border:'none',color:'#E8584F',cursor:'pointer',fontSize:16}}>x</button></div>):null;

  if(ph==='mode') return(<div style={{minHeight:'100vh',background:'linear-gradient(145deg,#FEFCFB,#F5F0EB)'}}>
    <style>{FC}</style>{hdr}
    <div style={{maxWidth:500,margin:'0 auto',padding:20}}>
      <h2 style={{fontFamily:'Caveat,cursive',fontSize:25,color:'#2D2D2D',textAlign:'center',marginBottom:18}}>{t.howStart}</h2>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        <div onClick={()=>{setMode('guided');setPh('guided');setStep(0);}} style={{padding:'16px 18px',borderRadius:14,border:'2px solid #E8584F',background:'#FEFCFB',cursor:'pointer'}}><div style={{fontFamily:'Caveat,cursive',fontSize:20,fontWeight:700,color:'#E8584F'}}>{t.guided}</div><div style={{fontFamily:'Patrick Hand,cursive',fontSize:14,color:'#666'}}>{t.guidedDesc}</div></div>
        <div onClick={()=>{setMode('free');setPh('free');}} style={{padding:'16px 18px',borderRadius:14,border:'2px solid #3B7DD8',background:'#FEFCFB',cursor:'pointer'}}><div style={{fontFamily:'Caveat,cursive',fontSize:20,fontWeight:700,color:'#3B7DD8'}}>{t.free}</div><div style={{fontFamily:'Patrick Hand,cursive',fontSize:14,color:'#666'}}>{t.freeDesc}</div></div>
        <div onClick={()=>fr.current?.click()} style={{padding:'16px 18px',borderRadius:14,border:'2px solid #aaa',background:'#FEFCFB',cursor:'pointer'}}><div style={{fontFamily:'Caveat,cursive',fontSize:20,fontWeight:700,color:'#777'}}>{t.load}</div><div style={{fontFamily:'Patrick Hand,cursive',fontSize:14,color:'#666'}}>{t.loadDesc}</div></div>
      </div>
      <input ref={fr} type="file" accept=".json" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(!f)return;const r2=new FileReader();r2.onload=ev=>{try{const p=JSON.parse(ev.target.result);if(!p||!p.answers)return;setAns(p.answers);setMode(p.mode||'guided');setRs(p.rs||'structured');if(p.data){setSn(vd(p.data));setPal(PAL[p.data.mood||'neutral']||PAL.neutral);setPh('result');}else setPh(p.mode||'guided');}catch(e2){alert('!');}};r2.readAsText(f);}}/>
    </div>
  </div>);

  if(ph==='guided'){const steps=t.steps;const c=steps[step];const isText=!c.o;const ok=c.id==='extras'||(ans[c.id]&&ans[c.id].trim());
    return(<div style={{minHeight:'100vh',background:'linear-gradient(145deg,#FEFCFB,#F5F0EB)'}}>
      <style>{FC}</style>{hdr}{errBox}
      <div style={{maxWidth:540,margin:'0 auto',padding:20}}>
        <div style={{display:'flex',gap:5,marginBottom:22}}>{steps.map((_,i)=>(<div key={i} style={{flex:1,height:5,borderRadius:3,background:i<=step?'#E8584F':'#e0e0e0'}}/>))}</div>
        <div style={{fontFamily:'Caveat,cursive',fontSize:13,color:'#E8584F',fontWeight:600}}>{t.step} {step+1}/{steps.length}</div>
        <h2 style={{fontFamily:'Caveat,cursive',fontSize:24,fontWeight:700,color:'#2D2D2D',marginBottom:14}}>{c.q}</h2>
        {isText?(<textarea value={ans[c.id]||''} onChange={e=>setAns(a=>({...a,[c.id]:e.target.value}))} placeholder={c.ph||''} style={{width:'100%',minHeight:95,padding:13,borderRadius:12,border:'2px solid #e0e0e0',fontFamily:'Patrick Hand,cursive',fontSize:15,resize:'vertical',outline:'none',background:'#FAFAFA',boxSizing:'border-box'}}/>)
        :(<div style={{display:'flex',flexDirection:'column',gap:7}}>{c.o.map(o=>(<button key={o} onClick={()=>setAns(a=>({...a,[c.id]:o}))} style={{padding:'10px 15px',borderRadius:12,textAlign:'left',fontFamily:'Patrick Hand,cursive',fontSize:15,cursor:'pointer',border:ans[c.id]===o?'2px solid #E8584F':'2px solid #e0e0e0',background:ans[c.id]===o?'#FFF5F0':'#FAFAFA',color:'#2D2D2D'}}>{o}</button>))}</div>)}
        <div style={{display:'flex',justifyContent:'space-between',marginTop:20}}>
          <button onClick={()=>step>0?setStep(s=>s-1):setPh('mode')} style={bt('#888',false)}>{step>0?t.back:t.modeSel}</button>
          <button onClick={()=>{if(step<steps.length-1)setStep(s=>s+1);else{const sv=ans.style||'';setRs(sv.includes('Free')||sv.includes('Frei')||sv.includes('\u0421\u0432\u043e\u0431\u043e\u0434\u043d\u044b\u0439')?'flow':'structured');gen(ans,'guided');}}} disabled={!ok} style={{...bt(ok?'#E8584F':'#ccc',true),fontSize:18}}>{step<steps.length-1?t.next:t.create}</button>
        </div>
      </div>
    </div>);
  }

  if(ph==='free') return(<div style={{minHeight:'100vh',background:'linear-gradient(145deg,#FEFCFB,#F5F0EB)'}}>
    <style>{FC}</style>{hdr}{errBox}
    <div style={{maxWidth:560,margin:'0 auto',padding:20}}>
      <h2 style={{fontFamily:'Caveat,cursive',fontSize:24,fontWeight:700,color:'#2D2D2D',marginBottom:5}}>{t.freeTitle}</h2>
      <p style={{fontFamily:'Patrick Hand,cursive',fontSize:14,color:'#888',marginBottom:12}}>{t.freeHint}</p>
      <textarea value={ft} onChange={e=>setFt(e.target.value)} placeholder={t.freePh} style={{width:'100%',minHeight:160,padding:15,borderRadius:14,border:'2px solid #e0e0e0',fontFamily:'Patrick Hand,cursive',fontSize:15,resize:'vertical',outline:'none',background:'#FAFAFA',boxSizing:'border-box',lineHeight:1.6}}/>
      <div style={{display:'flex',gap:6,marginTop:12,flexWrap:'wrap'}}>
        {Object.entries((t.layouts||{})).map(([k,la])=>(<button key={k} onClick={()=>setFrs(k)} style={{flex:1,minWidth:70,padding:8,borderRadius:10,border:frs===k?'2px solid #3B7DD8':'2px solid #e0e0e0',background:frs===k?'#F0F4FF':'#FAFAFA',fontFamily:'Caveat,cursive',fontSize:14,cursor:'pointer',color:'#2D2D2D'}}>{la}</button>))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:16}}>
        <button onClick={()=>setPh('mode')} style={bt('#888',false)}>{t.modeSel}</button>
        <button onClick={()=>{if(!ft.trim())return;setRs(frs);gen({freetext:ft},'free');}} disabled={!ft.trim()} style={{...bt(ft.trim()?'#3B7DD8':'#ccc',true),fontSize:18}}>{t.create}</button>
      </div>
    </div>
  </div>);

  if(ph==='loading') return(<div style={{minHeight:'100vh',background:'linear-gradient(145deg,#FEFCFB,#F5F0EB)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:14}}>
    <style>{FC}</style>
    <div style={{width:46,height:46,border:'4px solid #f0e0e0',borderTop:'4px solid #E8584F',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
    <div style={{fontFamily:'Caveat,cursive',fontSize:20,color:'#E8584F',fontWeight:600}}>{t.loading}</div>
    <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
  </div>);

  if(ph==='result'&&sn){
    let svg;
    if(rs==='aigen'){svg=<ImageLayout data={sn} pal={pal}/>;}
    else if(rs==='aisketch'){svg=<SketchLayout data={sn} pal={pal}/>;}
    else{try{const L={structured:StructSVG,journey:JourneySVG,poster:PosterSVG,flow:FlowSVG};const Comp=L[rs]||StructSVG;svg=<Comp data={sn} pal={pal}/>;}
    catch(e){svg=<div style={{padding:20,color:'#E8584F'}}>Error: {e.message}</div>;}}
    const eS={width:'100%',padding:'8px 10px',borderRadius:8,border:'2px solid #e0e0e0',fontFamily:'Patrick Hand,cursive',fontSize:14,outline:'none',boxSizing:'border-box',background:'#FAFAFA'};

    if(fs) return(<div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'#fff',zIndex:9999,overflow:'auto',WebkitOverflowScrolling:'touch'}}>
      <style>{FC}</style>
      <button onClick={()=>setFs(false)} style={{position:'fixed',top:12,right:12,zIndex:10000,...bt('#E8584F',true),fontSize:18}}>{t.exitFs}</button>
      <div style={{width:'100%',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:10}}>
        <div style={{width:'100%',maxWidth:1200,touchAction:'pinch-zoom'}}>{svg}</div>
      </div>
    </div>);

    return(<div style={{minHeight:'100vh',background:'linear-gradient(145deg,#FEFCFB,#F5F0EB)'}}>
      <style>{FC}</style>{hdr}
      <div style={{padding:14}}>
        <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap',justifyContent:'center'}}>
          <button onClick={()=>{setPh('mode');setMode(null);setAns({});setSn(null);setErr(null);setEd(false);}} style={bt('#888',false)}>{t.neu}</button>
          <button onClick={()=>gen(ans,mode)} style={bt('#E8584F',false)}>{t.reroll}</button>
          <button onClick={()=>setEd(e=>!e)} style={bt(ed?'#E8584F':'#7B68AE',ed)}>{ed?t.done:t.edit}</button>
          {Object.entries(t.layouts||{}).map(([k,la])=>(<button key={k} onClick={()=>setRs(k)} style={{...bt(rs===k?'#3B7DD8':'#999',rs===k),fontSize:14,padding:'7px 12px'}}>{la}</button>))}
          <button onClick={()=>setFs(true)} style={bt('#555',false)}>{t.fullscreen}</button>
          {rs!=='aigen'&&<button onClick={()=>dlS(sn.title)} style={bt('#2E86AB',false)}>SVG</button>}
          <button onClick={()=>{if(rs==='aigen'){const im=document.getElementById('sketchnote-ai-img');if(!im||!im.src)return;const a=Object.assign(document.createElement('a'),{href:im.src,download:`sn-${sl(sn.title)}.png`});document.body.appendChild(a);a.click();document.body.removeChild(a);}else dlP(sn.title,pal);}} style={bt('#4CAF50',false)}>PNG</button>
          <button onClick={()=>dlJ(ans,sn,mode,rs)} style={bt('#F5A623',false)}>{t.save}</button>
        </div>
        <div style={{maxWidth:1100,margin:'0 auto',boxShadow:'0 6px 28px rgba(0,0,0,.1)',borderRadius:12,overflow:'auto',WebkitOverflowScrolling:'touch'}}>{svg}</div>
        {ed&&(<div style={{maxWidth:800,margin:'20px auto',padding:20,background:'#fff',borderRadius:14,border:'2px solid #e0e0e0'}}>
          <h3 style={{fontFamily:'Caveat,cursive',fontSize:22,color:'#2D2D2D',marginBottom:12}}>{t.editTitle}</h3>
          <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
            <div style={{flex:2,minWidth:150}}><label style={{fontFamily:'Caveat,cursive',fontSize:14,color:'#888'}}>{t.titleL}</label><input value={sn.title} onChange={e=>updTitle(e.target.value)} style={eS}/></div>
            <div style={{flex:3,minWidth:200}}><label style={{fontFamily:'Caveat,cursive',fontSize:14,color:'#888'}}>{t.subtitleL}</label><input value={sn.subtitle||''} onChange={e=>updSubtitle(e.target.value)} style={eS}/></div>
          </div>
          <div style={{marginBottom:16}}><label style={{fontFamily:'Caveat,cursive',fontSize:14,color:'#888'}}>{t.centralL}</label><input value={sn.cm||''} onChange={e=>updCm(e.target.value)} style={eS}/></div>
          {sn.sections.map((sec,si)=>(<div key={si} style={{marginBottom:14,padding:12,borderRadius:10,border:'2px solid #eee',background:'#fafafa'}}>
            <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8,flexWrap:'wrap'}}>
              <span style={{fontFamily:'Caveat,cursive',fontSize:16,fontWeight:700,color:gc(pal,sec.color),minWidth:24}}>{sec.n}.</span>
              <input value={sec.title} onChange={e=>updSec(si,'title',e.target.value)} style={{...eS,flex:1,minWidth:120,fontWeight:600}}/>
              <select value={sec.scene||''} onChange={e=>updSec(si,'scene',e.target.value||null)} style={{...eS,width:130,flex:'none'}}><option value="">{t.noScene}</option>{SCENE_NAMES.map(s=>(<option key={s} value={s}>{s}</option>))}</select>
              <select value={sec.color} onChange={e=>updSec(si,'color',e.target.value)} style={{...eS,width:95,flex:'none'}}><option value="primary">{t.primary}</option><option value="secondary">{t.secondary}</option><option value="accent">{t.accent}</option></select>
            </div>
            {sec.items.map((item,ii)=>(<div key={ii} style={{display:'flex',gap:6,marginBottom:4,alignItems:'center',paddingLeft:32}}><span style={{color:gc(pal,sec.color),fontSize:18}}>*</span><input value={item} onChange={e=>updItem(si,ii,e.target.value)} style={{...eS,flex:1}}/><button onClick={()=>delItem(si,ii)} style={{background:'none',border:'none',color:'#E8584F',cursor:'pointer',fontSize:18,padding:'0 4px'}}>x</button></div>))}
            <button onClick={()=>addItem(si)} style={{marginLeft:32,background:'none',border:'none',color:gc(pal,sec.color),cursor:'pointer',fontFamily:'Patrick Hand,cursive',fontSize:13}}>{t.addItem}</button>
          </div>))}
        </div>)}
      </div>
    </div>);
  }

  return(<div style={{minHeight:'100vh',background:'#FEFCFB',display:'flex',alignItems:'center',justifyContent:'center'}}>
    <style>{FC}</style>
    <button onClick={()=>setPh('mode')} style={bt('#E8584F',true)}>Start</button>
  </div>);
}
