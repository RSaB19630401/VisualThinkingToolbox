// bildstark-icons.jsx — Simple, bold, filled illustrations for Bildstark style
// Inspired by the reference images: large, colorful, easily understood by children
import React from 'react';

// Maps scene names → simple filled illustrations (larger, bolder than Bikablo)
export function BsScene(name, x, y, s, primary, accent) {
  const sc = s;
  const t = `translate(${x},${y}) scale(${sc})`;
  const p = primary, a = accent || primary;

  const m = {
    // Person understands → lightbulb moment
    mountainClimb: () => (<g transform={t}>
      <circle cx="35" cy="18" r="10" fill="none" stroke={p} strokeWidth="3"/>
      <line x1="35" y1="28" x2="35" y2="52" stroke={p} strokeWidth="3"/>
      <line x1="25" y1="38" x2="45" y2="38" stroke={p} strokeWidth="3"/>
      <line x1="35" y1="52" x2="25" y2="68" stroke={p} strokeWidth="3"/>
      <line x1="35" y1="52" x2="45" y2="68" stroke={p} strokeWidth="3"/>
      <path d="M48,4 L58,4 L58,20 Q53,25 48,20Z" fill={a} opacity="0.25" stroke={a} strokeWidth="2"/>
      <line x1="53" y1="10" x2="53" y2="16" stroke={a} strokeWidth="2.5"/>
      <circle cx="53" cy="7" r="1.5" fill={a}/>
      <path d="M12,12 L8,8 M12,18 L6,18 M12,24 L8,28" stroke={p} strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
    </g>),

    // Target with arrow
    targetHit: () => (<g transform={t}>
      <circle cx="35" cy="38" r="28" fill={p} opacity="0.08"/>
      <circle cx="35" cy="38" r="28" fill="none" stroke={p} strokeWidth="3"/>
      <circle cx="35" cy="38" r="18" fill="none" stroke={p} strokeWidth="2.5"/>
      <circle cx="35" cy="38" r="8" fill={p} opacity="0.3"/>
      <circle cx="35" cy="38" r="3" fill={p}/>
      <line x1="56" y1="16" x2="38" y2="36" stroke={a} strokeWidth="3"/>
      <path d="M58,8 L60,18 L50,16" fill="none" stroke={a} strokeWidth="2.5" strokeLinecap="round"/>
    </g>),

    // Bridge connecting two sides
    bridge: () => (<g transform={t}>
      <path d="M5,50 Q35,15 65,50" fill="none" stroke={p} strokeWidth="3.5"/>
      <line x1="20" y1="38" x2="20" y2="65" stroke={p} strokeWidth="2.5"/>
      <line x1="35" y1="28" x2="35" y2="65" stroke={p} strokeWidth="2.5"/>
      <line x1="50" y1="38" x2="50" y2="65" stroke={p} strokeWidth="2.5"/>
      <circle cx="10" cy="45" r="5" fill={a} opacity="0.3"/>
      <circle cx="60" cy="45" r="5" fill={a} opacity="0.3"/>
    </g>),

    // Seed → sprout → tree (growth)
    seedToTree: () => (<g transform={t}>
      <ellipse cx="12" cy="62" rx="7" ry="4" fill={p} opacity="0.3"/>
      <circle cx="12" cy="58" r="3" fill={p} opacity="0.5"/>
      <line x1="35" y1="65" x2="35" y2="48" stroke={p} strokeWidth="2.5"/>
      <ellipse cx="35" cy="44" rx="10" ry="13" fill={a} opacity="0.15" stroke={p} strokeWidth="2"/>
      <line x1="58" y1="65" x2="58" y2="30" stroke={p} strokeWidth="3"/>
      <path d="M42,22 Q58,2 74,22 Q66,14 58,16 Q50,14 42,22Z" fill={a} opacity="0.2" stroke={p} strokeWidth="2.5"/>
    </g>),

    // Lighthouse (guidance)
    lighthouse: () => (<g transform={t}>
      <path d="M26,75 L30,25 L40,25 L44,75Z" fill={p} opacity="0.1" stroke={p} strokeWidth="2.5"/>
      <rect x="28" y="18" width="14" height="8" rx="2" fill={a} opacity="0.3" stroke={p} strokeWidth="2"/>
      <path d="M31,18 L35,10 L39,18" fill={a} opacity="0.5" stroke={p} strokeWidth="2"/>
      <path d="M14,20 L26,22" stroke={a} strokeWidth="2.5" opacity="0.5" strokeLinecap="round"/>
      <path d="M56,20 L44,22" stroke={a} strokeWidth="2.5" opacity="0.5" strokeLinecap="round"/>
      <path d="M18,12 L24,18" stroke={a} strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
      <path d="M52,12 L46,18" stroke={a} strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
    </g>),

    // Team circle
    teamCircle: () => (<g transform={t}>
      <circle cx="35" cy="38" r="22" fill={p} opacity="0.06" stroke={p} strokeWidth="2" strokeDasharray="6,4"/>
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const rad = deg * Math.PI / 180, cx2 = 35 + 26 * Math.cos(rad), cy2 = 38 + 26 * Math.sin(rad);
        return (<g key={i}>
          <circle cx={cx2} cy={cy2 - 4} r="6" fill={i === 0 ? a : p} opacity={i === 0 ? 0.4 : 0.25}/>
          <circle cx={cx2} cy={cy2 - 4} r="6" fill="none" stroke={p} strokeWidth="2"/>
        </g>);
      })}
    </g>),

    // Ladder of steps
    ladder: () => (<g transform={t}>
      <line x1="20" y1="8" x2="20" y2="70" stroke={p} strokeWidth="3"/>
      <line x1="48" y1="8" x2="48" y2="70" stroke={p} strokeWidth="3"/>
      {[18, 30, 42, 54, 66].map((py, i) => (
        <g key={i}><line x1="20" y1={py} x2="48" y2={py} stroke={p} strokeWidth="2.5"/>
        {i < 3 && <circle cx={34 + i * 2} cy={py - 8} r="3" fill={a} opacity="0.4"/>}</g>
      ))}
    </g>),

    // Compass
    compass: () => (<g transform={t}>
      <circle cx="35" cy="38" r="26" fill={p} opacity="0.06" stroke={p} strokeWidth="3"/>
      <circle cx="35" cy="38" r="4" fill={p}/>
      <path d="M35,38 L35,16" stroke={p} strokeWidth="3"/>
      <path d="M29,18 L35,10 L41,18" fill={a} opacity="0.5"/>
      <text x="33" y="9" fontFamily="Caveat" fontSize="12" fontWeight="700" fill={p}>N</text>
    </g>),

    // Thinking figure with question
    figureThinking: () => (<g transform={t}>
      <circle cx="28" cy="20" r="8" fill={p} opacity="0.15" stroke={p} strokeWidth="2.5"/>
      <line x1="28" y1="28" x2="28" y2="50" stroke={p} strokeWidth="2.5"/>
      <line x1="18" y1="38" x2="38" y2="38" stroke={p} strokeWidth="2.5"/>
      <line x1="28" y1="50" x2="20" y2="65" stroke={p} strokeWidth="2.5"/>
      <line x1="28" y1="50" x2="36" y2="65" stroke={p} strokeWidth="2.5"/>
      <ellipse cx="50" cy="12" rx="14" ry="10" fill={a} opacity="0.12" stroke={a} strokeWidth="2"/>
      <text x="46" y="17" fontFamily="Caveat" fontSize="16" fontWeight="700" fill={a}>?</text>
    </g>),

    // Celebrating figure
    figureCelebrate: () => (<g transform={t}>
      <circle cx="35" cy="22" r="8" fill={a} opacity="0.2" stroke={p} strokeWidth="2.5"/>
      <line x1="35" y1="30" x2="35" y2="50" stroke={p} strokeWidth="2.5"/>
      <path d="M25,36 L16,18" stroke={p} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M45,36 L54,18" stroke={p} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="35" y1="50" x2="27" y2="65" stroke={p} strokeWidth="2.5"/>
      <line x1="35" y1="50" x2="43" y2="65" stroke={p} strokeWidth="2.5"/>
      {[[12,14],[58,14],[20,6],[50,6],[35,2]].map(([cx2,cy2],i) => (
        <circle key={i} cx={cx2} cy={cy2} r="2" fill={a} opacity="0.5"/>
      ))}
    </g>),

    // Open door
    doorOpen: () => (<g transform={t}>
      <rect x="18" y="12" width="32" height="55" rx="3" fill={p} opacity="0.08" stroke={p} strokeWidth="2.5"/>
      <path d="M18,12 L8,22 L8,72 L18,67" fill={a} opacity="0.08" stroke={p} strokeWidth="2" strokeDasharray="4,3"/>
      <circle cx="44" cy="42" r="2.5" fill={p}/>
      <path d="M55,32 L62,28 M55,38 L62,38 M55,44 L62,48" stroke={a} strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
    </g>),

    // Puzzle pieces
    puzzleFit: () => (<g transform={t}>
      <rect x="8" y="8" width="26" height="26" rx="4" fill={p} opacity="0.15" stroke={p} strokeWidth="2.5"/>
      <rect x="36" y="8" width="26" height="26" rx="4" fill={a} opacity="0.15" stroke={p} strokeWidth="2.5"/>
      <rect x="8" y="36" width="26" height="26" rx="4" fill={a} opacity="0.1" stroke={p} strokeWidth="2"/>
      <rect x="36" y="36" width="26" height="26" rx="4" fill={p} opacity="0.1" stroke={p} strokeWidth="2"/>
      <circle cx="35" cy="35" r="6" fill={p} opacity="0.3"/>
    </g>),

    // Two people talking
    figureConversation: () => (<g transform={t}>
      <circle cx="18" cy="30" r="7" fill={p} opacity="0.15" stroke={p} strokeWidth="2.5"/>
      <line x1="18" y1="37" x2="18" y2="55" stroke={p} strokeWidth="2.5"/>
      <circle cx="52" cy="30" r="7" fill={a} opacity="0.15" stroke={p} strokeWidth="2.5"/>
      <line x1="52" y1="37" x2="52" y2="55" stroke={p} strokeWidth="2.5"/>
      <ellipse cx="28" cy="18" rx="12" ry="8" fill={p} opacity="0.1" stroke={p} strokeWidth="2"/>
      <ellipse cx="44" cy="14" rx="10" ry="7" fill={a} opacity="0.1" stroke={a} strokeWidth="2"/>
      <text x="24" y="22" fontFamily="Caveat" fontSize="10" fill={p}>...</text>
      <text x="40" y="18" fontFamily="Caveat" fontSize="10" fill={a}>!</text>
    </g>),

    // Handshake
    figureHandshake: () => (<g transform={t}>
      <circle cx="16" cy="18" r="6" fill={p} opacity="0.15" stroke={p} strokeWidth="2.5"/>
      <line x1="16" y1="24" x2="16" y2="42" stroke={p} strokeWidth="2.5"/>
      <circle cx="54" cy="18" r="6" fill={a} opacity="0.15" stroke={p} strokeWidth="2.5"/>
      <line x1="54" y1="24" x2="54" y2="42" stroke={p} strokeWidth="2.5"/>
      <path d="M24,35 L46,35" stroke={p} strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="35" cy="35" r="8" fill={a} opacity="0.1" stroke={p} strokeWidth="1.5"/>
    </g>),

    // Listening figure
    figureListening: () => (<g transform={t}>
      <circle cx="30" cy="25" r="8" fill={p} opacity="0.15" stroke={p} strokeWidth="2.5"/>
      <line x1="30" y1="33" x2="30" y2="52" stroke={p} strokeWidth="2.5"/>
      <path d="M50,16 Q64,16 64,30 Q64,44 50,44" fill="none" stroke={a} strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M54,22 Q60,22 60,30 Q60,38 54,38" fill="none" stroke={a} strokeWidth="2.5" strokeLinecap="round"/>
    </g>),

    // Balance/scales
    figureBalance: () => (<g transform={t}>
      <line x1="35" y1="10" x2="35" y2="65" stroke={p} strokeWidth="3"/>
      <line x1="10" y1="22" x2="60" y2="22" stroke={p} strokeWidth="3"/>
      <path d="M5,22 L12,42 L20,42Z" fill={p} opacity="0.15" stroke={p} strokeWidth="2"/>
      <path d="M50,22 L57,42 L64,42Z" fill={a} opacity="0.15" stroke={p} strokeWidth="2"/>
      <line x1="22" y1="65" x2="48" y2="65" stroke={p} strokeWidth="3"/>
      <circle cx="35" cy="10" r="4" fill={p}/>
    </g>),

    // Winding road
    windingRoad: () => (<g transform={t}>
      <path d="M10,68 Q28,55 22,40 Q16,25 35,22 Q54,19 48,8" fill="none" stroke={p} strokeWidth="4" strokeLinecap="round" opacity="0.3"/>
      <path d="M10,68 Q28,55 22,40 Q16,25 35,22 Q54,19 48,8" fill="none" stroke={p} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="8,6"/>
      <circle cx="10" cy="68" r="5" fill={p} opacity="0.3"/>
      <circle cx="48" cy="8" r="5" fill={a} opacity="0.4"/>
      <path d="M44,4 L48,0 L52,4" fill={a} opacity="0.5"/>
    </g>),

    // Network nodes
    networkNodes: () => (<g transform={t}>
      <circle cx="35" cy="38" r="10" fill={p} opacity="0.15" stroke={p} strokeWidth="2.5"/>
      <circle cx="12" cy="18" r="7" fill={a} opacity="0.12" stroke={p} strokeWidth="2"/>
      <circle cx="58" cy="18" r="7" fill={a} opacity="0.12" stroke={p} strokeWidth="2"/>
      <circle cx="12" cy="58" r="7" fill={a} opacity="0.12" stroke={p} strokeWidth="2"/>
      <circle cx="58" cy="58" r="7" fill={a} opacity="0.12" stroke={p} strokeWidth="2"/>
      <line x1="27" y1="32" x2="17" y2="23" stroke={p} strokeWidth="2" opacity="0.5"/>
      <line x1="43" y1="32" x2="53" y2="23" stroke={p} strokeWidth="2" opacity="0.5"/>
      <line x1="27" y1="44" x2="17" y2="53" stroke={p} strokeWidth="2" opacity="0.5"/>
      <line x1="43" y1="44" x2="53" y2="53" stroke={p} strokeWidth="2" opacity="0.5"/>
    </g>),

    // Treasure chest
    treasure: () => (<g transform={t}>
      <path d="M12,35 L12,60 L58,60 L58,35Z" fill={a} opacity="0.12" stroke={p} strokeWidth="2.5"/>
      <path d="M12,35 Q35,22 58,35" fill={p} opacity="0.1" stroke={p} strokeWidth="2.5"/>
      <circle cx="35" cy="48" r="4" fill={a} opacity="0.4"/>
      <line x1="35" y1="32" x2="35" y2="44" stroke={p} strokeWidth="2"/>
      <path d="M22,25 L28,12 M35,22 L35,8 M48,25 L42,12" stroke={a} strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
    </g>),

    // Wall break
    wallBreak: () => (<g transform={t}>
      <line x1="38" y1="5" x2="38" y2="70" stroke={p} strokeWidth="3.5"/>
      <path d="M33,28 L28,36 L36,42 L30,52 L38,55" fill="none" stroke={a} strokeWidth="2.5"/>
      <path d="M43,26 L48,34 L40,40 L46,50 L38,55" fill="none" stroke={a} strokeWidth="2.5"/>
      <circle cx="20" cy="35" r="7" fill={p} opacity="0.15" stroke={p} strokeWidth="2.5"/>
      <line x1="20" y1="42" x2="20" y2="56" stroke={p} strokeWidth="2.5"/>
      <path d="M28,48 L33,42" stroke={p} strokeWidth="2.5" strokeLinecap="round"/>
    </g>),

    // Mirror/reflect
    mirrorReflect: () => (<g transform={t}>
      <ellipse cx="35" cy="32" rx="24" ry="28" fill={p} opacity="0.06" stroke={p} strokeWidth="2.5"/>
      <line x1="35" y1="60" x2="35" y2="70" stroke={p} strokeWidth="3"/>
      <line x1="24" y1="70" x2="46" y2="70" stroke={p} strokeWidth="3"/>
      <circle cx="35" cy="26" r="5" fill={a} opacity="0.2" stroke={p} strokeWidth="2"/>
      <line x1="35" y1="31" x2="35" y2="44" stroke={p} strokeWidth="2"/>
    </g>),

    // Courage figure with flag
    figureCourage: () => (<g transform={t}>
      <circle cx="28" cy="25" r="7" fill={p} opacity="0.15" stroke={p} strokeWidth="2.5"/>
      <line x1="28" y1="32" x2="28" y2="52" stroke={p} strokeWidth="2.5"/>
      <path d="M20,40 L14,32" stroke={p} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M36,40 L42,32" stroke={p} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="52" x2="22" y2="66" stroke={p} strokeWidth="2.5"/>
      <line x1="28" y1="52" x2="34" y2="66" stroke={p} strokeWidth="2.5"/>
      <rect x="46" y="12" width="14" height="30" rx="2" fill={a} opacity="0.15" stroke={a} strokeWidth="2.5"/>
      <line x1="53" y1="12" x2="53" y2="4" stroke={a} strokeWidth="2.5"/>
      <path d="M49,6 L53,0 L57,6" fill={a} opacity="0.4"/>
    </g>),

    // Fear figure
    figureFear: () => (<g transform={t}>
      <circle cx="35" cy="32" r="7" fill={p} opacity="0.15" stroke={p} strokeWidth="2.5"/>
      <line x1="35" y1="39" x2="35" y2="55" stroke={p} strokeWidth="2.5"/>
      <path d="M27,46 L30,50" stroke={p} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M43,46 L40,50" stroke={p} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="35" y1="55" x2="30" y2="68" stroke={p} strokeWidth="2.5"/>
      <line x1="35" y1="55" x2="40" y2="68" stroke={p} strokeWidth="2.5"/>
      <path d="M18,8 Q35,-2 52,8 Q52,22 35,26 Q18,22 18,8Z" fill={a} opacity="0.1" stroke={a} strokeWidth="2" strokeDasharray="5,3"/>
      <text x="32" y="16" fontFamily="Caveat" fontSize="16" fontWeight="700" fill={a}>!</text>
    </g>),

    // Doubt figure
    figureDoubt: () => (<g transform={t}>
      <circle cx="35" cy="28" r="7" fill={p} opacity="0.15" stroke={p} strokeWidth="2.5"/>
      <line x1="35" y1="35" x2="35" y2="52" stroke={p} strokeWidth="2.5"/>
      <line x1="35" y1="52" x2="28" y2="66" stroke={p} strokeWidth="2.5"/>
      <line x1="35" y1="52" x2="42" y2="66" stroke={p} strokeWidth="2.5"/>
      <path d="M14,28 L24,34" stroke={p} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M56,28 L46,34" stroke={p} strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="4" y="18" width="16" height="14" rx="4" fill={p} opacity="0.1" stroke={p} strokeWidth="1.5"/>
      <text x="8" y="29" fontFamily="Caveat" fontSize="12" fill={p}>A</text>
      <rect x="50" y="18" width="16" height="14" rx="4" fill={a} opacity="0.1" stroke={a} strokeWidth="1.5"/>
      <text x="54" y="29" fontFamily="Caveat" fontSize="12" fill={a}>B</text>
    </g>),

    // Hug (connection)
    figureHug: () => (<g transform={t}>
      <circle cx="26" cy="20" r="7" fill={p} opacity="0.15" stroke={p} strokeWidth="2.5"/>
      <circle cx="44" cy="20" r="7" fill={a} opacity="0.15" stroke={p} strokeWidth="2.5"/>
      <line x1="26" y1="27" x2="26" y2="46" stroke={p} strokeWidth="2.5"/>
      <line x1="44" y1="27" x2="44" y2="46" stroke={p} strokeWidth="2.5"/>
      <path d="M26,34 Q35,28 44,34" fill="none" stroke={p} strokeWidth="2.5"/>
      <path d="M26,40 Q35,46 44,40" fill="none" stroke={p} strokeWidth="2.5"/>
      <path d="M32,10 L35,4 L38,10" fill={a} opacity="0.4" stroke={a} strokeWidth="1.5"/>
    </g>),

    // Scale balance
    scaleBalance: () => (<g transform={t}>
      <line x1="35" y1="8" x2="35" y2="65" stroke={p} strokeWidth="3"/>
      <line x1="8" y1="20" x2="62" y2="20" stroke={p} strokeWidth="2.5"/>
      <path d="M3,20 L10,40 L20,40Z" fill={p} opacity="0.12" stroke={p} strokeWidth="2"/>
      <path d="M50,20 L57,40 L64,40Z" fill={a} opacity="0.12" stroke={p} strokeWidth="2"/>
      <line x1="22" y1="65" x2="48" y2="65" stroke={p} strokeWidth="3"/>
      <circle cx="35" cy="8" r="4" fill={p}/>
    </g>),
  };

  try { const fn = m[name]; return fn ? fn() : null; } catch(e) { return null; }
}

