// SketchnoteTool.jsx — Main component: Wizard + 4 SVG renderers + Color control
import React, { useState, useCallback, useRef } from 'react';
import { mkR, rr, ln, arr } from './primitives.js';
import { Sc, SCENE_NAMES } from './scenes.jsx';
import { Ic, ICON_NAMES } from './icons.jsx';
import { PAL, gc, MOOD_VALS, ORIENT_VALS, resolvePalette } from './palettes.js';
import { FONT_CSS as FC, T } from './translations.js';
import { callAPI } from './api.js';
import { dlS, dlP, dlJ } from './downloads.js';
import { vd } from './validate.js';

/* ═══════════════════════════════════════════
   STRUCTURED SVG (Kästchen)
   ═══════════════════════════════════════════ */

function BoxSec({ sec, x, y, w, h, pal, seed }) {
  const rng = mkR(seed + (sec.n || 1) * 137), col = gc(pal, sec.color), tY = y + 28;
  const hs = !!sec.scene, sw = hs ? Math.min(w * 0.38, 80) : 0;
  return (<g>
    <path d={rr(x + 2, y + 2, w - 4, h - 4, 14, rng, 2.5)} fill={pal.sb} stroke={pal.t} strokeWidth="1.8" opacity="0.95" />
    <circle cx={x + 20} cy={y + 18} r="13" fill={col} opacity="0.9" />
    <text x={x + 20} y={y + 23.5} textAnchor="middle" fontFamily="Caveat" fontSize="16" fontWeight="700" fill="#fff">{sec.n}</text>
    <text x={x + 38} y={tY + 3} fontFamily="Caveat" fontSize="17" fontWeight="700" fill={pal.t}>{(sec.title || '').toUpperCase()}</text>
    <path d={ln(x + 10, tY + 8, x + w - 10, tY + 8, rng)} fill="none" stroke={col} strokeWidth="1.5" opacity="0.35" />
    {hs && Sc(sec.scene, x + w - sw - 6, tY + 12, Math.min(sw, 75) / 75, col)}
    {!hs && Ic(sec.sym, x + w - 40, y + 6, 28, col)}
    {(sec.items || []).slice(0, 3).map((item, i) => {
      const iy = tY + 26 + i * 18; const txt = item.length > 32 ? item.slice(0, 30) + '…' : item;
      return (<g key={i}><circle cx={x + 16} cy={iy - 3} r="2.5" fill={col} opacity="0.7" /><text x={x + 24} y={iy} fontFamily="Patrick Hand" fontSize="12.5" fill={pal.t}>{txt}</text></g>);
    })}
  </g>);
}

function StructSVG({ data, pal }) {
  const la = data.orientation !== 'portrait', W = la ? 1100 : 750, H = la ? 750 : 1050;
  const cols = data.layout?.columns || (la ? 3 : 2), seed = (data.title || '').length * 7 + 42, rng = mkR(seed);
  const M = 20, TH = 88, fH = data.footer?.items?.length ? 66 : 0, cH2 = data.cm ? 44 : 0;
  const ch = H - TH - fH - cH2 - M * 2, cw = W - M * 2, secs = data.sections, rows = Math.ceil(secs.length / cols), cW = cw / cols, cHh = ch / Math.max(rows, 1);
  return (<svg id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', background: pal.bg, borderRadius: 12 }}>
    <defs><style>{FC}</style></defs><rect width={W} height={H} fill={pal.bg} rx="10" />
    <path d={rr(8, 8, W - 16, H - 16, 16, rng, 3)} fill="none" stroke={pal.t} strokeWidth="2" opacity="0.12" />
    <path d={rr(M + 30, 12, cw - 60, 50, 10, rng, 3)} fill={pal.p} stroke={pal.t} strokeWidth="1.5" opacity="0.9" />
    <text x={W / 2} y={46} textAnchor="middle" fontFamily="Caveat" fontSize="27" fontWeight="700" fill="#fff">{data.title.toUpperCase()}</text>
    {data.subtitle && <text x={W / 2} y={78} textAnchor="middle" fontFamily="Patrick Hand" fontSize="15" fill={pal.t} opacity="0.65">{data.subtitle}</text>}
    {secs.map((s, i) => (<BoxSec key={i} sec={s} x={M + (i % cols) * cW + 5} y={TH + Math.floor(i / cols) * cHh + 5} w={cW - 10} h={cHh - 10} pal={pal} seed={seed} />))}
    {secs.length > 1 && secs.slice(0, -1).map((_, i) => { const fc = i % cols, fr = Math.floor(i / cols), tc = (i + 1) % cols, tr = Math.floor((i + 1) / cols), ar = mkR(seed + i * 31); let x1, y1, x2, y2; if (tr === fr) { x1 = M + fc * cW + cW - 6; y1 = TH + fr * cHh + cHh / 2; x2 = M + tc * cW + 12; y2 = y1; } else { x1 = M + fc * cW + cW / 2; y1 = TH + fr * cHh + cHh - 2; x2 = M + tc * cW + cW / 2; y2 = TH + tr * cHh + 8; } return (<g key={`a${i}`} opacity="0.35">{arr(x1, y1, x2, y2, ar, 8).map((p, j) => (<path key={j} d={p} fill="none" stroke={pal.p} strokeWidth="2" strokeLinecap="round" />))}</g>); })}
    {data.cm && <g><path d={rr(W / 2 - 180, H - fH - M - cH2 - 2, 360, 34, 18, rng, 2)} fill="#fff" stroke={pal.p} strokeWidth="1.5" />{Ic('star', W / 2 - 172, H - fH - M - cH2 + 2, 18, pal.p)}<text x={W / 2} y={H - fH - M - cH2 + 22} textAnchor="middle" fontFamily="Caveat" fontSize="15" fontWeight="600" fill={pal.p}>{data.cm}</text></g>}
    {fH > 0 && <g><path d={rr(M, H - fH - M + 4, cw, 54, 10, mkR(seed + 999), 2)} fill={pal.bg} stroke={pal.p} strokeWidth="1.5" strokeDasharray="6,4" />{data.footer.title && <text x={M + 16} y={H - fH - M + 21} fontFamily="Caveat" fontSize="14" fontWeight="700" fill={pal.p}>{data.footer.title.toUpperCase()}</text>}{data.footer.items.map((it, i) => { const ix = M + 16 + i * (cw / Math.max(data.footer.items.length, 1)); return (<g key={i}>{Ic('heart', ix, H - fH - M + 24, 13, pal.p)}<text x={ix + 16} y={H - fH - M + 42} fontFamily="Patrick Hand" fontSize="12" fill={pal.t}>{it}</text></g>); })}</g>}
  </svg>);
}

/* ═══════════════════════════════════════════
   FREE SKETCH SVG
   ═══════════════════════════════════════════ */

