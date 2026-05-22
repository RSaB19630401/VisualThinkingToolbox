// icons.js — 23 small inline icons/symbols
import React from 'react';

export const ICON_NAMES = [
  'idea','heart','star','checkmark','target','flag','rocket','clock',
  'speech','growth','person','exclamation','question','document','loop',
  'ear','handshake2','shield','key','brain','eye','thumbsUp','warning',
];

export function Ic(name, x, y, s, c) {
  const sc = s / 35;
  const t = `translate(${x},${y}) scale(${sc})`;
  const m = {
    idea: () => (<g transform={t}><ellipse cx="17" cy="14" rx="10" ry="11" fill="none" stroke={c} strokeWidth="2.5"/><line x1="13" y1="25" x2="21" y2="25" stroke={c} strokeWidth="2"/></g>),
    heart: () => (<g transform={t}><path d="M17,30 C0,20 0,5 9,3 C13,1 17,6 17,10 C17,6 21,1 25,3 C34,5 34,20 17,30Z" fill={c} opacity="0.8"/></g>),
    star: () => { const p=[]; for(let i=0;i<10;i++){const a=(i*Math.PI)/5-Math.PI/2,r2=i%2===0?14:6;p.push(`${17+r2*Math.cos(a)},${17+r2*Math.sin(a)}`);}return(<g transform={t}><polygon points={p.join(' ')} fill={c} opacity="0.8"/></g>); },
    checkmark: () => (<g transform={t}><path d="M5,18 L13,26 L29,8" fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></g>),
    target: () => (<g transform={t}><circle cx="17" cy="17" r="15" fill="none" stroke={c} strokeWidth="2"/><circle cx="17" cy="17" r="9" fill="none" stroke={c} strokeWidth="2"/><circle cx="17" cy="17" r="3" fill={c}/></g>),
    flag: () => (<g transform={t}><line x1="6" y1="4" x2="6" y2="32" stroke={c} strokeWidth="2.5"/><path d="M6,4 L26,10 L6,17Z" fill={c} opacity="0.7"/></g>),
    rocket: () => (<g transform={t}><path d="M17,2 C12,9 12,20 14,27 L17,24 L20,27 C22,20 22,9 17,2Z" fill="none" stroke={c} strokeWidth="2.5"/><circle cx="17" cy="13" r="3" fill={c}/></g>),
    clock: () => (<g transform={t}><circle cx="17" cy="17" r="14" fill="none" stroke={c} strokeWidth="2.5"/><line x1="17" y1="17" x2="17" y2="8" stroke={c} strokeWidth="2.5"/><line x1="17" y1="17" x2="23" y2="20" stroke={c} strokeWidth="2"/></g>),
    speech: () => (<g transform={t}><ellipse cx="17" cy="13" rx="15" ry="11" fill="none" stroke={c} strokeWidth="2.5"/><path d="M10,22 L7,31 L16,23" fill="none" stroke={c} strokeWidth="2"/></g>),
    growth: () => (<g transform={t}><path d="M4,28 L17,8" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round"/><path d="M12,6 L19,6 L19,13" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></g>),
    person: () => (<g transform={t}><circle cx="17" cy="7" r="6" fill="none" stroke={c} strokeWidth="2.5"/><line x1="17" y1="13" x2="17" y2="26" stroke={c} strokeWidth="2.5"/><line x1="9" y1="19" x2="25" y2="19" stroke={c} strokeWidth="2.5"/><line x1="17" y1="26" x2="11" y2="34" stroke={c} strokeWidth="2.5"/><line x1="17" y1="26" x2="23" y2="34" stroke={c} strokeWidth="2.5"/></g>),
    exclamation: () => (<g transform={t}><text x="10" y="28" fontFamily="Caveat" fontSize="32" fontWeight="700" fill={c}>!</text></g>),
    question: () => (<g transform={t}><text x="7" y="28" fontFamily="Caveat" fontSize="32" fontWeight="700" fill={c}>?</text></g>),
    document: () => (<g transform={t}><path d="M6,2 L20,2 L26,8 L26,32 L6,32Z" fill="none" stroke={c} strokeWidth="2.5"/><line x1="10" y1="14" x2="22" y2="14" stroke={c} strokeWidth="1.5"/><line x1="10" y1="20" x2="22" y2="20" stroke={c} strokeWidth="1.5"/></g>),
    loop: () => (<g transform={t}><path d="M22,10 A11,11 0 1,0 25,19" fill="none" stroke={c} strokeWidth="2.5"/><path d="M21,16 L26,20 L29,14" fill="none" stroke={c} strokeWidth="2"/></g>),
    ear: () => (<g transform={t}><path d="M20,6 Q8,6 8,18 Q8,30 17,30 Q14,24 17,20 Q20,16 18,12 Q16,8 20,6Z" fill="none" stroke={c} strokeWidth="2.5"/></g>),
    handshake2: () => (<g transform={t}><path d="M4,18 L12,12 L18,16 L24,12 L32,18" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12,12 L8,22 M24,12 L28,22" fill="none" stroke={c} strokeWidth="2"/></g>),
    shield: () => (<g transform={t}><path d="M17,4 L4,10 L4,20 Q4,30 17,34 Q30,30 30,20 L30,10Z" fill="none" stroke={c} strokeWidth="2.5"/><path d="M12,18 L16,22 L24,12" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"/></g>),
    key: () => (<g transform={t}><circle cx="10" cy="12" r="8" fill="none" stroke={c} strokeWidth="2.5"/><line x1="18" y1="12" x2="32" y2="12" stroke={c} strokeWidth="2.5"/><line x1="28" y1="12" x2="28" y2="18" stroke={c} strokeWidth="2"/><line x1="32" y1="12" x2="32" y2="18" stroke={c} strokeWidth="2"/></g>),
    brain: () => (<g transform={t}><path d="M17,6 Q8,6 8,14 Q4,14 4,20 Q4,26 10,28 Q10,32 17,32 Q24,32 24,28 Q30,26 30,20 Q30,14 26,14 Q26,6 17,6Z" fill="none" stroke={c} strokeWidth="2.5"/><path d="M17,10 L17,28 M12,16 L22,16 M12,22 L22,22" fill="none" stroke={c} strokeWidth="1.5" opacity="0.5"/></g>),
    eye: () => (<g transform={t}><path d="M2,17 Q17,4 32,17 Q17,30 2,17Z" fill="none" stroke={c} strokeWidth="2.5"/><circle cx="17" cy="17" r="6" fill="none" stroke={c} strokeWidth="2"/><circle cx="17" cy="17" r="2.5" fill={c}/></g>),
    thumbsUp: () => (<g transform={t}><path d="M12,14 L12,30 L24,30 L28,14Z" fill="none" stroke={c} strokeWidth="2.5"/><path d="M16,14 L16,8 Q16,4 20,4 L22,4 L22,14" fill="none" stroke={c} strokeWidth="2"/><line x1="12" y1="20" x2="6" y2="20" stroke={c} strokeWidth="2"/><line x1="12" y1="26" x2="6" y2="26" stroke={c} strokeWidth="2"/></g>),
    warning: () => (<g transform={t}><path d="M17,4 L2,32 L32,32Z" fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round"/><line x1="17" y1="14" x2="17" y2="22" stroke={c} strokeWidth="2.5"/><circle cx="17" cy="27" r="2" fill={c}/></g>),
  };
  try { const fn = m[name]; return fn ? fn() : null; } catch (e) { return null; }
}
