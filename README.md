# 🎨 Visual Thinking Toolbox

KI-gestützte Visual Thinking Tools — modular aufgebaut, erweiterbar.

## Modulare Struktur

```
src/
├── App.jsx              ← Tool-Router (Hub/Startseite)
├── SketchnoteTool.jsx   ← Sketchnote Generator (Haupttool)
├── primitives.js        ← SVG-Zeichenhelfer (hand-drawn Stil)
├── scenes.js            ← 26 Bikablo-Szenen
├── icons.js             ← 23 Icon-Symbole
├── palettes.js          ← 5 Stimmungs-Farbpaletten
├── translations.js      ← i18n (DE/EN/RU)
├── api.js               ← Claude API-Kommunikation
├── downloads.js         ← SVG/PNG/JSON-Export
├── validate.js          ← Datenvalidierung
└── main.jsx             ← React Entry Point
```

## Features (v2.0)

- ✅ KI-generierte Bikablo-Sketchnotes (Claude API)
- ✅ 26 Szenen + 23 Icons
- ✅ Zwei Layouts: Kästchen (Strukturiert) + Freie Skizze
- ✅ Geführter Wizard + Freier Modus
- ✅ Inline-Bearbeitung + Neu würfeln
- ✅ 3 Sprachen (DE/EN/RU)
- ✅ Mobilansicht mit Vollbild
- ✅ SVG/PNG/JSON Export
- ✅ Tool-Router für zukünftige Tools

## Geplante Tools

- 🔲 Mind-Map
- 🔲 Vorher/Nachher-Vergleich
- 🔲 Wertequadrat
- 🔲 Dark Mode + Sharing

## Setup

```bash
npm install
npm run dev        # Lokaler Dev-Server (Port 3000)
npm run build      # Production Build
```

## Deployment (Cloudflare Pages)

1. **Cloudflare Dashboard** → Workers & Pages → Create → Pages
2. **Connect to Git** → GitHub-Repo `VisualThinkingToolbox` auswählen
3. **Build-Einstellungen:**
   - Framework preset: `None`
   - Build command: `npm run build`
   - Build output directory: `dist`
4. **Environment Variables** (Settings → Environment Variables):
   - `ANTHROPIC_API_KEY` = dein Claude API Key
   - `NODE_VERSION` = `18`
5. **Deploy** — fertig! Jeder Push auf `main` deployt automatisch.

Die Datei `functions/api/generate.js` wird automatisch als serverless Function unter `/api/generate` bereitgestellt.

## Neues Tool hinzufügen

1. Erstelle `src/MeinTool.jsx` mit `export default function MeinTool()`
2. In `App.jsx` → `TOOLS`-Array ergänzen:
   ```js
   { id: 'meintool', name: 'Mein Tool', desc: '...', icon: '🔧', color: '#E8584F', ready: true, component: MeinTool }
   ```
3. Fertig — erscheint automatisch auf der Startseite.
