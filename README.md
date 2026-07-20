# MacTab OS

A premium, macOS Sonoma–inspired new tab dashboard for the browser. Turn every new tab into a beautiful, productive desktop with widgets, a dock, Spotlight search, and a suite of built-in apps — all running fully in the browser with local persistence.

![Stack](https://img.shields.io/badge/TanStack%20Start-v1-blue) ![React](https://img.shields.io/badge/React-19-61dafb) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)

## Features

### Desktop experience
- **Glassmorphism UI** modeled after macOS Sonoma with spring animations (Motion) and reduced-motion support.
- **Menu bar** with live clock, active app title, and system indicators.
- **Dock** with magnification, auto-hide, repositioning (bottom/left/right), and hover-preloading of lazy apps.
- **Draggable widgets**: Clock, Weather, Calendar, Quote, Reminders, System — positions persist.
- **Window manager**: draggable/resizable app windows, traffic-light controls, focus/z-index, minimize, and **macOS-style edge snapping** (halves, quarters, maximize) with a live preview overlay.
- **Sticky notes** you can scatter on the desktop.
- **Right-click desktop context menu**: new sticky, wallpaper picker, dark mode toggle, settings.

### Spotlight & shortcuts
- **Spotlight search** (`⌃ Space`) — launch apps, search notes, do quick math, or web search.
- Global shortcuts: `⌃ K` quick search, `⌃ N` new note, `⌃ B` speed dial, `⌃ H` clipboard, `Esc` close overlay.

### Built-in apps
Notes · Calculator · Calendar · Clock (world clock + stopwatch) · Pomodoro · Reminders · Weather (7‑day forecast) · Speed Dial · Clipboard Manager · Music · AI Hub · Google Apps · Utilities (QR / password / JSON) · Settings · Trash.

### Live data
- **Weather** via [Open-Meteo](https://open-meteo.com/) (no API key) with geolocation and a 30‑minute cache; falls back to a default city.

### Personalization
- Multiple wallpapers (Sonoma, Sequoia, Monterey, Aurora, Sunset, Midnight, Mint) with animated gradient option.
- Light / Dark / Auto theme.
- Dock position and auto-hide.
- Export / reset all data.

### Persistence
All state (notes, todos, stickies, widgets, speed dials, clipboard, preferences) is stored locally via **Zustand** + `localStorage` under the key `mactab-os`.

## Tech stack

- **TanStack Start v1** (React 19, SSR-capable) + **Vite 7**
- **Tailwind CSS 4** with a custom glassmorphism theme
- **Zustand** for state, **Motion** for animation, **date-fns** for time
- **shadcn/ui** (new-york) + **lucide-react** icons
- **TypeScript** (strict)

## Getting started

```bash
bun install
bun dev
```

Then open the printed local URL. Build with `bun run build` and preview with `bun run start`.

> Node/npm/pnpm work too — just swap the commands accordingly.

## Project structure

```
src/
  routes/                TanStack file-based routes (__root.tsx, index.tsx)
  mactab/
    store.ts             Zustand store (persisted)
    windows.ts           Window manager store
    apps.tsx             App registry (lazy-loaded)
    components/
      Desktop.tsx        Root workspace
      MenuBar.tsx        Top menu bar
      Dock.tsx           Magnifying dock
      Spotlight.tsx      Global search overlay
      AppWindow.tsx      Draggable window shell
      DraggableWidget.tsx
      DesktopContextMenu.tsx
      Stickies.tsx
      widgets/           Clock, Weather, Calendar, Quote, Todos, System
    apps/                Notes, Calculator, Calendar, Clock, Pomodoro,
                         Weather, SpeedDial, Todos, Clipboard, Music,
                         AIHub, GoogleApps, Utilities, Settings, Trash
    hooks/useWeather.ts
  styles.css             Tailwind 4 theme + glass utilities
```

## Keyboard shortcuts

| Action | Shortcut |
| --- | --- |
| Spotlight | `⌃ Space` |
| Quick search | `⌃ K` |
| New note | `⌃ N` |
| Speed Dial | `⌃ B` |
| Clipboard | `⌃ H` |
| Close overlay | `Esc` |

## Roadmap ideas

- Chrome extension manifest (MV3) with `chrome_url_overrides.newtab` and `chrome.storage.sync`.
- Mission Control (F3) overview and window groups/spaces.
- Real bookmarks / topsites integration when running as an extension.
- Store slicing and IndexedDB backend for large data.

## License

MIT
