# Frontend implementation guidance

Translating design decisions into robust frontend behaviour. Fast-changing: browser support notes
are dated (reviewed 2026-09/10) — re-check the exact feature against the project's support matrix.

## Quick rules

1. Prefer the **lowest-complexity platform primitive** that preserves semantics, accessibility,
   resilience and interaction quality. A newer API is not a UX improvement by itself.
2. Semantics first: native elements (`button`, `a`, `label`, `table`, `dialog`, `details`,
   `progress`) before ARIA; ARIA only to describe behaviour you actually implement.
3. Feature-family familiarity is not support evidence — check the exact primitive.
4. CSS for presentational behaviour derivable from layout/container state; JavaScript when
   behaviour changes domain state, needs measurement/coordination, or the native primitive can't
   meet the support/interaction contract.
5. Every enhancement has a complete no-enhancement path.
6. Use the design system's tokens and components; add new ones deliberately (see `design-systems.md`).

## Decision: CSS capability vs JavaScript

Ask: is it purely presentational and derivable from layout/container state? can CSS express it
without duplicating application state? does the exact primitive meet the support matrix? is the
fallback semantically and functionally correct? If yes → CSS.

## Layout and responsiveness

- Intrinsic layouts first: flex/grid with `minmax()`, `auto-fit`, `flex-wrap`, `clamp()` for
  display-only scaling; avoid fixed widths/heights on text containers; avoid `100vw` (scrollbar
  overflow) — prefer `100%`/`dvh`/`svh` thoughtfully on mobile.
- **Container queries** (size queries broadly available since 2023) for components in variable
  parents: `container-type: inline-size`, named containers when nested, thresholds from content
  failure. Style queries (custom properties only), scroll-state and anchored container queries are
  newer — progressive enhancement.
- Keep source order = reading/focus order; avoid `order`/grid placement that diverges from DOM.
- Reserve geometry for async content and media (`aspect-ratio`, width/height attributes, skeleton
  dimensions) to avoid layout shift.

## Overlays

`<dialog>` + `showModal()` for modal tasks (top layer, inert background); `.show()` for non-modal;
Popover API for non-modal transient surfaces with declarative `popovertarget`; CSS anchor
positioning (`position-area`, `anchor()`, `position-try-fallbacks`) for geometry where supported.
Don't import a floating library just to escape clipping or flip at edges; keep one for complex
collision policies, composite widgets, virtualization, legacy support. Details in `overlays.md`.

## Motion and scroll

- CSS transitions/animations and the Web Animations API for basic motion; View Transitions
  (same-document Baseline 2025; cross-document; types 2026) as progressive enhancement —
  state/focus/history correct when skipped.
- Scroll/view timelines for continuous, reversible presentational effects (no main-thread scroll
  listeners); scroll-state queries for discrete states (stuck, scrollable, snapped). Declare
  `animation-timeline` after the `animation` shorthand. Don't mirror scroll position into
  application state for visuals.
- Always pair with `prefers-reduced-motion` (see `motion.md`).

## Fonts

System stack unless a webfont earns its cost; subset and limit faces/axes; `font-display` chosen
deliberately; fallback metrics matched (`size-adjust`; check `ascent/descent/line-gap-override`
support); preload only first-render fonts. See `typography.md`.

## Theming

Semantic custom properties (tokens) resolved per theme; `color-scheme` declared so native controls
follow; `prefers-color-scheme` + explicit override persisted; `light-dark()` as syntax sugar;
`@media (forced-colors: active)` for narrow repairs. See `color-and-theming.md`.

## State, data and feedback

- Model async UI as explicit states (idle, pending, success-with-data, empty, error, stale,
  partial); per-item pending for concurrent mutations; idempotent retries; revision IDs on saves.
- Optimistic updates only with a designed failure/reconciliation path (React `useOptimistic`,
  TanStack Query/DB patterns as implementation references).
- Status messages via live regions (`role="status"`), alerts only when urgent.
- URL holds shareable query state; history entries for meaningful navigation only.
- Don't depend on `unload`/`beforeunload` for persistence; use `visibilitychange`/`pagehide` as extra flushes.

## Focus management

One owner per transition; no focus moves tied to data arrival/hydration; focus recovery by logical
identity after deletion/virtualization; restore to invokers after overlays; route-change focus only
for genuine new contexts. See `accessibility.md`.

## Performance perception

- Remove latency before masking it; skeletons/placeholders reserve the final geometry.
- Heavy visuals (video, 3D, large images, blur/backdrop filters, big animation libraries) carry
  real UX cost on low-end devices — each must earn it.
- `content-visibility: auto` can skip off-screen rendering while keeping content findable; not a
  substitute for virtualization or server pagination.
- Images: responsive `srcset`/`sizes`, modern formats, lazy-load below the fold, never lazy-load
  the LCP image.

## Testing the implementation

- Render-check at the agreed viewports and states (`inspection.md`); measure overflow and targets.
- Keyboard tests from the component's interaction contract (APG/native), not "Tab through everything".
- axe-like checks on each activated state, waiting for async completion; keep `incomplete`.
- Visual regression for unintended change; it doesn't adjudicate intent.
- Cold-cache, throttled network, failed requests, offline, reduced motion, dark/forced colors, 200% zoom.

## Evidence boundary

MDN, WHATWG/W3C specs and web.dev Baseline data establish platform capability and compatibility;
they don't prove that using a capability improves outcomes. Library references (React, TanStack)
are implementation examples, not requirements.