function FreeSVG({ data, pal }) {
  const la = data.orientation !== 'portrait', W = la ? 1120 : 760, H = la ? 660 : 1100;
  const seed = (data.title || '').length * 7 + 42, rng = mkR(seed);
  const allSecs = data.sections.slice(0, 9);
  const mainCount = Math.min(allSecs.length, la ? 5 : 4);
  const mainSecs = allSecs.slice(0, mainCount);
  const toolSecs = allSecs.slice(mainCount);
  const hasTools = toolSecs.length > 0;
  const toolH = hasTools ? 150 : 0;
  const colW = la ? (W - 40) / mainCount : (W - 40) / Math.min(mainCount, 3);

  return (<svg id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', background: pal.bg, borderRadius: 12 }}>
    <defs><style>{FC}</style></defs>
    <rect width={W} height={H} fill={pal.bg} rx="10" />
    <path d={rr(6, 6, W - 12, H - 12, 18, rng, 4)} fill="none" stroke={pal.p} strokeWidth="2" opacity="0.12" />

    {/* Title banner */}
    <path d={rr(W / 2 - 220, 10, 440, 50, 8, rng, 3)} fill={pal.p} stroke={pal.t} strokeWidth="1.5" opacity="0.9" />
    <text x={W / 2} y={44} textAnchor="middle" fontFamily="Caveat" fontSize="28" fontWeight="700" fill="#fff" letterSpacing="2">{data.title.toUpperCase()}</text>
    {data.subtitle && <text x={W / 2} y={76} textAnchor="middle" fontFamily="Patrick Hand" fontSize="14" fill={pal.t} opacity="0.6">{data.subtitle}</text>}

    {/* Main story sections */}
    {mainSecs.map((sec, i) => {
      const col = gc(pal, sec.color);
      const cx = 20 + i * colW + colW / 2;
      const sy = 95;
      const hs = !!sec.scene;
      const items = (sec.items || []).slice(0, 4).map(t2 => t2.length > 28 ? t2.slice(0, 26) + '…' : t2);
      const sceneY = sy + 50;
      const bullY = sceneY + (hs ? 110 : 50);
      return (<g key={i}>
        <text x={cx} y={sy + 12} textAnchor="middle" fontFamily="Caveat" fontSize="16" fontWeight="700" fill={pal.t}>{(sec.title || '').slice(0, 22).toUpperCase()}</text>
        <path d={ln(cx - 50, sy + 18, cx + 50, sy + 18, mkR(seed + i * 77))} fill="none" stroke={col} strokeWidth="1.5" opacity="0.3" />
        {hs && Sc(sec.scene, cx - 45, sceneY, 1.2, col)}
        {!hs && Ic(sec.sym, cx - 22, sceneY + 10, 50, col)}
        {items.map((item, j) => {
          const by = bullY + j * 18;
          return (<g key={j}>{Ic(sec.sym, cx - colW / 2 + 12, by - 8, 14, col)}<text x={cx - colW / 2 + 30} y={by} fontFamily="Patrick Hand" fontSize="13" fill={pal.t}>{item}</text></g>);
        })}
        {i < mainSecs.length - 1 && (<g opacity="0.4">{arr(cx + colW / 2 - 15, sceneY + 45, cx + colW / 2 + 15, sceneY + 45, mkR(seed + i * 53), 10).map((p, j) => (<path key={j} d={p} fill="none" stroke={pal.p} strokeWidth="2.5" strokeLinecap="round" />))}</g>)}
      </g>);
    })}

    {/* Central message */}
    {data.cm && (<g>
      <path d={rr(W / 2 - 200, H - toolH - 55, 400, 30, 15, rng, 2)} fill="#fff" stroke={pal.p} strokeWidth="1.5" />
      {Ic('star', W / 2 - 192, H - toolH - 52, 16, pal.p)}
      <text x={W / 2} y={H - toolH - 35} textAnchor="middle" fontFamily="Caveat" fontSize="14" fontWeight="600" fill={pal.p} fontStyle="italic">{data.cm}</text>
    </g>)}

    {/* Toolbox area */}
    {hasTools && (<g>
      <path d={rr(20, H - toolH - 10, W - 40, toolH, 12, rng, 3)} fill="none" stroke={pal.p} strokeWidth="2" />
      <path d={rr(W / 2 - 110, H - toolH - 22, 220, 26, 6, rng, 2)} fill={pal.bg} stroke={pal.p} strokeWidth="1.5" />
      <text x={W / 2} y={H - toolH - 4} textAnchor="middle" fontFamily="Caveat" fontSize="16" fontWeight="700" fill={pal.p}>{data.footer?.title || 'MEIN WERKZEUGKASTEN'}</text>
      {toolSecs.map((sec, i) => {
        const col2 = gc(pal, sec.color);
        const tw = (W - 80) / Math.max(toolSecs.length, 1);
        const tx = 40 + i * tw + tw / 2;
        const ty = H - toolH + 30;
        const hs2 = !!sec.scene;
        return (<g key={`t${i}`}>
          {hs2 ? Sc(sec.scene, tx - 25, ty - 10, 0.55, col2) : Ic(sec.sym, tx - 14, ty - 4, 32, col2)}
          <text x={tx} y={ty + 45} textAnchor="middle" fontFamily="Caveat" fontSize="13" fontWeight="700" fill={col2}>{(sec.title || '').slice(0, 20).toUpperCase()}</text>
          {(sec.items || []).slice(0, 2).map((item, j) => (<text key={j} x={tx} y={ty + 60 + j * 14} textAnchor="middle" fontFamily="Patrick Hand" fontSize="11" fill={pal.t}>{item.length > 24 ? item.slice(0, 22) + '…' : item}</text>))}
        </g>);
      })}
    </g>)}

    {/* Footer if no toolbox */}
    {!hasTools && data.footer?.items?.length > 0 && (<g>
      <path d={rr(20, H - 60, W - 40, 50, 10, rng, 2)} fill="none" stroke={pal.p} strokeWidth="1.5" strokeDasharray="6,4" />
      {data.footer.items.map((it, i) => { const ix = 40 + i * ((W - 80) / Math.max(data.footer.items.length, 1)); return (<g key={i}>{Ic('heart', ix, H - 48, 14, pal.p)}<text x={ix + 18} y={H - 34} fontFamily="Patrick Hand" fontSize="12" fill={pal.t}>{it}</text></g>); })}
    </g>)}
  </svg>);
}

/* ═══════════════════════════════════════════
   PROFI-KARTEN SVG (New third style)
   Banner title, card containers, checkmark bullets, dashed goal box
   ═══════════════════════════════════════════ */

