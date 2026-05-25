# 🎨 Visual Thinking Toolbox

KI-gestützte visuelle Denkwerkzeuge. Erstellt aus Textbeschreibungen Sketchnotes, Mind Maps, Vergleichsbilder und Wertequadrate.

## 4 Werkzeuge

### ✏️ Sketchnote Visualizer
4 Darstellungsstile: Strukturiert, Freie Skizze, Profi-Karten, Bildstark. Bikablo-Szenen und Icons, geführter Wizard oder freie Eingabe.

### 🧠 Mind Map
Zentrales Thema → KI generiert Äste + Unteräste → radialer SVG-Baum → manuell bearbeitbar.

### ⚖️ Vergleichsbild
4 Layouts wählbar: 2 Spalten, 3 Spalten, 4 Spalten, Venn-Diagramm. KI füllt Inhalte, danach editierbar.

### ◈ Wertequadrat
Nach Schulz von Thun. 3 Varianten: Klassisch (2×2), mit Dialektik-Pfeilen, Einfach + Leitfrage.

## Features

- **Farbpalette-Karten** — 8 Stimmungspaletten ("Warm & Mutig", "Ruhig & Klar" etc.) + eigene Farbe
- **Grundfarbe initial wählbar**, später änderbar, stimmungsbasierte Vorschläge
- **Tool-Auswahl als Startseite** mit Kacheln
- **KI-Generierung + manuelle Bearbeitung** bei allen Tools
- **Export** — SVG, PNG, Projekt-JSON
- **3 Sprachen** — DE, EN, RU

## Architektur

```
src/
├── main.jsx              # Entry
├── App.jsx               # Router + Landing Page + shared state
├── ColorChooser.jsx      # Palette-Karten-Selector
├── SketchnoteTool.jsx    # Sketchnote (4 Stile)
├── MindMapTool.jsx       # Mind Map
├── ComparisonTool.jsx    # Vergleichsbild (4 Layouts)
├── ValuesSquareTool.jsx  # Wertequadrat (3 Varianten)
├── primitives.js         # SVG-Zeichenhilfen
├── scenes.jsx            # 26 Bikablo-Szenen
├── icons.jsx             # 23 Icons
├── palettes.js           # Paletten + Palette-Cards + Farbableitung
├── translations.js       # DE/EN/RU
├── api.js                # API-Aufrufe für alle 4 Tools
├── downloads.js          # SVG/PNG/JSON Export
└── validate.js           # Response-Validierung
```

## Deployment

```
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .dev.vars
npx wrangler pages dev -- npm run dev
```

Cloudflare Pages: `npm run build` → `dist`
