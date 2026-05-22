// api.js — Anthropic API call via Cloudflare proxy, with Bildstark-specific prompt
import { SCENE_NAMES } from './scenes.jsx';
import { ICON_NAMES } from './icons.jsx';
import { MOOD_VALS } from './palettes.js';
import { T } from './translations.js';
import { vd } from './validate.js';

export async function callAPI(answers, mode, attempt = 0, lang = 'de', style = 'structured') {
  const scL = SCENE_NAMES.join(',');
  const syL = ICON_NAMES.join(',');
  const tLang = T[lang]?.apiLang || 'Deutsch';
  const tl = T[lang] || T.de;

  const sceneGuide = 'mountainClimb=Herausforderung,targetHit=Ziel,bridge=Verbindung,seedToTree=Wachstum,lighthouse=Orientierung,teamCircle=Teamwork,ladder=Aufstieg,compass=Richtung,figureThinking=Reflexion,figureCelebrate=Erfolg,doorOpen=Neuanfang,puzzleFit=Zusammenhang,figureHandshake=Vereinbarung/Kennenlernen,figureConversation=Dialog/Austausch,figureListening=Zuhören/Empathie,figureHug=Nähe/Trost,figureFear=Angst/Hemmung,figureDoubt=Zweifel/Entscheidung,figureBalance=Balance/Gleichgewicht,figureCourage=Mut/Durchbruch,windingRoad=Lebensweg/Prozess,mirrorReflect=Selbstreflexion,scaleBalance=Abwägen,networkNodes=Netzwerk/Vernetzung,treasure=Schatz/Potenzial,wallBreak=Durchbruch/Überwindung';

  const isBildstark = style === 'bildstark';

  const base = isBildstark
    ? `Sketchnote-Designer für BILDSTARKE, KINDGERECHTE Visualisierung. NUR reines JSON antworten. Keine Backticks.
Szenen:${scL}
Szenen-Guide:${sceneGuide}
Symbole:${syL}
JSON:{"title":"..","subtitle":"..","orientation":"landscape","mood":"optimistisch","centralMessage":"..max40Z","layout":{"columns":4},"sections":[{"number":1,"title":"..","scene":"name","symbol":"name","color":"primary","items":["max12Z","max12Z"]}],"footer":{"title":"SO GEHT'S","items":["Schritt1","Schritt2","Schritt3","Schritt4"]}}
WICHTIG FÜR BILDSTARK-STIL:
- Zielgruppe: Kinder ab 10 Jahre, einfachste Sprache!
- JEDER item max 12 Zeichen (1-3 Wörter)! z.B. "Mut haben", "Ziel setzen", "Team bilden"
- JEDE Sektion MUSS eine scene haben! Keine ohne scene!
- Titel max 16 Zeichen, sehr kurz und klar
- 6-9 Sektionen, je 2-3 Stichpunkte (ultrakurz!)
- centralMessage: Einfacher Satz, den ein Kind versteht
- footer.items: 3-4 Prozessschritte als Verben (z.B. "Verstehen","Vereinfachen","Zeichnen","Teilen")
- Nutze bildstarke Szenen! Jede Sektion ein anderes Bild!
- Denke in visuellen Metaphern, nicht in Text
Alle Texte in ${tLang}!`
    : `Sketchnote-Designer, Bikablo-Stil. NUR reines JSON antworten. Keine Backticks, kein Text.
Szenen:${scL}
Szenen-Guide:${sceneGuide}
Symbole:${syL}
JSON:{"title":"..","subtitle":"..","orientation":"landscape","mood":"optimistisch","centralMessage":"..","layout":{"columns":3},"sections":[{"number":1,"title":"..","scene":"name|null","symbol":"name","color":"primary","items":["..max28Z"]}],"footer":{"title":"FAZIT","items":[".."]}}
Erste 4-5 Sektionen=Hauptstory,Rest=Werkzeugkasten. 7-9 Sektionen,2-3 kurze Stichpunkte(max 28Z!),Titel max 22Z,mind.5 mit scene,Nutze vielfältige Szenen!
WICHTIG: Alle Texte in ${tLang} schreiben!`;

  let sys, usr;
  if (mode === 'guided') {
    const mi = tl.steps[5].o.indexOf(answers.mood);
    const mk = MOOD_VALS[mi >= 0 ? mi : 0] || 'neutral';
    const oi = tl.steps[6].o.indexOf(answers.orientation);
    const ORIENT_VALS2 = ['landscape', 'portrait', 'auto'];
    const or2 = ORIENT_VALS2[oi >= 0 ? oi : 0] || 'landscape';
    sys = base + ` Stimmung:${mk} Struktur:${answers.structure} Kontext:${answers.context} Orient:${or2 === 'auto' ? 'wähle' : or2}`;
    usr = `THEMA:${answers.topic} ZIEL:${answers.goal || ''} EXTRA:${answers.extras || ''} JSON:`;
  } else {
    sys = base + (isBildstark ? ' Freie Beschreibung. Leite alles ab. Halte es EXTREM einfach und bildhaft!' : ' Freie Beschreibung.Leite alles ab.');
    usr = `BESCHREIBUNG:${answers.freetext} JSON:`;
  }

  const apiUrl = import.meta.env.VITE_API_URL || '/api/generate';
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: sys,
      messages: [{ role: 'user', content: usr }],
    }),
  });

  if (res.status === 429 && attempt < 2) {
    await new Promise(r => setTimeout(r, (attempt + 1) * 15000));
    return callAPI(answers, mode, attempt + 1, lang, style);
  }
  if (!res.ok) throw new Error(res.status === 429
    ? 'Rate-Limit erreicht. Bitte 30s warten und erneut versuchen.'
    : `API-Fehler ${res.status}`);

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const text = (data.content || []).map(b => b.text || '').join('');
  if (!text.trim()) throw new Error('Leer');

  const cl = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  let p;
  try { p = JSON.parse(cl); }
  catch (e) {
    const mt = cl.match(/\{[\s\S]*\}/);
    if (mt) p = JSON.parse(mt[0]);
    else throw new Error('JSON-Fehler');
  }
  return vd(p);
}
