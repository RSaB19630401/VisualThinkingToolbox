import React, { useState, useCallback, useRef, useEffect } from "react";
import Sc, { SCENE_NAMES } from "./Scenes.jsx";
import Ic, { ICON_NAMES } from "./Icons.jsx";

const FC = `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap');`;

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
function mkR(seed) { let s = Math.abs(seed||42)%2147483646+1; return ()=>{ s=(s*16807)%2147483647; return(s-1)/2147483646; }; }
function rr(x,y,w,h,rad,rng,a=2){ const r=()=>(rng()-0.5)*a,c=Math.min(rad,w/2,h/2); return `M${x+c+r()},${y+r()} L${x+w-c+r()},${y+r()} Q${x+w+r()},${y+r()} ${x+w+r()},${y+c+r()} L${x+w+r()},${y+h-c+r()} Q${x+w+r()},${y+h+r()} ${x+w-c+r()},${y+h+r()} L${x+c+r()},${y+h+r()} Q${x+r()},${y+h+r()} ${x+r()},${y+h-c+r()} L${x+r()},${y+c+r()} Q${x+r()},${y+r()} ${x+c+r()},${y+r()} Z`; }
function ln(x1,y1,x2,y2,rng){ return `M${x1},${y1} Q${(x1+x2)/2+(rng()-0.5)*5},${(y1+y2)/2+(rng()-0.5)*5} ${x2},${y2}`; }
function arr(x1,y1,x2,y2,rng,h=10){ const a=Math.atan2(y2-y1,x2-x1); return [ln(x1,y1,x2,y2,rng),`M${x2},${y2}L${x2+Math.cos(a+2.5)*h},${y2+Math.sin(a+2.5)*h}`,`M${x2},${y2}L${x2+Math.cos(a-2.5)*h},${y2+Math.sin(a-2.5)*h}`]; }
function blob(cx,cy,rx,ry,rng){ const p=[]; for(let i=0;i<=16;i++){const a=(i/16)*Math.PI*2,d=1+(rng()-0.5)*0.25;p.push(`${cx+Math.cos(a)*rx*d},${cy+Math.sin(a)*ry*d}`);}return `M${p[0]} `+p.slice(1).map(v=>`L${v}`).join(' ')+' Z'; }
function wt(t,m=22){ if(!t)return[];const w=t.split(' '),l=[];let c='';w.forEach(x=>{if((c+' '+x).trim().length>m&&c){l.push(c.trim());c=x;}else c=c?c+' '+x:x;});if(c.trim())l.push(c.trim());return l; }


const PAL = {
  optimistisch:{p:'#E8584F',s:'#F5A623',a:'#4CAF50',t:'#2D2D2D',bg:'#FFF8F0',sb:'#FFFAF5'},
  neutral:{p:'#3B7DD8',s:'#6B7B8D',a:'#E8584F',t:'#2D2D2D',bg:'#F5F7FA',sb:'#F0F4F8'},
  nachdenklich:{p:'#7B68AE',s:'#5A8F7B',a:'#D4A853',t:'#2D2D2D',bg:'#F8F5FF',sb:'#F3F0FA'},
  energisch:{p:'#E8584F',s:'#FF6B35',a:'#FFD23F',t:'#2D2D2D',bg:'#FFF5F0',sb:'#FFF0EB'},
  empathisch:{p:'#E07BAB',s:'#7DAFCB',a:'#95C77E',t:'#2D2D2D',bg:'#FFF5F9',sb:'#FFF0F5'},
};
function gc(pal,key){ return key==='secondary'?pal.s:key==='accent'?pal.a:pal.p; }

