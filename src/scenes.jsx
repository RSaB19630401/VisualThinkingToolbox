// scenes.jsx — 26 Modernized Bikablo-style scene illustrations
// Style: Open Peeps / modern Sketchnote — detailed figures with
// proper proportions, hair, facial expressions, clothing, and context.
import React from 'react';

export const SCENE_NAMES = [
  'mountainClimb','targetHit','bridge','seedToTree','lighthouse','teamCircle',
  'ladder','compass','figureThinking','figureCelebrate','doorOpen','puzzleFit',
  'figureHandshake','figureConversation','figureListening','figureHug',
  'figureFear','figureDoubt','figureBalance','figureCourage','windingRoad',
  'mirrorReflect','scaleBalance','networkNodes','treasure','wallBreak'
];

export const SCENE_LABELS = {
  de: {
    mountainClimb: 'Berg erklimmen', targetHit: 'Ziel treffen', bridge: 'Brücke',
    seedToTree: 'Vom Samen zum Baum', lighthouse: 'Leuchtturm', teamCircle: 'Team-Kreis',
    ladder: 'Leiter', compass: 'Kompass', figureThinking: 'Nachdenken',
    figureCelebrate: 'Feiern', doorOpen: 'Offene Tür', puzzleFit: 'Puzzle passt',
    figureHandshake: 'Handschlag', figureConversation: 'Gespräch', figureListening: 'Zuhören',
    figureHug: 'Umarmung', figureFear: 'Angst', figureDoubt: 'Zweifel',
    figureBalance: 'Balance', figureCourage: 'Mut', windingRoad: 'Kurviger Weg',
    mirrorReflect: 'Spiegelung', scaleBalance: 'Waage', networkNodes: 'Netzwerk',
    treasure: 'Schatz', wallBreak: 'Mauer durchbrechen',
  },
  en: {
    mountainClimb: 'Mountain climb', targetHit: 'Hit target', bridge: 'Bridge',
    seedToTree: 'Seed to tree', lighthouse: 'Lighthouse', teamCircle: 'Team circle',
    ladder: 'Ladder', compass: 'Compass', figureThinking: 'Thinking',
    figureCelebrate: 'Celebrating', doorOpen: 'Open door', puzzleFit: 'Puzzle fit',
    figureHandshake: 'Handshake', figureConversation: 'Conversation', figureListening: 'Listening',
    figureHug: 'Hug', figureFear: 'Fear', figureDoubt: 'Doubt',
    figureBalance: 'Balance', figureCourage: 'Courage', windingRoad: 'Winding road',
    mirrorReflect: 'Reflection', scaleBalance: 'Scales', networkNodes: 'Network',
    treasure: 'Treasure', wallBreak: 'Break wall',
  },
  ru: {
    mountainClimb: 'Восхождение', targetHit: 'Попадание в цель', bridge: 'Мост',
    seedToTree: 'От семени к дереву', lighthouse: 'Маяк', teamCircle: 'Круг команды',
    ladder: 'Лестница', compass: 'Компас', figureThinking: 'Размышление',
    figureCelebrate: 'Праздник', doorOpen: 'Открытая дверь', puzzleFit: 'Пазл сходится',
    figureHandshake: 'Рукопожатие', figureConversation: 'Разговор', figureListening: 'Слушание',
    figureHug: 'Объятие', figureFear: 'Страх', figureDoubt: 'Сомнение',
    figureBalance: 'Баланс', figureCourage: 'Смелость', windingRoad: 'Извилистый путь',
    mirrorReflect: 'Отражение', scaleBalance: 'Весы', networkNodes: 'Сеть',
    treasure: 'Сокровище', wallBreak: 'Пробить стену',
  },
};


