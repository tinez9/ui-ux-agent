# Responsive Composition Beyond Breakpoints

## Research question
How should interfaces preserve task priority, semantic relationships, comparison, and accessibility when composition changes across viewport sizes, component containers, zoom, and enlarged text?

## Core rule
**Responsive design is preservation of meaning under changing constraints, not device-shaped rearrangement.** A layout may change columns, order, disclosure, density, or interaction surface, but the transformed composition must preserve the information, functionality, relationships, and decision context required for the task.

A breakpoint is an implementation trigger, not a design rationale. Change composition when the current arrangement stops supporting its semantic or task contract—not because a named device width was reached.

## Four invariants to preserve
Before implementing responsive variants, identify what must survive:

1. **Task invariant** — the primary job, required actions, and consequential alternatives remain available.
2. **Relationship invariant** — labels, controls, values, status, help, and consequences still read as belonging together.
3. **Comparison invariant** — attributes that must be compared remain meaningfully comparable; do not serialize a genuinely two-dimensional decision merely to avoid horizontal scrolling.
4. **State invariant** — current selection, progress, errors, filters, scope, and location survive recomposition rather than silently resetting or disappearing.

Responsive transformation may alter presentation. It should not silently alter the user's conceptual model.

## Reflow is a correctness boundary
WCAG 1.4.10 requires vertically scrolling content to work at a width equivalent to 320 CSS px without loss of information/functionality or two-dimensional scrolling, except where two-dimensional layout is required for usage or meaning. This is roughly the effective width produced by 400% zoom on a 1280 CSS px viewport.

The exception matters: tables, grids, diagrams, maps, and other intrinsically two-dimensional content do not become more usable merely by stacking every cell or fragment. Preserve the relationship and contain/localize the necessary scrolling instead of destroying meaning to satisfy a simplistic “everything must stack” rule.

WCAG Resize Text independently requires text enlargement up to 200%. Responsive media-query changes do not remove that obligation. Test zoom and enlarged text as first-class layout inputs, not as exotic accessibility modes.

## Viewport responsiveness vs component responsiveness
Use **media queries** for conditions genuinely tied to the viewport/device environment: major page-shell composition, input capabilities, user preferences, print, or global navigation changes.

Use **container size queries** when a reusable component should adapt to the space allocated by its parent. The same card, toolbar, result item, inspector, or embedded module may occupy a sidebar, split pane, dashboard region, modal, or full-width page at the same viewport width. Viewport-only breakpoints cannot express that local constraint reliably.

MDN documents container queries as conditions on a containing element rather than the viewport and provides container-relative units (`cqi`, `cqb`, `cqw`, etc.). Prefer local adaptation when component behavior depends on local space.

Do not turn container queries into a second arbitrary breakpoint system. The trigger should correspond to a component contract failure such as:
- labels/actions no longer fitting without harmful truncation;
- comparison becoming unreadable;
- target sizes or spacing becoming unsafe;
- a side-by-side relationship no longer supporting comprehension;
- a secondary region consuming disproportionate space.

## Recomposition strategies

### Reflow
Allow flexible tracks, wrapping, intrinsic sizing, and content-driven growth to absorb moderate constraint changes before introducing mode switches.

### Regroup
When adjacency becomes misleading or cramped, change groups while preserving semantic ownership. Moving help text, totals, filters, or actions far from the object they affect can break comprehension even when every element remains technically present.

### Reorder carefully
Visual order can change to preserve task priority, but DOM/focus/reading order must remain coherent. Prefer meaningful source order; the experimental `reading-flow` enhancement below cannot be the only fix for a broken fallback.

### Collapse only safe detail
Progressive disclosure is appropriate for information that is safe to retrieve on demand. Do not hide active state, errors, consequential alternatives, pricing/scope, or information required to interpret the current decision merely because width shrank.

### Change representation when semantics survive
A toolbar may become an overflow menu; a persistent inspector may become a sheet; a labelled navigation row may become a disclosure. This is valid when capability, state visibility, naming, and recovery remain predictable. Representation is allowed to change; meaning is not.

### Preserve genuine two-dimensional structures
For data grids/comparison matrices, first consider column prioritization, sticky identifiers, user-selected columns, localized horizontal scrolling, or an alternate detail view. Stacking every value into isolated cards can destroy cross-row or cross-column comparison.

## CSS reading-flow: an enhancement, not a source-order repair — 2026-10-24

**Default:** put task-critical content and controls in a meaningful DOM sequence *without CSS*. `reading-flow` can align sequential focus and speech traversal with a different, still meaningful responsive visual composition; it does **not** rearrange DOM nodes, layout, or paint order. It must not justify an otherwise incoherent source sequence. WCAG 1.3.2 (meaningful sequence) and 2.4.3 (focus order) allow more than one logical order in some contexts; they do not demand a rigid left-to-right tab path for every independent dashboard card.

