# Project: My Website (Personal Portfolio + Travel Itinerary)

## Overview
Personal website built with React 18 + TypeScript + Vite. Includes interactive backgrounds (Space, Fluid, Particles), social links, and an interactive Europe travel itinerary map.

## Tech Stack
- React 18 + TypeScript
- Vite build system
- react-leaflet v4.2.1 (maps)
- Three.js / @react-three/fiber (3D backgrounds)
- tsparticles (particle backgrounds)
- react-router-dom v7 (routing)
- GitHub Pages deployment (via `.github/workflows/deploy.yml`)

## Key Commands
- `npm run dev` — Start dev server
- `npm run build` — TypeScript check + Vite build (`tsc && vite build`)
- `npm run test` — Run Vitest tests
- `npm run preview` — Preview production build

## Project Structure
- `src/pages/Itinerario/` — Interactive travel itinerary
  - `index.tsx` — Main component (map, sidebar, timeline, countdown)
  - `DestinationModal.tsx` — Destination detail modal (3 tabs)
  - `EditDestinationModal.tsx` — In-app editor for destinations
  - `useEditableItinerary.ts` — Hook for editable state with localStorage persistence
  - `styles.css` — Main itinerary styles (glassmorphism)
  - `modal.css` — Modal + edit modal styles
  - `destinations/` — Data files per city/region
    - `types.ts` — Interfaces (Destination, Route, Flight, Reservation, etc.)
    - `index.ts` — Aggregates all destinations, routes, flights
    - `madrid.ts`, `barcelona.ts`, `florencia.ts`, `niza-monaco.ts`, `italia-sur.ts`, `flights.ts`
- `src/components/` — Shared components (BackgroundRenderer, SocialLinks, ThemeToggle)
- `.github/workflows/deploy.yml` — GitHub Pages CI/CD (push to main triggers deploy)

## Design System
- Apple-style glassmorphism: `backdrop-filter: blur()`, `rgba()` backgrounds
- Color palette: #007AFF (primary), #FF9500 (secondary), #34C759 (success), #FF3B30 (danger)
- Font: Space Grotesk for headings
- Stadia Maps Alidade Smooth tiles for map

## Itinerary Data Architecture
- Destinations are static TypeScript objects (one file per city/region)
- `useEditableItinerary` hook loads from localStorage, falls back to static data
- Flights (KLM, code ZIFHKS) are immutable constants — never edited
- Reservations are editable (toggle status, add confirmation codes)
- Routes array in `index.ts` defines map polylines with coordinates

## Recent Sessions

### Session: 2026-03-16 (Evening)

**Summary:** Improved mobile responsive design for the itinerary page

**Changes:**
- Reordered timeline cards to show destination names first (using CSS `order` property)
- Made timeline cards more compact (150-170px width) to show more destinations
- Country headers are now sticky and compact during horizontal scroll
- Hidden legend completely on mobile to prevent blocking itinerary scroll

**Decisions:**
- Used CSS `order` property instead of restructuring JSX to reorder card elements visually
- Legend hidden with `!important` on mobile since it blocks the itinerary scroll area

**Issues & Fixes:**
- Timeline cards showing dates first instead of destination names → Added `order` property to prioritize `.timeline-name`
- Legend blocking itinerary scroll on mobile → Removed the `.itinerario-sidebar:not(.collapsed) .legend` rule

---

### Session: 2026-03-16

**Summary:** Built complete interactive travel itinerary for Europe trip (Apr 23 - May 7, 2026) with Apple glassmorphism design, and added in-app editing capabilities.

**Changes:**
- Created full itinerary page: map with custom markers, sidebar with timeline, countdown, flights, reservations
- Destination data for 5 regions: Italia Sur (Salerno, Amalfi Coast), Florence, Nice/Monaco, Barcelona, Madrid
- 4 KLM flights with confirmation code
- 15 routes with transport type visualization
- DestinationModal with 3 tabs (Historia, Qué Ver, Cómo Llegar)
- Enhanced markers with order numbers, night badges, city labels
- EditDestinationModal for in-app editing (dates, nights, highlights, tips, activities)
- useEditableItinerary hook with localStorage persistence
- Editable reservations (toggle status, confirmation codes)
- Reset to original data functionality
- Mobile responsive bottom panel

**Decisions:**
- localStorage for persistence (no backend needed for personal trip tool)
- Flights are immutable (already purchased, code ZIFHKS)
- Destinations editable but only practical fields (dates, nights, activities) — not coordinates/history
- Stadia Maps Alidade Smooth tiles for clean, modern look

**Issues & Fixes:**
- Modal close button not working → Added `position: relative` to `.modal-content` + `z-index: 10` to `.modal-close`
- Edit button overlapping close button → Moved edit button to meta row, added right padding to modal header
- CSS minifier warning about unbalanced `{` at line 2600 → cosmetic warning, build still passes