export function Sc(name, x, y, s, c) {
  const t = `translate(${x},${y}) scale(${s})`;
  const lw = 2.2;
  const lw2 = 1.6;
  const lw3 = 1.2;

  const head = (cx, cy, r = 6, hair = 'short', expr = 'neutral') => {
    const faces = {
      neutral: (<>
        <circle cx={cx - 2} cy={cy - 1} r="0.9" fill={c}/>
        <circle cx={cx + 2} cy={cy - 1} r="0.9" fill={c}/>
        <path d={`M${cx - 2},${cy + 2.5} Q${cx},${cy + 4} ${cx + 2},${cy + 2.5}`} fill="none" stroke={c} strokeWidth="0.8" strokeLinecap="round"/>
      </>),
      happy: (<>
        <circle cx={cx - 2} cy={cy - 1} r="0.9" fill={c}/>
        <circle cx={cx + 2} cy={cy - 1} r="0.9" fill={c}/>
        <path d={`M${cx - 3},${cy + 1.5} Q${cx},${cy + 5} ${cx + 3},${cy + 1.5}`} fill="none" stroke={c} strokeWidth="1" strokeLinecap="round"/>
      </>),
      worried: (<>
        <circle cx={cx - 2} cy={cy - 0.5} r="0.9" fill={c}/>
        <circle cx={cx + 2} cy={cy - 0.5} r="0.9" fill={c}/>
        <path d={`M${cx - 2},${cy + 3} Q${cx},${cy + 1.5} ${cx + 2},${cy + 3}`} fill="none" stroke={c} strokeWidth="0.8" strokeLinecap="round"/>
        <line x1={cx - 3} y1={cy - 3.5} x2={cx - 1} y2={cy - 2.8} stroke={c} strokeWidth="0.8"/>
        <line x1={cx + 3} y1={cy - 3.5} x2={cx + 1} y2={cy - 2.8} stroke={c} strokeWidth="0.8"/>
      </>),
      surprised: (<>
        <circle cx={cx - 2} cy={cy - 1} r="1.1" fill="none" stroke={c} strokeWidth="0.8"/>
        <circle cx={cx + 2} cy={cy - 1} r="1.1" fill="none" stroke={c} strokeWidth="0.8"/>
        <ellipse cx={cx} cy={cy + 3} rx="1.5" ry="2" fill="none" stroke={c} strokeWidth="0.8"/>
      </>),
      determined: (<>
        <circle cx={cx - 2} cy={cy - 1} r="0.9" fill={c}/>
        <circle cx={cx + 2} cy={cy - 1} r="0.9" fill={c}/>
        <line x1={cx - 2} y1={cy + 2.5} x2={cx + 2} y2={cy + 2.5} stroke={c} strokeWidth="1" strokeLinecap="round"/>
        <line x1={cx - 3.5} y1={cy - 3.5} x2={cx - 0.5} y2={cy - 2.5} stroke={c} strokeWidth="1"/>
        <line x1={cx + 3.5} y1={cy - 3.5} x2={cx + 0.5} y2={cy - 2.5} stroke={c} strokeWidth="1"/>
      </>),
    };
    const hairs = {
      short: (<path d={`M${cx - r},${cy - 2} Q${cx - r},${cy - r - 3} ${cx},${cy - r - 3} Q${cx + r},${cy - r - 3} ${cx + r},${cy - 2}`} fill="none" stroke={c} strokeWidth={lw} strokeLinecap="round"/>),
      spiky: (<path d={`M${cx - r},${cy - 2} Q${cx - r + 1},${cy - r - 5} ${cx - 2},${cy - r - 2} L${cx},${cy - r - 6} L${cx + 2},${cy - r - 2} Q${cx + r - 1},${cy - r - 5} ${cx + r},${cy - 2}`} fill="none" stroke={c} strokeWidth={lw} strokeLinecap="round"/>),
      long: (<>
        <path d={`M${cx - r},${cy - 1} Q${cx - r - 1},${cy - r - 3} ${cx},${cy - r - 3} Q${cx + r + 1},${cy - r - 3} ${cx + r},${cy - 1}`} fill="none" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        <path d={`M${cx - r},${cy} Q${cx - r - 2},${cy + 6} ${cx - r + 1},${cy + 10}`} fill="none" stroke={c} strokeWidth={lw3} strokeLinecap="round"/>
        <path d={`M${cx + r},${cy} Q${cx + r + 2},${cy + 6} ${cx + r - 1},${cy + 10}`} fill="none" stroke={c} strokeWidth={lw3} strokeLinecap="round"/>
      </>),
      bun: (<>
        <path d={`M${cx - r},${cy - 2} Q${cx - r},${cy - r - 3} ${cx},${cy - r - 3} Q${cx + r},${cy - r - 3} ${cx + r},${cy - 2}`} fill="none" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        <circle cx={cx} cy={cy - r - 5} r="3.5" fill="none" stroke={c} strokeWidth={lw3}/>
      </>),
      none: null,
    };
    return (<>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth={lw}/>
      {hairs[hair]}
      {faces[expr]}
    </>);
  };

  const torso = (cx, headBottom, len = 18, shoulderW = 14) => (<>
    <line x1={cx} y1={headBottom} x2={cx} y2={headBottom + len} stroke={c} strokeWidth={lw}/>
    <path d={`M${cx - shoulderW / 2},${headBottom + 4} Q${cx},${headBottom + 2} ${cx + shoulderW / 2},${headBottom + 4}`} fill="none" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
  </>);

  const legs = (cx, hipY, legL = 14, spread = 6) => (<>
    <line x1={cx} y1={hipY} x2={cx - spread} y2={hipY + legL} stroke={c} strokeWidth={lw}/>
    <line x1={cx} y1={hipY} x2={cx + spread} y2={hipY + legL} stroke={c} strokeWidth={lw}/>
    <line x1={cx - spread} y1={hipY + legL} x2={cx - spread - 3} y2={hipY + legL} stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
    <line x1={cx + spread} y1={hipY + legL} x2={cx + spread + 3} y2={hipY + legL} stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
  </>);

  const m = {
    mountainClimb: () => (<g transform={t}>
      <path d="M0,78 L30,12 L60,78Z" fill="none" stroke={c} strokeWidth={lw} strokeLinejoin="round"/>
      <path d="M20,78 L40,38 L60,78" fill="none" stroke={c} strokeWidth={lw3} opacity="0.3" strokeLinejoin="round"/>
      <path d="M25,22 L30,12 L35,22 Q30,26 25,22Z" fill={c} opacity="0.1" stroke={c} strokeWidth={lw3}/>
      <line x1="30" y1="12" x2="30" y2="3" stroke={c} strokeWidth={lw2}/>
      <path d="M30,3 L40,6 L30,9" fill={c} opacity="0.6"/>
      <path d="M10,72 Q18,60 22,48 Q26,36 32,28" fill="none" stroke={c} strokeWidth={lw3} strokeDasharray="3,3" opacity="0.5"/>
      {head(24, 40, 4.5, 'short', 'determined')}
      <line x1="24" y1="45" x2="24" y2="55" stroke={c} strokeWidth={lw}/>
      <line x1="24" y1="55" x2="21" y2="62" stroke={c} strokeWidth={lw}/>
      <line x1="24" y1="55" x2="27" y2="62" stroke={c} strokeWidth={lw}/>
      <path d="M18,49 L15,42" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
      <path d="M30,49 L33,43" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
      <rect x="25" y="46" width="5" height="7" rx="1.5" fill="none" stroke={c} strokeWidth={lw3}/>
    </g>),
    targetHit: () => (<g transform={t}>
      <circle cx="48" cy="36" r="20" fill="none" stroke={c} strokeWidth={lw}/>
      <circle cx="48" cy="36" r="13" fill="none" stroke={c} strokeWidth={lw2}/>
      <circle cx="48" cy="36" r="6" fill="none" stroke={c} strokeWidth={lw2}/>
      <circle cx="48" cy="36" r="2" fill={c}/>
      <line x1="60" y1="22" x2="49" y2="35" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
      <path d="M63,18 L60,22 L64,24" fill="none" stroke={c} strokeWidth={lw2}/>
      {head(14, 28, 5, 'spiky', 'determined')}
      <line x1="14" y1="33" x2="14" y2="50" stroke={c} strokeWidth={lw}/>
      {legs(14, 50, 12, 5)}
      <path d="M19,38 L26,32 L30,28" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
      <path d="M9,38 L5,44" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
      <line x1="46" y1="14" x2="46" y2="10" stroke={c} strokeWidth={lw3} opacity="0.5"/>
      <line x1="52" y1="14" x2="54" y2="10" stroke={c} strokeWidth={lw3} opacity="0.5"/>
      <line x1="56" y1="18" x2="60" y2="16" stroke={c} strokeWidth={lw3} opacity="0.5"/>
    </g>),
    bridge: () => (<g transform={t}>
      <path d="M0,48 Q35,18 70,48" fill="none" stroke={c} strokeWidth={lw + 0.5}/>
      <line x1="15" y1="38" x2="15" y2="72" stroke={c} strokeWidth={lw}/>
      <line x1="35" y1="26" x2="35" y2="72" stroke={c} strokeWidth={lw}/>
      <line x1="55" y1="38" x2="55" y2="72" stroke={c} strokeWidth={lw}/>
      <line x1="0" y1="72" x2="70" y2="72" stroke={c} strokeWidth={lw2} opacity="0.4"/>
      {head(8, 40, 4, 'long', 'neutral')}
      <line x1="8" y1="44" x2="8" y2="54" stroke={c} strokeWidth={lw2}/>
      <line x1="8" y1="54" x2="5" y2="60" stroke={c} strokeWidth={lw2}/>
      <line x1="8" y1="54" x2="11" y2="60" stroke={c} strokeWidth={lw2}/>
      <path d="M12,48 L16,44" stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
      {head(62, 40, 4, 'spiky', 'happy')}
      <line x1="62" y1="44" x2="62" y2="54" stroke={c} strokeWidth={lw2}/>
      <line x1="62" y1="54" x2="59" y2="60" stroke={c} strokeWidth={lw2}/>
      <line x1="62" y1="54" x2="65" y2="60" stroke={c} strokeWidth={lw2}/>
      <path d="M58,48 L54,44" stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
    </g>),
    seedToTree: () => (<g transform={t}>
      <ellipse cx="10" cy="72" rx="5" ry="3" fill={c} opacity="0.3"/>
      <path d="M10,72 L10,65" stroke={c} strokeWidth={lw3}/>
      <path d="M7,65 Q10,60 13,65" fill="none" stroke={c} strokeWidth={lw3}/>
      <line x1="35" y1="72" x2="35" y2="52" stroke={c} strokeWidth={lw}/>
      <ellipse cx="35" cy="48" rx="10" ry="14" fill="none" stroke={c} strokeWidth={lw}/>
      <path d="M30,50 Q35,44 40,50" fill="none" stroke={c} strokeWidth={lw3} opacity="0.4"/>
      <line x1="58" y1="72" x2="58" y2="30" stroke={c} strokeWidth={lw + 0.5}/>
      <path d="M42,22 Q58,4 74,22 Q66,14 58,16 Q50,14 42,22Z" fill="none" stroke={c} strokeWidth={lw}/>
      <path d="M48,30 Q58,18 68,30" fill="none" stroke={c} strokeWidth={lw3} opacity="0.4"/>
      <path d="M0,72 L70,72" stroke={c} strokeWidth={lw2} opacity="0.3"/>
    </g>),
    lighthouse: () => (<g transform={t}>
      <path d="M28,78 L32,28 L38,28 L42,78Z" fill="none" stroke={c} strokeWidth={lw}/>
      <rect x="30" y="20" width="10" height="8" rx="1" fill="none" stroke={c} strokeWidth={lw}/>
      <path d="M32,20 L35,14 L38,20" fill="none" stroke={c} strokeWidth={lw}/>
      <circle cx="35" cy="10" r="3" fill={c} opacity="0.4"/>
      <path d="M16,24 L28,26" fill="none" stroke={c} strokeWidth={lw2} opacity="0.5"/>
      <path d="M54,24 L42,26" fill="none" stroke={c} strokeWidth={lw2} opacity="0.5"/>
      <path d="M12,20 L20,22" fill="none" stroke={c} strokeWidth={lw3} opacity="0.3"/>
      <path d="M58,20 L50,22" fill="none" stroke={c} strokeWidth={lw3} opacity="0.3"/>
      <path d="M30,40 L40,40 M30,55 L40,55" fill="none" stroke={c} strokeWidth={lw3} opacity="0.3"/>
      <path d="M5,78 Q35,72 65,78" fill="none" stroke={c} strokeWidth={lw2} opacity="0.3"/>
    </g>),
    teamCircle: () => (<g transform={t}>
      {[[35,14,'short','happy'],[56,30,'long','neutral'],[52,56,'spiky','happy'],[18,56,'bun','neutral'],[14,30,'short','happy']].map(([cx2,cy2,h,e],i) => (
        <g key={i}>
          {head(cx2, cy2, 5, h, e)}
          <line x1={cx2} y1={cy2 + 5} x2={cx2} y2={cy2 + 14} stroke={c} strokeWidth={lw2}/>
        </g>
      ))}
      <circle cx="35" cy="40" r="14" fill="none" stroke={c} strokeWidth={lw3} strokeDasharray="4,3" opacity="0.4"/>
      <path d="M29,36 L41,36 M35,32 L35,44" stroke={c} strokeWidth={lw3} opacity="0.3"/>
    </g>),
    ladder: () => (<g transform={t}>
      <line x1="22" y1="8" x2="22" y2="78" stroke={c} strokeWidth={lw}/>
      <line x1="42" y1="8" x2="42" y2="78" stroke={c} strokeWidth={lw}/>
      {[16, 28, 40, 52, 64].map((py, i) => (<line key={i} x1="22" y1={py} x2="42" y2={py} stroke={c} strokeWidth={lw2}/>))}
      {head(50, 36, 4.5, 'short', 'determined')}
      <line x1="50" y1="40.5" x2="50" y2="50" stroke={c} strokeWidth={lw}/>
      <line x1="50" y1="50" x2="46" y2="58" stroke={c} strokeWidth={lw}/>
      <line x1="50" y1="50" x2="42" y2="52" stroke={c} strokeWidth={lw}/>
      <path d="M44,42 L42,40" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
      <path d="M56,42 L58,38" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
    </g>),
    compass: () => (<g transform={t}>
      <circle cx="35" cy="42" r="28" fill="none" stroke={c} strokeWidth={lw}/>
      <circle cx="35" cy="42" r="3" fill={c}/>
      <path d="M35,42 L35,18" stroke={c} strokeWidth={lw + 0.5} fill="none"/>
      <path d="M30,20 L35,14 L40,20" fill={c} opacity="0.7"/>
      <text x="33" y="12" fontFamily="Caveat" fontSize="10" fontWeight="700" fill={c}>N</text>
      <path d="M35,42 L35,62" stroke={c} strokeWidth={lw2} fill="none" opacity="0.4"/>
      <path d="M35,42 L18,42" stroke={c} strokeWidth={lw2} fill="none" opacity="0.4"/>
      <path d="M35,42 L52,42" stroke={c} strokeWidth={lw2} fill="none" opacity="0.4"/>
      {[0, 90, 180, 270].map((a, i) => {
        const rad = (a * Math.PI) / 180;
        return <circle key={i} cx={35 + 26 * Math.cos(rad)} cy={42 + 26 * Math.sin(rad)} r="1.5" fill={c} opacity="0.4"/>;
      })}
    </g>),
    figureThinking: () => (<g transform={t}>
      {head(30, 22, 6, 'short', 'neutral')}
      {torso(30, 28, 20)}
      {legs(30, 48, 14, 6)}
      <path d="M23,34 L18,28" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
      <path d="M37,34 L36,26" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
      <ellipse cx="50" cy="12" rx="14" ry="9" fill="none" stroke={c} strokeWidth={lw2} strokeDasharray="4,3"/>
      <text x="46" y="16" fontFamily="Caveat" fontSize="13" fill={c}>?</text>
      <path d="M40,18 L44,20" fill="none" stroke={c} strokeWidth={lw3} opacity="0.4"/>
    </g>),
    figureCelebrate: () => (<g transform={t}>
      {head(35, 22, 6, 'spiky', 'happy')}
      {torso(35, 28, 18)}
      {legs(35, 46, 14, 6)}
      <path d="M28,34 L20,18" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
      <path d="M42,34 L50,18" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
      <line x1="18" y1="10" x2="16" y2="6" stroke={c} strokeWidth={lw3} opacity="0.5"/>
      <line x1="22" y1="8" x2="24" y2="4" stroke={c} strokeWidth={lw3} opacity="0.5"/>
      <line x1="48" y1="10" x2="46" y2="6" stroke={c} strokeWidth={lw3} opacity="0.5"/>
      <line x1="52" y1="8" x2="54" y2="4" stroke={c} strokeWidth={lw3} opacity="0.5"/>
      <circle cx="16" cy="14" r="1.5" fill={c} opacity="0.3"/>
      <circle cx="54" cy="14" r="1.5" fill={c} opacity="0.3"/>
    </g>),
    doorOpen: () => (<g transform={t}>
      <rect x="22" y="12" width="28" height="58" rx="2" fill="none" stroke={c} strokeWidth={lw}/>
      <path d="M22,12 L12,22 L12,74 L22,70" fill="none" stroke={c} strokeWidth={lw2} strokeDasharray="3,3"/>
      <circle cx="44" cy="44" r="2" fill={c}/>
      <path d="M6,12 L6,22" stroke={c} strokeWidth={lw3} opacity="0.3"/>
      {head(60, 42, 4.5, 'long', 'happy')}
      <line x1="60" y1="46.5" x2="60" y2="56" stroke={c} strokeWidth={lw}/>
      {legs(60, 56, 12, 4)}
      <path d="M56,50 L50,46" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
      <path d="M64,50 L68,46" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
    </g>),
    puzzleFit: () => (<g transform={t}>
      <path d="M10,20 L30,20 L30,15 Q35,10 40,15 L40,20 L60,20 L60,40 L55,40 Q50,45 55,50 L60,50 L60,70 L40,70 L40,65 Q35,60 30,65 L30,70 L10,70 L10,50 L15,50 Q20,45 15,40 L10,40Z" fill="none" stroke={c} strokeWidth={lw}/>
      <path d="M35,30 L35,42 M29,36 L41,36" stroke={c} strokeWidth={lw3} opacity="0.3"/>
      <circle cx="35" cy="55" r="3" fill={c} opacity="0.15"/>
    </g>),
    figureHandshake: () => (<g transform={t}>
      {head(16, 18, 5.5, 'short', 'happy')}
      <line x1="16" y1="23.5" x2="16" y2="42" stroke={c} strokeWidth={lw}/>
      {legs(16, 42, 14, 5)}
      {head(54, 18, 5.5, 'long', 'happy')}
      <line x1="54" y1="23.5" x2="54" y2="42" stroke={c} strokeWidth={lw}/>
      {legs(54, 42, 14, 5)}
      <path d="M22,32 L30,32" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
      <path d="M48,32 L40,32" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
      <path d="M30,30 Q35,28 40,30 Q35,34 30,30" fill={c} opacity="0.2" stroke={c} strokeWidth={lw3}/>
      <path d="M10,32 L8,38" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
      <path d="M60,32 L62,38" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
    </g>),
    figureConversation: () => (<g transform={t}>
      {head(18, 36, 5, 'bun', 'neutral')}
      <line x1="18" y1="41" x2="18" y2="56" stroke={c} strokeWidth={lw}/>
      {legs(18, 56, 12, 4)}
      <path d="M12,46 L8,42" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
      <path d="M24,46 L28,42" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
      {head(52, 36, 5, 'spiky', 'happy')}
      <line x1="52" y1="41" x2="52" y2="56" stroke={c} strokeWidth={lw}/>
      {legs(52, 56, 12, 4)}
      <path d="M46,46 L42,42" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
      <path d="M58,46 L62,42" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
      <ellipse cx="26" cy="20" rx="12" ry="8" fill="none" stroke={c} strokeWidth={lw2}/>
      <path d="M20,27 L18,33" fill="none" stroke={c} strokeWidth={lw3}/>
      <line x1="19" y1="18" x2="33" y2="18" stroke={c} strokeWidth="0.8" opacity="0.4"/>
      <line x1="19" y1="22" x2="30" y2="22" stroke={c} strokeWidth="0.8" opacity="0.4"/>
      <ellipse cx="46" cy="16" rx="10" ry="7" fill="none" stroke={c} strokeWidth={lw2}/>
      <path d="M50,22" fill="none" stroke={c} strokeWidth={lw3}/>
      <text x="43" y="19" fontFamily="Caveat" fontSize="8" fill={c} opacity="0.5">!</text>
    </g>),
    figureListening: () => (<g transform={t}>
      {head(35, 28, 6, 'long', 'neutral')}
      {torso(35, 34, 18)}
      {legs(35, 52, 14, 5)}
      <path d="M28,38 L22,34" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
      <path d="M42,38 L48,34" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
      <path d="M52,18 Q64,18 64,30 Q64,42 52,42" fill="none" stroke={c} strokeWidth={lw + 0.5} strokeLinecap="round"/>
      <path d="M56,24 Q60,24 60,30 Q60,36 56,36" fill="none" stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
    </g>),
    figureHug: () => (<g transform={t}>
      {head(26, 20, 5.5, 'short', 'happy')}
      {head(44, 20, 5.5, 'long', 'happy')}
      <line x1="26" y1="25.5" x2="26" y2="44" stroke={c} strokeWidth={lw}/>
      <line x1="44" y1="25.5" x2="44" y2="44" stroke={c} strokeWidth={lw}/>
      <path d="M26,32 Q35,28 44,32" fill="none" stroke={c} strokeWidth={lw}/>
      <path d="M26,38 Q35,42 44,38" fill="none" stroke={c} strokeWidth={lw}/>
      {legs(26, 44, 14, 4)}
      {legs(44, 44, 14, 4)}
      <path d="M32,10 L35,6 L38,10" fill="none" stroke={c} strokeWidth={lw3} opacity="0.5"/>
      <circle cx="35" cy="4" r="1.5" fill={c} opacity="0.3"/>
    </g>),
    figureFear: () => (<g transform={t}>
      {head(35, 36, 5.5, 'short', 'worried')}
      <line x1="35" y1="41.5" x2="35" y2="56" stroke={c} strokeWidth={lw}/>
      <path d="M28,46 L30,50" stroke={c} strokeWidth={lw} fill="none"/>
      <path d="M42,46 L40,50" stroke={c} strokeWidth={lw} fill="none"/>
      {legs(35, 56, 12, 4)}
      <path d="M18,8 Q35,-2 52,8 Q52,22 35,28 Q18,22 18,8Z" fill="none" stroke={c} strokeWidth={lw2} strokeDasharray="4,3"/>
      <text x="31" y="18" fontFamily="Caveat" fontSize="14" fill={c}>!</text>
      <line x1="24" y1="6" x2="22" y2="2" stroke={c} strokeWidth={lw3} opacity="0.4"/>
      <line x1="46" y1="6" x2="48" y2="2" stroke={c} strokeWidth={lw3} opacity="0.4"/>
    </g>),
    figureDoubt: () => (<g transform={t}>
      {head(35, 32, 5.5, 'bun', 'worried')}
      <line x1="35" y1="37.5" x2="35" y2="54" stroke={c} strokeWidth={lw}/>
      <path d="M28,42 L22,36" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
      <path d="M42,42 L48,36" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
      {legs(35, 54, 14, 5)}
      <path d="M12,28 L22,34" stroke={c} strokeWidth={lw2} fill="none" strokeLinecap="round"/>
      <path d="M58,28 L48,34" stroke={c} strokeWidth={lw2} fill="none" strokeLinecap="round"/>
      <text x="6" y="26" fontFamily="Caveat" fontSize="13" fill={c}>A</text>
      <text x="56" y="26" fontFamily="Caveat" fontSize="13" fill={c}>B</text>
      <text x="31" y="22" fontFamily="Caveat" fontSize="14" fill={c}>?</text>
    </g>),
    figureBalance: () => (<g transform={t}>
      {head(35, 18, 5.5, 'short', 'determined')}
      {torso(35, 23.5, 20)}
      {legs(35, 43.5, 14, 6)}
      <line x1="24" y1="30" x2="46" y2="34" stroke={c} strokeWidth={lw}/>
      <path d="M14,56 Q20,52 26,56 Q26,62 20,64 Q14,62 14,56Z" fill="none" stroke={c} strokeWidth={lw2}/>
      <path d="M44,52 Q50,48 56,52 Q56,58 50,60 Q44,58 44,52Z" fill="none" stroke={c} strokeWidth={lw2}/>
      <path d="M8,70 L62,70" stroke={c} strokeWidth={lw2} strokeDasharray="3,3" opacity="0.3"/>
    </g>),
    figureCourage: () => (<g transform={t}>
      {head(28, 28, 5.5, 'spiky', 'determined')}
      <line x1="28" y1="33.5" x2="28" y2="50" stroke={c} strokeWidth={lw}/>
      <path d="M22,38 L18,32" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
      <path d="M34,38 L38,32" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
      {legs(28, 50, 14, 5)}
      <rect x="46" y="18" width="14" height="32" rx="2" fill="none" stroke={c} strokeWidth={lw}/>
      <line x1="53" y1="18" x2="53" y2="10" stroke={c} strokeWidth={lw2}/>
      <path d="M49,12 L53,6 L57,12" fill={c} opacity="0.5"/>
      <line x1="46" y1="28" x2="60" y2="28" stroke={c} strokeWidth={lw3} opacity="0.3"/>
      <line x1="46" y1="38" x2="60" y2="38" stroke={c} strokeWidth={lw3} opacity="0.3"/>
    </g>),
    windingRoad: () => (<g transform={t}>
      <path d="M10,75 Q25,65 20,50 Q15,35 30,30 Q45,25 40,15 Q38,8 50,5" fill="none" stroke={c} strokeWidth={lw + 0.8} strokeLinecap="round"/>
      <circle cx="10" cy="75" r="5" fill={c} opacity="0.3"/>
      <circle cx="30" cy="30" r="3" fill={c} opacity="0.2"/>
      {head(24, 42, 3.5, 'short', 'determined')}
      <line x1="24" y1="45.5" x2="24" y2="53" stroke={c} strokeWidth={lw2}/>
      <line x1="24" y1="53" x2="21" y2="58" stroke={c} strokeWidth={lw2}/>
      <line x1="24" y1="53" x2="27" y2="58" stroke={c} strokeWidth={lw2}/>
      <line x1="48" y1="2" x2="48" y2="-4" stroke={c} strokeWidth={lw2}/>
      <path d="M48,-4 L56,-2 L48,1" fill={c} opacity="0.5"/>
    </g>),
    mirrorReflect: () => (<g transform={t}>
      <ellipse cx="35" cy="32" rx="22" ry="28" fill="none" stroke={c} strokeWidth={lw}/>
      <line x1="35" y1="60" x2="35" y2="72" stroke={c} strokeWidth={lw + 0.5}/>
      <line x1="25" y1="72" x2="45" y2="72" stroke={c} strokeWidth={lw}/>
      <circle cx="35" cy="24" r="5" fill="none" stroke={c} strokeWidth={lw3} opacity="0.5"/>
      <line x1="35" y1="29" x2="35" y2="40" stroke={c} strokeWidth={lw3} opacity="0.5"/>
      <line x1="30" y1="33" x2="40" y2="33" stroke={c} strokeWidth={lw3} opacity="0.5"/>
      <circle cx="33" cy="23" r="0.7" fill={c} opacity="0.4"/>
      <circle cx="37" cy="23" r="0.7" fill={c} opacity="0.4"/>
      <path d="M33,26 Q35,28 37,26" fill="none" stroke={c} strokeWidth="0.7" opacity="0.4"/>
      <path d="M50,12 L52,8 M54,14 L58,12" stroke={c} strokeWidth={lw3} opacity="0.3"/>
      {head(8, 34, 4, 'long', 'neutral')}
      <line x1="8" y1="38" x2="8" y2="50" stroke={c} strokeWidth={lw2}/>
      <path d="M12,42 L14,38" stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
    </g>),
    scaleBalance: () => (<g transform={t}>
      <line x1="35" y1="10" x2="35" y2="70" stroke={c} strokeWidth={lw}/>
      <line x1="25" y1="70" x2="45" y2="70" stroke={c} strokeWidth={lw}/>
      <circle cx="35" cy="10" r="3" fill={c} opacity="0.6"/>
      <line x1="8" y1="20" x2="62" y2="16" stroke={c} strokeWidth={lw}/>
      <line x1="8" y1="20" x2="8" y2="28" stroke={c} strokeWidth={lw2}/>
      <path d="M0,28 Q8,36 16,28" fill="none" stroke={c} strokeWidth={lw2}/>
      <rect x="3" y="30" width="4" height="3" rx="0.5" fill={c} opacity="0.2"/>
      <rect x="8" y="30" width="4" height="3" rx="0.5" fill={c} opacity="0.2"/>
      <line x1="62" y1="16" x2="62" y2="24" stroke={c} strokeWidth={lw2}/>
      <path d="M54,24 Q62,32 70,24" fill="none" stroke={c} strokeWidth={lw2}/>
      <path d="M62,26 C60,24 58,23 59.5,22 C60.5,21 62,23 62,23.5 C62,23 63.5,21 64.5,22 C66,23 64,24 62,26Z" fill={c} opacity="0.3"/>
      {head(35, 50, 3.5, 'short', 'neutral')}
      <line x1="35" y1="53.5" x2="35" y2="60" stroke={c} strokeWidth={lw2}/>
    </g>),
    networkNodes: () => (<g transform={t}>
      <circle cx="35" cy="40" r="10" fill={c} opacity="0.08" stroke={c} strokeWidth={lw}/>
      {head(35, 38, 4.5, 'short', 'happy')}
      {[[12, 16], [58, 16], [8, 60], [62, 60]].map(([nx, ny], i) => {
        const hairs = ['long', 'spiky', 'bun', 'short'];
        return (<g key={i}>
          <circle cx={nx} cy={ny} r="7" fill="none" stroke={c} strokeWidth={lw2}/>
          {head(nx, ny - 1, 3.5, hairs[i], 'neutral')}
          <line x1={nx + (35 - nx) * 0.35} y1={ny + (40 - ny) * 0.35} x2={35 + (nx - 35) * 0.35} y2={40 + (ny - 40) * 0.35} stroke={c} strokeWidth={lw3} opacity="0.4"/>
        </g>);
      })}
      <line x1="18" y1="20" x2="52" y2="20" stroke={c} strokeWidth="0.8" opacity="0.2" strokeDasharray="3,3"/>
      <line x1="14" y1="56" x2="56" y2="56" stroke={c} strokeWidth="0.8" opacity="0.2" strokeDasharray="3,3"/>
    </g>),
    treasure: () => (<g transform={t}>
      <path d="M14,42 L14,66 L56,66 L56,42Z" fill="none" stroke={c} strokeWidth={lw}/>
      <path d="M14,42 Q35,32 56,42" fill="none" stroke={c} strokeWidth={lw}/>
      <line x1="35" y1="38" x2="35" y2="52" stroke={c} strokeWidth={lw2}/>
      <circle cx="35" cy="52" r="2.5" fill={c} opacity="0.5"/>
      <rect x="32" y="50" width="6" height="5" rx="1" fill="none" stroke={c} strokeWidth={lw3}/>
      <path d="M25,28 L28,20 M35,26 L35,16 M45,28 L42,20" stroke={c} strokeWidth={lw2} opacity="0.4"/>
      <circle cx="22" cy="18" r="1.5" fill={c} opacity="0.3"/>
      <circle cx="48" cy="16" r="1.5" fill={c} opacity="0.3"/>
      <circle cx="35" cy="12" r="2" fill={c} opacity="0.3"/>
      {head(6, 50, 4, 'spiky', 'surprised')}
      <line x1="6" y1="54" x2="6" y2="64" stroke={c} strokeWidth={lw2}/>
      <path d="M10,57 L14,54" stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
    </g>),
    wallBreak: () => (<g transform={t}>
      <line x1="40" y1="4" x2="40" y2="28" stroke={c} strokeWidth={lw + 0.5}/>
      <line x1="40" y1="52" x2="40" y2="76" stroke={c} strokeWidth={lw + 0.5}/>
      <path d="M38,28 L34,32 L38,38 L34,44 L38,48 L40,52" fill="none" stroke={c} strokeWidth={lw}/>
      <path d="M42,28 L46,32 L42,38 L46,44 L42,48 L40,52" fill="none" stroke={c} strokeWidth={lw}/>
      <line x1="36" y1="8" x2="44" y2="8" stroke={c} strokeWidth={lw3} opacity="0.3"/>
      <line x1="36" y1="16" x2="44" y2="16" stroke={c} strokeWidth={lw3} opacity="0.3"/>
      <line x1="36" y1="60" x2="44" y2="60" stroke={c} strokeWidth={lw3} opacity="0.3"/>
      <line x1="36" y1="68" x2="44" y2="68" stroke={c} strokeWidth={lw3} opacity="0.3"/>
      {head(20, 32, 5, 'short', 'determined')}
      <line x1="20" y1="37" x2="20" y2="52" stroke={c} strokeWidth={lw}/>
      {legs(20, 52, 13, 5)}
      <path d="M26,42 L34,36" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
      <circle cx="35" cy="35" r="2.5" fill={c} opacity="0.4"/>
      <path d="M14,42 L10,48" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
      <line x1="46" y1="32" x2="52" y2="28" stroke={c} strokeWidth={lw3} opacity="0.5"/>
      <line x1="48" y1="38" x2="54" y2="38" stroke={c} strokeWidth={lw3} opacity="0.5"/>
      <line x1="46" y1="44" x2="52" y2="48" stroke={c} strokeWidth={lw3} opacity="0.5"/>
      <rect x="50" y="34" width="3" height="3" rx="0.5" fill={c} opacity="0.2" transform="rotate(20,51,35)"/>
      <rect x="54" y="42" width="2.5" height="2.5" rx="0.5" fill={c} opacity="0.15" transform="rotate(-15,55,43)"/>
    </g>),
  };

  try { const fn = m[name]; return fn ? fn() : null; } catch(e) { return null; }
}
