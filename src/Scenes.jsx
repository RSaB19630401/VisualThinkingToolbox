import React from "react";

/**
 * Modernized Scene Illustrations
 * Style: Open Peeps / modern Sketchnote — detailed figures with
 * proper proportions, hair, facial expressions, clothing, and context.
 * All scenes render within a ~70×80 viewBox and accept (name, x, y, scale, color).
 */

export const SCENE_NAMES = [
  'mountainClimb','targetHit','bridge','seedToTree','lighthouse','teamCircle',
  'ladder','compass','figureThinking','figureCelebrate','doorOpen','puzzleFit',
  'figureHandshake','figureConversation','figureListening','figureHug',
  'figureFear','figureDoubt','figureBalance','figureCourage','windingRoad',
  'mirrorReflect','scaleBalance','networkNodes','treasure','wallBreak'
];

export default function Sc(name, x, y, s, c) {
  const t = `translate(${x},${y}) scale(${s})`;
  const lw = 2.2;   // base line weight
  const lw2 = 1.6;  // secondary line weight
  const lw3 = 1.2;  // detail line weight

  // Reusable head with hair and face
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
      short: (<>
        <path d={`M${cx - r},${cy - 2} Q${cx - r},${cy - r - 3} ${cx},${cy - r - 3} Q${cx + r},${cy - r - 3} ${cx + r},${cy - 2}`}
          fill="none" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
      </>),
      spiky: (<>
        <path d={`M${cx - r},${cy - 2} Q${cx - r + 1},${cy - r - 5} ${cx - 2},${cy - r - 2}
          L${cx},${cy - r - 6} L${cx + 2},${cy - r - 2}
          Q${cx + r - 1},${cy - r - 5} ${cx + r},${cy - 2}`}
          fill="none" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
      </>),
      long: (<>
        <path d={`M${cx - r},${cy - 1} Q${cx - r - 1},${cy - r - 3} ${cx},${cy - r - 3}
          Q${cx + r + 1},${cy - r - 3} ${cx + r},${cy - 1}`}
          fill="none" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        <path d={`M${cx - r},${cy} Q${cx - r - 2},${cy + 6} ${cx - r + 1},${cy + 10}`}
          fill="none" stroke={c} strokeWidth={lw3} strokeLinecap="round"/>
        <path d={`M${cx + r},${cy} Q${cx + r + 2},${cy + 6} ${cx + r - 1},${cy + 10}`}
          fill="none" stroke={c} strokeWidth={lw3} strokeLinecap="round"/>
      </>),
      bun: (<>
        <path d={`M${cx - r},${cy - 2} Q${cx - r},${cy - r - 3} ${cx},${cy - r - 3}
          Q${cx + r},${cy - r - 3} ${cx + r},${cy - 2}`}
          fill="none" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
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

  // Reusable torso with shoulders
  const torso = (cx, headBottom, len = 18, shoulderW = 14) => (<>
    <line x1={cx} y1={headBottom} x2={cx} y2={headBottom + len} stroke={c} strokeWidth={lw}/>
    <path d={`M${cx - shoulderW / 2},${headBottom + 4} Q${cx},${headBottom + 2} ${cx + shoulderW / 2},${headBottom + 4}`}
      fill="none" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
  </>);

  // Reusable legs
  const legs = (cx, hipY, legL = 14, spread = 6) => (<>
    <line x1={cx} y1={hipY} x2={cx - spread} y2={hipY + legL} stroke={c} strokeWidth={lw}/>
    <line x1={cx} y1={hipY} x2={cx + spread} y2={hipY + legL} stroke={c} strokeWidth={lw}/>
    <line x1={cx - spread} y1={hipY + legL} x2={cx - spread - 3} y2={hipY + legL} stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
    <line x1={cx + spread} y1={hipY + legL} x2={cx + spread + 3} y2={hipY + legL} stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
  </>);

  const m = {
    // ── Mountain Climb ──────────────────────────────
    mountainClimb: () => (
      <g transform={t}>
        {/* Mountain */}
        <path d="M0,78 L30,12 L60,78Z" fill="none" stroke={c} strokeWidth={lw} strokeLinejoin="round"/>
        <path d="M20,78 L40,38 L60,78" fill="none" stroke={c} strokeWidth={lw3} opacity="0.3" strokeLinejoin="round"/>
        {/* Snow cap */}
        <path d="M25,22 L30,12 L35,22 Q30,26 25,22Z" fill={c} opacity="0.1" stroke={c} strokeWidth={lw3}/>
        {/* Flag at top */}
        <line x1="30" y1="12" x2="30" y2="3" stroke={c} strokeWidth={lw2}/>
        <path d="M30,3 L40,6 L30,9" fill={c} opacity="0.6"/>
        {/* Climbing path */}
        <path d="M10,72 Q18,60 22,48 Q26,36 32,28" fill="none" stroke={c} strokeWidth={lw3} strokeDasharray="3,3" opacity="0.5"/>
        {/* Climber figure on the path */}
        {head(24, 40, 4.5, 'short', 'determined')}
        <line x1="24" y1="45" x2="24" y2="55" stroke={c} strokeWidth={lw}/>
        <line x1="24" y1="55" x2="21" y2="62" stroke={c} strokeWidth={lw}/>
        <line x1="24" y1="55" x2="27" y2="62" stroke={c} strokeWidth={lw}/>
        {/* Arms reaching up */}
        <path d="M18,49 L15,42" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        <path d="M30,49 L33,43" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        {/* Backpack */}
        <rect x="25" y="46" width="5" height="7" rx="1.5" fill="none" stroke={c} strokeWidth={lw3}/>
      </g>
    ),

    // ── Target Hit ───────────────────────────────────
    targetHit: () => (
      <g transform={t}>
        {/* Target board */}
        <circle cx="48" cy="36" r="20" fill="none" stroke={c} strokeWidth={lw}/>
        <circle cx="48" cy="36" r="13" fill="none" stroke={c} strokeWidth={lw2}/>
        <circle cx="48" cy="36" r="6" fill="none" stroke={c} strokeWidth={lw2}/>
        <circle cx="48" cy="36" r="2" fill={c}/>
        {/* Arrow in bullseye */}
        <line x1="60" y1="22" x2="49" y2="35" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        <path d="M63,18 L60,22 L64,24" fill="none" stroke={c} strokeWidth={lw2}/>
        {/* Person throwing */}
        {head(14, 28, 5, 'spiky', 'determined')}
        <line x1="14" y1="33" x2="14" y2="50" stroke={c} strokeWidth={lw}/>
        {legs(14, 50, 12, 5)}
        {/* Throwing arm */}
        <path d="M19,38 L26,32 L30,28" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
        {/* Other arm */}
        <path d="M9,38 L5,44" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
        {/* Celebration sparks */}
        <line x1="46" y1="14" x2="46" y2="10" stroke={c} strokeWidth={lw3} opacity="0.5"/>
        <line x1="54" y1="14" x2="56" y2="10" stroke={c} strokeWidth={lw3} opacity="0.5"/>
        <line x1="50" y1="12" x2="50" y2="8" stroke={c} strokeWidth={lw3} opacity="0.5"/>
      </g>
    ),

    // ── Bridge ───────────────────────────────────────
    bridge: () => (
      <g transform={t}>
        {/* Bridge structure */}
        <path d="M0,48 Q35,22 70,48" fill="none" stroke={c} strokeWidth={lw + 0.5} strokeLinecap="round"/>
        <line x1="15" y1="40" x2="15" y2="68" stroke={c} strokeWidth={lw}/>
        <line x1="35" y1="30" x2="35" y2="68" stroke={c} strokeWidth={lw}/>
        <line x1="55" y1="40" x2="55" y2="68" stroke={c} strokeWidth={lw}/>
        {/* Railing */}
        <path d="M5,44 Q35,18 65,44" fill="none" stroke={c} strokeWidth={lw3} strokeDasharray="4,3" opacity="0.4"/>
        {/* Person A on left */}
        {head(8, 38, 4, 'long', 'happy')}
        <line x1="8" y1="42" x2="8" y2="50" stroke={c} strokeWidth={lw2}/>
        {/* Waving arm */}
        <path d="M12,44 L16,40" stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
        {/* Person B on right */}
        {head(62, 38, 4, 'short', 'happy')}
        <line x1="62" y1="42" x2="62" y2="50" stroke={c} strokeWidth={lw2}/>
        {/* Waving arm */}
        <path d="M58,44 L54,40" stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
        {/* Water underneath */}
        <path d="M5,72 Q15,68 25,72 Q35,76 45,72 Q55,68 65,72" fill="none" stroke={c} strokeWidth={lw3} opacity="0.25"/>
      </g>
    ),

    // ── Seed to Tree ─────────────────────────────────
    seedToTree: () => (
      <g transform={t}>
        {/* Ground line */}
        <path d="M0,70 Q35,68 70,70" fill="none" stroke={c} strokeWidth={lw3} opacity="0.3"/>
        {/* Seed */}
        <ellipse cx="8" cy="68" rx="5" ry="3.5" fill={c} opacity="0.2" stroke={c} strokeWidth={lw3}/>
        <path d="M8,65 Q10,62 8,60" fill="none" stroke={c} strokeWidth={lw3} opacity="0.5"/>
        {/* Sprout */}
        <line x1="28" y1="70" x2="28" y2="58" stroke={c} strokeWidth={lw2}/>
        <path d="M28,60 Q24,54 20,56" fill="none" stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
        <path d="M28,62 Q32,56 36,58" fill="none" stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
        {/* Full tree */}
        <line x1="55" y1="70" x2="55" y2="38" stroke={c} strokeWidth={lw + 0.5}/>
        <path d="M40,30 Q42,10 55,8 Q68,10 70,30 Q65,22 55,20 Q45,22 40,30Z"
          fill="none" stroke={c} strokeWidth={lw}/>
        {/* Leaves detail */}
        <circle cx="48" cy="20" r="5" fill={c} opacity="0.08"/>
        <circle cx="60" cy="22" r="4" fill={c} opacity="0.08"/>
        <circle cx="54" cy="14" r="4.5" fill={c} opacity="0.08"/>
        {/* Growth arrows */}
        <path d="M15,66 L22,66" stroke={c} strokeWidth={lw3} opacity="0.4" markerEnd="none"/>
        <path d="M19,66 L22,63 M19,66 L22,69" stroke={c} strokeWidth="0.8" opacity="0.4"/>
        <path d="M36,60 L44,50" stroke={c} strokeWidth={lw3} opacity="0.4"/>
        <path d="M41,52 L44,50 L42,54" stroke={c} strokeWidth="0.8" opacity="0.4"/>
      </g>
    ),

    // ── Lighthouse ───────────────────────────────────
    lighthouse: () => (
      <g transform={t}>
        {/* Lighthouse body */}
        <path d="M28,76 L31,28 L39,28 L42,76Z" fill="none" stroke={c} strokeWidth={lw}/>
        {/* Stripes */}
        <line x1="30" y1="45" x2="40" y2="45" stroke={c} strokeWidth={lw3} opacity="0.4"/>
        <line x1="29" y1="58" x2="41" y2="58" stroke={c} strokeWidth={lw3} opacity="0.4"/>
        {/* Light house top */}
        <rect x="30" y="20" width="10" height="8" rx="1" fill="none" stroke={c} strokeWidth={lw}/>
        <path d="M32,20 L35,14 L38,20" fill="none" stroke={c} strokeWidth={lw}/>
        {/* Light beacon */}
        <circle cx="35" cy="17" r="2" fill={c} opacity="0.6"/>
        {/* Light beams */}
        <path d="M17,22 L28,24" stroke={c} strokeWidth={lw2} opacity="0.5"/>
        <path d="M15,18 L28,22" stroke={c} strokeWidth={lw3} opacity="0.35"/>
        <path d="M53,22 L42,24" stroke={c} strokeWidth={lw2} opacity="0.5"/>
        <path d="M55,18 L42,22" stroke={c} strokeWidth={lw3} opacity="0.35"/>
        {/* Waves */}
        <path d="M8,76 Q18,72 28,76" fill="none" stroke={c} strokeWidth={lw3} opacity="0.3"/>
        <path d="M42,76 Q52,72 62,76" fill="none" stroke={c} strokeWidth={lw3} opacity="0.3"/>
        {/* Person looking up at lighthouse */}
        {head(12, 62, 3.5, 'short', 'surprised')}
        <line x1="12" y1="65.5" x2="12" y2="73" stroke={c} strokeWidth={lw2}/>
        <path d="M15,68 L18,64" stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
      </g>
    ),

    // ── Team Circle ──────────────────────────────────
    teamCircle: () => (
      <g transform={t}>
        {/* Connection circle */}
        <circle cx="35" cy="40" r="16" fill="none" stroke={c} strokeWidth={lw3} strokeDasharray="5,4" opacity="0.3"/>
        {/* 5 people around the circle */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const cx2 = 35 + 24 * Math.cos(rad);
          const cy2 = 40 + 24 * Math.sin(rad);
          const hairs = ['short', 'long', 'spiky', 'bun', 'short'];
          return (
            <g key={i}>
              {head(cx2, cy2 - 5, 4, hairs[i], 'happy')}
              <line x1={cx2} y1={cy2 - 1} x2={cx2} y2={cy2 + 6} stroke={c} strokeWidth={lw2}/>
              {/* Arms reaching toward center */}
              <path d={`M${cx2},${cy2 + 1} L${35 + 10 * Math.cos(rad)},${40 + 10 * Math.sin(rad)}`}
                stroke={c} strokeWidth={lw3} opacity="0.5" strokeLinecap="round"/>
            </g>
          );
        })}
        {/* Heart in center */}
        <path d="M35,43 C32,39 28,37 31,34 C33,32 35,35 35,37 C35,35 37,32 39,34 C42,37 38,39 35,43Z"
          fill={c} opacity="0.3"/>
      </g>
    ),

    // ── Ladder ───────────────────────────────────────
    ladder: () => (
      <g transform={t}>
        {/* Ladder */}
        <line x1="26" y1="8" x2="26" y2="76" stroke={c} strokeWidth={lw}/>
        <line x1="44" y1="8" x2="44" y2="76" stroke={c} strokeWidth={lw}/>
        {[16, 28, 40, 52, 64].map((py, i) => (
          <line key={i} x1="26" y1={py} x2="44" y2={py} stroke={c} strokeWidth={lw2}/>
        ))}
        {/* Person climbing */}
        {head(50, 32, 4.5, 'short', 'determined')}
        <line x1="50" y1="37" x2="48" y2="48" stroke={c} strokeWidth={lw}/>
        {/* Arms gripping ladder */}
        <path d="M45,40 L44,36" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        <path d="M52,42 L44,44" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        {/* Legs on rungs */}
        <line x1="48" y1="48" x2="44" y2="52" stroke={c} strokeWidth={lw}/>
        <line x1="48" y1="48" x2="44" y2="44" stroke={c} strokeWidth={lw}/>
        {/* Star at top */}
        <path d="M35,4 L36.5,7.5 L40,7.5 L37.5,10 L38.5,13.5 L35,11.5 L31.5,13.5 L32.5,10 L30,7.5 L33.5,7.5Z"
          fill={c} opacity="0.5"/>
      </g>
    ),

    // ── Compass ──────────────────────────────────────
    compass: () => (
      <g transform={t}>
        {/* Compass outer ring */}
        <circle cx="35" cy="40" r="28" fill="none" stroke={c} strokeWidth={lw}/>
        <circle cx="35" cy="40" r="25" fill="none" stroke={c} strokeWidth={lw3} opacity="0.3"/>
        {/* Cardinal marks */}
        <line x1="35" y1="14" x2="35" y2="18" stroke={c} strokeWidth={lw2}/>
        <line x1="35" y1="62" x2="35" y2="66" stroke={c} strokeWidth={lw2}/>
        <line x1="9" y1="40" x2="13" y2="40" stroke={c} strokeWidth={lw2}/>
        <line x1="57" y1="40" x2="61" y2="40" stroke={c} strokeWidth={lw2}/>
        {/* Compass needle */}
        <path d="M35,40 L32,22 L35,18 L38,22Z" fill={c} opacity="0.6"/>
        <path d="M35,40 L32,58 L35,62 L38,58Z" fill="none" stroke={c} strokeWidth={lw3}/>
        <circle cx="35" cy="40" r="3" fill={c} opacity="0.8"/>
        {/* N label */}
        <text x="32" y="11" fontFamily="Caveat" fontSize="11" fontWeight="700" fill={c}>N</text>
        {/* Person figure looking at compass */}
        {head(60, 16, 3.5, 'short', 'neutral')}
        <line x1="60" y1="19.5" x2="60" y2="27" stroke={c} strokeWidth={lw2}/>
        <path d="M57,22 L52,20" stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
      </g>
    ),

    // ── Figure Thinking ──────────────────────────────
    figureThinking: () => (
      <g transform={t}>
        {head(28, 22, 6, 'short', 'neutral')}
        <line x1="28" y1="28" x2="28" y2="48" stroke={c} strokeWidth={lw}/>
        {legs(28, 48, 14, 6)}
        {/* Arm on chin - thinking pose */}
        <path d="M22,35 L18,28 L22,22" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
        {/* Other arm relaxed */}
        <path d="M34,35 L38,42" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
        {/* Thought bubble */}
        <ellipse cx="50" cy="12" rx="15" ry="10" fill="none" stroke={c} strokeWidth={lw2}/>
        <circle cx="38" cy="20" r="2" fill="none" stroke={c} strokeWidth={lw3}/>
        <circle cx="42" cy="16" r="1.5" fill="none" stroke={c} strokeWidth={lw3}/>
        {/* Question mark in bubble */}
        <text x="46" y="16" fontFamily="Caveat" fontSize="14" fontWeight="600" fill={c}>?</text>
        {/* Lightbulb hint */}
        <path d="M55,8 L58,5 M60,12 L64,12 M56,16 L59,19" stroke={c} strokeWidth={lw3} opacity="0.4"/>
      </g>
    ),

    // ── Figure Celebrate ─────────────────────────────
    figureCelebrate: () => (
      <g transform={t}>
        {head(35, 24, 6, 'spiky', 'happy')}
        <line x1="35" y1="30" x2="35" y2="50" stroke={c} strokeWidth={lw}/>
        {legs(35, 50, 14, 7)}
        {/* Arms up celebrating */}
        <path d="M29,36 L20,20" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
        <path d="M41,36 L50,20" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
        {/* Hands open */}
        <circle cx="19" cy="19" r="2" fill="none" stroke={c} strokeWidth={lw3}/>
        <circle cx="51" cy="19" r="2" fill="none" stroke={c} strokeWidth={lw3}/>
        {/* Confetti / celebration */}
        <line x1="14" y1="10" x2="12" y2="6" stroke={c} strokeWidth={lw3} opacity="0.5"/>
        <line x1="56" y1="10" x2="58" y2="6" stroke={c} strokeWidth={lw3} opacity="0.5"/>
        <circle cx="24" cy="8" r="1.5" fill={c} opacity="0.3"/>
        <circle cx="46" cy="6" r="1.5" fill={c} opacity="0.3"/>
        <path d="M17,14 L15,11" stroke={c} strokeWidth={lw3} opacity="0.4"/>
        <path d="M53,14 L55,11" stroke={c} strokeWidth={lw3} opacity="0.4"/>
        {/* Star */}
        <path d="M35,6 L36,9 L39,9 L37,11 L38,14 L35,12 L32,14 L33,11 L31,9 L34,9Z" fill={c} opacity="0.4"/>
      </g>
    ),

    // ── Door Open ────────────────────────────────────
    doorOpen: () => (
      <g transform={t}>
        {/* Door frame */}
        <rect x="22" y="12" width="28" height="56" rx="2" fill="none" stroke={c} strokeWidth={lw}/>
        {/* Open door (perspective) */}
        <path d="M22,12 L10,22 L10,74 L22,68" fill="none" stroke={c} strokeWidth={lw2} opacity="0.5"/>
        {/* Door knob */}
        <circle cx="45" cy="44" r="2" fill={c} opacity="0.6"/>
        {/* Light coming through */}
        <path d="M30,30 L32,26 M36,28 L36,22 M42,30 L44,26" stroke={c} strokeWidth={lw3} opacity="0.3"/>
        {/* Person stepping through */}
        {head(56, 38, 5, 'short', 'happy')}
        <line x1="56" y1="43" x2="56" y2="56" stroke={c} strokeWidth={lw}/>
        {/* Walking legs */}
        <line x1="56" y1="56" x2="52" y2="66" stroke={c} strokeWidth={lw}/>
        <line x1="56" y1="56" x2="60" y2="65" stroke={c} strokeWidth={lw}/>
        {/* Arm forward */}
        <path d="M52,48 L48,44" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        <path d="M60,48 L63,52" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
      </g>
    ),

    // ── Puzzle Fit ────────────────────────────────────
    puzzleFit: () => (
      <g transform={t}>
        {/* Puzzle pieces */}
        <path d="M8,18 L28,18 L28,14 Q32,8 36,14 L36,18 L56,18 L56,36 L52,36 Q46,40 52,44 L56,44 L56,62 L36,62 L36,58 Q32,52 28,58 L28,62 L8,62 L8,44 L12,44 Q18,40 12,36 L8,36Z"
          fill="none" stroke={c} strokeWidth={lw}/>
        {/* Inner detail lines */}
        <line x1="28" y1="18" x2="28" y2="62" stroke={c} strokeWidth={lw3} strokeDasharray="3,3" opacity="0.2"/>
        <line x1="8" y1="40" x2="56" y2="40" stroke={c} strokeWidth={lw3} strokeDasharray="3,3" opacity="0.2"/>
        {/* Highlight one piece fitting */}
        <path d="M28,18 L28,14 Q32,8 36,14 L36,18 L56,18 L56,36 L52,36 Q46,40 52,44 L56,44 L56,40 L36,40 L36,18 L28,18"
          fill={c} opacity="0.08"/>
        {/* Small person pushing piece */}
        {head(63, 28, 3.5, 'short', 'determined')}
        <line x1="63" y1="31.5" x2="63" y2="38" stroke={c} strokeWidth={lw2}/>
        <path d="M60,34 L57,32" stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
      </g>
    ),

    // ── Figure Handshake ─────────────────────────────
    figureHandshake: () => (
      <g transform={t}>
        {/* Person A */}
        {head(16, 20, 5.5, 'short', 'happy')}
        <line x1="16" y1="26" x2="16" y2="44" stroke={c} strokeWidth={lw}/>
        {legs(16, 44, 14, 5)}
        {/* Person B */}
        {head(54, 20, 5.5, 'long', 'happy')}
        <line x1="54" y1="26" x2="54" y2="44" stroke={c} strokeWidth={lw}/>
        {legs(54, 44, 14, 5)}
        {/* Handshake in middle */}
        <path d="M22,34 L30,34 Q35,30 40,34 L48,34" stroke={c} strokeWidth={lw + 0.3} fill="none" strokeLinecap="round"/>
        {/* Grip detail */}
        <path d="M32,32 L38,32" stroke={c} strokeWidth={lw3}/>
        <path d="M33,36 L37,36" stroke={c} strokeWidth={lw3}/>
        {/* Other arms */}
        <path d="M10,34 L6,40" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        <path d="M60,34 L64,40" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        {/* Connection spark */}
        <path d="M33,26 L35,22 L37,26" stroke={c} strokeWidth={lw3} opacity="0.4"/>
      </g>
    ),

    // ── Figure Conversation ──────────────────────────
    figureConversation: () => (
      <g transform={t}>
        {/* Person A */}
        {head(18, 34, 5.5, 'long', 'happy')}
        <line x1="18" y1="40" x2="18" y2="56" stroke={c} strokeWidth={lw}/>
        {legs(18, 56, 12, 5)}
        {/* Gesturing arm */}
        <path d="M24,44 L30,38" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        <path d="M12,44 L8,48" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        {/* Person B */}
        {head(52, 34, 5.5, 'spiky', 'happy')}
        <line x1="52" y1="40" x2="52" y2="56" stroke={c} strokeWidth={lw}/>
        {legs(52, 56, 12, 5)}
        <path d="M46,44 L40,38" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        <path d="M58,44 L62,48" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        {/* Speech bubbles */}
        <ellipse cx="28" cy="18" rx="12" ry="8" fill="none" stroke={c} strokeWidth={lw2}/>
        <path d="M20,24 L18,30" fill="none" stroke={c} strokeWidth={lw3}/>
        <line x1="22" y1="16" x2="34" y2="16" stroke={c} strokeWidth={lw3} opacity="0.4"/>
        <line x1="24" y1="20" x2="32" y2="20" stroke={c} strokeWidth={lw3} opacity="0.4"/>
        <ellipse cx="46" cy="14" rx="10" ry="7" fill="none" stroke={c} strokeWidth={lw2}/>
        <path d="M52,20" fill="none" stroke={c} strokeWidth={lw3}/>
        <path d="M52,20 L54,28" fill="none" stroke={c} strokeWidth={lw3}/>
        <line x1="40" y1="12" x2="52" y2="12" stroke={c} strokeWidth={lw3} opacity="0.4"/>
      </g>
    ),

    // ── Figure Listening ─────────────────────────────
    figureListening: () => (
      <g transform={t}>
        {head(32, 28, 6, 'bun', 'neutral')}
        <line x1="32" y1="34" x2="32" y2="52" stroke={c} strokeWidth={lw}/>
        {legs(32, 52, 14, 6)}
        {/* Arms relaxed, open posture */}
        <path d="M26,40 L20,36" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
        <path d="M38,40 L42,44" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
        {/* Large ear symbol */}
        <path d="M52,18 Q66,18 66,32 Q66,46 52,46" fill="none" stroke={c} strokeWidth={lw + 0.3} strokeLinecap="round"/>
        <path d="M55,24 Q62,24 62,32 Q62,40 55,40" fill="none" stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
        {/* Sound waves */}
        <path d="M48,26 Q50,30 48,34" fill="none" stroke={c} strokeWidth={lw3} opacity="0.4"/>
        {/* Heart near chest (empathy) */}
        <path d="M32,42 C30,40 28,39 29.5,38 C30.5,37 32,39 32,39.5 C32,39 33.5,37 34.5,38 C36,39 34,40 32,42Z"
          fill={c} opacity="0.3"/>
      </g>
    ),

    // ── Figure Hug ───────────────────────────────────
    figureHug: () => (
      <g transform={t}>
        {/* Person A */}
        {head(26, 22, 5.5, 'long', 'happy')}
        <line x1="26" y1="28" x2="26" y2="46" stroke={c} strokeWidth={lw}/>
        {/* Person B */}
        {head(44, 22, 5.5, 'short', 'happy')}
        <line x1="44" y1="28" x2="44" y2="46" stroke={c} strokeWidth={lw}/>
        {/* Hugging arms */}
        <path d="M26,34 Q35,30 44,34" fill="none" stroke={c} strokeWidth={lw}/>
        <path d="M26,38 Q35,44 44,38" fill="none" stroke={c} strokeWidth={lw}/>
        {/* Legs */}
        <line x1="26" y1="46" x2="22" y2="58" stroke={c} strokeWidth={lw}/>
        <line x1="26" y1="46" x2="30" y2="58" stroke={c} strokeWidth={lw}/>
        <line x1="44" y1="46" x2="40" y2="58" stroke={c} strokeWidth={lw}/>
        <line x1="44" y1="46" x2="48" y2="58" stroke={c} strokeWidth={lw}/>
        {/* Warmth / heart */}
        <path d="M35,14 C33,11 30,10 32,8 C33,7 35,9 35,10 C35,9 37,7 38,8 C40,10 37,11 35,14Z"
          fill={c} opacity="0.4"/>
        {/* Sparkle lines */}
        <line x1="15" y1="18" x2="12" y2="15" stroke={c} strokeWidth={lw3} opacity="0.3"/>
        <line x1="55" y1="18" x2="58" y2="15" stroke={c} strokeWidth={lw3} opacity="0.3"/>
        <line x1="35" y1="5" x2="35" y2="2" stroke={c} strokeWidth={lw3} opacity="0.3"/>
      </g>
    ),

    // ── Figure Fear ──────────────────────────────────
    figureFear: () => (
      <g transform={t}>
        {head(32, 36, 6, 'spiky', 'worried')}
        <line x1="32" y1="42" x2="32" y2="56" stroke={c} strokeWidth={lw}/>
        {/* Legs close together (defensive) */}
        <line x1="32" y1="56" x2="29" y2="68" stroke={c} strokeWidth={lw}/>
        <line x1="32" y1="56" x2="35" y2="68" stroke={c} strokeWidth={lw}/>
        {/* Arms hugging self */}
        <path d="M26,46 L24,40 L28,38" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
        <path d="M38,46 L40,40 L36,38" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
        {/* Danger cloud */}
        <path d="M18,8 Q32,-2 50,8 Q54,16 48,22 Q52,28 44,28 Q38,32 30,26 Q20,28 18,22 Q12,18 18,8Z"
          fill="none" stroke={c} strokeWidth={lw2} strokeDasharray="4,3" opacity="0.5"/>
        {/* Exclamation */}
        <text x="32" y="20" fontFamily="Caveat" fontSize="16" fontWeight="700" fill={c} textAnchor="middle" opacity="0.6">!</text>
        {/* Shake lines */}
        <path d="M22,40 L18,38" stroke={c} strokeWidth={lw3} opacity="0.4"/>
        <path d="M42,40 L46,38" stroke={c} strokeWidth={lw3} opacity="0.4"/>
        <path d="M22,50 L18,50" stroke={c} strokeWidth={lw3} opacity="0.4"/>
        <path d="M42,50 L46,50" stroke={c} strokeWidth={lw3} opacity="0.4"/>
      </g>
    ),

    // ── Figure Doubt ─────────────────────────────────
    figureDoubt: () => (
      <g transform={t}>
        {head(35, 30, 6, 'short', 'worried')}
        <line x1="35" y1="36" x2="35" y2="54" stroke={c} strokeWidth={lw}/>
        {legs(35, 54, 14, 6)}
        {/* Arms spread out weighing options */}
        <path d="M29,42 L16,34" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
        <path d="M41,42 L54,34" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
        {/* Option A */}
        <circle cx="12" cy="30" r="8" fill="none" stroke={c} strokeWidth={lw2}/>
        <text x="10" y="34" fontFamily="Caveat" fontSize="12" fontWeight="600" fill={c}>A</text>
        {/* Option B */}
        <circle cx="58" cy="30" r="8" fill="none" stroke={c} strokeWidth={lw2}/>
        <text x="56" y="34" fontFamily="Caveat" fontSize="12" fontWeight="600" fill={c}>B</text>
        {/* Question mark above */}
        <text x="32" y="18" fontFamily="Caveat" fontSize="16" fontWeight="700" fill={c}>?</text>
        {/* Arrow hints */}
        <path d="M22,26 L16,28" stroke={c} strokeWidth={lw3} opacity="0.4"/>
        <path d="M48,26 L54,28" stroke={c} strokeWidth={lw3} opacity="0.4"/>
      </g>
    ),

    // ── Figure Balance ───────────────────────────────
    figureBalance: () => (
      <g transform={t}>
        {head(35, 16, 5.5, 'bun', 'neutral')}
        <line x1="35" y1="22" x2="35" y2="42" stroke={c} strokeWidth={lw}/>
        {legs(35, 42, 14, 6)}
        {/* Balance beam as arms */}
        <line x1="14" y1="30" x2="56" y2="30" stroke={c} strokeWidth={lw}/>
        {/* Left weight (work) */}
        <path d="M8,54 L14,36 L20,54Z" fill="none" stroke={c} strokeWidth={lw2}/>
        <line x1="14" y1="30" x2="14" y2="36" stroke={c} strokeWidth={lw2}/>
        <text x="10" y="50" fontFamily="Caveat" fontSize="8" fill={c} opacity="0.6">💼</text>
        {/* Right weight (life) */}
        <path d="M50,52 L56,34 L62,52Z" fill="none" stroke={c} strokeWidth={lw2}/>
        <line x1="56" y1="30" x2="56" y2="34" stroke={c} strokeWidth={lw2}/>
        {/* Heart in right pan */}
        <path d="M56,46 C54,44 52,43 53.5,42 C54.5,41 56,43 56,43.5 C56,43 57.5,41 58.5,42 C60,43 58,44 56,46Z"
          fill={c} opacity="0.3"/>
        {/* Balance line */}
        <path d="M10,68 L60,68" stroke={c} strokeWidth={lw3} strokeDasharray="3,3" opacity="0.25"/>
      </g>
    ),

    // ── Figure Courage ───────────────────────────────
    figureCourage: () => (
      <g transform={t}>
        {head(28, 26, 5.5, 'short', 'determined')}
        <line x1="28" y1="32" x2="28" y2="50" stroke={c} strokeWidth={lw}/>
        {legs(28, 50, 14, 6)}
        {/* Power arm raised */}
        <path d="M22,38 L16,28 L18,22" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
        {/* Other arm forward */}
        <path d="M34,38 L40,34" stroke={c} strokeWidth={lw} fill="none" strokeLinecap="round"/>
        {/* Cape / flag */}
        <path d="M48,14 L48,4" stroke={c} strokeWidth={lw}/>
        <path d="M48,4 L62,8 L48,12" fill={c} opacity="0.5"/>
        <path d="M48,14 L48,50" stroke={c} strokeWidth={lw}/>
        {/* Shield on body */}
        <path d="M24,36 L28,34 L32,36 L32,42 Q28,46 24,42Z" fill="none" stroke={c} strokeWidth={lw2}/>
        <path d="M27,38 L29,40 L31,37" fill="none" stroke={c} strokeWidth={lw3} strokeLinecap="round"/>
        {/* Action lines */}
        <line x1="10" y1="24" x2="6" y2="22" stroke={c} strokeWidth={lw3} opacity="0.4"/>
        <line x1="12" y1="30" x2="7" y2="30" stroke={c} strokeWidth={lw3} opacity="0.4"/>
      </g>
    ),

    // ── Winding Road ─────────────────────────────────
    windingRoad: () => (
      <g transform={t}>
        {/* Winding path */}
        <path d="M8,72 Q22,62 18,48 Q14,34 28,28 Q42,22 38,12 Q36,4 48,2"
          fill="none" stroke={c} strokeWidth={lw + 0.5} strokeLinecap="round"/>
        {/* Path borders */}
        <path d="M4,74 Q18,64 14,50 Q10,36 24,30 Q38,24 34,14 Q32,6 44,4"
          fill="none" stroke={c} strokeWidth={lw3} opacity="0.25" strokeLinecap="round"/>
        <path d="M12,70 Q26,60 22,46 Q18,32 32,26 Q46,20 42,10 Q40,2 52,0"
          fill="none" stroke={c} strokeWidth={lw3} opacity="0.25" strokeLinecap="round"/>
        {/* Start marker */}
        <circle cx="8" cy="72" r="4" fill={c} opacity="0.3"/>
        {/* Milestone dots */}
        <circle cx="18" cy="48" r="2.5" fill={c} opacity="0.2"/>
        <circle cx="28" cy="28" r="2.5" fill={c} opacity="0.2"/>
        {/* Person walking */}
        {head(24, 42, 3.5, 'short', 'determined')}
        <line x1="24" y1="45.5" x2="24" y2="53" stroke={c} strokeWidth={lw2}/>
        <line x1="24" y1="53" x2="21" y2="58" stroke={c} strokeWidth={lw2}/>
        <line x1="24" y1="53" x2="27" y2="58" stroke={c} strokeWidth={lw2}/>
        {/* Flag at end */}
        <line x1="48" y1="2" x2="48" y2="-4" stroke={c} strokeWidth={lw2}/>
        <path d="M48,-4 L56,-2 L48,1" fill={c} opacity="0.5"/>
      </g>
    ),

    // ── Mirror Reflect ───────────────────────────────
    mirrorReflect: () => (
      <g transform={t}>
        {/* Mirror frame */}
        <ellipse cx="35" cy="32" rx="22" ry="28" fill="none" stroke={c} strokeWidth={lw}/>
        <line x1="35" y1="60" x2="35" y2="72" stroke={c} strokeWidth={lw + 0.5}/>
        <line x1="25" y1="72" x2="45" y2="72" stroke={c} strokeWidth={lw}/>
        {/* Reflection in mirror */}
        <circle cx="35" cy="24" r="5" fill="none" stroke={c} strokeWidth={lw3} opacity="0.5"/>
        <line x1="35" y1="29" x2="35" y2="40" stroke={c} strokeWidth={lw3} opacity="0.5"/>
        <line x1="30" y1="33" x2="40" y2="33" stroke={c} strokeWidth={lw3} opacity="0.5"/>
        {/* Face in reflection */}
        <circle cx="33" cy="23" r="0.7" fill={c} opacity="0.4"/>
        <circle cx="37" cy="23" r="0.7" fill={c} opacity="0.4"/>
        <path d="M33,26 Q35,28 37,26" fill="none" stroke={c} strokeWidth="0.7" opacity="0.4"/>
        {/* Sparkle on mirror */}
        <path d="M50,12 L52,8 M54,14 L58,12" stroke={c} strokeWidth={lw3} opacity="0.3"/>
        {/* Person looking */}
        {head(8, 34, 4, 'long', 'neutral')}
        <line x1="8" y1="38" x2="8" y2="50" stroke={c} strokeWidth={lw2}/>
        <path d="M12,42 L14,38" stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
      </g>
    ),

    // ── Scale Balance ────────────────────────────────
    scaleBalance: () => (
      <g transform={t}>
        {/* Central post */}
        <line x1="35" y1="10" x2="35" y2="70" stroke={c} strokeWidth={lw}/>
        <line x1="25" y1="70" x2="45" y2="70" stroke={c} strokeWidth={lw}/>
        <circle cx="35" cy="10" r="3" fill={c} opacity="0.6"/>
        {/* Beam (slightly tilted) */}
        <line x1="8" y1="20" x2="62" y2="16" stroke={c} strokeWidth={lw}/>
        {/* Left pan (lower = heavier) */}
        <line x1="8" y1="20" x2="8" y2="28" stroke={c} strokeWidth={lw2}/>
        <path d="M0,28 Q8,36 16,28" fill="none" stroke={c} strokeWidth={lw2}/>
        {/* Items in left pan */}
        <rect x="3" y="30" width="4" height="3" rx="0.5" fill={c} opacity="0.2"/>
        <rect x="8" y="30" width="4" height="3" rx="0.5" fill={c} opacity="0.2"/>
        {/* Right pan (higher = lighter) */}
        <line x1="62" y1="16" x2="62" y2="24" stroke={c} strokeWidth={lw2}/>
        <path d="M54,24 Q62,32 70,24" fill="none" stroke={c} strokeWidth={lw2}/>
        {/* Item in right pan */}
        <path d="M62,26 C60,24 58,23 59.5,22 C60.5,21 62,23 62,23.5 C62,23 63.5,21 64.5,22 C66,23 64,24 62,26Z"
          fill={c} opacity="0.3"/>
        {/* Thinking person */}
        {head(35, 50, 3.5, 'short', 'neutral')}
        <line x1="35" y1="53.5" x2="35" y2="60" stroke={c} strokeWidth={lw2}/>
      </g>
    ),

    // ── Network Nodes ────────────────────────────────
    networkNodes: () => (
      <g transform={t}>
        {/* Central node */}
        <circle cx="35" cy="40" r="10" fill={c} opacity="0.08" stroke={c} strokeWidth={lw}/>
        {head(35, 38, 4.5, 'short', 'happy')}
        {/* Surrounding nodes with people */}
        {[[12, 16], [58, 16], [8, 60], [62, 60]].map(([nx, ny], i) => {
          const hairs = ['long', 'spiky', 'bun', 'short'];
          return (
            <g key={i}>
              <circle cx={nx} cy={ny} r="7" fill="none" stroke={c} strokeWidth={lw2}/>
              {head(nx, ny - 1, 3.5, hairs[i], 'neutral')}
              {/* Connection line */}
              <line x1={nx + (35 - nx) * 0.35} y1={ny + (40 - ny) * 0.35}
                x2={35 + (nx - 35) * 0.35} y2={40 + (ny - 40) * 0.35}
                stroke={c} strokeWidth={lw3} opacity="0.4"/>
            </g>
          );
        })}
        {/* Cross connections */}
        <line x1="18" y1="20" x2="52" y2="20" stroke={c} strokeWidth="0.8" opacity="0.2" strokeDasharray="3,3"/>
        <line x1="14" y1="56" x2="56" y2="56" stroke={c} strokeWidth="0.8" opacity="0.2" strokeDasharray="3,3"/>
      </g>
    ),

    // ── Treasure ─────────────────────────────────────
    treasure: () => (
      <g transform={t}>
        {/* Treasure chest */}
        <path d="M14,42 L14,66 L56,66 L56,42Z" fill="none" stroke={c} strokeWidth={lw}/>
        <path d="M14,42 Q35,32 56,42" fill="none" stroke={c} strokeWidth={lw}/>
        {/* Chest details */}
        <line x1="35" y1="38" x2="35" y2="52" stroke={c} strokeWidth={lw2}/>
        <circle cx="35" cy="52" r="2.5" fill={c} opacity="0.5"/>
        {/* Lock */}
        <rect x="32" y="50" width="6" height="5" rx="1" fill="none" stroke={c} strokeWidth={lw3}/>
        {/* Glow / sparkle */}
        <path d="M25,28 L28,20 M35,26 L35,16 M45,28 L42,20" stroke={c} strokeWidth={lw2} opacity="0.4"/>
        <circle cx="22" cy="18" r="1.5" fill={c} opacity="0.3"/>
        <circle cx="48" cy="16" r="1.5" fill={c} opacity="0.3"/>
        <circle cx="35" cy="12" r="2" fill={c} opacity="0.3"/>
        {/* Person discovering */}
        {head(6, 50, 4, 'spiky', 'surprised')}
        <line x1="6" y1="54" x2="6" y2="64" stroke={c} strokeWidth={lw2}/>
        <path d="M10,57 L14,54" stroke={c} strokeWidth={lw2} strokeLinecap="round"/>
      </g>
    ),

    // ── Wall Break ───────────────────────────────────
    wallBreak: () => (
      <g transform={t}>
        {/* Wall */}
        <line x1="40" y1="4" x2="40" y2="28" stroke={c} strokeWidth={lw + 0.5}/>
        <line x1="40" y1="52" x2="40" y2="76" stroke={c} strokeWidth={lw + 0.5}/>
        {/* Broken section */}
        <path d="M38,28 L34,32 L38,38 L34,44 L38,48 L40,52" fill="none" stroke={c} strokeWidth={lw}/>
        <path d="M42,28 L46,32 L42,38 L46,44 L42,48 L40,52" fill="none" stroke={c} strokeWidth={lw}/>
        {/* Brick pattern */}
        <line x1="36" y1="8" x2="44" y2="8" stroke={c} strokeWidth={lw3} opacity="0.3"/>
        <line x1="36" y1="16" x2="44" y2="16" stroke={c} strokeWidth={lw3} opacity="0.3"/>
        <line x1="36" y1="60" x2="44" y2="60" stroke={c} strokeWidth={lw3} opacity="0.3"/>
        <line x1="36" y1="68" x2="44" y2="68" stroke={c} strokeWidth={lw3} opacity="0.3"/>
        {/* Person breaking through */}
        {head(20, 32, 5, 'short', 'determined')}
        <line x1="20" y1="37" x2="20" y2="52" stroke={c} strokeWidth={lw}/>
        {legs(20, 52, 13, 5)}
        {/* Punching arm */}
        <path d="M26,42 L34,36" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        {/* Fist */}
        <circle cx="35" cy="35" r="2.5" fill={c} opacity="0.4"/>
        {/* Other arm */}
        <path d="M14,42 L10,48" stroke={c} strokeWidth={lw} strokeLinecap="round"/>
        {/* Impact lines */}
        <line x1="46" y1="32" x2="52" y2="28" stroke={c} strokeWidth={lw3} opacity="0.5"/>
        <line x1="48" y1="38" x2="54" y2="38" stroke={c} strokeWidth={lw3} opacity="0.5"/>
        <line x1="46" y1="44" x2="52" y2="48" stroke={c} strokeWidth={lw3} opacity="0.5"/>
        {/* Debris */}
        <rect x="50" y="34" width="3" height="3" rx="0.5" fill={c} opacity="0.2" transform="rotate(20,51,35)"/>
        <rect x="54" y="42" width="2.5" height="2.5" rx="0.5" fill={c} opacity="0.15" transform="rotate(-15,55,43)"/>
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
