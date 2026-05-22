# ✏️ Sketchnote Visualizer

Bikablo-Stil Sketchnote-Generator mit KI. Erstellt aus Textbeschreibungen visuelle Sketchnotes mit Strichmännchen, Szenen-Illustrationen und visuellen Metaphern.

## Features

- **Geführter Modus** – Schritt-für-Schritt-Wizard
- **Freier Modus** – KI erkennt Struktur, Stimmung und Szenen automatisch
- **Vier Darstellungsstile** – Strukturiert, Freie Skizze, Profi-Karten, Bildstark
- **Farbsteuerung** – Grundfarbe vor Generierung wählen + Color-Picker im Edit-Panel
- **26 Bikablo-Szenen + Bildstark-Illustrationen** – Zwei Illustration-Sets
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
│   ├── SketchnoteTool.jsx    # Wizard + 4 SVG-Renderer + Edit-Panel
│   ├── primitives.js         # SVG-Zeichenhilfen (RNG, Rounded Rect, Lines)
│   ├── scenes.jsx            # 26 Bikablo-Szenen-Illustrationen
│   ├── icons.jsx             # 23 kleine Inline-Icons
│   ├── bildstark-icons.jsx   # Bildstarke Illustrationen (einfach, bold, gefüllt)
│   ├── palettes.js           # Farbpaletten + Grundfarben-Ableitung
│   ├── translations.js       # DE/EN/RU Übersetzungen
│   ├── api.js                # Anthropic API-Aufruf (mit Bildstark-Prompt)
│   ├── downloads.js          # SVG/PNG/JSON Export
│   └── validate.js           # API-Response-Validierung
├── functions/api/generate.js  # Cloudflare Pages Function
├── worker.js                  # Cloudflare Worker
└── ...config files
```

## Vier Darstellungsstile

### 📦 Strukturiert (Kästchen)
Grid-Layout mit nummerierten Boxen, Pfeile zwischen Sektionen.

### 🎨 Freie Skizze (Story-Flow)
Horizontaler Erzählfluss, große Szenen-Illustrationen, Werkzeugkasten-Footer.

### 🃏 Profi-Karten
Ribbon-Banner-Titel, Karten-Container mit farbigen Titelleisten, Checkmark-Bullets, gestrichelte Ziel-Box.

### 🖼️ Bildstark (NEU)
Kindgerechte Visualisierung. Eigener KI-Prompt (max 3 Wörter pro Punkt, jede Karte mit großer Illustration). Grid aus Karten, Prozess-Flow mit Icon-Pfeilen, gestrichelte Ziel-Box. Einfache Sprache, verständlich ab 10 Jahre. Eigenes Illustrationsset (bold, gefüllt, farbig statt Bikablo-Strichstil).

## Farbsteuerung

- **Vor der Generierung:** Grundfarbe per Color-Picker wählen
- **Grundfarbe + Stimmung:** Primärfarbe wird ersetzt; Stimmung beeinflusst Rest
- **Im Edit-Panel:** Color-Picker zum nachträglichen Ändern

## Deployment: GitHub + Cloudflare Pages

1. `git push` → Cloudflare Pages baut automatisch
2. Build command: `npm run build` | Output: `dist`
3. Environment variable: `ANTHROPIC_API_KEY` als Secret setzen

## Lokale Entwicklung

```
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .dev.vars
npx wrangler pages dev -- npm run dev
```