function vd(d){
  if(!d||typeof d!=='object')throw new Error('Ungültig');
  return{title:String(d.title||'Sketchnote'),subtitle:d.subtitle?String(d.subtitle):'',orientation:d.orientation==='portrait'?'portrait':'landscape',mood:d.mood||'neutral',cm:d.centralMessage?String(d.centralMessage):'',
    layout:{columns:Number(d.layout?.columns)||3},
    sections:Array.isArray(d.sections)?d.sections.map((s,i)=>({n:s.number||i+1,title:String(s.title||''),scene:SCENE_NAMES.includes(s.scene)?s.scene:null,sym:ICON_NAMES.includes(s.symbol)?s.symbol:'star',color:s.color||'primary',items:Array.isArray(s.items)?s.items.map(String).slice(0,5):[]})):[],
    footer:{title:String(d.footer?.title||''),items:Array.isArray(d.footer?.items)?d.footer.items.map(String).slice(0,4):[]},
  };
}

/* ═══ STRUCTURED ═══ */
function BoxSec({sec,x,y,w,h,pal,seed}){
  const rng=mkR(seed+(sec.n||1)*137),col=gc(pal,sec.color),tY=y+28;
  const hs=!!sec.scene,sw=hs?Math.min(w*0.38,80):0;
  return(<g>
    <path d={rr(x+2,y+2,w-4,h-4,14,rng,2.5)} fill={pal.sb} stroke={pal.t} strokeWidth="1.8" opacity="0.95"/>
    <circle cx={x+20} cy={y+18} r="13" fill={col} opacity="0.9"/>
    <text x={x+20} y={y+23.5} textAnchor="middle" fontFamily="Caveat" fontSize="16" fontWeight="700" fill="#fff">{sec.n}</text>
    <text x={x+38} y={tY+3} fontFamily="Caveat" fontSize="17" fontWeight="700" fill={pal.t}>{(sec.title||'').toUpperCase()}</text>
    <path d={ln(x+10,tY+8,x+w-10,tY+8,rng)} fill="none" stroke={col} strokeWidth="1.5" opacity="0.35"/>
    {hs && Sc(sec.scene,x+w-sw-6,tY+12,Math.min(sw,75)/75,col)}
    {!hs && Ic(sec.sym,x+w-40,y+6,28,col)}
    {(sec.items||[]).slice(0,3).map((item,i)=>{const iy=tY+26+i*18;const txt=item.length>32?item.slice(0,30)+'…':item;return(<g key={i}><circle cx={x+16} cy={iy-3} r="2.5" fill={col} opacity="0.7"/><text x={x+24} y={iy} fontFamily="Patrick Hand" fontSize="12.5" fill={pal.t}>{txt}</text></g>);})}
  </g>);
}

