# Native Anchored Overlays — 2026 capability boundary

Use this note when implementing floating UI whose **semantics are already known** (menu, picker, explanatory popover, non-modal dialog-like surface, etc.). It extends `FRONTEND_IMPLEMENTATION.md`; it does not replace its semantics-first overlay decision model.

## Core rule

Treat overlay implementation as three separable contracts:

1. **Semantics and interaction** — what widget is this, what keyboard/focus behavior does it require, and is it modal?
2. **Lifecycle/top layer** — how it opens, closes, light-dismisses, and relates to its invoker.
3. **Geometry** — where it sits relative to an anchor and what happens near viewport/container edges.

Do not adopt a JavaScript floating-positioning library merely because all three used to arrive bundled together. In 2026 the web platform can increasingly own lifecycle and geometry while application code owns product semantics.

## Native stack

For a non-modal anchored surface whose semantics fit:

- use `popover` / `popovertarget` for native top-layer lifecycle and invoker association;
- exploit the implicit anchor relationship between a popover and its invoker rather than creating a second positioning relationship unnecessarily;
- use CSS anchor positioning (`position-area`, `anchor()`, `anchor-size()` as needed) for geometry;
- use `position-try-fallbacks` / `position-try` when the preferred placement would overflow;
- keep a robust unenhanced placement or library fallback when the supported browser matrix includes older engines.

For a truly modal task, use `<dialog>` + `showModal()` rather than turning a popover into faux modality. Popovers created by the Popover API are non-modal.

## Collision handling is now a platform capability, not automatically a library requirement

As of 2026, CSS can express common collision policies directly. `position-try-fallbacks` can try predefined flips, alternative `position-area` placements, or custom `@position-try` rules when the preferred anchored position overflows. `position-try-order` can choose an option based on available width/height.

This materially changes the implementation decision for tooltips, menus, teaching UI, simple pickers, and contextual surfaces: **basic flip/reposition behavior alone is no longer sufficient justification for a runtime positioning dependency**.

Still prefer a mature library/custom coordinator when requirements include behavior the native stack cannot satisfy cleanly, such as project-specific collision scoring, complex nested/composite widgets, virtualization, cross-document/portal constraints, legacy-browser support, or coordinated geometry/state across many surfaces.

## Failure modes and edge cases

### A fallback list is not magic collision avoidance

The browser only tries the options supplied. If `flip-block` and `flip-inline` are listed independently, a corner case may require both transformations together; if no candidate fully avoids overflow, the element can fall back to its original placement. Test corners, small viewports, zoom, long localized strings, dynamic content, and virtual keyboards rather than assuming “flip” means “always visible.”

### Geometry must not change meaning

A surface moving from above to below its anchor should remain the same semantic widget. Do not couple placement to application state. Arrow direction, decorative gradients, or connector geometry may need to adapt, but accessible name, focus model, selected state, and action meaning must not.

### Anchored container queries are a specialist enhancement

Anchored container queries can detect which positioning fallback was applied, enabling descendants such as an arrow to adapt. Treat this as a progressive enhancement and verify exact support. Do not require it merely to render the overlay correctly.

### Top layer does not supply widget semantics

`popover` solves visibility/lifecycle/top-layer concerns. It does not make a `<div>` into a menu, listbox, tooltip, or dialog. Use native semantic elements or the appropriate accessible composite-widget pattern independently of positioning.

### Modality remains semantic

Do not add `aria-modal="true"` to a surface that permits outside interaction. WAI-ARIA warns that false modality can make outside content effectively unavailable to assistive-technology users. Conversely, when the task is genuinely modal, prefer native `<dialog>` behavior rather than reconstructing inertness and focus containment around a generic popover.

## 2026 support boundary

Do not infer support for the entire anchor-positioning family from one property. MDN marks several pieces as newly Baseline in 2026: `position-try-fallbacks` since January 2026, `position-try-order` since February 2026, and `position-anchor` since September 2026. Older devices/browsers may therefore still miss parts of the stack.

`ToggleEvent.source`, which identifies the control that initiated a popover toggle, is also Baseline 2026 (May 2026). It can reduce application-side bookkeeping when behavior legitimately depends on the invoker, but should not become an excuse to mirror browser-owned open/closed state into framework state.

Feature-test the exact primitives required and define the fallback contract before adopting them in a production component library.

## Agent implementation checklist

Before installing or generating floating-UI infrastructure, answer:

- What is the semantic widget?
- Is it actually modal?
- Can native popover/dialog own lifecycle and top-layer behavior?
- Is the invoker already an implicit anchor?
- Can `position-area` / anchor functions express preferred geometry?
- Which overflow cases must be supported, including corners and zoom?
- Can `position-try*` express those fallbacks?
- What is the no-support behavior?
- Does a library still provide a capability the native stack genuinely lacks?

If the final answer is “the library only flips a simple anchored surface around viewport edges,” re-evaluate the dependency.

## Evidence boundary

This guidance is based on current platform capability and W3C accessibility semantics. It supports **reducing unnecessary custom positioning/state infrastructure**; it does not establish that overlays themselves improve usability, nor that native primitives are always lower-cost once a mature cross-browser component library is already standardized in a product.

## Primary sources reviewed — 2026-10-05

- MDN, Popover API / Using the Popover API: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API and https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using
- MDN, `position-try-fallbacks`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-try-fallbacks
- MDN, `position-try-order`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-try-order
- MDN, `position-anchor`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-anchor
- MDN, anchor-positioning fallback guide: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Try_options_hiding
- MDN, `ToggleEvent.source`: https://developer.mozilla.org/en-US/docs/Web/API/ToggleEvent/source
- W3C WAI, modal/alert-dialog guidance and HTML `<dialog>` technique H102: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/ and https://www.w3.org/WAI/WCAG22/Techniques/html/H102
