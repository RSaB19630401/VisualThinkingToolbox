// downloads.js — Export sketchnotes as SVG, PNG, or JSON project files

/** Trigger a browser download from a Blob */
function dlB(b, n) {
  const u = URL.createObjectURL(b);
  const a = Object.assign(document.createElement('a'), { href: u, download: n });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}

/** Slugify a title for filenames */
function sl(t) {
  return (t || 'x').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
}

/** Download the current sketchnote as SVG */
export function dlS(t) {
  const el = document.getElementById('sketchnote-svg');
  if (!el) return;
  const c = el.cloneNode(true);
  c.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  dlB(
    new Blob([new XMLSerializer().serializeToString(c)], { type: 'image/svg+xml' }),
    `sn-${sl(t)}.svg`
  );
}

/** Download the current sketchnote as PNG (2× resolution) */
export function dlP(t, p) {
  const el = document.getElementById('sketchnote-svg');
  if (!el) return;
  const c = el.cloneNode(true);
  c.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const s = new XMLSerializer().serializeToString(c);
  const vb = el.getAttribute('viewBox').split(' ').map(Number);
  const cv = Object.assign(document.createElement('canvas'), { width: vb[2] * 2, height: vb[3] * 2 });
  const ctx = cv.getContext('2d');
  const img = new Image();
  img.onload = () => {
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.drawImage(img, 0, 0, cv.width, cv.height);
    cv.toBlob(b => { if (b) dlB(b, `sn-${sl(t)}.png`); }, 'image/png');
  };
  img.onerror = () => alert('PNG fehler');
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(s)));
}

/** Download the current project state as JSON (for later re-import) */
export function dlJ(a, d, m, r) {
  dlB(
    new Blob([JSON.stringify({ v: 7, mode: m, rs: r, answers: a, data: d, at: new Date().toISOString() }, null, 2)], { type: 'application/json' }),
    `sn-${sl(d?.title)}.json`
  );
}
