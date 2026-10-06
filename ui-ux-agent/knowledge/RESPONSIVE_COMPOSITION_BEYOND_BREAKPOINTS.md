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
Visual order can change to preserve task priority, but DOM/focus/reading order must remain coherent. Avoid CSS reordering that creates a visual sequence different from keyboard or assistive-technology sequence.

### Collapse only safe detail
Progressive disclosure is appropriate for information that is safe to retrieve on demand. Do not hide active state, errors, consequential alternatives, pricing/scope, or information required to interpret the current decision merely because width shrank.

### Change representation when semantics survive
A toolbar may become an overflow menu; a persistent inspector may become a sheet; a labelled navigation row may become a disclosure. This is valid when capability, state visibility, naming, and recovery remain predictable. Representation is allowed to change; meaning is not.

### Preserve genuine two-dimensional structures
For data grids/comparison matrices, first consider column prioritization, sticky identifiers, user-selected columns, localized horizontal scrolling, or an alternate detail view. Stacking every value into isolated cards can destroy cross-row or cross-column comparison.

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

## Maturity
**Operational but incomplete.** Platform and accessibility constraints are strong. The semantic-preservation model is agent synthesis and needs broader validation across data-heavy products, localization, native platforms, and measured task outcomes before being treated as mature universal guidance.
