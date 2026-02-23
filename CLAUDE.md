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

Single-page Next.js app with a linear phase-based flow managed in `app/page.tsx`. The `phase` state drives which component renders inside `<AnimatePresence>`:

**countdown → landing → ask → celebration → adventure → gallery**

- `CountdownLock` — locks the site until Feb 13, 2026 1:15 PM CST. Bypass with `?bypass=true` in the URL.
- `LandingHero` — intro screen with Venezuelan-themed visuals.
- `AskPrompt` — "Will you be my Valentine?" with a dodging No button (`NoButton.tsx`).
- `Celebration` — confetti via `react-confetti-explosion`.
- `AdventureReveal` — glassmorphism cards revealing the date plan.
- `PhotoGallery` — final photo gallery phase.

`MusicPlayer` and `FloatingHearts` persist across all post-countdown phases.

## 3D Components

All Three.js components live in `app/components/three/` and **must** be imported via `next/dynamic` with `ssr: false` — they use browser APIs unavailable during SSR. Example pattern used in `AskPrompt.tsx`:

```ts
const FloatingScene3D = dynamic(() => import("./three/FloatingScene3D"), { ssr: false });
```

## Styling

- **Tailwind CSS 4** — custom colors are defined in `globals.css` inside `@theme inline { }`, not in a `tailwind.config` file.
- Key color tokens: `warm-black` (#1A0A10), `mexican-pink` (#E4007C), `soft-gold` (#D4AF37), `orchid-pink`/`orchid-purple`.
- Utility classes defined in `globals.css`: `.text-gradient-gold`, `.text-gradient-pink`, `.glass-card`, `.animate-float-up`, `.animate-glow-pulse`, `.animate-shimmer`, `.animate-breathe`, `.animate-border-glow`.
- `float-up` animation uses CSS custom properties `--duration` and `--float-opacity` set inline on each particle element.
- Fonts: Geist Sans (`--font-sans`), Geist Mono (`--font-mono`), Playfair Display (`--font-serif`).

## Key Constraints

- `useSearchParams()` requires a `<Suspense>` boundary — `CountdownLock` wraps its inner component for this reason.
- All UI copy is in Spanish (Venezuelan dialect).
- The app is entirely client-side (`"use client"` on `page.tsx`); `layout.tsx` is the only server component.
