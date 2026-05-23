// gr-characters.jsx — Simple character illustrations for Graphic Recording style
// Figures with hair, simple clothing, clear gestures/expressions
import React from 'react';

/**
 * GrChar renders a character at position (x,y) with scale s.
 * pose: 'thinking' | 'celebrating' | 'presenting' | 'pointing' | 'questioning' | 'confident' | 'walking' | 'sitting'
 * accent: accent color for highlights (hair accessory, tie, etc.)
 * stroke: line color (usually dark gray/black)
 */
export function GrChar(pose, x, y, s, accent, stroke = '#2D2D2D') {
  const t = `translate(${x},${y}) scale(${s})`;
  const sw = 2.2; // stroke width
  const hair = accent; // hair/accessory color = accent

  const poses = {
    thinking: () => (<g transform={t}>
      {/* Head */}
      <circle cx="30" cy="18" r="12" fill="none" stroke={stroke} strokeWidth={sw}/>
      {/* Hair */}
      <path d="M19,14 Q22,4 30,6 Q38,4 41,14" fill="none" stroke={stroke} strokeWidth={sw + 0.5}/>
      <path d="M20,12 Q24,7 30,8" fill="none" stroke={hair} strokeWidth="1.5" opacity="0.6"/>
      {/* Eyes + thinking expression */}
      <circle cx="26" cy="17" r="1.2" fill={stroke}/>
      <circle cx="34" cy="17" r="1.2" fill={stroke}/>
      <path d="M26,22 Q30,24 34,22" fill="none" stroke={stroke} strokeWidth="1.2"/>
      {/* Body with shirt */}
      <path d="M24,30 L24,52 L36,52 L36,30" fill="none" stroke={stroke} strokeWidth={sw}/>
      <line x1="30" y1="30" x2="30" y2="42" stroke={stroke} strokeWidth="1" opacity="0.3"/>
      {/* Collar */}
      <path d="M24,30 L30,35 L36,30" fill="none" stroke={stroke} strokeWidth="1.5"/>
      {/* Arms — hand on chin (thinking) */}
      <path d="M24,34 L14,40 L18,30" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
      <path d="M36,34 L44,44" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
      {/* Legs */}
      <line x1="27" y1="52" x2="24" y2="68" stroke={stroke} strokeWidth={sw}/>
      <line x1="33" y1="52" x2="36" y2="68" stroke={stroke} strokeWidth={sw}/>
      {/* Shoes */}
      <path d="M21,68 L27,68" stroke={stroke} strokeWidth={sw + 0.5} strokeLinecap="round"/>
      <path d="M33,68 L39,68" stroke={stroke} strokeWidth={sw + 0.5} strokeLinecap="round"/>
    </g>),

    celebrating: () => (<g transform={t}>
      <circle cx="30" cy="18" r="12" fill="none" stroke={stroke} strokeWidth={sw}/>
      <path d="M19,14 Q22,4 30,6 Q38,4 41,14" fill="none" stroke={stroke} strokeWidth={sw + 0.5}/>
      <circle cx="26" cy="16" r="1.2" fill={stroke}/>
      <circle cx="34" cy="16" r="1.2" fill={stroke}/>
      <path d="M24,22 Q30,27 36,22" fill="none" stroke={stroke} strokeWidth="1.5"/>
      <path d="M24,30 L24,52 L36,52 L36,30" fill="none" stroke={stroke} strokeWidth={sw}/>
      <path d="M24,30 L30,35 L36,30" fill="none" stroke={stroke} strokeWidth="1.5"/>
      {/* Arms UP */}
      <path d="M24,34 L10,14" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
      <path d="M36,34 L50,14" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
      {/* Sparkles */}
      <line x1="6" y1="10" x2="8" y2="6" stroke={hair} strokeWidth="2" strokeLinecap="round"/>
      <line x1="52" y1="10" x2="54" y2="6" stroke={hair} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="14" cy="6" r="2" fill={hair} opacity="0.5"/>
      <circle cx="48" cy="4" r="1.5" fill={hair} opacity="0.5"/>
      <line x1="27" y1="52" x2="22" y2="68" stroke={stroke} strokeWidth={sw}/>
      <line x1="33" y1="52" x2="38" y2="68" stroke={stroke} strokeWidth={sw}/>
      <path d="M19,68 L25,68" stroke={stroke} strokeWidth={sw + 0.5} strokeLinecap="round"/>
      <path d="M35,68 L41,68" stroke={stroke} strokeWidth={sw + 0.5} strokeLinecap="round"/>
    </g>),

    presenting: () => (<g transform={t}>
      <circle cx="30" cy="18" r="12" fill="none" stroke={stroke} strokeWidth={sw}/>
      <path d="M19,14 Q22,4 30,6 Q38,4 41,14" fill="none" stroke={stroke} strokeWidth={sw + 0.5}/>
      <path d="M21,12 Q26,6 32,9" fill="none" stroke={hair} strokeWidth="1.5" opacity="0.6"/>
      <circle cx="26" cy="17" r="1.2" fill={stroke}/>
      <circle cx="34" cy="17" r="1.2" fill={stroke}/>
      <path d="M26,22 Q30,25 34,22" fill="none" stroke={stroke} strokeWidth="1.3"/>
      <path d="M24,30 L24,52 L36,52 L36,30" fill="none" stroke={stroke} strokeWidth={sw}/>
      <path d="M24,30 L30,35 L36,30" fill="none" stroke={stroke} strokeWidth="1.5"/>
      {/* Open arms — presenting */}
      <path d="M24,34 L8,28" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
      <path d="M36,34 L52,28" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
      {/* Hands open */}
      <circle cx="6" cy="27" r="2.5" fill="none" stroke={stroke} strokeWidth="1.5"/>
      <circle cx="54" cy="27" r="2.5" fill="none" stroke={stroke} strokeWidth="1.5"/>
      <line x1="27" y1="52" x2="24" y2="68" stroke={stroke} strokeWidth={sw}/>
      <line x1="33" y1="52" x2="36" y2="68" stroke={stroke} strokeWidth={sw}/>
      <path d="M21,68 L27,68" stroke={stroke} strokeWidth={sw + 0.5} strokeLinecap="round"/>
      <path d="M33,68 L39,68" stroke={stroke} strokeWidth={sw + 0.5} strokeLinecap="round"/>
    </g>),

    pointing: () => (<g transform={t}>
      <circle cx="30" cy="18" r="12" fill="none" stroke={stroke} strokeWidth={sw}/>
      <path d="M19,14 Q22,4 30,6 Q38,4 41,14" fill="none" stroke={stroke} strokeWidth={sw + 0.5}/>
      <circle cx="26" cy="17" r="1.2" fill={stroke}/>
      <circle cx="34" cy="17" r="1.2" fill={stroke}/>
      <path d="M27,22 Q30,24 33,22" fill="none" stroke={stroke} strokeWidth="1.2"/>
      <path d="M24,30 L24,52 L36,52 L36,30" fill="none" stroke={stroke} strokeWidth={sw}/>
      <path d="M24,30 L30,35 L36,30" fill="none" stroke={stroke} strokeWidth="1.5"/>
      {/* Right arm pointing */}
      <path d="M36,36 L54,24 L60,22" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
      {/* Left arm down */}
      <path d="M24,36 L16,48" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
      <line x1="27" y1="52" x2="24" y2="68" stroke={stroke} strokeWidth={sw}/>
      <line x1="33" y1="52" x2="36" y2="68" stroke={stroke} strokeWidth={sw}/>
      <path d="M21,68 L27,68" stroke={stroke} strokeWidth={sw + 0.5} strokeLinecap="round"/>
      <path d="M33,68 L39,68" stroke={stroke} strokeWidth={sw + 0.5} strokeLinecap="round"/>
    </g>),

    questioning: () => (<g transform={t}>
      <circle cx="30" cy="18" r="12" fill="none" stroke={stroke} strokeWidth={sw}/>
      <path d="M19,14 Q22,4 30,6 Q38,4 41,14" fill="none" stroke={stroke} strokeWidth={sw + 0.5}/>
      {/* Raised eyebrows */}
      <path d="M23,13 Q26,11 28,13" fill="none" stroke={stroke} strokeWidth="1.3"/>
      <path d="M32,13 Q34,11 37,13" fill="none" stroke={stroke} strokeWidth="1.3"/>
      <circle cx="26" cy="17" r="1.2" fill={stroke}/>
      <circle cx="34" cy="17" r="1.2" fill={stroke}/>
      <ellipse cx="30" cy="23" rx="3" ry="2.5" fill="none" stroke={stroke} strokeWidth="1.3"/>
      <path d="M24,30 L24,52 L36,52 L36,30" fill="none" stroke={stroke} strokeWidth={sw}/>
      <path d="M24,30 L30,35 L36,30" fill="none" stroke={stroke} strokeWidth="1.5"/>
      {/* One arm raised with question */}
      <path d="M36,34 L48,18" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
      <path d="M24,36 L14,46" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
      {/* Question mark */}
      <text x="50" y="16" fontFamily="Caveat" fontSize="18" fontWeight="700" fill={hair}>?</text>
      <line x1="27" y1="52" x2="24" y2="68" stroke={stroke} strokeWidth={sw}/>
      <line x1="33" y1="52" x2="36" y2="68" stroke={stroke} strokeWidth={sw}/>
      <path d="M21,68 L27,68" stroke={stroke} strokeWidth={sw + 0.5} strokeLinecap="round"/>
      <path d="M33,68 L39,68" stroke={stroke} strokeWidth={sw + 0.5} strokeLinecap="round"/>
    </g>),

    confident: () => (<g transform={t}>
      <circle cx="30" cy="18" r="12" fill="none" stroke={stroke} strokeWidth={sw}/>
      <path d="M19,14 Q22,4 30,6 Q38,4 41,14" fill="none" stroke={stroke} strokeWidth={sw + 0.5}/>
      <path d="M20,12 Q25,7 31,9" fill="none" stroke={hair} strokeWidth="1.5" opacity="0.6"/>
      <circle cx="26" cy="16" r="1.2" fill={stroke}/>
      <circle cx="34" cy="16" r="1.2" fill={stroke}/>
      <path d="M25,22 Q30,25 35,22" fill="none" stroke={stroke} strokeWidth="1.5"/>
      <path d="M24,30 L24,52 L36,52 L36,30" fill="none" stroke={stroke} strokeWidth={sw}/>
      <path d="M24,30 L30,35 L36,30" fill="none" stroke={stroke} strokeWidth="1.5"/>
      {/* Hands on hips */}
      <path d="M24,36 L14,42 L20,52" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
      <path d="M36,36 L46,42 L40,52" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
      <line x1="27" y1="52" x2="24" y2="68" stroke={stroke} strokeWidth={sw}/>
      <line x1="33" y1="52" x2="36" y2="68" stroke={stroke} strokeWidth={sw}/>
      <path d="M21,68 L27,68" stroke={stroke} strokeWidth={sw + 0.5} strokeLinecap="round"/>
      <path d="M33,68 L39,68" stroke={stroke} strokeWidth={sw + 0.5} strokeLinecap="round"/>
    </g>),
  };

  try { const fn = poses[pose] || poses.presenting; return fn(); } catch(e) { return null; }
}