// Bold simple icon for Bildstark process flow arrows
export function BsFlowIcon(name, x, y, s, color) {
  const sc = s / 30;
  const t = `translate(${x},${y}) scale(${sc})`;
  const m = {
    magnify: () => (<g transform={t}><circle cx="14" cy="14" r="10" fill={color} opacity="0.12" stroke={color} strokeWidth="2.5"/><line x1="21" y1="21" x2="28" y2="28" stroke={color} strokeWidth="3" strokeLinecap="round"/></g>),
    funnel: () => (<g transform={t}><path d="M4,4 L26,4 L18,18 L18,28 L12,28 L12,18Z" fill={color} opacity="0.15" stroke={color} strokeWidth="2.5"/></g>),
    eye: () => (<g transform={t}><path d="M2,15 Q15,4 28,15 Q15,26 2,15Z" fill={color} opacity="0.1" stroke={color} strokeWidth="2.5"/><circle cx="15" cy="15" r="5" fill={color} opacity="0.3"/><circle cx="15" cy="15" r="2" fill={color}/></g>),
    heart: () => (<g transform={t}><path d="M15,26 C2,18 2,6 8,4 C12,2 15,6 15,8 C15,6 18,2 22,4 C28,6 28,18 15,26Z" fill={color} opacity="0.3" stroke={color} strokeWidth="2"/></g>),
    star: () => { const pts=[]; for(let i=0;i<10;i++){const a2=(i*Math.PI)/5-Math.PI/2,r2=i%2===0?13:5;pts.push(`${15+r2*Math.cos(a2)},${15+r2*Math.sin(a2)}`);}return(<g transform={t}><polygon points={pts.join(' ')} fill={color} opacity="0.3" stroke={color} strokeWidth="2"/></g>); },
    bulb: () => (<g transform={t}><ellipse cx="15" cy="12" rx="9" ry="10" fill={color} opacity="0.15" stroke={color} strokeWidth="2.5"/><line x1="11" y1="22" x2="19" y2="22" stroke={color} strokeWidth="2.5"/><path d="M11,26 L19,26" stroke={color} strokeWidth="2" opacity="0.5"/></g>),
    check: () => (<g transform={t}><path d="M5,16 L12,24 L26,6" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></g>),
    pencil: () => (<g transform={t}><path d="M22,4 L26,8 L10,24 L4,26 L6,20Z" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/></g>),
    trophy: () => (<g transform={t}><path d="M10,4 L10,16 Q15,24 20,16 L20,4Z" fill={color} opacity="0.15" stroke={color} strokeWidth="2.5"/><line x1="15" y1="24" x2="15" y2="28" stroke={color} strokeWidth="2.5"/><line x1="10" y1="28" x2="20" y2="28" stroke={color} strokeWidth="2"/></g>),
  };
  try { const fn = m[name]; return fn ? fn() : null; } catch(e) { return null; }
}