**Current compatibility (checked 2026-10-24):** Chrome/Edge 137+ implement `reading-flow` and `reading-order`; current MDN browser-compat-data still records **no Firefox or Safari support**. A September 2026 community article claiming Safari 26.4 support conflicts with that data and with the still-open WebKit standards-position request; do not promote the claim without a tested engine/build. Unsupported browsers retain source-based navigation, so source order is the required fallback, not a minor polish item.

| Need | Mechanism | Boundary |
|---|---|---|
| A responsive flex row visually reversed | `reading-flow: flex-visual` follows visual reading direction; `flex-flow` follows flex-direction/wrap order | These can yield **different** orders for `row-reverse` and `wrap-reverse`; verify RTL/writing-mode. |
| Explicitly positioned grid cards | `reading-flow: grid-rows` or `grid-columns` | Choose the meaningful row/column sequence; `grid-order` follows CSS `order`, **not** arbitrary grid-area placement. |
| An exceptional item must be visited earlier | `reading-order: -1` on a direct child of a container with a non-`normal` `reading-flow` | Ordinal groups are local to that container. Do not replace document architecture with many manual ranks. |
| Forms, checkout steps, ordered instructions, linked labels/errors | Correct DOM sequence first | CSS visual reordering is not a reliable cross-browser fix for meaning-bearing dependencies. |

Example of **optional** enhancement for independent dashboard modules, after verifying that source order remains usable:

```css
.dashboard-modules {
  display: grid;
  /* Grid placement may differ across container widths. */
}
@supports (reading-flow: grid-rows) {
  .dashboard-modules { reading-flow: grid-rows; }
}
```

