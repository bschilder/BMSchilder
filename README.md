# Brian M. Schilder — Personal Website

**Live site:** https://bschilder.github.io/BMSchilder

## Tech Stack

- **Vite 7** + **TypeScript** — build tooling and type safety
- **Vanilla TS** — no framework; each section is a self-contained component
- **PapaParse** — parses CSV data files at runtime
- **Three.js** — 3D brain model viewer (lazy-loaded)
- **HTML5 Canvas** — hero landscape, animated mesh backgrounds
- **GitHub Pages** — deployed via GitHub Actions on push to `master`

## Project Structure

```
BMSchilder/
├── index.html                  # Single-page entry point
├── vite.config.ts              # Vite config with custom CSV data plugin
├── src/
│   ├── main.ts                 # App entry — loads data, inits all components
│   ├── style.css               # Global styles + @imports for component CSS
│   ├── palette.ts              # 8 switchable color palettes (CSS custom properties)
│   ├── components/
│   │   ├── hero.ts/css         # Animated vaporwave landscape (Canvas 2D)
│   │   ├── nav.ts/css          # Fixed nav with scroll-spy + mobile hamburger
│   │   ├── logo.ts             # SVG logo generator (DNA helix + network node)
│   │   ├── about.ts/css        # Bio, metrics, affiliations, CV download
│   │   ├── skills.ts/css       # Skill bars + animated cloud background
│   │   ├── timeline.ts/css     # Center-line timeline with navigator slider
│   │   ├── publications.ts/css # Filterable publication cards with search
│   │   ├── tools.ts/css        # Software tools grid with animated mesh
│   │   ├── grants.ts/css       # Grants section
│   │   ├── artwork.ts/css      # Artwork carousel
│   │   ├── brain-viewer.ts/css # 3D brain STL viewer (Three.js)
│   │   ├── contact.ts/css      # Contact links
│   │   └── footer.ts/css       # Footer
│   ├── data/
│   │   └── csv-loader.ts       # Fetches + parses all CSV data files
│   ├── types/
│   │   └── cv-data.ts          # TypeScript interfaces for CV data
│   └── utils/
│       ├── format.ts           # Text formatting helpers
│       ├── intersection-observer.ts  # Scroll-triggered fade-in animations
│       └── smooth-scroll.ts    # Smooth anchor scrolling
├── cv/cv_data/                 # Git submodule — CSV data source
│   ├── education.csv
│   ├── experience.csv
│   ├── grants.csv
│   ├── profile.csv
│   ├── publications.csv
│   ├── skills.csv
│   ├── talks.csv
│   └── tools.csv
├── public/                     # Static assets (copied to dist as-is)
│   ├── favicon.svg
│   ├── models/brain.stl
│   ├── photos/
│   ├── images/
│   └── files/
└── .github/workflows/
    └── deploy.yml              # GitHub Actions: build + deploy to Pages
```

## Data Flow

CV content lives in the `cv/cv_data/` git submodule as CSV files. At build time, a custom Vite plugin (`cvDataPlugin` in `vite.config.ts`) copies these CSVs into `dist/data/`. During dev, the same plugin intercepts `/BMSchilder/data/*.csv` requests and serves them directly from the submodule.

At runtime, `csv-loader.ts` fetches all CSVs via `fetch()`, parses them with PapaParse, and returns a typed `CVData` object that every component receives.

## Color Palette System

The site uses CSS custom properties for all colors (`--vapor-teal`, `--bg-deep`, etc.). Eight palettes are defined in `src/palette.ts`:

| Palette | Description |
|---------|-------------|
| `vaporwave` | Pink/teal/purple (default) |
| `midnight` | Deep blue/cyan |
| `sunset` | Warm orange/gold/magenta |
| `cyberpunk` | Neon green/yellow on black |
| `arctic` | Ice blue/white/silver |
| `sakura` | Cherry blossom pink |
| `lagoon` | Minty teal/purple |
| `greyscale` | Monochrome silver |

Click the sun in the hero to cycle through palettes. All canvas drawings read palette colors from CSS variables, so they update in real time.

## Development

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

The dev server runs at `http://localhost:5173/BMSchilder/`.

## Deployment

Pushing to `master` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`), which:

1. Checks out the repo with submodules
2. Runs `npm ci` and `npm run build`
3. Deploys the `dist/` directory to GitHub Pages

## Updating CV Data

The CSV data lives in the `cv` submodule (separate repo). To update:

```bash
cd cv/cv_data
# Edit CSV files...
git add . && git commit -m "Update data"
git push

cd ../..
git add cv
git commit -m "Update cv submodule"
git push
```

## Key Architectural Patterns

- **Component pattern:** Each section has a paired `.ts` + `.css` file. The TS exports an `init*()` function that receives `CVData` and renders into its DOM section via `innerHTML`.
- **Canvas lifecycle:** All `requestAnimationFrame` loops use `IntersectionObserver` to pause when off-screen and `visibilitychange` to pause when the tab is hidden. A `running` flag prevents duplicate loops.
- **Bidirectional sync:** The timeline navigator slider and scroll position stay in sync via a `programmaticScroll` flag to prevent feedback loops.
