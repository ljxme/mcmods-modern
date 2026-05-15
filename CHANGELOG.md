# Changelog

## 0.2.0 — Geist × Claude Code Fusion
**Dual-theme redesign based on real MCMod DOM analysis**

### Step 1 — Dual-theme design tokens
- Replaced single-theme Vercel tokens with a dual-theme system (`:root` dark / `[data-mcmods-theme=light]` light)
- Unified accent palette: Claude Code syntax colors (`#58a6ff`, `#3fb950`, `#bc8cff`, `#d29922`) in both modes
- Light mode: Geist neutrals (`#fafafa` / `#ffffff` / `#0a0a0a`)
- Dark mode: terminal blacks (`#0d1117` / `#161b22` / `#c9d1d9`)
- Typography: `Geist` for body/nav, `Geist Mono` for code/data/search
- Added `--mcmods-btn-height-*` variables

### Step 2 — Real MCMod selectors in reset
- Replaced generic selectors with real MCMod DOM classes (`.main`, `.center`, `.top-main`, `.mcmodCommonTable`)
- Dual-theme body/background/link styles
- Added nprogress bar dark styling

### Step 3 — Component CSS with real targets
- **navbar.css**: targeted `.top-main`, `.frame`, `.def-nav`, `.navs`, `.search_box`, `#key`, `#btn`
- **banner.css** (new): `.banner`, `.m_menu`, `.frame-in`, category pills (`.t1`–`.t7`, `.t23`, `.t24`)
- **cards.css**: targeted `.blcok_frame` > `.block`, `.news_block`, `.img`, `.info`
- **buttons.css**: targeted `.addArea a`, `.nav li`, `.btn`, `.search_btn`, `.editor`
- **search.css**: targeted `#Search`, `._search`, search inputs with terminal prompt `> ` styling
- **tables.css**: targeted `.mcmodCommonTable`
- **footer.css** (new): targeted `.under`, `.un_links`, `.un_info`, `.copyright`

### Step 4 — Page CSS for real content areas
- **home.css**: `.post_frame`, `.post_block`, `.postTitle`, `.postText`, `.topic_block`, `.item`, `.dec`, `.score`, `.mainMod`
- **item.css**: detail header area, attributes, description, comments
- **list.css**: sidebar filters, sort bar, list items

### Step 5 — Theme toggle mechanism
- Injected fixed 36x36px toggle button (bottom-right, mirrors CLI badge)
- Toggles `<html data-mcmods-theme="dark|light">`
- Default follows `prefers-color-scheme` media query
- Preference persisted to `localStorage`
- Icon: `☾` (dark mode), `☀` (light mode)
- CLI badge colors updated to match new palette

### Step 6 — Build verification
- `tsc --noEmit`: passed
- `eslint src/`: passed
- `wxt build`: passed (target size ~55 KB)

### Step 7 — BewlyBewly-inspired improvements
- Added `onReady()` utility: selector polling with `requestIdleCallback` + exponential backoff (up to 10 retries)
- Added FOUC prevention: pre-inject `body{visibility:hidden}` at `document_start`, auto-restore when theme applied
- Imported `injectStyle` for runtime style injection alongside existing `createObserver` / `injectCLIDecoration`

---

## 0.1.0 — Initial Release
**Terminal / Claude Code style overlay**

- WXT-based Firefox browser extension
- CSS Custom Properties design token system
- Global reset, scrollbar, component/page-level CSS
- MutationObserver utility for dynamic content
- Settings storage via background service worker
- Type-safe messaging between content script and background