function ProCardSVG({ data, pal }) {
  const la = data.orientation !== 'portrait';
  const W = la ? 1180 : 800, H = la ? 720 : 1150;
  const seed = (data.title || '').length * 7 + 42, rng = mkR(seed);
  const allSecs = data.sections.slice(0, 9);

  // Layout: top row (4 cards) + bottom row (remaining) + goal box
  const topCount = la ? Math.min(allSecs.length, 4) : Math.min(allSecs.length, 3);
  const topSecs = allSecs.slice(0, topCount);
  const botSecs = allSecs.slice(topCount);
  const hasBotRow = botSecs.length > 0;

  const bannerH = 70;
  const subY = bannerH + 24;
  const cardStartY = data.subtitle ? subY + 18 : bannerH + 12;
  const goalH = data.cm ? 70 : 0;
  const botRowH = hasBotRow ? 200 : 0;
  const topRowH = H - cardStartY - goalH - botRowH - 20;

  const pad = 14;
  const cardGap = 12;
  const usableW = W - pad * 2;

  // Top row cards
  const topCardW = (usableW - (topCount - 1) * cardGap) / topCount;

  // Bottom row cards
  const botCount = botSecs.length;
  const botCardW = botCount > 0 ? (usableW - (botCount - 1) * cardGap) / botCount : 0;

  // Ribbon banner path (wider, with "fold" ends)
  const bx = W / 2 - 260, bw = 520, by = 6;
  const ribbonRng = mkR(seed + 7);

  return (<svg id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', background: pal.bg, borderRadius: 12 }}>
    <defs>
      <style>{FC}</style>
      <filter id="cardShadow" x="-4%" y="-4%" width="110%" height="112%">
        <feDropShadow dx="1.5" dy="2.5" stdDeviation="3" floodOpacity="0.08" />
      </filter>
    </defs>
    <rect width={W} height={H} fill={pal.bg} rx="10" />
    {/* Outer border sketch */}
    <path d={rr(5, 5, W - 10, H - 10, 14, rng, 3)} fill="none" stroke={pal.t} strokeWidth="1.5" opacity="0.1" />

    {/* ── RIBBON BANNER ── */}
    {/* Banner ribbon with folded ends */}
    <path d={`M${bx + 16},${by} L${bx + bw - 16},${by} L${bx + bw},${by + 6} L${bx + bw - 6},${by + bannerH - 14} L${bx + bw - 16},${by + bannerH - 8} L${bx + 16},${by + bannerH - 8} L${bx + 6},${by + bannerH - 14} L${bx},${by + 6}Z`}
      fill={pal.p} stroke={pal.t} strokeWidth="1.2" opacity="0.92" />
    {/* Small ribbon folds */}
    <path d={`M${bx},${by + 6} L${bx + 8},${by + 12}`} stroke={pal.t} strokeWidth="1" opacity="0.3" />
    <path d={`M${bx + bw},${by + 6} L${bx + bw - 8},${by + 12}`} stroke={pal.t} strokeWidth="1" opacity="0.3" />
    {/* Decorative lines beside banner */}
    {[[-20, -12], [-28, -4], [bw + 12, -12], [bw + 20, -4]].map(([dx, dy], k) => (
      <line key={k} x1={bx + dx + (ribbonRng() - 0.5) * 3} y1={by + 20 + dy} x2={bx + dx + 12 + (ribbonRng() - 0.5) * 3} y2={by + 20 + dy - 4} stroke={pal.p} strokeWidth="2" opacity="0.4" strokeLinecap="round" />
    ))}
    <text x={W / 2} y={by + 42} textAnchor="middle" fontFamily="Caveat" fontSize="34" fontWeight="700" fill="#fff" letterSpacing="3">{data.title.toUpperCase()}</text>
    {data.subtitle && <text x={W / 2} y={subY + 4} textAnchor="middle" fontFamily="Patrick Hand" fontSize="15" fill={pal.t} opacity="0.6">{data.subtitle}</text>}

    {/* ── TOP ROW CARDS ── */}
    {topSecs.map((sec, i) => {
      const col = gc(pal, sec.color);
      const cx = pad + i * (topCardW + cardGap);
      const cy = cardStartY;
      const cw = topCardW;
      const ch = topRowH;
      const cardRng = mkR(seed + (sec.n || 1) * 137);
      const hs = !!sec.scene;
      const items = (sec.items || []).slice(0, 4).map(t2 => t2.length > 30 ? t2.slice(0, 28) + '…' : t2);

      // Title bar height
      const tbH = 32;
      // Scene area
      const sceneAreaY = cy + tbH + 8;
      const sceneH = hs ? 100 : 60;
      const bullStartY = sceneAreaY + sceneH + 4;

      return (<g key={i}>
        {/* Card container */}
        <path d={rr(cx, cy, cw, ch, 12, cardRng, 2.8)} fill="#fff" stroke={pal.t} strokeWidth="1.8" filter="url(#cardShadow)" />

        {/* Colored title bar */}
        <rect x={cx + 4} y={cy + 4} width={cw - 8} height={tbH} rx="6" fill={col} opacity="0.15" />
        {/* Number circle */}
        <circle cx={cx + 24} cy={cy + 4 + tbH / 2} r="13" fill={col} />
        <text x={cx + 24} y={cy + 4 + tbH / 2 + 5.5} textAnchor="middle" fontFamily="Caveat" fontSize="16" fontWeight="700" fill="#fff">{sec.n}</text>
        {/* Title text */}
        <text x={cx + 44} y={cy + 4 + tbH / 2 + 5} fontFamily="Caveat" fontSize="16" fontWeight="700" fill={pal.t}>{(sec.title || '').slice(0, 22).toUpperCase()}</text>

        {/* Scene illustration (large, centered) */}
        {hs && Sc(sec.scene, cx + cw / 2 - 45, sceneAreaY, 1.15, col)}
        {!hs && Ic(sec.sym, cx + cw / 2 - 28, sceneAreaY + 5, 56, col)}

        {/* Checkmark bullet items */}
        {items.map((item, j) => {
          const by = bullStartY + j * 20;
          return (<g key={j}>
            {/* Checkmark icon */}
            <path d={`M${cx + 14},${by - 2} L${cx + 18},${by + 3} L${cx + 26},${by - 6}`}
              fill="none" stroke={col} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <text x={cx + 32} y={by + 1} fontFamily="Patrick Hand" fontSize="12.5" fill={pal.t}>{item}</text>
          </g>);
        })}
      </g>);
    })}

    {/* ── BOTTOM ROW CARDS ── */}
    {hasBotRow && botSecs.map((sec, i) => {
      const col = gc(pal, sec.color);
      const cx = pad + i * (botCardW + cardGap);
      const cy = cardStartY + topRowH + 10;
      const cw = botCardW;
      const ch = botRowH - 16;
      const cardRng = mkR(seed + (sec.n || 1) * 211);
      const hs = !!sec.scene;
      const items = (sec.items || []).slice(0, 3).map(t2 => t2.length > 28 ? t2.slice(0, 26) + '…' : t2);
      const tbH = 28;

      return (<g key={`b${i}`}>
        {/* Card */}
        <path d={rr(cx, cy, cw, ch, 10, cardRng, 2)} fill="#fff" stroke={pal.t} strokeWidth="1.5" filter="url(#cardShadow)" />
        {/* Title bar */}
        <rect x={cx + 3} y={cy + 3} width={cw - 6} height={tbH} rx="5" fill={col} opacity="0.12" />
        <circle cx={cx + 20} cy={cy + 3 + tbH / 2} r="11" fill={col} />
        <text x={cx + 20} y={cy + 3 + tbH / 2 + 5} textAnchor="middle" fontFamily="Caveat" fontSize="14" fontWeight="700" fill="#fff">{sec.n}</text>
        <text x={cx + 38} y={cy + 3 + tbH / 2 + 4.5} fontFamily="Caveat" fontSize="14" fontWeight="700" fill={pal.t}>{(sec.title || '').slice(0, 22).toUpperCase()}</text>

        {/* Scene */}
        {hs ? Sc(sec.scene, cx + cw / 2 - 30, cy + tbH + 8, 0.7, col) : Ic(sec.sym, cx + cw / 2 - 18, cy + tbH + 10, 38, col)}

        {/* Items */}
        {items.map((item, j) => {
          const by = cy + tbH + (hs ? 70 : 55) + j * 18;
          return (<g key={j}>
            <path d={`M${cx + 12},${by - 2} L${cx + 15},${by + 2} L${cx + 22},${by - 5}`}
              fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x={cx + 28} y={by + 1} fontFamily="Patrick Hand" fontSize="11.5" fill={pal.t}>{item}</text>
          </g>);
        })}
      </g>);
    })}

    {/* ── DASHED GOAL BOX ── */}
    {data.cm && (() => {
      const goalW = Math.min(420, W - 60);
      const gx = W - goalW - pad - 8;
      const gy = H - goalH - 8;
      const goalRng = mkR(seed + 777);
      return (<g>
        <path d={rr(gx, gy, goalW, goalH - 4, 14, goalRng, 2.5)} fill="#fff" stroke={pal.p} strokeWidth="2" strokeDasharray="8,5" />
        {/* Heart icon */}
        {Ic('heart', gx + 12, gy + 10, 26, pal.p)}
        {/* ZIEL label */}
        <text x={gx + 44} y={gy + 24} fontFamily="Caveat" fontSize="20" fontWeight="700" fill={pal.p}>ZIEL</text>
        {/* Goal text — word wrap */}
        {(() => {
          const words = (data.cm || '').split(' ');
          const lines = [];
          let cur = '';
          words.forEach(w => {
            if ((cur + ' ' + w).trim().length > 42 && cur) { lines.push(cur.trim()); cur = w; }
            else cur = cur ? cur + ' ' + w : w;
          });
          if (cur.trim()) lines.push(cur.trim());
          return lines.slice(0, 2).map((line, li) => (
            <text key={li} x={gx + 44} y={gy + 42 + li * 16} fontFamily="Patrick Hand" fontSize="13" fill={pal.t} fontStyle="italic">{line}</text>
          ));
        })()}
      </g>);
    })()}

    {/* Footer items (if no goal) */}
    {!data.cm && data.footer?.items?.length > 0 && (<g>
      <path d={rr(20, H - 60, W - 40, 50, 10, rng, 2)} fill="none" stroke={pal.p} strokeWidth="1.5" strokeDasharray="6,4" />
      {data.footer.items.map((it, i) => { const ix = 40 + i * ((W - 80) / Math.max(data.footer.items.length, 1)); return (<g key={i}>{Ic('heart', ix, H - 48, 14, pal.p)}<text x={ix + 18} y={H - 34} fontFamily="Patrick Hand" fontSize="12" fill={pal.t}>{it}</text></g>); })}
    </g>)}
  </svg>);
}