**Scope and testing traps:** a reading-flow container also affects focus-navigation scoping; positive `tabindex` is not a safe workaround. `display: contents` wrappers and focusable descendants have additional HTML focus-scope interactions (WHATWG #10407/#10533 remain open). CSS support detection checks parsing, **not** the actual keyboard/assistive-technology outcome. Do not assume all screen-reader browsing modes follow the same path merely because the spec targets speech order.

**Agent acceptance gate:** inspect DOM order with CSS disabled; tab/Shift+Tab through real controls in supported Chromium **and** unsupported Safari/Firefox; inspect screen-reader linear reading and headings separately; repeat after responsive/container-query changes, RTL/writing-mode, 200–400% zoom, nested `display: contents`, and dynamically inserted controls. Record both *visible focus position* and *meaning preserved*. Do not rely on a screenshot or an axe-clean result alone.

### Tested QA limitation: Playwright snapshots versus CSS reading-flow (2026-10-24)

**Reproduced locally** with headless Linux Chromium **144.0.7559.96** and Playwright Python **1.57.0**. Three buttons were in source order **One → Two → Three**:

| Layout | Visual LTR | Actual Tab / CDP AX tree order | Playwright `locator.aria_snapshot()` |
|---|---|---|---|
| Flex `row-reverse`, `reading-flow: normal` | Three, Two, One | One, Two, Three | One, Two, Three |
| Flex `row-reverse`, `reading-flow: flex-visual` | Three, Two, One | **Three, Two, One** | **One, Two, Three** |
| Grid: One in column 3, Two in 1, Three in 2; `reading-flow: grid-rows` | Two, Three, One | **Two, Three, One** | **One, Two, Three** |
| Same grid with `reading-order: -1` on One | Two, Three, One | One, Two, Three | One, Two, Three |

A **source-ordered** `expect(locator).to_match_aria_snapshot()` assertion **passed** on the `flex-visual` fixture although Tab moved Three → Two → One. Current Playwright upstream `packages/injected/src/ariaSnapshot.ts` constructs its snapshot by walking DOM `firstChild/nextSibling` (plus slot/shadow/ARIA-owns), without CSS `reading-flow` sorting. A Playwright ARIA snapshot is useful structural/semantic evidence, **not an oracle for CSS-driven sequential focus order**.

**CDP trap:** `Accessibility.getFullAXTree().nodes` is a flat response array, not necessarily reading-order traversal. In a nested block-wrapper grid fixture, filtering raw nodes yielded **Three, One, Two**; traversing the hierarchy via `nodeId → childIds` yielded **Two, Three, One**, matching Tab. For agent QA, test logical DOM order with CSS off, actual Tab/Shift+Tab from known focus, visual geometry and (if needed) the reconstructed CDP AX hierarchy. Do not infer real screen-reader speech from CDP or Playwright snapshots. This test does **not** cover newer Playwright releases, Safari/Firefox, NVDA/VoiceOver, zoom or dynamic reflow.

**Evidence boundary:** CSS Display 4 (editor's draft, 2026-06-05) and Chrome's 2025 implementation article establish intended mechanics; MDN BCD and browser standards-position issues establish a **current support gap**, not tested assistive-technology parity. WCAG defines outcome constraints, not an endorsement of this CSS property. A single-engine Chromium keyboard/CDP experiment is documented above; cross-engine and real AT validation remain missing.

## Density is contextual
Do not equate narrow with “mobile” or wide with “expert.” A desktop user may use a narrow split pane; a tablet may be wide; browser zoom can produce a narrow CSS viewport; a component can be narrow inside a wide dashboard.

Likewise, reducing density is not always correct. Expert tools may need high information throughput. Preserve the task's required simultaneous visibility before optimizing for visual calm.

## Typography and localization are layout inputs
Fixed breakpoints tested only with English placeholder copy are brittle. Validate:
- long localized labels and values;
- 200% text enlargement and high zoom;
- RTL direction;
- user-generated unbroken strings;
- dynamic validation/status text;
- variable data density.

Prefer intrinsic sizing, wrapping, `minmax()`, flex/grid constraints, and content-driven thresholds over assumptions that copy stays short.

## Failure modes

### Device-name breakpoints
“Mobile/tablet/desktop” widths are chosen first and the design is forced into them.

**Fix:** identify composition failure conditions, then place thresholds where the content/task contract fails.

### Mechanical stacking
Desktop columns become one long column regardless of semantic relationships or task order.

**Fix:** explicitly define narrow-mode reading order, grouping, state visibility, and action priority.

### Viewport-coupled components
A component behaves correctly full-width but breaks when embedded in a narrow pane on a large screen.

**Fix:** make locally constrained components container-responsive.

### Responsive disappearance
Secondary-but-required actions, errors, active filters, or state vanish in narrow layouts.

**Fix:** distinguish lower salience from optional functionality; preserve required capability and state.

### Comparison destruction
A comparison table is transformed into separate cards that require memory to compare attributes.

**Fix:** preserve simultaneous comparison or provide a purpose-built alternate comparison representation.

### Zoom treated as mobile emulation
A breakpoint activates at high zoom and shrinks typography or removes functionality to “fit.”

**Fix:** ensure text can still achieve required enlargement and all variants satisfy accessibility requirements.

### CSS order diverges from interaction order
Grid/flex ordering makes the screen look right while keyboard focus or screen-reader sequence follows a different path.

**Fix:** keep meaningful source order; use visual reordering only where it does not create semantic/navigation mismatch.

## Agent implementation contract
When generating or reviewing a responsive interface:

1. Write the task, relationship, comparison, and state invariants before breakpoints.
2. Let intrinsic layout absorb normal variation first.
3. Use viewport queries for page/environment changes and container queries for local component constraints.
4. Add a threshold only when you can name the failure it prevents.
5. For every mode change, specify what moves, groups, collapses, changes representation, and must remain visible.
6. Preserve logical DOM/focus order and semantic ownership.
7. Treat two-dimensional structures as an explicit exception requiring meaning-preserving handling.
8. Test real content at narrow containers, 200% text, ~400% zoom/reflow conditions, RTL, localization, and dynamic error/status states.
9. Render the same component in multiple parent contexts; viewport screenshots alone are insufficient.
10. Prefer fewer meaningful composition transitions over many pixel-tuned exceptions.

## Evaluation matrix
Test at least these transformations, not merely a list of device screenshots:

| Transformation | What to inspect |
|---|---|
| narrow viewport | task order, navigation, disclosure, overflow |
| narrow component in wide viewport | local component adaptation |
| 200% enlarged text | clipping, overlap, control usability, reading order |
| ~320 CSS px effective width / high zoom | reflow, information/function preservation |
| long localization / RTL | wrapping, order, alignment, directional assumptions |
| dense real data | comparison, truncation, overflow, state visibility |
| keyboard / assistive technology | focus and semantic order after visual recomposition |

A successful responsive system preserves task completion and comprehension across transformations; visual similarity across widths is not the objective.

## Evidence boundary
W3C provides a strong normative accessibility boundary for reflow and text enlargement. MDN provides current platform documentation for media/container queries and container-relative units. These sources support the mechanics and accessibility constraints, but they do **not** establish universal breakpoint values or prove that any particular responsive composition improves task outcomes. Decisions about regrouping, comparison, density, and representation remain task-dependent and should be validated with realistic content and users when consequential.

## Sources
- W3C WAI — Understanding WCAG 1.4.10 Reflow (reviewed 2026-10-05): https://www.w3.org/WAI/WCAG21/Understanding/reflow
- W3C WAI — Understanding WCAG 1.4.4 Resize Text (reviewed 2026-10-05): https://www.w3.org/WAI/WCAG21/Understanding/resize-text
- MDN — CSS container queries (reviewed 2026-10-05): https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries
- MDN — Using container size and style queries (reviewed 2026-10-05): https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_size_and_style_queries
- CSSWG — CSS Display 4 reading-flow / reading-order (editor's draft 2026-06-05, reviewed 2026-10-24): https://drafts.csswg.org/css-display-4/#reading-flow
- Chrome for Developers — reading-flow focus-navigation behavior (2025-05-01): https://developer.chrome.com/blog/reading-flow/
- MDN — reading-flow reference and compatibility (reviewed 2026-10-24): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/reading-flow
- W3C WAI — WCAG 2.2 focus order and meaningful sequence: https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html ; https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html

## Maturity
**Operational but incomplete.** Platform and accessibility constraints are strong. The semantic-preservation model is agent synthesis and needs broader validation across data-heavy products, localization, native platforms, and measured task outcomes before being treated as mature universal guidance.
