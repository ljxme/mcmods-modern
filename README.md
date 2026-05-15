# mcmods-modern

A Firefox browser extension that restyles [MCMod (MC百科)](https://www.mcmod.cn/) into a dark, terminal/CLI-inspired interface.

<img src="public/icons/icon.svg" alt="" width="128" align="right">

## Overview

- Dark terminal background `#1a1b26` with high-contrast `#c9d1d9` body text
- Monospace font (`JetBrains Mono`) for navigation, code, and data
- Card / modal pseudo-terminal decorations (`● ● ●` title bar)
- Thin dark scrollbar matching the terminal aesthetic
- Injects a small `> mcmod.modern loaded` badge in the bottom-right corner

## Install

### Development build (temporary add-on)

```bash
npm run build:firefox
# Firefox → about:debugging → This Firefox → Load Temporary Add-on
# Select dist/firefox-mv2/manifest.json
```

### Development mode (live reload)

```bash
npm run dev:firefox
```

### Production

Package `dist/firefox-mv2/` as `.zip` and submit to [Firefox Add-ons (AMO)](https://addons.mozilla.org/) for review.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | [WXT](https://wxt.dev/) (Web eXtension Tools) |
| Language | TypeScript + CSS |
| Build | Vite (via WXT) |
| Style Architecture | CSS Custom Properties (`--mcmods-*` namespace) |
| Target Platform | Firefox Manifest V3 |
| Target Site | `https://www.mcmod.cn/` |
| Package Manager | npm |

## Structure

```
mcmods-modern/
├── src/
│   ├── entrypoints/
│   │   ├── content.ts        # Content script (style injection + CLI badge)
│   │   └── background.ts     # Service worker (settings, messaging)
│   ├── styles/
│   │   ├── base/             # Design tokens, reset, scrollbar
│   │   │   └── variables.css # CSS custom properties
│   │   ├── components/       # Navbar, cards, buttons, tables, modals, search
│   │   └── pages/            # Home, item detail, list/category
│   └── utils/
│       └── observer.ts       # MutationObserver wrapper
├── public/icons/
│   └── icon.svg              # Extension icon
├── wxt.config.ts
├── package.json
└── tsconfig.json
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev mode (Chrome) |
| `npm run dev:firefox` | Dev mode (Firefox) |
| `npm run build` | Production build (Chrome) |
| `npm run build:firefox` | Production build (Firefox) |
| `npm run zip:firefox` | Package .zip (AMO submission) |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript type check |

## Design Principles

- CSS-only overrides — no DOM structure changes
- WCAG AA compliance (body contrast >= 4.5:1)
- Zero runtime framework, no third-party JS dependencies
- Namespaced: CSS classes with `mcmods-`, DOM ids with `__mcmods-`
- `!important` only on critical visual properties (color, background, border)

## License

MIT