/* ═══════════════════════════════════════════
   BILDSTARK SVG — Organic flowing sketchnote
   Like "Erstkontakt" / "Guter Gesprächseinstieg" references:
   HUGE illustrations, bold arrows, brush-stroke titles,
   NO cards, NO grid, maximum visual impact
   ═══════════════════════════════════════════ */

function brushBg(x, y, w, h, rng, col) {
  const j = () => (rng() - 0.5) * 5;
  return <path d={`M${x+j()},${y+h*0.4+j()} Q${x+w*0.2+j()},${y-3+j()} ${x+w*0.5+j()},${y+j()} Q${x+w*0.8+j()},${y-2+j()} ${x+w+j()},${y+h*0.35+j()} Q${x+w+3+j()},${y+h*0.7+j()} ${x+w-2+j()},${y+h+j()} Q${x+w*0.5+j()},${y+h+3+j()} ${x+2+j()},${y+h+j()} Q${x-2+j()},${y+h*0.6+j()} ${x+j()},${y+h*0.4+j()}Z`}
    fill={col} opacity="0.28" />;
}

function bigArrow(x1, y1, x2, y2, rng, col) {
  const mx = (x1+x2)/2, my = (y1+y2)/2 + (rng()-0.5)*6;
  return (<g>
    <path d={`M${x1},${y1} Q${mx},${my} ${x2-4},${y2}`} fill="none" stroke={col} strokeWidth="4.5" strokeLinecap="round" />
    <path d={`M${x2-14},${y2-8} L${x2},${y2} L${x2-14},${y2+8}`} fill="none" stroke={col} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </g>);
}

