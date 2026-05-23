import React from "react";
import Sc from "./Scenes.jsx";
import Ic from "./Icons.jsx";
import { FC, mkR, rr, ln, arr, gc } from "./helpers.js";

/* ═══════════════════════════════════════════════════
   LAYOUT 1: KÄSTCHEN (Structured Grid)
   ═══════════════════════════════════════════════════ */

function BoxSec({ sec, x, y, w, h, pal, seed }) {
  const rng = mkR(seed + (sec.n || 1) * 137), col = gc(pal, sec.color), tY = y + 28;
  const hs = !!sec.scene, sw = hs ? Math.min(w * 0.38, 80) : 0;
  return (
    <g>
      <path d={rr(x + 2, y + 2, w - 4, h - 4, 14, rng, 2.5)} fill={pal.sb} stroke={pal.t} strokeWidth="1.8" opacity="0.95"/>
      <circle cx={x + 20} cy={y + 18} r="13" fill={col} opacity="0.9"/>
      <text x={x + 20} y={y + 23.5} textAnchor="middle" fontFamily="Caveat" fontSize="16" fontWeight="700" fill="#fff">{sec.n}</text>
      <text x={x + 38} y={tY + 3} fontFamily="Caveat" fontSize="17" fontWeight="700" fill={pal.t}>{(sec.title || '').toUpperCase()}</text>
      <path d={ln(x + 10, tY + 8, x + w - 10, tY + 8, rng)} fill="none" stroke={col} strokeWidth="1.5" opacity="0.35"/>
      {hs && Sc(sec.scene, x + w - sw - 6, tY + 12, Math.min(sw, 75) / 75, col)}
      {!hs && Ic(sec.sym, x + w - 40, y + 6, 28, col)}
      {(sec.items || []).slice(0, 3).map((item, i) => {
        const iy = tY + 26 + i * 18;
        const txt = item.length > 32 ? item.slice(0, 30) + '…' : item;
        return (
          <g key={i}>
            <circle cx={x + 16} cy={iy - 3} r="2.5" fill={col} opacity="0.7"/>
            <text x={x + 24} y={iy} fontFamily="Patrick Hand" fontSize="12.5" fill={pal.t}>{txt}</text>
          </g>
        );
      })}
    </g>
  );
}

