import React from "react";

/**
 * Upgraded Icon Illustrations
 * More refined versions with slightly more detail and better line quality.
 * Each icon renders within a ~34x34 viewBox and accepts (name, x, y, size, color).
 */

export const ICON_NAMES = [
  'idea','heart','star','checkmark','target','flag','rocket','clock',
  'speech','growth','person','exclamation','question','document',
  'loop','ear','handshake2','shield','key','brain','eye','thumbsUp','warning'
];

export default function Ic(name, x, y, s, c) {
  const sc = s / 35;
  const t = `translate(${x},${y}) scale(${sc})`;
  const lw = 2.2;
  const lw2 = 1.6;

  const m = {
    idea: () => (
      <g transform={t}>
        <ellipse cx="17" cy="13" rx="10" ry="11" fill="none" stroke={c} strokeWidth={lw}/>
        <line x1="13" y1="24" x2="21" y2="24" stroke={c} strokeWidth={lw2}/>
        <line x1="14" y1="27" x2="20" y2="27" stroke={c} strokeWidth={lw2}/>
        {/* Filament */}
        <path d="M14,16 Q17,20 20,16" fill="none" stroke={c} strokeWidth="1.2" opacity="0.5"/>
        {/* Light rays */}
        <line x1="17" y1="0" x2="17" y2="3" stroke={c} strokeWidth="1.2" opacity="0.4"/>
        <line x1="6" y1="5" x2="8" y2="7" stroke={c} strokeWidth="1.2" opacity="0.4"/>
        <line x1="28" y1="5" x2="26" y2="7" stroke={c} strokeWidth="1.2" opacity="0.4"/>
        <line x1="3" y1="13" x2="6" y2="13" stroke={c} strokeWidth="1.2" opacity="0.4"/>
        <line x1="28" y1="13" x2="31" y2="13" stroke={c} strokeWidth="1.2" opacity="0.4"/>
      </g>
    ),
    heart: () => (
      <g transform={t}>
        <path d="M17,30 C4,22 0,10 8,5 C12,2 17,6 17,10 C17,6 22,2 26,5 C34,10 30,22 17,30Z"
          fill={c} opacity="0.7" stroke={c} strokeWidth="1"/>
      </g>
    ),
    star: () => {
      const p = [];
      for (let i = 0; i < 10; i++) {
        const a = (i * Math.PI) / 5 - Math.PI / 2;
        const r2 = i % 2 === 0 ? 14 : 6;
        p.push(`${17 + r2 * Math.cos(a)},${17 + r2 * Math.sin(a)}`);
      }
      return (
        <g transform={t}>
          <polygon points={p.join(' ')} fill={c} opacity="0.7" stroke={c} strokeWidth="0.8"/>
        </g>
      );
    },
    checkmark: () => (
      <g transform={t}>
        <circle cx="17" cy="17" r="14" fill="none" stroke={c} strokeWidth="1.5" opacity="0.25"/>
        <path d="M7,18 L14,26 L28,10" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    ),
    target: () => (
      <g transform={t}>
        <circle cx="17" cy="17" r="15" fill="none" stroke={c} strokeWidth={lw}/>
        <circle cx="17" cy="17" r="10" fill="none" stroke={c} strokeWidth={lw2}/>
        <circle cx="17" cy="17" r="5" fill="none" stroke={c} strokeWidth={lw2}/>
        <circle cx="17" cy="17" r="2" fill={c}/>
      </g>
    ),
    flag: () => (
      <g transform={t}>
        <line x1="6" y1="4" x2="6" y2="32" stroke={c} strokeWidth={lw}/>
        <path d="M6,4 L26,10 L6,17Z" fill={c} opacity="0.5" stroke={c} strokeWidth="1"/>
        <line x1="4" y1="32" x2="10" y2="32" stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
      </g>
    ),
    rocket: () => (
      <g transform={t}>
        <path d="M17,2 C12,8 11,18 13,26 L17,22 L21,26 C23,18 22,8 17,2Z"
          fill="none" stroke={c} strokeWidth={lw}/>
        <circle cx="17" cy="13" r="2.5" fill={c} opacity="0.5"/>
        {/* Fins */}
        <path d="M13,22 L8,28 L13,26" fill="none" stroke={c} strokeWidth={lw2}/>
        <path d="M21,22 L26,28 L21,26" fill="none" stroke={c} strokeWidth={lw2}/>
        {/* Flame */}
        <path d="M15,26 Q17,32 19,26" fill="none" stroke={c} strokeWidth="1.2" opacity="0.5"/>
      </g>
    ),
    clock: () => (
      <g transform={t}>
        <circle cx="17" cy="17" r="14" fill="none" stroke={c} strokeWidth={lw}/>
        <line x1="17" y1="17" x2="17" y2="8" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        <line x1="17" y1="17" x2="24" y2="20" stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
        <circle cx="17" cy="17" r="1.5" fill={c}/>
        {/* Hour marks */}
        {[0, 90, 180, 270].map((a, i) => {
          const rad = (a * Math.PI) / 180;
          return <line key={i} x1={17 + 12 * Math.cos(rad)} y1={17 + 12 * Math.sin(rad)}
            x2={17 + 14 * Math.cos(rad)} y2={17 + 14 * Math.sin(rad)}
            stroke={c} strokeWidth="1.5"/>;
        })}
      </g>
    ),
    speech: () => (
      <g transform={t}>
        <ellipse cx="17" cy="13" rx="15" ry="11" fill="none" stroke={c} strokeWidth={lw}/>
        <path d="M10,22 L7,30 L17,23" fill="none" stroke={c} strokeWidth={lw2}/>
        {/* Text lines */}
        <line x1="9" y1="11" x2="25" y2="11" stroke={c} strokeWidth="1" opacity="0.3"/>
        <line x1="9" y1="15" x2="22" y2="15" stroke={c} strokeWidth="1" opacity="0.3"/>
      </g>
    ),
    growth: () => (
      <g transform={t}>
        <path d="M4,28 Q10,22 17,8" fill="none" stroke={c} strokeWidth={lw + 0.5} strokeLinecap="round"/>
        <path d="M12,6 L19,6 L19,13" fill="none" stroke={c} strokeWidth={lw} strokeLinecap="round" strokeLinejoin="round"/>
        {/* Growth bars */}
        <line x1="4" y1="28" x2="4" y2="32" stroke={c} strokeWidth={lw2} opacity="0.3"/>
        <line x1="10" y1="22" x2="10" y2="32" stroke={c} strokeWidth={lw2} opacity="0.3"/>
      </g>
    ),
    person: () => (
      <g transform={t}>
        <circle cx="17" cy="7" r="5.5" fill="none" stroke={c} strokeWidth={lw}/>
        {/* Simple face */}
        <circle cx="15" cy="6" r="0.8" fill={c}/>
        <circle cx="19" cy="6" r="0.8" fill={c}/>
        <path d="M15,9 Q17,11 19,9" fill="none" stroke={c} strokeWidth="0.7"/>
        <line x1="17" y1="12.5" x2="17" y2="24" stroke={c} strokeWidth={lw}/>
        <line x1="10" y1="18" x2="24" y2="18" stroke={c} strokeWidth={lw}/>
        <line x1="17" y1="24" x2="11" y2="33" stroke={c} strokeWidth={lw}/>
        <line x1="17" y1="24" x2="23" y2="33" stroke={c} strokeWidth={lw}/>
      </g>
    ),
    exclamation: () => (
      <g transform={t}>
        <circle cx="17" cy="17" r="14" fill="none" stroke={c} strokeWidth={lw} opacity="0.3"/>
        <line x1="17" y1="7" x2="17" y2="21" stroke={c} strokeWidth="3" strokeLinecap="round"/>
        <circle cx="17" cy="27" r="2" fill={c}/>
      </g>
    ),
    question: () => (
      <g transform={t}>
        <circle cx="17" cy="17" r="14" fill="none" stroke={c} strokeWidth={lw} opacity="0.3"/>
        <path d="M12,12 Q12,6 17,6 Q22,6 22,12 Q22,16 17,18 L17,21" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="17" cy="27" r="2" fill={c}/>
      </g>
    ),
    document: () => (
      <g transform={t}>
        <path d="M6,2 L20,2 L26,8 L26,32 L6,32Z" fill="none" stroke={c} strokeWidth={lw}/>
        <path d="M20,2 L20,8 L26,8" fill="none" stroke={c} strokeWidth={lw2}/>
        <line x1="10" y1="14" x2="22" y2="14" stroke={c} strokeWidth="1.2" opacity="0.4"/>
        <line x1="10" y1="19" x2="22" y2="19" stroke={c} strokeWidth="1.2" opacity="0.4"/>
        <line x1="10" y1="24" x2="18" y2="24" stroke={c} strokeWidth="1.2" opacity="0.4"/>
      </g>
    ),
    loop: () => (
      <g transform={t}>
        <path d="M22,10 A11,11 0 1,0 25,20" fill="none" stroke={c} strokeWidth={lw}/>
        <path d="M22,16 L26,20 L29,14" fill="none" stroke={c} strokeWidth={lw2} strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    ),
    ear: () => (
      <g transform={t}>
        <path d="M20,4 Q6,4 6,18 Q6,32 18,32 Q14,24 18,20 Q22,16 20,10 Q18,6 20,4Z"
          fill="none" stroke={c} strokeWidth={lw}/>
        {/* Sound waves */}
        <path d="M24,12 Q28,18 24,24" fill="none" stroke={c} strokeWidth="1.2" opacity="0.4"/>
        <path d="M28,10 Q34,18 28,26" fill="none" stroke={c} strokeWidth="1" opacity="0.3"/>
      </g>
    ),
    handshake2: () => (
      <g transform={t}>
        <path d="M4,18 L12,12 L18,16 L24,12 L30,18" fill="none" stroke={c} strokeWidth={lw} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12,12 L8,22 M24,12 L28,22" fill="none" stroke={c} strokeWidth={lw2}/>
        {/* Connection lines */}
        <line x1="15" y1="14" x2="21" y2="14" stroke={c} strokeWidth="1.2" opacity="0.4"/>
      </g>
    ),
    shield: () => (
      <g transform={t}>
        <path d="M17,3 L3,9 L3,19 Q3,30 17,34 Q31,30 31,19 L31,9Z" fill="none" stroke={c} strokeWidth={lw}/>
        <path d="M11,18 L15,22 L24,12" fill="none" stroke={c} strokeWidth={lw2} strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    ),
    key: () => (
      <g transform={t}>
        <circle cx="10" cy="12" r="7" fill="none" stroke={c} strokeWidth={lw}/>
        <circle cx="10" cy="12" r="3" fill="none" stroke={c} strokeWidth={lw2}/>
        <line x1="17" y1="12" x2="30" y2="12" stroke={c} strokeWidth={lw}/>
        <line x1="26" y1="12" x2="26" y2="18" stroke={c} strokeWidth={lw2}/>
        <line x1="30" y1="12" x2="30" y2="18" stroke={c} strokeWidth={lw2}/>
      </g>
    ),
    brain: () => (
      <g transform={t}>
        <path d="M17,5 Q7,5 7,13 Q3,13 3,19 Q3,25 9,27 Q9,32 17,32 Q25,32 25,27 Q31,25 31,19 Q31,13 27,13 Q27,5 17,5Z"
          fill="none" stroke={c} strokeWidth={lw}/>
        <path d="M17,9 L17,28" fill="none" stroke={c} strokeWidth="1.2" opacity="0.4"/>
        <path d="M11,14 Q17,18 23,14" fill="none" stroke={c} strokeWidth="1" opacity="0.35"/>
        <path d="M11,22 Q17,18 23,22" fill="none" stroke={c} strokeWidth="1" opacity="0.35"/>
      </g>
    ),
    eye: () => (
      <g transform={t}>
        <path d="M2,17 Q17,3 32,17 Q17,31 2,17Z" fill="none" stroke={c} strokeWidth={lw}/>
        <circle cx="17" cy="17" r="6" fill="none" stroke={c} strokeWidth={lw2}/>
        <circle cx="17" cy="17" r="2.5" fill={c}/>
        {/* Reflection */}
        <circle cx="15" cy="15" r="1" fill="#fff" opacity="0.3"/>
      </g>
    ),
    thumbsUp: () => (
      <g transform={t}>
        <path d="M12,14 L12,30 L26,30 L28,14Z" fill="none" stroke={c} strokeWidth={lw}/>
        <path d="M16,14 L16,8 Q16,4 20,4 L22,4 L22,14" fill="none" stroke={c} strokeWidth={lw2}/>
        {/* Finger lines */}
        <line x1="16" y1="19" x2="26" y2="19" stroke={c} strokeWidth="0.8" opacity="0.3"/>
        <line x1="16" y1="23" x2="26" y2="23" stroke={c} strokeWidth="0.8" opacity="0.3"/>
        <line x1="16" y1="27" x2="26" y2="27" stroke={c} strokeWidth="0.8" opacity="0.3"/>
      </g>
    ),
    warning: () => (
      <g transform={t}>
        <path d="M17,3 L1,32 L33,32Z" fill="none" stroke={c} strokeWidth={lw} strokeLinejoin="round"/>
        <line x1="17" y1="13" x2="17" y2="22" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        <circle cx="17" cy="27" r="1.8" fill={c}/>
      </g>
    ),
  };

  try {
    const fn = m[name];
    return fn ? fn() : null;
  } catch (e) {
    return null;
  }
}