function BildstarkSVG({ data, pal }) {
  const la = data.orientation !== 'portrait';
  const W = la ? 1200 : 800, H = la ? 740 : 1100;
  const seed = (data.title||'').length*7+42, rng = mkR(seed);
  const allSecs = data.sections.slice(0, 9);
  const mainMax = la ? 5 : 3;
  const mainCount = Math.min(allSecs.length, mainMax);
  const mainSecs = allSecs.slice(0, mainCount);
  const toolSecs = allSecs.slice(mainCount);
  const hasTools = toolSecs.length > 0 || (data.footer?.items?.length > 0);
  const toolH = hasTools ? 135 : 0;
  const bannerH = 60;
  const subGap = data.subtitle ? 28 : 8;
  const flowY = bannerH + subGap + 10;
  const flowBottom = H - toolH - 16;
  const flowH = flowBottom - flowY;
  const colW = (W - 60) / mainCount;

  // Title brush-stroke Y and icon area
  const titleZoneH = 32;
  const sceneZoneY = flowY + titleZoneH + 10;
  const iconSize = la ? 130 : 100;
  const sceneVisH = iconSize + 30; // icon + padding
  const labelZoneY = sceneZoneY + sceneVisH;

  return (<svg id="sketchnote-svg" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%',background:pal.bg,borderRadius:12}}>
    <defs><style>{FC}</style></defs>
    <rect width={W} height={H} fill={pal.bg} rx="10" />
    <path d={rr(6,6,W-12,H-12,16,rng,4)} fill="none" stroke={pal.p} strokeWidth="1.5" opacity="0.07" />

    {/* ── BANNER: hand-drawn box with accent underlines ── */}
    {(() => {
      const bw = Math.min(W*0.65,620), bx = W/2-bw/2, by = 6, bRng = mkR(seed+13);
      return (<g>
        <path d={rr(bx, by, bw, bannerH-8, 10, bRng, 4)} fill="#fff" stroke={pal.t} strokeWidth="2.5" />
        {/* Bold accent underlines */}
        <path d={`M${bx+16},${by+bannerH-10} Q${bx+bw/2},${by+bannerH-6+(bRng()-0.5)*4} ${bx+bw-16},${by+bannerH-10}`}
          fill="none" stroke={pal.p} strokeWidth="4" strokeLinecap="round" />
        <path d={`M${bx+50},${by+bannerH-4} Q${bx+bw/2},${by+bannerH+(bRng()-0.5)*3} ${bx+bw-50},${by+bannerH-4}`}
          fill="none" stroke={pal.p} strokeWidth="3" strokeLinecap="round" opacity="0.45" />
        {/* Deco dashes */}
        {[[-16,14],[-12,26],[bw+8,14],[bw+4,26]].map(([dx,dy],k) => (
          <line key={k} x1={bx+dx} y1={by+dy-3} x2={bx+dx+12} y2={by+dy+3} stroke={pal.p} strokeWidth="3" opacity="0.4" strokeLinecap="round" />
        ))}
        <text x={W/2} y={by+38} textAnchor="middle" fontFamily="Caveat" fontSize="34" fontWeight="700" fill={pal.t} letterSpacing="2">{data.title.toUpperCase()}</text>
      </g>);
    })()}
    {data.subtitle && (<g>
      {Ic('heart', W/2-90, bannerH+4, 18, pal.p)}
      <text x={W/2} y={bannerH+16} textAnchor="middle" fontFamily="Patrick Hand" fontSize="15" fill={pal.t} opacity="0.55" fontStyle="italic">{data.subtitle}</text>
    </g>)}

    {/* ── MAIN SECTIONS: huge illustrations with flow arrows ── */}
    {mainSecs.map((sec, i) => {
      const col = gc(pal, sec.color);
      const cx = 30 + i * colW;
      const centerX = cx + colW / 2;
      const hs = !!sec.scene;
      const sRng = mkR(seed + (sec.n||1) * 97);
      const items = (sec.items||[]).slice(0,4).map(t2 => t2.length>22 ? t2.slice(0,20)+'…' : t2);
      const titleW = Math.min(colW - 20, 200);

      return (<g key={i}>
        {/* Wide brush-stroke title background */}
        {brushBg(centerX - titleW/2, flowY, titleW, titleZoneH, sRng, col)}
        <text x={centerX} y={flowY + 22} textAnchor="middle" fontFamily="Caveat" fontSize="19" fontWeight="700" fill={pal.t} letterSpacing="1">
          {sec.n}. {(sec.title||'').slice(0,20).toUpperCase()}
        </text>

        {/* LARGE icon symbol — no stick figures, just bold icons */}
        {(() => {
          const ix = centerX - iconSize/2, iy = sceneZoneY + (sceneVisH - iconSize)/2;
          return (<g>
            {/* Soft circle highlight behind icon */}
            <circle cx={centerX} cy={iy + iconSize/2} r={iconSize * 0.52} fill={col} opacity="0.08" />
            <circle cx={centerX} cy={iy + iconSize/2} r={iconSize * 0.52} fill="none" stroke={col} strokeWidth="1.5" opacity="0.15" strokeDasharray="6,4" />
            {Ic(sec.sym, ix, iy, iconSize, col)}
          </g>);
        })()}

        {/* Keyword labels */}
        {items.map((item, j) => (
          <g key={j}>
            <circle cx={cx + 10} cy={labelZoneY + j*19 + 1} r="3.5" fill={col} opacity="0.65" />
            <text x={cx + 19} y={labelZoneY + j*19 + 5} fontFamily="Patrick Hand" fontSize="14" fill={pal.t}>{item}</text>
          </g>
        ))}

        {/* BIG flow arrow → next section */}
        {i < mainSecs.length - 1 && bigArrow(
          cx + colW - 22, sceneZoneY + sceneVisH * 0.4,
          cx + colW + 22, sceneZoneY + sceneVisH * 0.4,
          mkR(seed + i*67), pal.p
        )}
      </g>);
    })}

    {/* ── Floating central message ── */}
    {data.cm && !hasTools && (<g>
      <path d={rr(W/2-210, flowBottom-8, 420, 30, 14, rng, 2)} fill="#fff" stroke={pal.p} strokeWidth="1.5" />
      {Ic('star', W/2-200, flowBottom-4, 16, pal.p)}
      <text x={W/2} y={flowBottom+14} textAnchor="middle" fontFamily="Caveat" fontSize="14" fontWeight="600" fill={pal.p} fontStyle="italic">{data.cm}</text>
    </g>)}

    {/* ── TOOLBOX BAR (bottom) ── */}
    {hasTools && (() => {
      const tbY = H - toolH - 2, tbRng = mkR(seed+555);
      const toolItems = toolSecs.length > 0 ? toolSecs : [];
      const footerItems = data.footer?.items || [];
      // Calculate positions for tool items + ZIEL
      const hasCm = !!data.cm;
      const toolAreaW = hasCm ? (W - 60) * 0.65 : (W - 60);
      const zielAreaX = hasCm ? 30 + toolAreaW + 16 : 0;

      return (<g>
        <path d={rr(14, tbY, W-28, toolH-4, 14, tbRng, 3.5)} fill="#fff" stroke={pal.p} strokeWidth="2.2" />
        {/* Title label centered */}
        <path d={rr(W/2-130, tbY-16, 260, 30, 8, tbRng, 2.5)} fill={pal.bg} stroke={pal.p} strokeWidth="1.8" />
        <text x={W/2} y={tbY+5} textAnchor="middle" fontFamily="Caveat" fontSize="18" fontWeight="700" fill={pal.p}>
          {data.footer?.title || 'MEIN WERKZEUGKASTEN'}
        </text>

        {/* Tool sections */}
        {toolItems.length > 0 && toolItems.map((sec, i) => {
          const tw = toolAreaW / Math.max(toolItems.length, 1);
          const tx = 30 + i * tw + tw / 2;
          const ty = tbY + 24;
          const col2 = gc(pal, sec.color);
          return (<g key={`t${i}`}>
            {Ic(sec.sym, tx-18, ty, 38, col2)}
            <text x={tx} y={ty+52} textAnchor="middle" fontFamily="Caveat" fontSize="15" fontWeight="700" fill={col2}>{(sec.title||'').slice(0,18).toUpperCase()}</text>
            {(sec.items||[]).slice(0,1).map((item,j) => (
              <text key={j} x={tx} y={ty+68+j*14} textAnchor="middle" fontFamily="Patrick Hand" fontSize="12.5" fill={pal.t} opacity="0.65">{item.length>22 ? item.slice(0,20)+'…' : item}</text>
            ))}
          </g>);
        })}

        {/* Footer items as icons (if no tool sections) */}
        {toolItems.length === 0 && footerItems.length > 0 && footerItems.map((item, i) => {
          const fw = toolAreaW / Math.max(footerItems.length, 1);
          const fx = 30 + i * fw + fw / 2;
          const fy = tbY + 28;
          const ic = ['target','heart','star','checkmark','flag'];
          return (<g key={`f${i}`}>
            {Ic(ic[i%ic.length], fx-16, fy, 32, pal.p)}
            <text x={fx} y={fy+44} textAnchor="middle" fontFamily="Caveat" fontSize="15" fontWeight="700" fill={pal.p}>{item.length>18 ? item.slice(0,16)+'…' : item}</text>
          </g>);
        })}

        {/* ZIEL box (right side of toolbox) */}
        {hasCm && (<g>
          {Ic('heart', zielAreaX, tbY+20, 24, pal.p)}
          <text x={zielAreaX+30} y={tbY+36} fontFamily="Caveat" fontSize="16" fontWeight="700" fill={pal.p}>ZIEL</text>
          <text x={zielAreaX} y={tbY+56} fontFamily="Patrick Hand" fontSize="13" fill={pal.t} fontStyle="italic">{(data.cm||'').slice(0,40)}</text>
          {data.cm.length > 40 && <text x={zielAreaX} y={tbY+72} fontFamily="Patrick Hand" fontSize="13" fill={pal.t} fontStyle="italic">{data.cm.slice(40,80)}</text>}
        </g>)}
      </g>);
    })()}
  </svg>);
}