export function StructSVG({ data, pal }) {
  const la = data.orientation !== 'portrait', W = la ? 1100 : 750, H = la ? 750 : 1050;
  const cols = data.layout?.columns || (la ? 3 : 2), seed = (data.title || '').length * 7 + 42, rng = mkR(seed);
  const M = 20, TH = 88, fH = data.footer?.items?.length ? 66 : 0, cH2 = data.cm ? 44 : 0;
  const ch = H - TH - fH - cH2 - M * 2, cw = W - M * 2, secs = data.sections, rows = Math.ceil(secs.length / cols), cW = cw / cols, cHh = ch / Math.max(rows, 1);
  return (
    <svg id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', background: pal.bg, borderRadius: 12 }}>
      <defs><style>{FC}</style></defs>
      <rect width={W} height={H} fill={pal.bg} rx="10"/>
      <path d={rr(8, 8, W - 16, H - 16, 16, rng, 3)} fill="none" stroke={pal.t} strokeWidth="2" opacity="0.12"/>
      <path d={rr(M + 30, 12, cw - 60, 50, 10, rng, 3)} fill={pal.p} stroke={pal.t} strokeWidth="1.5" opacity="0.9"/>
      <text x={W / 2} y={46} textAnchor="middle" fontFamily="Caveat" fontSize="27" fontWeight="700" fill="#fff">{data.title.toUpperCase()}</text>
      {data.subtitle && <text x={W / 2} y={78} textAnchor="middle" fontFamily="Patrick Hand" fontSize="15" fill={pal.t} opacity="0.65">{data.subtitle}</text>}
      {secs.map((s, i) => (<BoxSec key={i} sec={s} x={M + (i % cols) * cW + 5} y={TH + Math.floor(i / cols) * cHh + 5} w={cW - 10} h={cHh - 10} pal={pal} seed={seed}/>))}
      {secs.length > 1 && secs.slice(0, -1).map((_, i) => {
        const fc = i % cols, fr = Math.floor(i / cols), tc = (i + 1) % cols, tr = Math.floor((i + 1) / cols), ar = mkR(seed + i * 31);
        let x1, y1, x2, y2;
        if (tr === fr) { x1 = M + fc * cW + cW - 6; y1 = TH + fr * cHh + cHh / 2; x2 = M + tc * cW + 12; y2 = y1; }
        else { x1 = M + fc * cW + cW / 2; y1 = TH + fr * cHh + cHh - 2; x2 = M + tc * cW + cW / 2; y2 = TH + tr * cHh + 8; }
        return (<g key={`a${i}`} opacity="0.35">{arr(x1, y1, x2, y2, ar, 8).map((p, j) => (<path key={j} d={p} fill="none" stroke={pal.p} strokeWidth="2" strokeLinecap="round"/>))}</g>);
      })}
      {data.cm && <g><path d={rr(W / 2 - 180, H - fH - M - cH2 - 2, 360, 34, 18, rng, 2)} fill="#fff" stroke={pal.p} strokeWidth="1.5"/>{Ic('star', W / 2 - 172, H - fH - M - cH2 + 2, 18, pal.p)}<text x={W / 2} y={H - fH - M - cH2 + 22} textAnchor="middle" fontFamily="Caveat" fontSize="15" fontWeight="600" fill={pal.p}>{data.cm}</text></g>}
      {fH > 0 && <g><path d={rr(M, H - fH - M + 4, cw, 54, 10, mkR(seed + 999), 2)} fill={pal.bg} stroke={pal.p} strokeWidth="1.5" strokeDasharray="6,4"/>{data.footer.title && <text x={M + 16} y={H - fH - M + 21} fontFamily="Caveat" fontSize="14" fontWeight="700" fill={pal.p}>{data.footer.title.toUpperCase()}</text>}{data.footer.items.map((it, i) => { const ix = M + 16 + i * (cw / Math.max(data.footer.items.length, 1)); return (<g key={i}>{Ic('heart', ix, H - fH - M + 24, 13, pal.p)}<text x={ix + 16} y={H - fH - M + 42} fontFamily="Patrick Hand" fontSize="12" fill={pal.t}>{it}</text></g>); })}</g>}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT 2: JOURNEY MAP (Winding Path)
   ═══════════════════════════════════════════════════ */

export function JourneySVG({ data, pal }) {
  const la = data.orientation !== 'portrait', W = la ? 1100 : 750, H = la ? 750 : 1050;
  const seed = (data.title || '').length * 7 + 42, rng = mkR(seed);
  const secs = data.sections.slice(0, 8);
  const M = 20, TH = 80;
  const fH = data.footer?.items?.length ? 72 : 0;
  const cmH = data.cm ? 36 : 0;
  const contentH = H - TH - fH - cmH - M * 2;

  // Generate station positions along a winding path
  const stations = secs.map((_, i) => {
    const row = Math.floor(i / (la ? 3 : 2));
    const col = row % 2 === 0 ? (i % (la ? 3 : 2)) : ((la ? 2 : 1) - (i % (la ? 3 : 2)));
    const cols = la ? 3 : 2;
    const colW = (W - M * 4) / cols;
    const rowH = contentH / Math.ceil(secs.length / cols);
    return {
      x: M * 2 + col * colW + colW / 2,
      y: TH + M + row * rowH + rowH / 2,
    };
  });

  return (
    <svg id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', background: pal.bg, borderRadius: 12 }}>
      <defs><style>{FC}</style></defs>
      <rect width={W} height={H} fill={pal.bg} rx="10"/>
      <path d={rr(6, 6, W - 12, H - 12, 18, rng, 4)} fill="none" stroke={pal.p} strokeWidth="2" opacity="0.08"/>

      {/* Title banner */}
      <path d={rr(W / 2 - 220, 10, 440, 48, 8, rng, 3)} fill={pal.p} stroke={pal.t} strokeWidth="1.5" opacity="0.92"/>
      <text x={W / 2} y={42} textAnchor="middle" fontFamily="Caveat" fontSize="26" fontWeight="700" fill="#fff" letterSpacing="1">{data.title.toUpperCase()}</text>
      {data.subtitle && <text x={W / 2} y={72} textAnchor="middle" fontFamily="Patrick Hand" fontSize="14" fill={pal.t} opacity="0.55">{data.subtitle}</text>}

      {/* Winding path connecting stations */}
      {stations.length > 1 && stations.slice(0, -1).map((st, i) => {
        const next = stations[i + 1];
        const midX = (st.x + next.x) / 2 + (rng() - 0.5) * 40;
        const midY = (st.y + next.y) / 2 + (rng() - 0.5) * 20;
        return (
          <path key={`path${i}`}
            d={`M${st.x},${st.y} Q${midX},${midY} ${next.x},${next.y}`}
            fill="none" stroke={pal.p} strokeWidth="3.5" strokeLinecap="round" opacity="0.15"/>
        );
      })}

      {/* Stations */}
      {secs.map((sec, i) => {
        const st = stations[i];
        if (!st) return null;
        const col = gc(pal, sec.color);
        const hs = !!sec.scene;
        const items = (sec.items || []).slice(0, 3).map(t => t.length > 26 ? t.slice(0, 24) + '…' : t);
        const cols = la ? 3 : 2;
        const colW = (W - M * 4) / cols;
        const textX = st.x + 30;
        const sceneX = st.x - colW / 2 + 10;

        return (
          <g key={i}>
            {/* Station number circle */}
            <circle cx={st.x} cy={st.y - 50} r="15" fill={col} opacity="0.9"/>
            <text x={st.x} y={st.y - 45} textAnchor="middle" fontFamily="Caveat" fontSize="16" fontWeight="700" fill="#fff">{sec.n}</text>

            {/* Section title */}
            <text x={st.x} y={st.y - 28} textAnchor="middle" fontFamily="Caveat" fontSize="16" fontWeight="700" fill={pal.t}>{(sec.title || '').slice(0, 20).toUpperCase()}</text>
            <path d={ln(st.x - 55, st.y - 22, st.x + 55, st.y - 22, mkR(seed + i * 77))} fill="none" stroke={col} strokeWidth="1.2" opacity="0.3"/>

            {/* Scene illustration */}
            {hs && Sc(sec.scene, st.x - 38, st.y - 16, 0.85, col)}
            {!hs && Ic(sec.sym, st.x - 18, st.y - 10, 36, col)}

            {/* Bullet items */}
            {items.map((item, j) => {
              const by = st.y + (hs ? 56 : 30) + j * 16;
              return (
                <g key={j}>
                  <circle cx={st.x - 50} cy={by - 3} r="2" fill={col} opacity="0.6"/>
                  <text x={st.x - 44} y={by} fontFamily="Patrick Hand" fontSize="12" fill={pal.t}>{item}</text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Central message */}
      {data.cm && (
        <g>
          <path d={rr(W / 2 - 200, H - fH - M - cmH - 4, 400, 30, 15, rng, 2)} fill="#fff" stroke={pal.p} strokeWidth="1.5"/>
          {Ic('star', W / 2 - 192, H - fH - M - cmH, 16, pal.p)}
          <text x={W / 2} y={H - fH - M - cmH + 18} textAnchor="middle" fontFamily="Caveat" fontSize="14" fontWeight="600" fill={pal.p} fontStyle="italic">{data.cm}</text>
        </g>
      )}

      {/* Footer */}
      {fH > 0 && (
        <g>
          <path d={rr(M, H - fH - M + 6, W - M * 2, fH - 6, 10, mkR(seed + 999), 2)} fill="none" stroke={pal.p} strokeWidth="1.5" strokeDasharray="6,4"/>
          {data.footer.title && <text x={W / 2} y={H - fH - M + 22} textAnchor="middle" fontFamily="Caveat" fontSize="13" fontWeight="700" fill={pal.p}>{data.footer.title.toUpperCase()}</text>}
          {data.footer.items.map((it, i) => {
            const ix = M + 20 + i * ((W - M * 2 - 40) / Math.max(data.footer.items.length, 1));
            return (
              <g key={i}>
                {Ic('heart', ix, H - fH - M + 28, 13, pal.p)}
                <text x={ix + 16} y={H - fH - M + 46} fontFamily="Patrick Hand" fontSize="12" fill={pal.t}>{it}</text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT 3: SKETCHNOTE-POSTER (Mixed Sizes + Sidebar)
   ═══════════════════════════════════════════════════ */

export function PosterSVG({ data, pal }) {
  const la = data.orientation !== 'portrait', W = la ? 1100 : 750, H = la ? 780 : 1100;
  const seed = (data.title || '').length * 7 + 42, rng = mkR(seed);
  const secs = data.sections.slice(0, 9);
  const M = 16;
  const TH = 76;
  const sideW = la ? 180 : 150;
  const mainW = W - M * 3 - sideW;
  const fH = data.footer?.items?.length ? 80 : 0;
  const cmH = data.cm ? 36 : 0;
  const contentH = H - TH - fH - cmH - M * 2;

  // Split sections: hero (first), main content (2-5), sidebar questions (6+)
  const heroSec = secs[0];
  const mainSecs = secs.slice(1, la ? 6 : 5);
  const sidebarSecs = secs.slice(la ? 6 : 5);
  const mainCols = la ? 3 : 2;
  const heroH = contentH * 0.38;
  const gridH = contentH - heroH - 10;
  const cellW = mainW / mainCols;
  const cellH = gridH / Math.ceil(mainSecs.length / mainCols);

  return (
    <svg id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', background: pal.bg, borderRadius: 12 }}>
      <defs><style>{FC}</style></defs>
      <rect width={W} height={H} fill={pal.bg} rx="10"/>
      <path d={rr(5, 5, W - 10, H - 10, 14, rng, 3)} fill="none" stroke={pal.t} strokeWidth="1.5" opacity="0.08"/>

      {/* Title */}
      <path d={rr(W / 2 - 240, 10, 480, 44, 8, rng, 3)} fill={pal.p} stroke={pal.t} strokeWidth="1.5" opacity="0.92"/>
      <text x={W / 2} y={40} textAnchor="middle" fontFamily="Caveat" fontSize="26" fontWeight="700" fill="#fff" letterSpacing="1">{data.title.toUpperCase()}</text>
      {data.subtitle && <text x={W / 2} y={66} textAnchor="middle" fontFamily="Patrick Hand" fontSize="14" fill={pal.t} opacity="0.55">{data.subtitle}</text>}

      {/* Hero section (wide, first section) */}
      {heroSec && (() => {
        const hx = M, hy = TH, hw = mainW, hh = heroH;
        const col = gc(pal, heroSec.color);
        const hs = !!heroSec.scene;
        const items = (heroSec.items || []).slice(0, 4).map(t => t.length > 30 ? t.slice(0, 28) + '…' : t);
        return (
          <g>
            <path d={rr(hx, hy, hw, hh, 14, rng, 2.5)} fill={pal.sb} stroke={pal.t} strokeWidth="1.5" opacity="0.9"/>
            <circle cx={hx + 22} cy={hy + 20} r="14" fill={col} opacity="0.9"/>
            <text x={hx + 22} y={hy + 25} textAnchor="middle" fontFamily="Caveat" fontSize="17" fontWeight="700" fill="#fff">{heroSec.n}</text>
            <text x={hx + 42} y={hy + 26} fontFamily="Caveat" fontSize="19" fontWeight="700" fill={pal.t}>{(heroSec.title || '').toUpperCase()}</text>
            <path d={ln(hx + 12, hy + 34, hx + hw * 0.6, hy + 34, rng)} fill="none" stroke={col} strokeWidth="1.5" opacity="0.3"/>
            {/* Large illustration */}
            {hs && Sc(heroSec.scene, hx + 16, hy + 40, Math.min(hh - 50, 120) / 80, col)}
            {!hs && Ic(heroSec.sym, hx + 30, hy + 50, Math.min(hh - 60, 70), col)}
            {/* Items to the right of illustration */}
            {items.map((item, j) => (
              <g key={j}>
                <circle cx={hx + hw * 0.45} cy={hy + 52 + j * 20} r="2.5" fill={col} opacity="0.6"/>
                <text x={hx + hw * 0.45 + 10} y={hy + 56 + j * 20} fontFamily="Patrick Hand" fontSize="13" fill={pal.t}>{item}</text>
              </g>
            ))}
          </g>
        );
      })()}

      {/* Main content grid (sections 2-5) */}
      {mainSecs.map((sec, i) => {
        const col = gc(pal, sec.color);
        const cx = M + (i % mainCols) * cellW;
        const cy = TH + heroH + 10 + Math.floor(i / mainCols) * cellH;
        const cw = cellW - 6;
        const ch = cellH - 6;
        const hs = !!sec.scene;
        const items = (sec.items || []).slice(0, 3).map(t => t.length > 24 ? t.slice(0, 22) + '…' : t);
        return (
          <g key={`m${i}`}>
            <path d={rr(cx + 3, cy + 3, cw, ch, 12, mkR(seed + i * 137), 2)} fill={pal.sb} stroke={pal.t} strokeWidth="1.2" opacity="0.85"/>
            <circle cx={cx + 18} cy={cy + 18} r="11" fill={col} opacity="0.9"/>
            <text x={cx + 18} y={cy + 22.5} textAnchor="middle" fontFamily="Caveat" fontSize="14" fontWeight="700" fill="#fff">{sec.n}</text>
            <text x={cx + 34} y={cy + 22} fontFamily="Caveat" fontSize="15" fontWeight="700" fill={pal.t}>{(sec.title || '').slice(0, 18).toUpperCase()}</text>
            {hs && Sc(sec.scene, cx + 10, cy + 30, Math.min(ch - 40, 80) / 80 * 0.7, col)}
            {!hs && Ic(sec.sym, cx + 14, cy + 28, Math.min(ch - 40, 40), col)}
            {items.map((item, j) => {
              const iy = cy + 34 + j * 16 + (hs ? 50 : 10);
              return (
                <g key={j}>
                  <circle cx={cx + cw * 0.35} cy={iy - 3} r="2" fill={col} opacity="0.5"/>
                  <text x={cx + cw * 0.35 + 8} y={iy} fontFamily="Patrick Hand" fontSize="12" fill={pal.t}>{item}</text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Sidebar (right column) */}
      <path d={rr(W - M - sideW, TH, sideW, contentH, 12, rng, 3)} fill={pal.sb} stroke={pal.p} strokeWidth="1.2" opacity="0.6"/>
      <text x={W - M - sideW / 2} y={TH + 22} textAnchor="middle" fontFamily="Caveat" fontSize="14" fontWeight="700" fill={pal.p}>
        {sidebarSecs.length > 0 ? (sidebarSecs[0]?.title || 'REFLEXION').toUpperCase() : 'GUTE FRAGEN'}
      </text>
      <path d={ln(W - M - sideW + 12, TH + 28, W - M - 12, TH + 28, rng)} fill="none" stroke={pal.p} strokeWidth="1" opacity="0.25"/>

      {/* Sidebar content */}
      {sidebarSecs.length > 0 ? (
        sidebarSecs.map((sec, i) => {
          const sy = TH + 40 + i * (contentH / Math.max(sidebarSecs.length, 1) * 0.7);
          const col2 = gc(pal, sec.color);
          return (
            <g key={`s${i}`}>
              {Ic(sec.sym, W - M - sideW + 10, sy, 20, col2)}
              <text x={W - M - sideW + 34} y={sy + 10} fontFamily="Caveat" fontSize="12" fontWeight="600" fill={col2}>{(sec.title || '').slice(0, 16)}</text>
              {(sec.items || []).slice(0, 2).map((item, j) => (
                <text key={j} x={W - M - sideW + 14} y={sy + 26 + j * 14} fontFamily="Patrick Hand" fontSize="11" fill={pal.t}>{item.slice(0, 22)}</text>
              ))}
            </g>
          );
        })
      ) : (
        /* Default sidebar: conversation starters */
        data.footer?.items?.map((it, i) => (
          <g key={`q${i}`}>
            {Ic('speech', W - M - sideW + 10, TH + 40 + i * 40, 16, pal.p)}
            <text x={W - M - sideW + 30} y={TH + 52 + i * 40} fontFamily="Patrick Hand" fontSize="11.5" fill={pal.t}>{it.slice(0, 24)}</text>
          </g>
        ))
      )}

      {/* Central message */}
      {data.cm && (
        <g>
          <path d={rr(M + mainW / 2 - 180, H - fH - M - cmH - 4, 360, 30, 15, rng, 2)} fill="#fff" stroke={pal.p} strokeWidth="1.2"/>
          {Ic('star', M + mainW / 2 - 172, H - fH - M - cmH, 14, pal.p)}
          <text x={M + mainW / 2} y={H - fH - M - cmH + 18} textAnchor="middle" fontFamily="Caveat" fontSize="14" fontWeight="600" fill={pal.p} fontStyle="italic">{data.cm}</text>
        </g>
      )}

      {/* Footer */}
      {fH > 0 && (
        <g>
          <path d={rr(M, H - fH - M + 6, W - M * 2, fH - 8, 10, mkR(seed + 999), 2)} fill="none" stroke={pal.p} strokeWidth="1.5" strokeDasharray="6,4"/>
          {data.footer.title && (
            <g>
              <path d={rr(W / 2 - 90, H - fH - M - 2, 180, 18, 6, rng, 2)} fill={pal.bg} stroke={pal.p} strokeWidth="1"/>
              <text x={W / 2} y={H - fH - M + 11} textAnchor="middle" fontFamily="Caveat" fontSize="12" fontWeight="700" fill={pal.p}>{data.footer.title.toUpperCase()}</text>
            </g>
          )}
          {data.footer.items.map((it, i) => {
            const ix = M + 20 + i * ((W - M * 2 - 40) / Math.max(data.footer.items.length, 1));
            return (
              <g key={i}>
                {Ic('heart', ix, H - fH - M + 18, 12, pal.p)}
                <text x={ix + 16} y={H - fH - M + 36} fontFamily="Patrick Hand" fontSize="11.5" fill={pal.t}>{it}</text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   LAYOUT 4: PROZESS-FLOW (Steps + Toolbox)
   ═══════════════════════════════════════════════════ */

export function FlowSVG({ data, pal }) {
  const la = data.orientation !== 'portrait', W = la ? 1120 : 760, H = la ? 700 : 1100;
  const seed = (data.title || '').length * 7 + 42, rng = mkR(seed);
  const allSecs = data.sections.slice(0, 9);
  const mainCount = Math.min(allSecs.length, la ? 5 : 4);
  const mainSecs = allSecs.slice(0, mainCount);
  const toolSecs = allSecs.slice(mainCount);
  const hasTools = toolSecs.length > 0;
  const M = 18;
  const TH = 80;
  const toolH = hasTools ? 155 : 0;
  const cmH = data.cm ? 36 : 0;
  const fH = (!hasTools && data.footer?.items?.length) ? 56 : 0;
  const storyH = H - TH - toolH - cmH - fH - M * 2;
  const colW = (W - M * 2) / mainCount;

  return (
    <svg id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', background: pal.bg, borderRadius: 12 }}>
      <defs><style>{FC}</style></defs>
      <rect width={W} height={H} fill={pal.bg} rx="10"/>
      <path d={rr(5, 5, W - 10, H - 10, 16, rng, 4)} fill="none" stroke={pal.p} strokeWidth="2" opacity="0.08"/>

      {/* Title banner (ribbon style) */}
      <path d={`M${W/2-230},12 L${W/2+230},12 L${W/2+235},34 L${W/2+230},56 L${W/2-230},56 L${W/2-235},34 Z`}
        fill={pal.p} opacity="0.92"/>
      <text x={W / 2} y={42} textAnchor="middle" fontFamily="Caveat" fontSize="26" fontWeight="700" fill="#fff" letterSpacing="2">{data.title.toUpperCase()}</text>
      {data.subtitle && <text x={W / 2} y={72} textAnchor="middle" fontFamily="Patrick Hand" fontSize="13" fill={pal.t} opacity="0.5">{data.subtitle}</text>}

      {/* Main process steps */}
      {mainSecs.map((sec, i) => {
        const col = gc(pal, sec.color);
        const cx = M + i * colW + colW / 2;
        const sy = TH + 10;
        const hs = !!sec.scene;
        const items = (sec.items || []).slice(0, 4).map(t => t.length > 24 ? t.slice(0, 22) + '…' : t);
        const sceneScale = Math.min(storyH * 0.35, 100) / 80;

        return (
          <g key={i}>
            {/* Step number + colored label */}
            <rect x={cx - colW / 2 + 8} y={sy} width={16} height={16} rx="4" fill={col} opacity="0.85"/>
            <text x={cx - colW / 2 + 16} y={sy + 12.5} textAnchor="middle" fontFamily="Caveat" fontSize="12" fontWeight="700" fill="#fff">{sec.n}</text>
            <rect x={cx - colW / 2 + 28} y={sy} width={colW - 50} height={16} rx="4" fill={col} opacity="0.1"/>
            <text x={cx - 2} y={sy + 12} textAnchor="middle" fontFamily="Caveat" fontSize="14" fontWeight="700" fill={pal.t}>{(sec.title || '').slice(0, 18).toUpperCase()}</text>

            {/* Large scene illustration */}
            {hs && Sc(sec.scene, cx - 40, sy + 30, sceneScale, col)}
            {!hs && Ic(sec.sym, cx - 24, sy + 40, 50, col)}

            {/* Bullet items below */}
            {items.map((item, j) => {
              const by = sy + 30 + (hs ? sceneScale * 80 + 16 : 60) + j * 17;
              return (
                <g key={j}>
                  <circle cx={cx - colW / 2 + 18} cy={by - 3} r="2.5" fill={col} opacity="0.5"/>
                  <text x={cx - colW / 2 + 26} y={by} fontFamily="Patrick Hand" fontSize="12.5" fill={pal.t}>{item}</text>
                </g>
              );
            })}

            {/* Arrow to next */}
            {i < mainSecs.length - 1 && (
              <g opacity="0.35">
                {arr(cx + colW / 2 - 14, sy + 30 + sceneScale * 40, cx + colW / 2 + 14, sy + 30 + sceneScale * 40, mkR(seed + i * 53), 10).map((p, j) => (
                  <path key={j} d={p} fill="none" stroke={pal.p} strokeWidth="2.5" strokeLinecap="round"/>
                ))}
              </g>
            )}
          </g>
        );
      })}

      {/* Central message */}
      {data.cm && (
        <g>
          <path d={rr(W / 2 - 210, H - toolH - fH - M - cmH - 4, 420, 30, 15, rng, 2)} fill="#fff" stroke={pal.p} strokeWidth="1.2"/>
          {Ic('star', W / 2 - 202, H - toolH - fH - M - cmH, 14, pal.p)}
          <text x={W / 2} y={H - toolH - fH - M - cmH + 18} textAnchor="middle" fontFamily="Caveat" fontSize="14" fontWeight="600" fill={pal.p} fontStyle="italic">{data.cm}</text>
        </g>
      )}

      {/* Toolbox section */}
      {hasTools && (
        <g>
          <path d={rr(M, H - toolH - M + 4, W - M * 2, toolH - 6, 12, rng, 3)} fill="none" stroke={pal.p} strokeWidth="2"/>
          <path d={rr(W / 2 - 120, H - toolH - M - 8, 240, 22, 6, rng, 2)} fill={pal.bg} stroke={pal.p} strokeWidth="1.2"/>
          <text x={W / 2} y={H - toolH - M + 7} textAnchor="middle" fontFamily="Caveat" fontSize="15" fontWeight="700" fill={pal.p}>{data.footer?.title || 'MEIN WERKZEUGKASTEN'}</text>

          {toolSecs.map((sec, i) => {
            const col2 = gc(pal, sec.color);
            const tw = (W - M * 2 - 40) / Math.max(toolSecs.length, 1);
            const tx = M + 20 + i * tw + tw / 2;
            const ty = H - toolH + M + 10;
            const hs2 = !!sec.scene;
            return (
              <g key={`t${i}`}>
                {hs2 ? Sc(sec.scene, tx - 28, ty - 14, 0.55, col2) : Ic(sec.sym, tx - 16, ty - 8, 34, col2)}
                <text x={tx} y={ty + 38} textAnchor="middle" fontFamily="Caveat" fontSize="12" fontWeight="700" fill={col2}>{(sec.title || '').slice(0, 18).toUpperCase()}</text>
                {(sec.items || []).slice(0, 2).map((item, j) => (
                  <text key={j} x={tx} y={ty + 52 + j * 14} textAnchor="middle" fontFamily="Patrick Hand" fontSize="11" fill={pal.t}>{item.length > 22 ? item.slice(0, 20) + '…' : item}</text>
                ))}
              </g>
            );
          })}
        </g>
      )}

      {/* Footer (only if no toolbox) */}
      {!hasTools && data.footer?.items?.length > 0 && (
        <g>
          <path d={rr(M, H - fH - M + 4, W - M * 2, fH - 4, 10, rng, 2)} fill="none" stroke={pal.p} strokeWidth="1.5" strokeDasharray="6,4"/>
          {data.footer.items.map((it, i) => {
            const ix = M + 20 + i * ((W - M * 2 - 40) / Math.max(data.footer.items.length, 1));
            return (
              <g key={i}>
                {Ic('heart', ix, H - fH - M + 12, 13, pal.p)}
                <text x={ix + 16} y={H - fH - M + 30} fontFamily="Patrick Hand" fontSize="12" fill={pal.t}>{it}</text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}