function StructSVG({data,pal}){
  const la=data.orientation!=='portrait',W=la?1100:750,H=la?750:1050;
  const cols=data.layout?.columns||(la?3:2),seed=(data.title||'').length*7+42,rng=mkR(seed);
  const M=20,TH=88,fH=data.footer?.items?.length?66:0,cH2=data.cm?44:0;
  const ch=H-TH-fH-cH2-M*2,cw=W-M*2,secs=data.sections,rows=Math.ceil(secs.length/cols),cW=cw/cols,cHh=ch/Math.max(rows,1);
  return(<svg id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%',background:pal.bg,borderRadius:12}}>
    <defs><style>{FC}</style></defs><rect width={W} height={H} fill={pal.bg} rx="10"/>
    <path d={rr(8,8,W-16,H-16,16,rng,3)} fill="none" stroke={pal.t} strokeWidth="2" opacity="0.12"/>
    <path d={rr(M+30,12,cw-60,50,10,rng,3)} fill={pal.p} stroke={pal.t} strokeWidth="1.5" opacity="0.9"/>
    <text x={W/2} y={46} textAnchor="middle" fontFamily="Caveat" fontSize="27" fontWeight="700" fill="#fff">{data.title.toUpperCase()}</text>
    {data.subtitle&&<text x={W/2} y={78} textAnchor="middle" fontFamily="Patrick Hand" fontSize="15" fill={pal.t} opacity="0.65">{data.subtitle}</text>}
    {secs.map((s,i)=>(<BoxSec key={i} sec={s} x={M+(i%cols)*cW+5} y={TH+Math.floor(i/cols)*cHh+5} w={cW-10} h={cHh-10} pal={pal} seed={seed}/>))}
    {secs.length>1&&secs.slice(0,-1).map((_,i)=>{const fc=i%cols,fr=Math.floor(i/cols),tc=(i+1)%cols,tr=Math.floor((i+1)/cols),ar=mkR(seed+i*31);let x1,y1,x2,y2;if(tr===fr){x1=M+fc*cW+cW-6;y1=TH+fr*cHh+cHh/2;x2=M+tc*cW+12;y2=y1;}else{x1=M+fc*cW+cW/2;y1=TH+fr*cHh+cHh-2;x2=M+tc*cW+cW/2;y2=TH+tr*cHh+8;}return(<g key={`a${i}`} opacity="0.35">{arr(x1,y1,x2,y2,ar,8).map((p,j)=>(<path key={j} d={p} fill="none" stroke={pal.p} strokeWidth="2" strokeLinecap="round"/>))}</g>);})}
    {data.cm&&<g><path d={rr(W/2-180,H-fH-M-cH2-2,360,34,18,rng,2)} fill="#fff" stroke={pal.p} strokeWidth="1.5"/>{Ic('star',W/2-172,H-fH-M-cH2+2,18,pal.p)}<text x={W/2} y={H-fH-M-cH2+22} textAnchor="middle" fontFamily="Caveat" fontSize="15" fontWeight="600" fill={pal.p}>{data.cm}</text></g>}
    {fH>0&&<g><path d={rr(M,H-fH-M+4,cw,54,10,mkR(seed+999),2)} fill={pal.bg} stroke={pal.p} strokeWidth="1.5" strokeDasharray="6,4"/>{data.footer.title&&<text x={M+16} y={H-fH-M+21} fontFamily="Caveat" fontSize="14" fontWeight="700" fill={pal.p}>{data.footer.title.toUpperCase()}</text>}{data.footer.items.map((it,i)=>{const ix=M+16+i*(cw/Math.max(data.footer.items.length,1));return(<g key={i}>{Ic('heart',ix,H-fH-M+24,13,pal.p)}<text x={ix+16} y={H-fH-M+42} fontFamily="Patrick Hand" fontSize="12" fill={pal.t}>{it}</text></g>);})}</g>}
  </svg>);
}

/* ═══ FREE SKETCH ═══ */