/* ═══════════════════════════════════════════
   MAIN WIZARD & UI
   ═══════════════════════════════════════════ */

const bt = (c, f) => ({
  padding: '9px 16px', borderRadius: 10,
  border: f ? 'none' : `2px solid ${c}`,
  background: f ? c : '#fff', color: f ? '#fff' : c,
  fontFamily: 'Caveat,cursive', fontSize: 16, fontWeight: 600,
  cursor: 'pointer', whiteSpace: 'nowrap',
});

function ColorPicker({ value, onChange, label, onClear }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <label style={{ fontFamily: 'Caveat,cursive', fontSize: 14, color: '#888' }}>{label}</label>
      <input type="color" value={value || '#E8584F'} onChange={e => onChange(e.target.value)}
        style={{ width: 36, height: 28, border: '2px solid #e0e0e0', borderRadius: 6, cursor: 'pointer', padding: 0 }} />
      {value && onClear && (
        <button onClick={onClear} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontFamily: 'Patrick Hand,cursive', fontSize: 12 }}>✕ Reset</button>
      )}
    </div>
  );
}

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
  const [frs, setFrs] = useState('free');
  const [ed, setEd] = useState(false);
  const [lang, setLang] = useState('de');
  const [fs, setFs] = useState(false);
  const [baseColor, setBaseColor] = useState(null);
  const [moodKey, setMoodKey] = useState('neutral');
  const fr = useRef(null);
  const t = T[lang] || T.de;

  // Palette recalc on color/mood change
  const recalcPal = (bc, mk) => setPal(resolvePalette(bc, mk));

  const updSec = (idx, f2, v) => { setSn(p => { if (!p) return p; return { ...p, sections: p.sections.map((s, i) => i === idx ? { ...s, [f2]: v } : s) }; }); };
  const updItem = (si, ii, v) => { setSn(p => { if (!p) return p; return { ...p, sections: p.sections.map((s, i) => i === si ? { ...s, items: s.items.map((x, j) => j === ii ? v : x) } : s) }; }); };
  const addItem = (si) => { setSn(p => { if (!p) return p; return { ...p, sections: p.sections.map((s, i) => i === si ? { ...s, items: [...s.items, '...'] } : s) }; }); };
  const delItem = (si, ii) => { setSn(p => { if (!p) return p; return { ...p, sections: p.sections.map((s, i) => i === si ? { ...s, items: s.items.filter((_, j) => j !== ii) } : s) }; }); };
  const updTitle = (v) => { setSn(p => p ? { ...p, title: v } : p); };
  const updSubtitle = (v) => { setSn(p => p ? { ...p, subtitle: v } : p); };
  const updCm = (v) => { setSn(p => p ? { ...p, cm: v } : p); };

  const gen = useCallback(async (a, m, overrideStyle) => {
    setAns(a); setPh('loading'); setErr(null);
    const currentStyle = overrideStyle || rs;
    try {
      const d = await callAPI(a, m, 0, lang, currentStyle);
      const mi2 = t.steps[5].o.indexOf(a.mood);
      const mk = m === 'guided' ? (MOOD_VALS[mi2 >= 0 ? mi2 : 0] || 'neutral') : (d.mood && PAL[d.mood] ? d.mood : 'empathisch');
      setMoodKey(mk);
      setPal(resolvePalette(baseColor, mk));
      setSn(d); setPh('result');
    } catch (e) { console.error(e); setErr(e.message); setPh(m === 'guided' ? 'guided' : 'free'); }
  }, [lang, t, baseColor, rs]);

  // Detect style from wizard answer
  const detectStyle = (styleAnswer) => {
    if (!styleAnswer) return 'structured';
    const s = styleAnswer.toLowerCase();
    if (s.includes('frei') || s.includes('free') || s.includes('свободный')) return 'free';
    if (s.includes('profi') || s.includes('pro') || s.includes('профи') || s.includes('karten') || s.includes('cards') || s.includes('карт')) return 'procards';
    if (s.includes('bild') || s.includes('visual') || s.includes('bold') || s.includes('нагляд')) return 'bildstark';
    return 'structured';
  };

  const langBar = (
    <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 6 }}>
      {[['de', '🇩🇪'], ['en', '🇬🇧'], ['ru', '🇷🇺']].map(([k, fl]) => (
        <button key={k} onClick={() => setLang(k)} style={{ padding: '4px 10px', borderRadius: 8, border: lang === k ? '2px solid #E8584F' : '2px solid transparent', background: lang === k ? '#FFF5F0' : 'transparent', fontSize: 16, cursor: 'pointer' }}>{fl}</button>
      ))}
    </div>
  );
  const hdr = (
    <div style={{ textAlign: 'center', padding: '16px 16px 3px' }}>
      <h1 style={{ fontFamily: 'Caveat,cursive', fontSize: 30, fontWeight: 700, color: '#2D2D2D', margin: 0 }}>✏️ {t.title}</h1>
      <p style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 13, color: '#aaa', marginTop: 2 }}>{t.sub}</p>
      {langBar}
    </div>
  );
  const errBox = err ? (
    <div style={{ maxWidth: 500, margin: '0 auto 8px', padding: '10px 16px', background: '#FFF0F0', border: '2px solid #E8584F', borderRadius: 10, textAlign: 'center', fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#E8584F' }}>
      {err}<button onClick={() => setErr(null)} style={{ marginLeft: 12, background: 'none', border: 'none', color: '#E8584F', cursor: 'pointer', fontSize: 16 }}>x</button>
    </div>
  ) : null;

  /* ─── MODE SELECTION ─── */
  if (ph === 'mode') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg,#FEFCFB,#F5F0EB)' }}>
      <style>{FC}</style>{hdr}
      <div style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
        <h2 style={{ fontFamily: 'Caveat,cursive', fontSize: 25, color: '#2D2D2D', textAlign: 'center', marginBottom: 18 }}>{t.howStart}</h2>

        {/* Base color picker */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16, padding: '10px 14px', background: '#fff', borderRadius: 12, border: '2px solid #e0e0e0' }}>
          <label style={{ fontFamily: 'Caveat,cursive', fontSize: 16, fontWeight: 600, color: '#2D2D2D' }}>{t.baseColor}:</label>
          <input type="color" value={baseColor || '#E8584F'} onChange={e => { setBaseColor(e.target.value); recalcPal(e.target.value, moodKey); }}
            style={{ width: 42, height: 32, border: '2px solid #e0e0e0', borderRadius: 8, cursor: 'pointer', padding: 0 }} />
          {baseColor ? (
            <button onClick={() => { setBaseColor(null); recalcPal(null, moodKey); }} style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 13, color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}>✕ {t.noBaseColor}</button>
          ) : (
            <span style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 13, color: '#aaa' }}>{t.noBaseColor}</span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div onClick={() => { setMode('guided'); setPh('guided'); setStep(0); }} style={{ padding: '16px 18px', borderRadius: 14, border: '2px solid #E8584F', background: '#FEFCFB', cursor: 'pointer' }}>
            <div style={{ fontFamily: 'Caveat,cursive', fontSize: 20, fontWeight: 700, color: '#E8584F' }}>{t.guided}</div>
            <div style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#666' }}>{t.guidedDesc}</div>
          </div>
          <div onClick={() => { setMode('free'); setPh('free'); }} style={{ padding: '16px 18px', borderRadius: 14, border: '2px solid #3B7DD8', background: '#FEFCFB', cursor: 'pointer' }}>
            <div style={{ fontFamily: 'Caveat,cursive', fontSize: 20, fontWeight: 700, color: '#3B7DD8' }}>{t.free}</div>
            <div style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#666' }}>{t.freeDesc}</div>
          </div>
          <div onClick={() => fr.current?.click()} style={{ padding: '16px 18px', borderRadius: 14, border: '2px solid #aaa', background: '#FEFCFB', cursor: 'pointer' }}>
            <div style={{ fontFamily: 'Caveat,cursive', fontSize: 20, fontWeight: 700, color: '#777' }}>{t.load}</div>
            <div style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#666' }}>{t.loadDesc}</div>
          </div>
        </div>
        <input ref={fr} type="file" accept=".json" style={{ display: 'none' }} onChange={e => {
          const f = e.target.files?.[0]; if (!f) return;
          const r2 = new FileReader();
          r2.onload = ev => {
            try {
              const p = JSON.parse(ev.target.result);
              if (!p || !p.answers) return;
              setAns(p.answers); setMode(p.mode || 'guided'); setRs(p.rs || 'structured');
              if (p.baseColor) { setBaseColor(p.baseColor); }
              if (p.data) { setSn(vd(p.data)); setPal(resolvePalette(p.baseColor || null, p.data.mood || 'neutral')); setMoodKey(p.data.mood || 'neutral'); setPh('result'); }
              else setPh(p.mode || 'guided');
            } catch (e2) { alert('!'); }
          }; r2.readAsText(f);
        }} />
      </div>
    </div>
  );

  /* ─── GUIDED WIZARD ─── */
  if (ph === 'guided') {
    const steps = t.steps; const c = steps[step]; const isText = !c.o;
    const ok = c.id === 'extras' || (ans[c.id] && ans[c.id].trim());
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg,#FEFCFB,#F5F0EB)' }}>
        <style>{FC}</style>{hdr}{errBox}
        <div style={{ maxWidth: 540, margin: '0 auto', padding: 20 }}>
          <div style={{ display: 'flex', gap: 5, marginBottom: 22 }}>{steps.map((_, i) => (<div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= step ? '#E8584F' : '#e0e0e0' }} />))}</div>
          <div style={{ fontFamily: 'Caveat,cursive', fontSize: 13, color: '#E8584F', fontWeight: 600 }}>{t.step} {step + 1}/{steps.length}</div>
          <h2 style={{ fontFamily: 'Caveat,cursive', fontSize: 24, fontWeight: 700, color: '#2D2D2D', marginBottom: 14 }}>{c.q}</h2>
          {isText ? (
            <textarea value={ans[c.id] || ''} onChange={e => setAns(a => ({ ...a, [c.id]: e.target.value }))} placeholder={c.ph || ''} style={{ width: '100%', minHeight: 95, padding: 13, borderRadius: 12, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 15, resize: 'vertical', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>{c.o.map(o => (
              <button key={o} onClick={() => setAns(a => ({ ...a, [c.id]: o }))} style={{ padding: '10px 15px', borderRadius: 12, textAlign: 'left', fontFamily: 'Patrick Hand,cursive', fontSize: 15, cursor: 'pointer', border: ans[c.id] === o ? '2px solid #E8584F' : '2px solid #e0e0e0', background: ans[c.id] === o ? '#FFF5F0' : '#FAFAFA', color: '#2D2D2D' }}>{o}</button>
            ))}</div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button onClick={() => step > 0 ? setStep(s => s - 1) : setPh('mode')} style={bt('#888', false)}>{step > 0 ? t.back : t.modeSel}</button>
            <button onClick={() => {
              if (step < steps.length - 1) setStep(s => s + 1);
              else {
                const sv = ans.style || '';
                const detectedStyle = detectStyle(sv);
                setRs(detectedStyle);
                gen(ans, 'guided', detectedStyle);
              }
            }} disabled={!ok} style={{ ...bt(ok ? '#E8584F' : '#ccc', true), fontSize: 18 }}>{step < steps.length - 1 ? t.next : t.create}</button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── FREE MODE ─── */
  if (ph === 'free') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg,#FEFCFB,#F5F0EB)' }}>
      <style>{FC}</style>{hdr}{errBox}
      <div style={{ maxWidth: 560, margin: '0 auto', padding: 20 }}>
        <h2 style={{ fontFamily: 'Caveat,cursive', fontSize: 24, fontWeight: 700, color: '#2D2D2D', marginBottom: 5 }}>{t.freeTitle}</h2>
        <p style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: '#888', marginBottom: 12 }}>{t.freeHint}</p>
        <textarea value={ft} onChange={e => setFt(e.target.value)} placeholder={t.freePh} style={{ width: '100%', minHeight: 160, padding: 15, borderRadius: 14, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 15, resize: 'vertical', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box', lineHeight: 1.6 }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          {[['structured', t.structured], ['free', t.freeSketch], ['procards', t.proCards], ['bildstark', t.bildstark]].map(([k, la]) => (
            <button key={k} onClick={() => setFrs(k)} style={{ flex: 1, minWidth: 100, padding: 10, borderRadius: 10, border: frs === k ? '2px solid #3B7DD8' : '2px solid #e0e0e0', background: frs === k ? '#F0F4FF' : '#FAFAFA', fontFamily: 'Caveat,cursive', fontSize: 15, cursor: 'pointer', color: '#2D2D2D' }}>{la}</button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          <button onClick={() => setPh('mode')} style={bt('#888', false)}>{t.modeSel}</button>
          <button onClick={() => { if (!ft.trim()) return; setRs(frs); gen({ freetext: ft }, 'free', frs); }} disabled={!ft.trim()} style={{ ...bt(ft.trim() ? '#3B7DD8' : '#ccc', true), fontSize: 18 }}>{t.create}</button>
        </div>
      </div>
    </div>
  );

  /* ─── LOADING ─── */
  if (ph === 'loading') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg,#FEFCFB,#F5F0EB)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <style>{FC}</style>
      <div style={{ width: 46, height: 46, border: '4px solid #f0e0e0', borderTop: '4px solid #E8584F', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <div style={{ fontFamily: 'Caveat,cursive', fontSize: 20, color: '#E8584F', fontWeight: 600 }}>{t.loading}</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  /* ─── RESULT ─── */
  if (ph === 'result' && sn) {
    let svg;
    try {
      if (rs === 'bildstark') svg = <BildstarkSVG data={sn} pal={pal} />;
      else if (rs === 'procards') svg = <ProCardSVG data={sn} pal={pal} />;
      else if (rs === 'free') svg = <FreeSVG data={sn} pal={pal} />;
      else svg = <StructSVG data={sn} pal={pal} />;
    } catch (e) { svg = <div style={{ padding: 20, color: '#E8584F' }}>Error: {e.message}</div>; }

    const eS = { width: '100%', padding: '8px 10px', borderRadius: 8, border: '2px solid #e0e0e0', fontFamily: 'Patrick Hand,cursive', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#FAFAFA' };

    // Style switch buttons (individual, showing active)
    const styleButtons = [
      ['structured', t.boxes || '📦'],
      ['free', t.freeL || '🎨'],
      ['procards', t.proL || '🃏'],
      ['bildstark', t.bildL || '🖼️'],
    ];

    if (fs) return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#fff', zIndex: 9999, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <style>{FC}</style>
        <button onClick={() => setFs(false)} style={{ position: 'fixed', top: 12, right: 12, zIndex: 10000, ...bt('#E8584F', true), fontSize: 18 }}>{t.exitFs}</button>
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
          <div style={{ width: '100%', maxWidth: 1200, touchAction: 'pinch-zoom' }}>{svg}</div>
        </div>
      </div>
    );

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg,#FEFCFB,#F5F0EB)' }}>
        <style>{FC}</style>{hdr}
        <div style={{ padding: 14 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => { setPh('mode'); setMode(null); setAns({}); setSn(null); setErr(null); setEd(false); }} style={bt('#888', false)}>{t.neu}</button>
            <button onClick={() => gen(ans, mode)} style={bt('#E8584F', false)}>{t.reroll}</button>
            <button onClick={() => setEd(e2 => !e2)} style={bt(ed ? '#E8584F' : '#7B68AE', ed)}>{ed ? t.done : t.edit}</button>
          </div>
          {/* Style switcher row */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 10, justifyContent: 'center' }}>
            {styleButtons.map(([k, label]) => (
              <button key={k} onClick={() => setRs(k)} style={{ padding: '5px 12px', borderRadius: 8, border: rs === k ? `2px solid #3B7DD8` : '2px solid #ddd', background: rs === k ? '#E8F0FE' : '#fff', fontFamily: 'Caveat,cursive', fontSize: 14, fontWeight: rs === k ? 700 : 400, cursor: 'pointer', color: rs === k ? '#3B7DD8' : '#888' }}>{label}</button>
            ))}
            <span style={{ borderLeft: '1px solid #ddd', margin: '0 4px' }} />
            <button onClick={() => setFs(true)} style={bt('#555', false)}>{t.fullscreen}</button>
            <button onClick={() => dlS(sn.title)} style={bt('#2E86AB', false)}>SVG</button>
            <button onClick={() => dlP(sn.title, pal)} style={bt('#4CAF50', false)}>PNG</button>
            <button onClick={() => dlJ(ans, sn, mode, rs, baseColor)} style={bt('#F5A623', false)}>{t.save}</button>
          </div>
          <div style={{ maxWidth: 1100, margin: '0 auto', boxShadow: '0 6px 28px rgba(0,0,0,.1)', borderRadius: 12, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>{svg}</div>

          {/* ─── EDIT PANEL ─── */}
          {ed && (
            <div style={{ maxWidth: 800, margin: '20px auto', padding: 20, background: '#fff', borderRadius: 14, border: '2px solid #e0e0e0' }}>
              <h3 style={{ fontFamily: 'Caveat,cursive', fontSize: 22, color: '#2D2D2D', marginBottom: 12 }}>{t.editTitle}</h3>

              {/* Color picker in edit panel */}
              <div style={{ display: 'flex', gap: 14, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <ColorPicker
                  value={baseColor}
                  onChange={c2 => { setBaseColor(c2); recalcPal(c2, moodKey); }}
                  label={t.colorLabel}
                  onClear={() => { setBaseColor(null); recalcPal(null, moodKey); }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 2, minWidth: 150 }}><label style={{ fontFamily: 'Caveat,cursive', fontSize: 14, color: '#888' }}>{t.titleL}</label><input value={sn.title} onChange={e => updTitle(e.target.value)} style={eS} /></div>
                <div style={{ flex: 3, minWidth: 200 }}><label style={{ fontFamily: 'Caveat,cursive', fontSize: 14, color: '#888' }}>{t.subtitleL}</label><input value={sn.subtitle || ''} onChange={e => updSubtitle(e.target.value)} style={eS} /></div>
              </div>
              <div style={{ marginBottom: 16 }}><label style={{ fontFamily: 'Caveat,cursive', fontSize: 14, color: '#888' }}>{t.centralL}</label><input value={sn.cm || ''} onChange={e => updCm(e.target.value)} style={eS} /></div>
              {sn.sections.map((sec, si) => (
                <div key={si} style={{ marginBottom: 14, padding: 12, borderRadius: 10, border: '2px solid #eee', background: '#fafafa' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'Caveat,cursive', fontSize: 16, fontWeight: 700, color: gc(pal, sec.color), minWidth: 24 }}>{sec.n}.</span>
                    <input value={sec.title} onChange={e => updSec(si, 'title', e.target.value)} style={{ ...eS, flex: 1, minWidth: 120, fontWeight: 600 }} />
                    <select value={sec.scene || ''} onChange={e => updSec(si, 'scene', e.target.value || null)} style={{ ...eS, width: 130, flex: 'none' }}><option value="">{t.noScene}</option>{SCENE_NAMES.map(s2 => (<option key={s2} value={s2}>{s2}</option>))}</select>
                    <select value={sec.color} onChange={e => updSec(si, 'color', e.target.value)} style={{ ...eS, width: 95, flex: 'none' }}><option value="primary">{t.primary}</option><option value="secondary">{t.secondary}</option><option value="accent">{t.accent}</option></select>
                  </div>
                  {sec.items.map((item, ii) => (
                    <div key={ii} style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'center', paddingLeft: 32 }}>
                      <span style={{ color: gc(pal, sec.color), fontSize: 18 }}>*</span>
                      <input value={item} onChange={e => updItem(si, ii, e.target.value)} style={{ ...eS, flex: 1 }} />
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

  return (
    <div style={{ minHeight: '100vh', background: '#FEFCFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{FC}</style>
      <button onClick={() => setPh('mode')} style={bt('#E8584F', true)}>Start</button>
    </div>
  );
}
