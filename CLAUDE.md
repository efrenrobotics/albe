# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

Island-hub homepage (`app/page.tsx` → `IslandHub`) that opens hand-built journeys. Each journey is a client route with a local `phase` state machine inside `<AnimatePresence mode="wait">`.

### Hub (`/`)

- `IslandHub` — ocean background with island links. Unlocked: San Valentín, Cumpleaños, Aniversario. Remaining islands stay locked (`???` / Próximamente).

### Journeys

**`/valentines`** — `app/valentines/page.tsx`

countdown → landing → ask → celebration → adventure → gallery

- `CountdownLock` — locks until Feb 13, 2026 1:15 PM CST. Bypass with `?bypass=true`.
- `LandingHero`, `AskPrompt` (dodging No), `Celebration`, `AdventureReveal`, `PhotoGallery`.
- `MusicPlayer` + `FloatingHearts` persist after countdown.

**`/birthday`** — `app/birthday/page.tsx`

countdown → message → cake → flowers → concert → video

- `BirthdayCountdown`, gift reveals, `VideoFinale`. Music: `/audio/las-mananitas.mp3`.

**`/aniversario`** — `app/aniversario/page.tsx`

countdown → abrir → aeropuerto → despegue → roma → tren → florencia → vuelo-viena → viena → recuerdos → final

- The route unlocks December 8, 2026 at midnight CST. Use `/aniversario?bypass=true` to start at Abrir. Add `&phase=<phase>` to preview an individual scene.
- `app/aniversario/data/trip.ts` holds the itinerary, coordinates, and optional per-city dates, nights, and ambient tracks. Add city dates once confirmed.
- `app/aniversario/page.tsx` checks which audio files exist at prerender time. The client journey uses one Web Audio context, unlocked on the Abrir tap. `/audio/aeropuerto.mp3` supplies the song. The engine, bells, train, splash, flap board, market chimes, and waltz are synthesized.
- One lazy WebGL canvas handles takeoff and the finale. Reduced-motion and WebGL fallback scenes use SVG. The city scenes and travel transitions live in `app/aniversario/components/`.
- The memories chapter uses photos from `public/photos/` and `public/photos/aniversario/`. Sign the note as Freni.

## 3D Components

Shared Three.js pieces live in `app/components/three/`. Journey-specific scenes (e.g. aniversario globe) live under that journey. **Always** import via `next/dynamic` with `ssr: false`.

```ts
const FloatingScene3D = dynamic(() => import("./three/FloatingScene3D"), { ssr: false });
```

## Styling

- **Tailwind CSS 4** — custom colors in `globals.css` inside `@theme inline { }`.
- Key tokens: `warm-black`, `mexican-pink`, `soft-gold`, `orchid-pink`/`orchid-purple`.
- Aniversario city palettes: `roma-*`, `firenze-*`, `wien-*`.
- Utilities: `.text-gradient-gold`, `.text-gradient-pink`, `.glass-card`, `.animate-float-up`, `.animate-glow-pulse`, `.animate-shimmer`, `.animate-breathe`, `.animate-border-glow`.
- Fonts: Geist Sans (`--font-sans`), Geist Mono (`--font-mono`), Playfair Display (`--font-serif`).

## Key Constraints

- `useSearchParams()` requires a `<Suspense>` boundary.
- All UI copy is in Spanish (informal / Venezuelan flavor).
- The anniversary page is a server wrapper around `Journey.tsx`. The other journey pages are client components.