function FreeSVG({data,pal}){
  const la=data.orientation!=='portrait',W=la?1120:760,H=la?660:1100;
  const seed=(data.title||'').length*7+42,rng=mkR(seed);
  const allSecs=data.sections.slice(0,9);
  // Split: first 4-5 = main story, rest = toolbox
  const mainCount=Math.min(allSecs.length,la?5:4);
  const mainSecs=allSecs.slice(0,mainCount);
  const toolSecs=allSecs.slice(mainCount);
  const hasTools=toolSecs.length>0;
  const toolH=hasTools?150:0;
  const storyH=H-90-toolH-30;
  const colW=la?(W-40)/mainCount:(W-40)/Math.min(mainCount,3);

  return(<svg id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%',background:pal.bg,borderRadius:12}}>
    <defs><style>{FC}</style></defs>
    <rect width={W} height={H} fill={pal.bg} rx="10"/>
    <path d={rr(6,6,W-12,H-12,18,rng,4)} fill="none" stroke={pal.p} strokeWidth="2" opacity="0.12"/>

    {/* Title banner */}
    <path d={rr(W/2-220,10,440,50,8,rng,3)} fill={pal.p} stroke={pal.t} strokeWidth="1.5" opacity="0.9"/>
    <text x={W/2} y={44} textAnchor="middle" fontFamily="Caveat" fontSize="28" fontWeight="700" fill="#fff" letterSpacing="2">{data.title.toUpperCase()}</text>
    {data.subtitle&&<text x={W/2} y={76} textAnchor="middle" fontFamily="Patrick Hand" fontSize="14" fill={pal.t} opacity="0.6">{data.subtitle}</text>}

    {/* Main story sections - horizontal flow */}
    {mainSecs.map((sec,i)=>{
      const col=gc(pal,sec.color);
      const cx=20+i*colW+colW/2; // center x of this column
      const sy=95; // story y start
      const hs=!!sec.scene;
      const items=(sec.items||[]).slice(0,4).map(t=>t.length>28?t.slice(0,26)+'…':t);
      const sceneY=sy+50;
      const bullY=sceneY+(hs?110:50);
      return(<g key={i}>
        {/* Title */}
        <text x={cx} y={sy+12} textAnchor="middle" fontFamily="Caveat" fontSize="16" fontWeight="700" fill={pal.t}>{(sec.title||'').slice(0,22).toUpperCase()}</text>
        <path d={ln(cx-50,sy+18,cx+50,sy+18,mkR(seed+i*77))} fill="none" stroke={col} strokeWidth="1.5" opacity="0.3"/>

        {/* Large scene illustration */}
        {hs && Sc(sec.scene,cx-45,sceneY,1.2,col)}
        {!hs && Ic(sec.sym,cx-22,sceneY+10,50,col)}

        {/* Bullet items below scene */}
        {items.map((item,j)=>{
          const by=bullY+j*18;
          return(<g key={j}>
            {Ic(sec.sym,cx-colW/2+12,by-8,14,col)}
            <text x={cx-colW/2+30} y={by} fontFamily="Patrick Hand" fontSize="13" fill={pal.t}>{item}</text>
          </g>);
        })}

        {/* Arrow to next section */}
        {i<mainSecs.length-1&&(<g opacity="0.4">
          {arr(cx+colW/2-15,sceneY+45,cx+colW/2+15,sceneY+45,mkR(seed+i*53),10).map((p,j)=>(<path key={j} d={p} fill="none" stroke={pal.p} strokeWidth="2.5" strokeLinecap="round"/>))}
        </g>)}
      </g>);
    })}

    {/* Central message */}
    {data.cm&&(<g>
      <path d={rr(W/2-200,H-toolH-55,400,30,15,rng,2)} fill="#fff" stroke={pal.p} strokeWidth="1.5"/>
      {Ic('star',W/2-192,H-toolH-52,16,pal.p)}
      <text x={W/2} y={H-toolH-35} textAnchor="middle" fontFamily="Caveat" fontSize="14" fontWeight="600" fill={pal.p} fontStyle="italic">{data.cm}</text>
    </g>)}

    {/* Toolbox / Footer area */}
    {hasTools&&(<g>
      <path d={rr(20,H-toolH-10,W-40,toolH,12,rng,3)} fill="none" stroke={pal.p} strokeWidth="2"/>
      {/* Toolbox title */}
      <path d={rr(W/2-110,H-toolH-22,220,26,6,rng,2)} fill={pal.bg} stroke={pal.p} strokeWidth="1.5"/>
      <text x={W/2} y={H-toolH-4} textAnchor="middle" fontFamily="Caveat" fontSize="16" fontWeight="700" fill={pal.p}>{data.footer?.title||'MEIN WERKZEUGKASTEN'}</text>

      {/* Tool items in a row */}
      {toolSecs.map((sec,i)=>{
        const col2=gc(pal,sec.color);
        const tw=(W-80)/Math.max(toolSecs.length,1);
        const tx=40+i*tw+tw/2;
        const ty=H-toolH+30;
        const hs2=!!sec.scene;
        return(<g key={`t${i}`}>
          {hs2?Sc(sec.scene,tx-25,ty-10,0.55,col2):Ic(sec.sym,tx-14,ty-4,32,col2)}
          <text x={tx} y={ty+45} textAnchor="middle" fontFamily="Caveat" fontSize="13" fontWeight="700" fill={col2}>{(sec.title||'').slice(0,20).toUpperCase()}</text>
          {(sec.items||[]).slice(0,2).map((item,j)=>(<text key={j} x={tx} y={ty+60+j*14} textAnchor="middle" fontFamily="Patrick Hand" fontSize="11" fill={pal.t}>{item.length>24?item.slice(0,22)+'…':item}</text>))}
        </g>);
      })}
    </g>)}

    {/* Footer items if no toolbox */}
    {!hasTools&&data.footer?.items?.length>0&&(<g>
      <path d={rr(20,H-60,W-40,50,10,rng,2)} fill="none" stroke={pal.p} strokeWidth="1.5" strokeDasharray="6,4"/>
      {data.footer.items.map((it,i)=>{const ix=40+i*((W-80)/Math.max(data.footer.items.length,1));return(<g key={i}>{Ic('heart',ix,H-48,14,pal.p)}<text x={ix+18} y={H-34} fontFamily="Patrick Hand" fontSize="12" fill={pal.t}>{it}</text></g>);})}
    </g>)}
  </svg>);
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


export default function App(){
  const[ph,setPh]=useState('mode');
  const[mode,setMode]=useState(null);
  const[ans,setAns]=useState({});
  const[sn,setSn]=useState(null);
  const[pal,setPal]=useState(PAL.neutral);
  const[err,setErr]=useState(null);
  const[rs,setRs]=useState('structured');
  const[step,setStep]=useState(0);
  const[ft,setFt]=useState('');
  const[frs,setFrs]=useState('free');
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
  const hdr=(<div style={{textAlign:'center',padding:'16px 16px 3px'}}><h1 style={{fontFamily:'Caveat,cursive',fontSize:30,fontWeight:700,color:'#2D2D2D',margin:0}}>{'\u270F\uFE0F'} {t.title}</h1><p style={{fontFamily:'Patrick Hand,cursive',fontSize:13,color:'#aaa',marginTop:2}}>{t.sub}</p>{langBar}</div>);
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
          <button onClick={()=>{if(step<steps.length-1)setStep(s=>s+1);else{const sv=ans.style||'';setRs(sv.includes('Free')||sv.includes('Frei')||sv.includes('\u0421\u0432\u043e\u0431\u043e\u0434\u043d\u044b\u0439')?'free':'structured');gen(ans,'guided');}}} disabled={!ok} style={{...bt(ok?'#E8584F':'#ccc',true),fontSize:18}}>{step<steps.length-1?t.next:t.create}</button>
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
      <div style={{display:'flex',gap:8,marginTop:12}}>
        {[['structured',t.structured],['free',t.freeSketch]].map(([k,la])=>(<button key={k} onClick={()=>setFrs(k)} style={{flex:1,padding:10,borderRadius:10,border:frs===k?'2px solid #3B7DD8':'2px solid #e0e0e0',background:frs===k?'#F0F4FF':'#FAFAFA',fontFamily:'Caveat,cursive',fontSize:15,cursor:'pointer',color:'#2D2D2D'}}>{la}</button>))}
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
    try{svg=rs==='free'?<FreeSVG data={sn} pal={pal}/>:<StructSVG data={sn} pal={pal}/>;}
    catch(e){svg=<div style={{padding:20,color:'#E8584F'}}>Error: {e.message}</div>;}
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
          <button onClick={()=>setRs(r=>r==='free'?'structured':'free')} style={bt('#3B7DD8',false)}>{rs==='free'?t.boxes:t.freeL}</button>
          <button onClick={()=>setFs(true)} style={bt('#555',false)}>{t.fullscreen}</button>
          <button onClick={()=>dlS(sn.title)} style={bt('#2E86AB',false)}>SVG</button>
          <button onClick={()=>dlP(sn.title,pal)} style={bt('#4CAF50',false)}>PNG</button>
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
