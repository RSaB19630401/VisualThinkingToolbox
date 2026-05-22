# ✏️ Sketchnote Visualizer

Bikablo-Stil Sketchnote-Generator mit KI. Erstellt aus Textbeschreibungen visuelle Sketchnotes mit Strichmännchen, Szenen-Illustrationen und visuellen Metaphern.

## Features

- **Geführter Modus** – Schritt-für-Schritt-Wizard
- **Freier Modus** – KI erkennt Struktur, Stimmung und Szenen automatisch
- **Drei Darstellungsstile** – Strukturiert (Kästchen), Freie Skizze (Story-Flow), Profi-Karten (Banner + Cards)
- **Farbsteuerung** – Grundfarbe vor Generierung wählen + Color-Picker im Edit-Panel
- **26 Bikablo-Szenen** – Berg, Zielscheibe, Brücke, Leuchtturm, Strichmännchen...
- **23 Icons** – Idee, Herz, Stern, Checkmark, Rakete...
- **5 Stimmungs-Paletten** – Farben passen sich dem Inhalt an
- **Export** – SVG, PNG, Projekt-JSON (speichern & laden)
- **3 Sprachen** – Deutsch, Englisch, Russisch

## Architektur (modular)

```
├── index.html
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Router wrapper
│   ├── SketchnoteTool.jsx    # Wizard + 3 SVG-Renderer + Edit-Panel
│   ├── primitives.js         # SVG-Zeichenhilfen (RNG, Rounded Rect, Lines)
│   ├── scenes.js             # 26 Bikablo-Szenen-Illustrationen
│   ├── icons.js              # 23 kleine Inline-Icons
│   ├── palettes.js           # Farbpaletten + Grundfarben-Ableitung
│   ├── translations.js       # DE/EN/RU Übersetzungen
│   ├── api.js                # Anthropic API-Aufruf
│   ├── downloads.js          # SVG/PNG/JSON Export
│   └── validate.js           # API-Response-Validierung
├── functions/
│   └── api/
│       └── generate.js       # Cloudflare Pages Function (API-Proxy)
├── worker.js                 # Cloudflare Worker (standalone)
├── package.json
├── vite.config.js
└── README.md
```

## Darstellungsstile

### 📦 Strukturiert (Kästchen)
Grid-Layout mit nummerierten Boxen, Pfeile zwischen Sektionen, klassische Sketchnote-Optik.

### 🎨 Freie Skizze (Story-Flow)
Horizontaler Erzählfluss, große Szenen-Illustrationen, Werkzeugkasten-Footer.

### 🃏 Profi-Karten (NEU)
Ribbon-Banner-Titel, Karten-Container mit farbigen Titelleisten, große Illustrationen, Checkmark-Bullets, gestrichelte Ziel-Box mit Herz-Icon. Inspiriert vom Bikablo-Profi-Stil.

## Farbsteuerung

- **Vor der Generierung:** Grundfarbe per Color-Picker wählen (optional)
- **Grundfarbe + Stimmung:** Die Grundfarbe ersetzt die Primärfarbe; Stimmung beeinflusst Sekundär-/Akzentfarben und Hintergrund
- **Im Edit-Panel:** Color-Picker zum nachträglichen Ändern der Grundfarbe
- **Ohne Grundfarbe:** Standard-Stimmungspalette wird verwendet

## Deployment: GitHub + Cloudflare Pages

1. `git push` → Cloudflare Pages baut automatisch
2. **Build command:** `npm run build`
3. **Build output:** `dist`
4. **Environment variable:** `ANTHROPIC_API_KEY` als Secret setzen

## Lokale Entwicklung

```
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .dev.vars
npx wrangler pages dev -- npm run dev
```

## Kosten

- **Cloudflare Pages:** Kostenlos (100.000 Requests/Monat)
- **Anthropic API:** Pay-per-use (~$0.003-0.015 pro Sketchnote)

## Lizenz

MIT