// Thought bubble cloud shape
export function ThoughtBubble(x, y, w, h, stroke = '#2D2D2D') {
  return (<g>
    <ellipse cx={x + w/2} cy={y + h/2} rx={w/2} ry={h/2} fill="#fff" stroke={stroke} strokeWidth="2"/>
    {/* Cloud bumps */}
    <circle cx={x + w*0.2} cy={y + 2} r={w*0.12} fill="#fff" stroke={stroke} strokeWidth="1.5"/>
    <circle cx={x + w*0.5} cy={y - 4} r={w*0.14} fill="#fff" stroke={stroke} strokeWidth="1.5"/>
    <circle cx={x + w*0.8} cy={y + 2} r={w*0.11} fill="#fff" stroke={stroke} strokeWidth="1.5"/>
    {/* Tail dots */}
    <circle cx={x - 8} cy={y + h + 8} r="5" fill="#fff" stroke={stroke} strokeWidth="1.5"/>
    <circle cx={x - 16} cy={y + h + 20} r="3" fill="#fff" stroke={stroke} strokeWidth="1.5"/>
  </g>);
}

// Map section symbols/scenes to character poses
export function poseForSection(index, total) {
  const poses = ['thinking', 'pointing', 'presenting', 'confident', 'celebrating', 'questioning'];
  return poses[index % poses.length];
}
