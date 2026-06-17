// api.js — API calls for all tools: Sketchnote, Mind Map, Comparison, Values Square
import { SCENE_NAMES } from './scenes.jsx';
import { ICON_NAMES } from './icons.jsx';
import { MOOD_VALS } from './palettes.js';
import { T } from './translations.js';
import { vd } from './validate.js';

async function apiCall(sys, usr, attempt = 0) {
  const apiUrl = import.meta.env.VITE_API_URL || '/api/generate';
  const res = await fetch(apiUrl, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 2000, system: sys, messages: [{ role: 'user', content: usr }] }),
  });
  if (res.status === 429 && attempt < 2) {
    await new Promise(r => setTimeout(r, (attempt + 1) * 15000));
    return apiCall(sys, usr, attempt + 1);
  }
  if (!res.ok) throw new Error(res.status === 429 ? 'Rate-Limit erreicht. Bitte kurz warten.' : `API-Fehler ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const text = (data.content || []).map(b => b.text || '').join('');
  if (!text.trim()) {
    if (attempt < 1) return apiCall(sys, usr, attempt + 1);
    throw new Error('Leere Antwort der KI');
  }
  const cl = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  try { return JSON.parse(cl); }
  catch (e) {
    const mt = cl.match(/\{[\s\S]*\}/);
    if (mt) { try { return JSON.parse(mt[0]); } catch (e2) { /* fall through to retry */ } }
    // Parse-Retry: KI liefert gelegentlich kaputtes JSON → einmal neu versuchen
    if (attempt < 1) return apiCall(sys, usr, attempt + 1);
    throw new Error('KI lieferte ungültiges JSON. Bitte erneut versuchen.');
  }
}

// ── SKETCHNOTE ──
export async function callAPI(answers, mode, attempt = 0, lang = 'de', style = 'structured') {
  const scL = SCENE_NAMES.join(','), syL = ICON_NAMES.join(',');
  const tLang = T[lang]?.apiLang || 'Deutsch';
  const tl = T[lang] || T.de;
  const sceneGuide = 'mountainClimb=Herausforderung,targetHit=Ziel,bridge=Verbindung,seedToTree=Wachstum,lighthouse=Orientierung,teamCircle=Teamwork,ladder=Aufstieg,compass=Richtung,figureThinking=Reflexion,figureCelebrate=Erfolg,doorOpen=Neuanfang,puzzleFit=Zusammenhang,figureHandshake=Vereinbarung,figureConversation=Dialog,figureListening=Zuhören,figureHug=Nähe,figureFear=Angst,figureDoubt=Zweifel,figureBalance=Balance,figureCourage=Mut,windingRoad=Lebensweg,mirrorReflect=Selbstreflexion,scaleBalance=Abwägen,networkNodes=Netzwerk,treasure=Potenzial,wallBreak=Durchbruch';
  const isBs = style === 'bildstark';
  const base = isBs
    ? `Sketchnote-Designer BILDSTARK. NUR JSON. Szenen:${scL} Symbole:${syL}\nJSON:{"title":"..","subtitle":"..","orientation":"landscape","mood":"optimistisch","centralMessage":"..max40Z","layout":{"columns":4},"sections":[{"number":1,"title":"..","scene":"name","symbol":"name","color":"primary","items":["max12Z"]}],"footer":{"title":"SO GEHT'S","items":["Schritt1","Schritt2"]}}\nJEDE section MUSS scene haben! Items max 12Z, Titel max 16Z, 6-9 Sektionen, einfachste Sprache für Kinder. Alle Texte ${tLang}!`
    : `Sketchnote-Designer Bikablo. NUR JSON. Szenen:${scL} Guide:${sceneGuide} Symbole:${syL}\nJSON:{"title":"..","subtitle":"..","orientation":"landscape","mood":"optimistisch","centralMessage":"..","layout":{"columns":3},"sections":[{"number":1,"title":"..","scene":"name|null","symbol":"name","color":"primary","items":["..max28Z"]}],"footer":{"title":"FAZIT","items":[".."]}}\n7-9 Sektionen,2-3 Punkte(max 28Z!),mind.5 mit scene. Alle Texte ${tLang}!`;
  let sys, usr;
  if (mode === 'guided') {
    const mi = tl.steps[5].o.indexOf(answers.mood);
    const mk = MOOD_VALS[mi >= 0 ? mi : 0] || 'neutral';
    const oi = tl.steps[6].o.indexOf(answers.orientation);
    const or2 = ['landscape','portrait','auto'][oi >= 0 ? oi : 0] || 'landscape';
    sys = base + ` Stimmung:${mk} Struktur:${answers.structure} Kontext:${answers.context} Orient:${or2==='auto'?'wähle':or2}`;
    usr = `THEMA:${answers.topic} ZIEL:${answers.goal||''} EXTRA:${answers.extras||''} JSON:`;
  } else {
    sys = base + ' Freie Beschreibung. Leite alles ab.';
    usr = `BESCHREIBUNG:${answers.freetext} JSON:`;
  }
  const raw = await apiCall(sys, usr, attempt);
  return vd(raw);
}

// ── MIND MAP ──
export async function callMindMapAPI(topic, lang = 'de') {
  const tLang = { de: 'Deutsch', en: 'English', ru: 'Russisch' }[lang] || 'Deutsch';
  const sys = `Mind-Map-Designer. NUR reines JSON. Erstelle eine Mind Map zum Thema.
JSON: {"title":"Zentrales Thema","branches":[{"label":"Ast-Name","color":"primary|secondary|accent","children":["Unter1","Unter2","Unter3"]}]}
Regeln: 4-7 Hauptäste, je 2-4 Unteräste. Kurze Begriffe (max 20 Zeichen). Alle Texte in ${tLang}!`;
  const usr = `THEMA: ${topic} JSON:`;
  return await apiCall(sys, usr);
}

// ── COMPARISON / VERGLEICHSBILD ──
export async function callComparisonAPI(topic, layout, lang = 'de') {
  const tLang = { de: 'Deutsch', en: 'English', ru: 'Russisch' }[lang] || 'Deutsch';
  const isVenn = layout.startsWith('venn');
  const vennCount = isVenn ? parseInt(layout.replace('venn', '')) || 2 : 0;
  const colCount = layout === '3col' ? 3 : layout === '4col' ? 4 : isVenn ? vennCount : 2;
  const layoutHint = isVenn ? `Venn-Diagramm mit ${vennCount} Kreisen und Überschneidungen` : `${colCount} Spalten nebeneinander`;
  const sharedHint = isVenn ? ',"shared":["Gemeinsamkeit1","Gemeinsamkeit2"]' : '';
  const sys = `Vergleichsbild-Designer. NUR reines JSON. Layout: ${layoutHint}.
JSON: {"title":"Vergleichstitel","subtitle":"..","columns":[${Array.from({length: colCount}, (_, i) => `{"label":"Gruppe ${String.fromCharCode(65+i)}","icon":"star","color":"${['primary','secondary','accent','primary'][i]}","items":["Punkt1","Punkt2","Punkt3"]}`).join(',')}]${sharedHint},"conclusion":"Fazit-Satz"}
Icons: idea,heart,star,checkmark,target,flag,rocket,clock,growth,person,shield,key,brain,eye,thumbsUp
Regeln: Genau ${colCount} columns! Items max 25 Zeichen, Labels max 18 Zeichen. Alle Texte in ${tLang}!`;
  const usr = `THEMA: ${topic} JSON:`;
  return await apiCall(sys, usr);
}

// ── VALUES SQUARE / WERTEQUADRAT ──
export async function callValuesSquareAPI(topic, variant, lang = 'de') {
  const tLang = { de: 'Deutsch', en: 'English', ru: 'Russisch' }[lang] || 'Deutsch';
  const varHint = variant === 'dialectic' ? 'Mit Dialektik-Pfeilen zwischen Über- und Untertreibung' : variant === 'simple' ? 'Einfach: 4 Felder + zentrale Frage' : 'Klassisch 2x2 mit positiven Werten oben, Übertreibungen unten';
  const sys = `Wertequadrat-Designer nach Friedemann Schulz von Thun. NUR reines JSON. Variante: ${varHint}.
JSON: {"title":"Wertequadrat: Thema","centralQuestion":"Leitfrage?","quadrants":[{"position":"topLeft","label":"Positiver Wert A","description":"Kurze Erklärung","color":"primary"},{"position":"topRight","label":"Positiver Wert B","description":"Kurze Erklärung","color":"secondary"},{"position":"bottomLeft","label":"Übertreibung A","description":"Kurze Erklärung","color":"accent"},{"position":"bottomRight","label":"Übertreibung B","description":"Kurze Erklärung","color":"accent"}],"tensions":[{"from":"topLeft","to":"topRight","label":"Ergänzung"},{"from":"topLeft","to":"bottomLeft","label":"Übertreibung"},{"from":"topRight","to":"bottomRight","label":"Übertreibung"},{"from":"bottomLeft","to":"bottomRight","label":"Entwertung"}]}
Regeln: Labels max 20Z, Descriptions max 40Z. Alle Texte in ${tLang}!`;
  const usr = `THEMA: ${topic} JSON:`;
  return await apiCall(sys, usr);
}
