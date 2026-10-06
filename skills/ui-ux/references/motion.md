# Motion

Motion needs a job: state change, causality, spatial relationship, feedback, continuity, progress
— or delight that is an explicit product goal. Decorative motion is optional and never carries
essential information alone.

## Quick rules

1. Ask: what information does this movement add? what moves (large-area translation, zoom,
   parallax, depth deserve caution)? who triggers it (interaction / automatic / scroll)? what is
   the reduced-motion variant? what if it's interrupted?
2. **Reduced motion is a semantic variant**, designed with the default — not `animation: none`
   added later. Preserve the information; remove or replace problematic spatial movement.
3. Honour the OS/browser preference by default (`prefers-reduced-motion`); a product setting may
   add granularity but must not ignore the system preference.
4. State, focus, history and URL must be correct without the animation; transitions can be skipped.
5. Prefer platform primitives (CSS transitions/animations, Web Animations, View Transitions)
   before adding a library for basic motion.
6. No universal durations/easings are evidence-based; define purpose per transition.

## Audit checklist

- Inventory animated elements: purpose of each? entrance animations on every block? hover lift on every card?
- Reduced motion emulated: information preserved? large parallax/zoom/auto-motion removed?
- Motion delays interaction (users wait for animations to finish to act)?
- Auto-playing or looping motion: can it be paused (moving content > 5s needs a control)?
- Scroll-linked effects: is meaning or navigation dependent on them?
- Interruption: rapid repeated interactions, navigation mid-transition — state correct?
- Performance: janky animations (layout-triggering properties, heavy filters/blur) on low-end devices.
- Loading/skeleton shimmer respects reduced motion.

## Patterns

- **Local state change** (toggle, selection, disclosure, validation): brief, local, never blocks
  input; animate the affected relationship, not the viewport.
- **View/navigation continuity:** use a view transition only when spatial continuity helps users
  understand where something went. View Transitions are Baseline for same-document (2025) with
  cross-document support and transition types (2026); always progressive enhancement.
- **Scroll-linked / large spatial motion:** highest vestibular and distraction risk; only when it
  adds task-relevant orientation or storytelling that survives a reduced-motion alternative.
  - Native scroll/view timelines when the effect is a continuous, reversible function of scroll
    (reading progress, element reveal tied to its scrollport) — avoids main-thread scroll listeners.
  - Scroll-state container queries when the need is discrete (stuck header, more content,
    snapped item).
  - Keep application/domain state out of scroll plumbing.
  - Pitfall: declare `animation-timeline` after the `animation` shorthand.
- **Motion and identity:** a motion character can be a signature (e.g. a spatial-continuity
  principle) — applied systematically, never everywhere.

## Failure modes

- Fade-and-slide on every section; motion used as "polish" without a job.
- Reduced motion treated as "disable everything" (losing state cues) or ignored.
- Animation as the only carrier of progress, selection, instructions or access to controls.
- Duplicating a browser navigation transition the platform already performed.
- Transitions that break focus/history when skipped or interrupted.

## Evidence boundary

W3C (SC 2.3.3, `prefers-reduced-motion` techniques) and MDN (View Transitions, scroll-driven
animations) establish safety rules and capabilities; Apple supports intent-driven motion and
Reduce Motion adaptation. No source proves animation generally improves comprehension or perceived
speed, nor a universal duration/easing. Browser support reviewed 2026-09/10 — re-check.
